<?php
namespace App\Repositories\Employee;

use Carbon\Carbon;
use App\Traits\Evaluator;
use Illuminate\Support\Str;
use App\Models\Employee\Salary;
use App\Models\Calendar\Holiday;
use App\Models\Employee\Payroll;
use App\Models\Employee\Attendance;
use App\Models\Employee\LeaveRequest;
use App\Models\Employee\PayrollDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Employee\EmployeeRepository;
use App\Models\Configuration\Employee\AttendanceType;

class PayrollRepository
{
    use Evaluator;
    protected $payroll;
    protected $payroll_detail;
    protected $employee;
    protected $salary;
    protected $attendance;
    protected $holiday;
    protected $leave_request;
    protected $attendance_type;


    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Payroll $payroll,
        PayrollDetail $payroll_detail,
        EmployeeRepository $employee,
        Salary $salary,
        Attendance $attendance,
        Holiday $holiday,
        LeaveRequest $leave_request,
        AttendanceType $attendance_type
    ) {
        $this->payroll = $payroll;
        $this->payroll_detail = $payroll_detail;
        $this->employee = $employee;
        $this->salary = $salary;
        $this->attendance = $attendance;
        $this->holiday = $holiday;
        $this->leave_request = $leave_request;
        $this->attendance_type = $attendance_type;
    }

    /**
     * Find payroll with given id or throw an error.
     *
     * @param integer $id
     * @return Payroll
     */

    public function findOrFail($id)
    {
        $payroll = $this->payroll->info()->filterById($id)->first();

        if (! $payroll) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_payroll')]);
        }

        return $payroll;
    }

    /**
     * Find payroll with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Payroll
     */
    public function findByUuidOrFail($uuid)
    {
        $payroll = $this->payroll->info()->whereUuid($uuid)->first();

        if (! $payroll) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_payroll')]);
        }

        return $payroll;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Payroll
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'created_at');
        $order   = gv($params, 'order', 'desc');
        $name    = gv($params, 'name');
        $employee_id   = gv($params, 'employee_id');

        $employee_id = is_array($employee_id) ? $employee_id : ($employee_id ? explode(',', $employee_id) : []);

        $accessible_employee_ids = $this->employee->getAccessibleEmployeeId();
        array_push($accessible_employee_ids, \Auth::user()->Employee->id);

        if (array_diff($employee_id, $accessible_employee_ids)) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        $query = $this->payroll->info()->whereIn('employee_id', $accessible_employee_ids);
        
        if (count($employee_id)) {
            $query->whereIn('employee_id', $employee_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all payroll using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Payroll
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get payroll filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $employees = $this->employee->getAccessibleEmployeeList();
        
        return compact('employees');
    }

    /**
     * Get payroll pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->getFilters();
    }

    /**
     * Fetch first unpaid payroll of given employee
     *
     * @param array $params array of data
     * @return Payroll
     */
    public function fetchUnpaid($params = array())
    {
        $employee_id = gv($params, 'employee_id');

        $employee = $this->employee->findOrFail($employee_id);

        $this->employee->isAccessible($employee);

        $payroll = $this->payroll->filterByEmployeeId($employee->id)->where('payment_status','!=','paid')->orderBy('start_date')->first();

        return compact('payroll');
    }

    /**
     * Fetch payroll data.
     *
     * @param array $params
     * @return void
     */
    public function fetch($params = array())
    {
        $employee_id = gv($params, 'employee_id');
        $start_date  = toDate(gv($params, 'start_date'));
        $end_date    = toDate(gv($params, 'end_date'));
        $payroll_id  = gv($params, 'payroll_id');
        $self        = gbv($params, 'self');

        $employee = $this->employee->findOrFail($employee_id);

        $this->employee->isAccessible($employee, $self);

        $salary = $this->salary->info()->filterByEmployeeId($employee->id)->where('date_effective', '<=', $start_date)->orderBy('date_effective', 'desc')->first();

        if (! $salary) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_salary_structure')]);
        }

        $overlapping_query = (! $payroll_id) ? $this->payroll : $this->payroll->where('id', '!=', $payroll_id);

        $overlapping = $overlapping_query->filterByEmployeeId($employee_id)->where(function ($q) use ($start_date, $end_date) {
            $q->where(function($q1) use($start_date, $end_date) {
                $q1->where('start_date','<=',$start_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q2) use($start_date) {
                $q2->where('start_date','<=',$start_date)->where('end_date','>',$start_date);
            })->orWhere(function($q2) use($end_date) {
                $q2->where('start_date','<',$end_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q3) use($start_date, $end_date) {
                $q3->where('start_date','>',$start_date)->where('end_date','<',$end_date);
            });
        })->count();

        if ($overlapping) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_overlapping')]);
        }

        $attendance_types = $this->attendance_type->select('id','name','alias','type','unit')->get();
        $attendance_types->push(array('id' => null, 'name' => 'Leave', 'alias' => 'L', 'type' => 'leave', 'unit' => null));
        $attendance_types->transform(function ($attendance_type) {
            $attendance_type['count'] = 0;
            $attendance_type['value'] = 0;
            return $attendance_type;
        });

        $attendances = $this->attendance->with([
            'attendanceType:id,name,alias,type,unit',
            'attendanceDetails:id,employee_attendance_id,employee_attendance_type_id,value',
            'attendanceDetails.attendanceType:id,name,alias,type,unit'
        ])->filterByEmployeeId($employee_id)->where('date_of_attendance','>=',$start_date)->where('date_of_attendance','<=',$end_date)->get();

        $holidays = $this->holiday->dateBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->get();
        $holiday_alias = optional($attendance_types->firstWhere('type', 'holiday'))->alias;

        $leave_requests = $this->leave_request->select('id','start_date','end_date','options')->filterByEmployeeId($employee_id)->filterByStatus('approved')->where(function($q) use($start_date, $end_date) {
            $q->where(function($q1) use($start_date, $end_date) {
                $q1->where('start_date','>=',$start_date)->where('end_date','<=',$end_date);
            })->orWhere(function($q2) use($start_date, $end_date) {
                $q2->where('start_date','<',$start_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q3) use($start_date, $end_date) {
                $q3->where('start_date','>=',$start_date)->where('end_date','<',$end_date);
            });
        })->get();

        $date = $start_date;

        $per_day_calculation_basis = config('config.per_day_salary_calculation_basis') ? : 'calendar_period';
        $salary->per_day_calculation_basis = $per_day_calculation_basis;

        if ($per_day_calculation_basis == 'calendar_period') {
            $per_day_calculation_basis = Carbon::parse($start_date)->daysInMonth;
        } else {
            $user_defined_days = config('config.user_defined_per_day_salary_calculation_basis');
            $per_day_calculation_basis = (is_numeric($user_defined_days) && $user_defined_days > 0) ? $user_defined_days : 30;
            $salary->user_defined_days = $per_day_calculation_basis;
        }

        while($date <= $end_date) {
            $emplyoee_attendance = '';

            $marked_attendance = $attendances->where('date_of_attendance', $date)->first();

            if ($marked_attendance) {
                $marked = $marked_attendance->attendanceType;
                if ($marked) {
                    $emplyoee_attendance = $marked->alias;
                }

                $production_attendances = $marked_attendance->attendanceDetails;
                foreach ($production_attendances as $production_attendance) {
                    $production_attendance_alias = $production_attendance->attendanceType->alias;
                    $production_attendance_value = $production_attendance->value;
                    $attendance_types->transform(function($attendance_type) use($production_attendance_alias, $production_attendance_value) {
                        $attendance_type['count'] = $attendance_type['count'] + (($attendance_type['alias'] == $production_attendance_alias) ? 1 : 0);
                        $attendance_type['value'] = $attendance_type['value'] + (($attendance_type['alias'] == $production_attendance_alias) ? $production_attendance_value : 0);
                        return $attendance_type;
                    });
                }
            }

            $leave_request = $leave_requests->filter(function($item) use ($date) {
                return (data_get($item, 'start_date') <= getDateTime($date)) && (data_get($item, 'end_date') >= getDateTime($date));
            })->first();

            if ($leave_request) {
                $emplyoee_attendance = 'L';
            }

            if (! $emplyoee_attendance) {
                $holiday = $holidays->firstWhere('date', getDateTime($date));
                if ($holiday) {
                    $emplyoee_attendance = $holiday_alias ? : 'H';
                }
            }

            if ($emplyoee_attendance) {
                $attendance_types->transform(function($attendance_type) use($emplyoee_attendance) {
                    $attendance_type['count'] = $attendance_type['count'] + (($attendance_type['alias'] == $emplyoee_attendance) ? 1 : 0);
                    return $attendance_type;
                });
            }
            $date = date('Y-m-d', strtotime($date.' + 1 day'));
        }

        $payroll_template_details = $salary->payrollTemplate->payrollTemplateDetails->sortBy('position');

        $attendance = $attendance_types->whereIn('type',['present','holiday'])->sum('count');

        $half_day_data = $attendance_types->firstWhere('type','half_day');

        $half_day = $half_day_data ? $half_day_data->count : 0;

        $leave = $attendance_types->firstWhere('type','leave')['count'];

        $salary_heads = array();
        $total_earning = 0;
        $total_deduction = 0;
        foreach ($payroll_template_details as $payroll_template_detail) {
            if ($payroll_template_detail->category == 'not_applicable') {

                $amount = 0 ;

            } else if ($payroll_template_detail->category == 'attendance') {

                $salary_detail = $salary->salaryDetails->firstWhere('payroll_template_detail_id', $payroll_template_detail->id);
                $amount = ($salary_detail) ? $salary_detail->amount : 0;
                $per_day_salary = $amount / $per_day_calculation_basis;
                $total_attendance = ($attendance + $leave + ($half_day / 2));
                $amount = round($total_attendance * $per_day_salary);

            } else if ($payroll_template_detail->category == 'flat_rate') {

                $salary_detail = $salary->salaryDetails->firstWhere('payroll_template_detail_id', $payroll_template_detail->id);
                $amount = ($salary_detail) ? $salary_detail->amount : 0;

            } else if ($payroll_template_detail->category == 'user_defined') {

                $amount = 0;

            } else if ($payroll_template_detail->category == 'production') {

                $attendance_type = $attendance_types->firstWhere('id', $payroll_template_detail->employee_attendance_type_id);
                $value = ($attendance_type) ? $attendance_type->value : 0;
                $salary_detail = $salary->salaryDetails->firstWhere('payroll_template_detail_id', $payroll_template_detail->id);
                $amount = ($salary_detail) ? round($value * $salary_detail->amount) : 0;

            } else if ($payroll_template_detail->category == 'computation') {

                $computation = $payroll_template_detail->computation;
                foreach ($salary_heads as $alias => $salary_amount) {
                    $computation = str_replace($alias, $salary_amount, $computation);
                }

                $amount = $this->evaluate($computation);

                if ($amount === 'invalid') {
                    throw ValidationException::withMessages(['message' => trans('employee.salatry_structure_contains_invalid_computation')]);
                }

                $amount = round($amount);
            }

            $total_earning += (($payroll_template_detail->payHead->type == 'earning') ? $amount : 0);
            $total_deduction += (($payroll_template_detail->payHead->type == 'deduction') ? $amount : 0);

            $salary_heads[$payroll_template_detail->payHead->alias] = $amount;
            
            $payroll_template_detail->amount = $amount;
        }

        $salary->total_earning = $total_earning;
        $salary->total_deduction = $total_deduction;
        $salary->net_salary = $total_earning - $total_deduction;

        return compact('attendance_types','salary');
    }

    /**
     * Validate input
     * @param  array  $params array of input
     * @return void       
     */         
    private function validateInput($salary, $params = array())
    {
        $can_edit_payroll_amount = (\Auth::user()->can('edit-payroll-amount')) ? true : false;

        $pay_heads = gv($params, 'pay_heads', []);

        foreach ($pay_heads as $pay_head) {
            $amount = gv($pay_head, 'amount', 0);
            $pay_head_id = gv($pay_head, 'pay_head_id');

            if (! is_numeric($amount)) {
                throw ValidationException::withMessages(['message' => trans('validation.integer', ['attribute' => gv($pay_head, 'name')])]);
            }

            if ($amount < 0) {
                throw ValidationException::withMessages(['message' => trans('validation.min.numeric', ['attribute' => gv($pay_head, 'name'), 'min' => 0])]);
            }

            $payroll_template_detail = $salary->payrollTemplate->payrollTemplateDetails->firstWhere('pay_head_id', $pay_head_id);

            if (! $can_edit_payroll_amount && $payroll_template_detail->amount != $amount) {
                throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
            }
        }
    }

    /**
     * Generate a new payroll.
     *
     * @param array $params
     * @return void
     */
    public function generate($params = array())
    {
        $data = $this->fetch($params);

        $salary = gv($data, 'salary');

        $this->validateInput($salary, $params);

        $params['employee_salary_id'] = $salary->id;
        $params['per_day_calculation_basis'] = $salary->per_day_calculation_basis;
        $params['user_defined_days'] = $salary->per_day_calculation_basis == 'user_defined' ? $salary->user_defined_days : null;

        $payroll = $this->payroll->forceCreate($this->formatParams($params));

        $this->updatePayrollDetail($payroll, $params);

        return $payroll;
    }

    /**
     * Update Payroll details
     *
     * @param Payroll $payroll
     * @param array $params
     * @return void
     */
    private function updatePayrollDetail(Payroll $payroll, $params)
    {
        $pay_heads = gv($params, 'pay_heads', []);

        $payroll_details = $payroll->PayrollDetails;

        $total = 0;
        foreach ($pay_heads as $index => $pay_head) {

            $amount = gv($pay_head, 'amount', 0);
            $type = gv($pay_head, 'type');

            $payroll_detail = $this->payroll_detail->firstOrCreate([
                'payroll_id' => $payroll->id,
                'pay_head_id' => gv($pay_head, 'pay_head_id')
            ]);

            $payroll_detail->amount = $amount;
            $payroll_detail->save();

            $total += ($type == 'earning') ? $amount : 0;
            $total -= ($type == 'deduction') ? $amount : 0;
        }

        $payroll->total = $total;
        $payroll->save();
    }

    /**
     * Validate Payroll total with payroll transaction
     *
     * @param Payroll $payroll
     * @param array $params
     * @return void
     */
    private function validatePayrollDetail(Payroll $payroll, $params)
    {
        $pay_heads = gv($params, 'pay_heads', []);

        $payroll_details = $payroll->PayrollDetails;

        $total = 0;
        foreach ($pay_heads as $index => $pay_head) {
            $amount = gv($pay_head, 'amount', 0);
            $type = gv($pay_head, 'type');
            $total += ($type == 'earning') ? $amount : 0;
            $total -= ($type == 'deduction') ? $amount : 0;
        }

        if ($payroll->paid > $total) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_total_cannot_less_than_payroll_transaction_amount', ['amount' => currency($payroll->paid, 1)])]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $payroll_id = null)
    {
        $formatted = [
            'employee_id'               => gv($params, 'employee_id'),
            'employee_salary_id'        => gv($params, 'employee_salary_id'),
            'start_date'                => toDate(gv($params, 'start_date')),
            'end_date'                  => toDate(gv($params, 'end_date')),
            'per_day_calculation_basis' => gv($params, 'per_day_calculation_basis'),
            'user_defined_days'         => gv($params, 'user_defined_days',0),
            'payment_status'            => 'unpaid',
            'remarks'                   => gv($params, 'remarks'),
            'options'                   => []
        ];

        if (! $payroll_id) {
            $formatted['uuid'] = Str::uuid();
        }

        return $formatted;
    }

    /**
     * Update given payroll.
     *
     * @param Payroll $payroll
     * @param array $params
     *
     * @return Payroll
     */

    public function update(Payroll $payroll, $params)
    {
        $params['payroll_id'] = $payroll->id;

        $data = $this->fetch($params);

        $salary = gv($data, 'salary');

        $this->validateInput($salary, $params);

        $this->validatePayrollDetail($payroll, $params);

        $this->updatePayrollDetail($payroll, $params);

        return $payroll;
    }

    /**
     * Find payroll is deletable or not.
     *
     * @param string $uuid
     * @return bool|null
     */
    public function deletable($uuid)
    {
        $payroll = $this->findByUuidOrFail($uuid);

        if ($payroll->transactions()->where('is_cancelled',0)->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_associated_with_transaction')]);
        }

        return $payroll;
    }

    /**
     * Delete payroll.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Payroll $payroll)
    {
        return $payroll->delete();
    }

    /**
     * Delete multiple payroll.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->payroll->whereIn('id', $ids)->delete();
    }
}