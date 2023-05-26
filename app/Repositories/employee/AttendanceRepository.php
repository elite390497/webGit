<?php
namespace App\Repositories\Employee;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\Calendar\Holiday;
use App\Models\Employee\Payroll;
use App\Models\Employee\Attendance;
use App\Models\Employee\LeaveRequest;
use App\Models\Employee\AttendanceDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Employee\EmployeeRepository;
use App\Models\Configuration\Employee\AttendanceType;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Employee\DesignationRepository;
use App\Repositories\Configuration\Employee\EmployeeCategoryRepository;

class AttendanceRepository
{
    protected $attendance;
    protected $employee;
    protected $department;
    protected $designation;
    protected $employee_category;
    protected $holiday;
    protected $leave_request;
    protected $attendance_type;
    protected $attendance_detail;
    protected $payroll;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Attendance $attendance,
        EmployeeRepository $employee,
        DepartmentRepository $department,
        DesignationRepository $designation,
        EmployeeCategoryRepository $employee_category,
        Holiday $holiday,
        LeaveRequest $leave_request,
        AttendanceType $attendance_type,
        AttendanceDetail $attendance_detail,
        Payroll $payroll
    ) {
        $this->attendance = $attendance;
        $this->employee = $employee;
        $this->department = $department;
        $this->designation = $designation;
        $this->employee_category = $employee_category;
        $this->holiday = $holiday;
        $this->leave_request = $leave_request;
        $this->attendance_type = $attendance_type;
        $this->attendance_detail = $attendance_detail;
        $this->payroll = $payroll;
    }

    /**
     * Get attendance pre requisite.
     *
     * @return Array
     */
    public function preRequisiteRegular()
    {
        $departments = $this->department->selectAll();
        $designations = $this->designation->selectAllExludingDefault();
        $employee_categories = $this->employee_category->selectAllExludingDefault();
        $holiday_lists = $this->holiday->filterBySession()->get();
        $holidays = $holiday_lists->pluck('date')->all();

        return compact('departments','designations','employee_categories','holiday_lists','holidays');
    }

    /**
     * Get production based attendance pre requisite.
     *
     * @return Array
     */
    public function preRequisiteProduction()
    {
        $employees = $this->employee->getAccessibleEmployeeList();

        $attendance_types = $this->attendance_type->select('id','name','alias','type','unit')->whereIn('type', ['production_based_earning','production_based_deduction'])->get();

        return compact('employees','attendance_types');
    }

    /**
     * Fetch employee with his attendance for production.
     *
     * @param array $params array of parameters
     * @return Array
     */
    public function fetchProduction($params)
    {
        $employee_id = gv($params, 'employee_id');
        $date = toDate(gv($params, 'date'));

        $employee = $this->employee->findOrFail($employee_id);

        $this->employee->isAccessible($employee);

        $attendance = $this->attendance->info()->filterByEmployeeId($employee_id)->filterByDateOfAttendance($date)->first();

        if (! $attendance) {
            throw ValidationException::withMessages(['message' => trans('employee.regular_attendance_not_marked')]);
        }

        $is_payroll_generated = $this->payroll->filterByEmployeeId($employee->id)->where('start_date','<=',$date)->where('end_date','>=',$date)->count();

        $is_holiday = $this->holiday->filterByDate(gv($params, 'date'))->count() ? true : false;

        return compact('attendance','is_holiday','is_payroll_generated');
    }

    private function getColor($type)
    {
        switch ($type) {
            case 'present':
                $color = 'success';
                break;
            
            case 'leave':
                $color = 'primary';
                break;
            
            case 'absent':
                $color = 'danger';
                break;
            
            case 'holiday':
                $color = 'info';
                break;

            case 'half_day':
                $color = 'warning';
                break;
            
            default:
                $color = 'default';
                break;
        }

        return $color;
    }


    public function listRegular($params)
    {
        $designation_id = gv($params, 'designation_id');
        $department_id = gv($params, 'department_id');
        $employee_category_id = gv($params, 'employee_category_id');
        $start_date = gv($params, 'month') ? gv($params, 'month').'-01' : date('Y-m-d');
        $end_date = Carbon::parse($start_date)->endOfMonth()->toDateString();
        $params['date'] = $start_date;
        $params['summary'] = true;
        $params['self'] = 1;
        $employees = $this->employee->getData($params)->get();
        $employee_id = $employees->pluck('id')->all();

        $attendance_types = $this->attendance_type->get();

        $attendance_summary_with_name[] = array('symbol' => 'L', 'name' => trans('employee.leave'), 'value' => 0);
        $attendance_summary[] = array('symbol' => 'L', 'value' => 0);
        foreach ($attendance_types->whereNotIn('type',['production_based_earning','production_based_deduction'])->all() as $attendance_type) {
            $attendance_summary_with_name[] = array('symbol' => $attendance_type->alias, 'name' => $attendance_type->name, 'value' => 0);
            $attendance_summary[] = array('symbol' => $attendance_type->alias, 'value' => 0);
        }

        $attendances = $this->attendance->with('attendanceType')->whereIn('employee_id', $employee_id)->where('date_of_attendance','>=',$start_date)->where('date_of_attendance','<=',$end_date)->get();

        $holidays = $this->holiday->dateBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->get();

        $holiday_alias = optional($attendance_types->firstWhere('type', 'holiday'))->alias;

        $leave_requests = $this->leave_request->select('id','employee_id','start_date','end_date','options')->filterByStatus('approved')->whereIn('employee_id', $employee_id)->where(function($q) use($start_date, $end_date) {
            $q->where(function($q1) use($start_date, $end_date) {
                $q1->where('start_date','>=',$start_date)->where('end_date','<=',$end_date);
            })->orWhere(function($q2) use($start_date, $end_date) {
                $q2->where('start_date','<',$start_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q3) use($start_date, $end_date) {
                $q3->where('start_date','>=',$start_date)->where('end_date','<',$end_date);
            });
        })->get();

        foreach ($employees as $employee) {
            $all_employee_attendances = $attendances->where('employee_id', $employee->id);
            $employee_attendances = [];
            $employee_attendance_summary = [];
            for($date = $start_date; $date <= $end_date; $date = date('Y-m-d', strtotime($date.' + 1 day'))) {
                $employee_attendance = '';
                $attendance_color = 'default';
                $employee_attendance_description = '';

                $marked_attendance = $all_employee_attendances->firstWhere('date_of_attendance', getDateTime($date));

                if ($marked_attendance) {
                    $marked = $marked_attendance->attendanceType;
                    if ($marked) {
                        $attendance_color = $this->getColor($marked->type);
                        $employee_attendance = $marked->alias;
                        $employee_attendance_description = $marked_attendance->remarks;
                    }
                }

                $leave_request = $leave_requests->where('employee_id', $employee->id)->filter(function($item) use ($date) {
                    return (data_get($item, 'start_date') <= getDateTime($date)) && (data_get($item, 'end_date') >= getDateTime($date));
                })->first();

                if ($leave_request) {
                    $employee_attendance = 'L';
                    $attendance_color = $this->getColor('leave');
                    $employee_attendance_description = trans('employee.leave_approved');
                }

                if (! $employee_attendance) {
                    $holiday = $holidays->firstWhere('date', getDateTime($date));
                    if ($holiday) {
                        $employee_attendance = $holiday_alias ? : 'H';
                        $attendance_color = $this->getColor('holiday');
                        $employee_attendance_description = $holiday->description;
                    }
                }

                if ($employee_attendance) {
                    $employee_attendance_summary[] = $employee_attendance;
                }

                $employee_attendances[] = array('symbol' => $employee_attendance, 'color' => $attendance_color, 'description' => $employee_attendance_description);
            }
            $data = array_count_values($employee_attendance_summary);

            $attendance_summary_data = array();
            foreach ($data as $key => $value) {
                $attendance_summary_data[] = array('symbol' => $key, 'value' => $value);
            }
            $summary = $attendance_summary;
            $employee->attendances = $employee_attendances;
            $employee->summary = array_replace_recursive($summary, $attendance_summary_data);
        }

        return compact('employees','attendance_summary_with_name');
    }

    /**
     * Get employee leaves for given date.
     *
     * @param date $date Date of Attendance
     * @return Array
     */
    private function getLeaves($date)
    {
        $leave_requests = $this->leave_request->filterByStatus('approved')->where('start_date','<=',$date)->where('end_date','>=',$date)->get();
        $leaves = array();
        foreach ($leave_requests as $leave_request){
            $leaves[] = $leave_request->employee_id;
        }

        return $leaves;
    }

    /**
     * Get employee leaves for given date.
     *
     * @param array $attendance_types collection of attendance types
     * @param string $category category of attendance
     * @return Array
     */
    private function getAttendanceTypeCategoryWise($attendance_types, $category = 'regular')
    {
        $types['regular'] = array();
        $types['production'] = array();
        foreach ($attendance_types as $attendance_type) {
            if ($category == 'regular' && ! in_array($attendance_type->type, ['production_based_earning','production_based_deduction'])) {
                $types['regular'][] = array('text' => $attendance_type->name.' ('.$attendance_type->alias.')', 'value' => $attendance_type->id);
            } else if ($category == 'production' && in_array($attendance_type->type, ['production_based_earning','production_based_deduction'])) {
                $types['production'][] = array('text' => $attendance_type->name.' ('.$attendance_type->alias.')', 'value' => $attendance_type->id);
            }
        }

        return $types[$category];
    }

    /**
     * Fetch employee with their attendance.
     *
     * @param array $params array of parameters
     * @return Array
     */
    public function fetchRegular($params)
    {
        $params['summary'] = true;
        $params['status'] = 'active';
        $date_of_attendance = toDate(gv($params, 'date'));

        $employees = $this->employee->getData($params)->get();

        $attendance_types = $this->attendance_type->select('id','name','alias','type')->filterByStatus(1)->get();
        $attendances = $this->attendance->filterByDateOfAttendance($date_of_attendance)->whereIn('employee_id', $employees->pluck('id')->all())->get();

        $regular_attendance_types = $this->getAttendanceTypeCategoryWise($attendance_types, 'regular');
        $production_attendance_types = $this->getAttendanceTypeCategoryWise($attendance_types, 'production');
        $is_holiday = $this->holiday->filterByDate($date_of_attendance)->count() ? true : false;

        $payroll_generated = $this->payroll->whereIn('employee_id', $employees->pluck('id')->all())->where('start_date','<=',$date_of_attendance)->where('end_date','>=',$date_of_attendance)->get()->pluck('employee_id')->all();

        $leaves = $this->getLeaves(gv($params, 'date'));

        return compact('employees','attendance_types','regular_attendance_types','production_attendance_types','leaves','attendances','is_holiday','payroll_generated');
    }

    /**
     * Validate all input employees
     *
     * @param array $params array of parameters
     */
    private function validateEmployees($params)
    {
        $params['status']   = 'active';
        $employees          = gv($params, 'employees', []);
        $date_of_attendance = toDate(gv($params, 'date_of_attendance'));

        if (! $employees) {
            throw ValidationException::withMessages(['message' => trans('employee.no_employee_found_for_attendance')]);
        }

        $all_employees = $this->employee->getData($params)->get();

        $input_employee_ids = [];
        $attendance_type_ids = [];
        foreach ($employees as $employee) {
            $employee_id = gv($employee, 'id');
            $attendance_type_ids[] = gv($employee, 'attendance');

            if (! $employee_id) {
                throw ValidationException::withMessages(['message' => trans('employee.missing_employee_id_for_attendance')]);
            }

            $input_employee_ids[] = $employee_id;
        }

        $fetched_employee_ids = [];
        foreach ($all_employees as $employee) {
            $fetched_employee_ids[] = $employee_id;
        }

        if (array_diff($fetched_employee_ids, $input_employee_ids)) {
            throw ValidationException::withMessages(['message' => trans('employee.invalid_employee_input_for_attendance')]);
        }
    }

    /**
     * Validate all input
     *
     * @param array $params array of parameters
     */
    private function validateInput($params)
    {
        $category           = gv($params, 'category');
        $date_of_attendance = toDate(gv($params, 'date_of_attendance'));

        if (! in_array($category, ['regular','production'])) {
            throw ValidationException::withMessages(['message' => trans('employee.invalid_attendance_category')]);
        }

        if (! dateBetweenSession($date_of_attendance)) {
            throw ValidationException::withMessages(['date_of_attendance' => trans('academic.invalid_session_date_range')]);
        }
    }

    /**
     * Validate all attendance types
     *
     * @param array $params array of parameters
     */
    private function validateAttendanceType($params)
    {
        $category  = gv($params, 'category');
        $employees = gv($params, 'employees', []);

        $attendance_type_query = $this->attendance_type->whereNotNull('id');

        if ($category == 'regular') {
            $attendance_type_query->whereNotIn('type', ['production_based_earning', 'production_based_deduction']);
        } else {
            $attendance_type_query->whereIn('type', ['production_based_earning', 'production_based_deduction']);
        }

        $attendance_types = $attendance_type_query->get()->pluck('id')->all();

        $input_attendance_type_ids = [];
        foreach ($employees as $employee) {
            $employee_attendance = gv($employee, 'attendance');
            if ($employee_attendance) {
                $input_attendance_type_ids[] = $employee_attendance;
            }
        }

        foreach ($input_attendance_type_ids as $input_attendance_type_id) {
            if (! in_array($input_attendance_type_id, $attendance_types)) {
                throw ValidationException::withMessages(['message' => trans('employee.invalid_attendance_type')]);
            }
        }
    }

    /**
     * Store employee's regular attendance.
     *
     * @return Array
     */
    public function storeRegular($params)
    {
        $category           = gv($params, 'category');
        $employees          = gv($params, 'employees', []);
        $date_of_attendance = toDate(gv($params, 'date_of_attendance'));

        $this->validateInput($params);

        $this->validateEmployees($params);

        $this->validateAttendanceType($params);

        $leaves = $this->getLeaves($date_of_attendance);

        $attendances = $this->attendance->filterByDateOfAttendance($date_of_attendance)->get();

        $payroll_generated = $this->payroll->where('start_date','<=',$date_of_attendance)->where('end_date','>=',$date_of_attendance)->get()->pluck('employee_id')->all();

        foreach ($employees as $employee) {
            $id         = gv($employee, 'id');
            $attendance = gv($employee, 'attendance');
            $remarks    = gv($employee, 'remarks');

            $attendance = (in_array($id, $leaves)) ? null : $attendance;
            $remarks    = (in_array($id, $leaves)) ? null : $remarks;

            if (in_array($id, $payroll_generated)) {
                continue;
            }
            
            $employee_attendance = $attendances->firstWhere('employee_id', $id);

            if (! $attendance) {
                if ($employee_attendance) {
                    $employee_attendance->delete();   
                }                
            } else {
                if ($employee_attendance) {
                    $employee_attendance->employee_attendance_type_id = $attendance;
                    $employee_attendance->remarks = $remarks;
                    $employee_attendance->save();
                } else {
                    $employee_attendance = $this->attendance->forceCreate([
                        'date_of_attendance'          => toDate($date_of_attendance),
                        'employee_id'                 => $id,
                        'employee_attendance_type_id' => $attendance,
                        'remarks'                     => $remarks
                    ]);
                }
            }
        }
    }

    /**
     * Store employee's production attendance.
     *
     * @return Array
     */
    public function storeProduction($params)
    {
        $employee_id = gv($params, 'employee_id');
        $date_of_attendance = toDate(gv($params, 'date_of_attendance'));
        $attendances = gv($params, 'attendances', []);

        $params['category'] = 'production';
        $this->validateInput($params);

        $employee = $this->employee->findOrFail($employee_id);

        $this->employee->isAccessible($employee);

        $is_payroll_generated = $this->payroll->filterByEmployeeId($employee->id)->where('start_date','<=',$date_of_attendance)->where('end_date','>=',$date_of_attendance)->count();

        if ($is_payroll_generated) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_is_generated')]);
        }

        $ids = array();
        foreach ($attendances as $index => $attendance) {
            $id = gv($attendance, 'id');
            $value = gv($attendance, 'value', 0);

            $ids[] = $id;

            if (! isInteger($value)) {
                throw ValidationException::withMessages(['value_'.$index => trans('validation.integer', ['attribute' => trans('employee.production_attendance_value')])]);
            }

            if ($value < 0) {
                throw ValidationException::withMessages(['value_'.$index => trans('validation.min.numeric', ['attribute' => trans('employee.production_attendance_value'), 'min' => 0])]);
            }
        }

        if (count($attendances) != count(array_unique($ids))) {
            throw ValidationException::withMessages(['message' => trans('employee.duplicate_production_attendance_type_found')]);
        }

        $attendance = $this->attendance->info()->filterByEmployeeId($employee_id)->filterByDateOfAttendance($date_of_attendance)->first();

        if (! $attendance) {
            throw ValidationException::withMessages(['message' => trans('employee.regular_attendance_not_marked')]);
        }

        $attendance_types = $this->attendance_type->select('id','name','alias','type','unit')->whereIn('type', ['production_based_earning','production_based_deduction'])->get();

        foreach ($attendance_types as $attendance_type) {
            $attendance_detail = $this->attendance_detail->firstOrNew([
                'employee_attendance_id' => $attendance->id,
                'employee_attendance_type_id' => $attendance_type->id
            ]);

            $employee_attendance = array_first(array_where($attendances, function ($data, $key) use($attendance_type) {
                    return data_get($data, 'id') == $attendance_type->id;
                }));

            if ($employee_attendance)  {
                $value = gv($employee_attendance, 'value');
                $remarks = gv($employee_attendance, 'remarks');

                if ($value) {
                    $attendance_detail->value = $value;
                    $attendance_detail->remarks = $remarks;
                    $attendance_detail->save();
                } else {
                    $attendance_detail->delete();
                }
            } else {
                if ($attendance_detail->id) {
                    $attendance_detail->delete();
                }
            }
        }
    }
}