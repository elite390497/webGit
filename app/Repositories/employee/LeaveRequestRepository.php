<?php
namespace App\Repositories\Employee;

use Illuminate\Support\Str;
use App\Models\Calendar\Holiday;
use App\Models\Employee\Payroll;
use App\Models\Employee\LeaveRequest;
use App\Models\Employee\LeaveAllocation;
use App\Models\Employee\LeaveRequestDetail;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Configuration\Employee\LeaveTypeRepository;

class LeaveRequestRepository
{
    protected $leave_request;
    protected $leave_type;
    protected $employee;
    protected $holiday;
    protected $leave_allocation;
    protected $upload;
    protected $leave_request_detail;
    protected $payroll;
    protected $module = 'leave_request';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        LeaveRequest $leave_request,
        LeaveTypeRepository $leave_type,
        EmployeeRepository $employee,
        Holiday $holiday,
        LeaveAllocation $leave_allocation,
        UploadRepository $upload,
        LeaveRequestDetail $leave_request_detail,
        Payroll $payroll
    ) {
        $this->leave_request = $leave_request;
        $this->leave_type = $leave_type;
        $this->employee = $employee;
        $this->holiday = $holiday;
        $this->leave_allocation = $leave_allocation;
        $this->upload = $upload;
        $this->leave_request_detail = $leave_request_detail;
        $this->payroll = $payroll;
    }

    /**
     * Find leave request with given id or throw an error.
     *
     * @param integer $id
     * @return LeaveRequest
     */

    public function findOrFail($id)
    {
        $leave_request = $this->leave_request->info()->filterBySession()->filterById($id)->first();

        if (! $leave_request) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_leave_request')]);
        }

        return $leave_request;
    }

    /**
     * Find leave request with given uuid or throw an error.
     *
     * @param string $uuid
     * @return LeaveRequest
     */

    public function findByUuidOrFail($uuid)
    {
        $leave_request = $this->leave_request->info()->filterBySession()->whereUuid($uuid)->first();

        if (! $leave_request) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_leave_request')]);
        }

        return $leave_request;
    }

    /**
     * Find leave request is accessible for authenticated user.
     *
     * @param LeaveRequest $leave_request
     * @return boolean
     */
    public function isAccessible(LeaveRequest $leave_request)
    {
        $employee_id = \Auth::user()->Employee->id;
        $accessible_employee_ids = $this->employee->getAccessibleEmployeeId();
        array_push($accessible_employee_ids, $employee_id);

        $accessible_employees = \Auth::user()->can('request-leave-for-other-employee') ? $accessible_employee_ids : [$employee_id];
        
        if (! in_array($leave_request->employee_id, $accessible_employees)) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Find leave allocation for given leave request
     *
     * @param LeaveRequest $leave_request
     * @return LeaveAllocation
     */
    public function getLeaveAllocation(LeaveRequest $leave_request)
    {
        $leave_allocation = $this->leave_allocation->with(['leaveAllocationDetails:id,employee_leave_allocation_id,employee_leave_type_id,allotted,used','leaveAllocationDetails.leaveType:id,name,alias'])->filterBySession()->filterByEmployeeId($leave_request->employee_id)->where('start_date','<=', toDate($leave_request->start_date))->where('end_date','>=', toDate($leave_request->end_date))->first();

        if (! $leave_allocation) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_leave_allocation_for_given_period', ['start' => showDate($leave_request->start_date), 'end' => showDate($leave_request->end_date), 'name' => $leave_request->Employee->name])]);
        }

        return $leave_allocation;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return LeaveRequest
     */
    public function getData($params)
    {
        $sort_by       = gv($params, 'sort_by', 'created_at');
        $order         = gv($params, 'order', 'desc');
        $employee_id   = gv($params, 'employee_id');
        $leave_type_id = gv($params, 'leave_type_id');

        $leave_type_id = is_array($leave_type_id) ? $leave_type_id : ($leave_type_id ? explode(',', $leave_type_id) : []);
        $employee_id = is_array($employee_id) ? $employee_id : ($employee_id ? explode(',', $employee_id) : []);

        $query = $this->leave_request->info()->filterBySession();

        $auth_user = \Auth::user();
        $accessible_employee_ids = $this->employee->getAccessibleEmployeeId();
        array_push($accessible_employee_ids, $auth_user->Employee->id);

        if (\Auth::user()->can('request-leave-for-other-employee')) {
            $query->whereIn('employee_id', $accessible_employee_ids);
        } else {
            $query->filterByEmployeeId($auth_user->Employee->id);
        }

        if (count($employee_id)) {
            $query->whereIn('employee_id', $employee_id);
        }

        if (count($leave_type_id)) {
            $query->whereIn('employee_leave_type_id', $leave_type_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all leave requests using given params.
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
     * @return LeaveRequest
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get leave request filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $leave_types = $this->leave_type->selectAll();
        $employees = \Auth::user()->can('request-leave-for-other-employee') ? $this->employee->getAccessibleEmployeeList() : [];

        return compact('leave_types','employees');
    }

    /**
     * Get leave request pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->getFilters();
    }

    /**
     * Create a new leave request.
     *
     * @param array $params
     * @return void
     */
    public function create($params = array())
    {
        $leave_request = $this->leave_request->forceCreate($this->formatParams($params));

        $this->processUpload($leave_request, $params);

        return $leave_request;
    }

    private function getHolidayAsLeave($params, $holidays)
    {
        $start_date = toDate(gv($params, 'start_date'));
        $end_date = toDate(gv($params, 'end_date'));

        if (! dateBetweenSession($start_date)) {
            throw ValidationException::withMessages(['message' => trans('employee.date_not_in_academic_session', ['date' => trans('employee.leave_request_start_date')])]);
        }

        if (! dateBetweenSession($end_date)) {
            throw ValidationException::withMessages(['message' => trans('employee.date_not_in_academic_session', ['date' => trans('employee.leave_request_end_date')])]);
        }

        $dates = array();

        if (config('config.leave_holiday_calculation_mode') == 'include') {
            $dates = $holidays->pluck('date')->all();
        } else if (config('config.leave_holiday_calculation_mode') == 'include_if_enclosed') {
            $holidays = $holidays->pluck('date')->all();
            foreach ($holidays as $date) {
                $previous_date = date('Y-m-d', strtotime($date.' -1 day'));
                $next_date = date('Y-m-d', strtotime($date.' +1 day'));

                if ($previous_date >= $start_date && $next_date <= $end_date) {
                    $dates[] = $date;
                }
            }
        }

        return $dates;
    }

    private function validatePreviousLeaveRequest($params = array())
    {
        $leave_request_id = gv($params, 'leave_request_id');
        $leave_type_id    = gv($params, 'leave_type_id');
        $employee_id      = gv($params, 'employee_id');
        $employee_name    = gv($params, 'employee_name');
        $leave_requested  = gv($params, 'leave_requested');
        $leave_balance    = gv($params, 'leave_balance');

        $pending_leave_request_query = (! $leave_request_id) ? $this->leave_request : $this->leave_request->where('id', '!=', $leave_request_id);

        $pending_leave_requests = $pending_leave_request_query->info()->filterByEmployeeLeaveTypeId($leave_type_id)->filterByEmployeeId($employee_id)->filterByStatus('pending')->get();

        $pending_leave_count = 0;
        foreach ($pending_leave_requests as $pending_leave_request) {
            $pending_leave_count += getLeaveRequestCount($pending_leave_request);
        }

        $leave_pending = $leave_requested + $pending_leave_count;
        if ($leave_pending > $leave_balance) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_balance_with_previous_request_less_than_requested', ['name' => $employee_name, 'pending' => $pending_leave_count, 'balance' => $leave_balance, 'requested' => $leave_requested])]);
        }
    }

    private function validateLeaveRequestOverlapping($params = array())
    {
        $leave_request_id = gv($params, 'leave_request_id');
        $employee_id      = gv($params, 'employee_id');
        $start_date       = toDate(gv($params, 'start_date'));
        $end_date       = toDate(gv($params, 'end_date'));

        $overlapping_query = (! $leave_request_id) ? $this->leave_request : $this->leave_request->where('id', '!=', $leave_request_id);

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
            throw ValidationException::withMessages(['message' => trans('employee.leave_request_overlapping')]);
        }
    }

    private function getLeaveRequestEmployee($params = array())
    {
        $employee_id = gv($params, 'employee_id');

        if (\Auth::user()->can('request-leave-for-other-employee') && $employee_id) {
            $employee = $this->employee->findOrFail($employee_id);
            $this->employee->isAccessible($employee);
        } else {
            $employee = \Auth::user()->Employee;            
        }

        return $employee;
    }

    private function validateLeaveBalance($params = array())
    {
        $employee_id     = gv($params, 'employee_id');
        $employee_name   = gv($params, 'employee_name');
        $start_date      = toDate(gv($params, 'start_date'));
        $end_date      = toDate(gv($params, 'end_date'));
        $leave_type_id   = gv($params, 'leave_type_id');
        $leave_type_name = gv($params, 'leave_type_name');
        $leave_requested = gv($params, 'leave_requested');

        $leave_allocation = $this->leave_allocation->with('leaveAllocationDetails')->filterByEmployeeId($employee_id)->where('start_date','<=',$start_date)->where('end_date','>=',$end_date)->first();

        if (! $leave_allocation) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_leave_allocation_for_given_period', ['start' => showDate($start_date), 'end' => showDate($end_date), 'name' => $employee_name])]);
        }

        $leave_allocation_detail = $leave_allocation->leaveAllocationDetails->firstWhere('employee_leave_type_id', $leave_type_id);

        if (! $leave_allocation_detail) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_allocation_leave_type_undefined', ['name' => $leave_type_name])]);
        }

        $leave_balance = $leave_allocation_detail->allotted - $leave_allocation_detail->used;

        if ($leave_balance < $leave_requested) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_balance_less_than_requested', ['name' => $leave_type_name, 'balance' => $leave_balance, 'requested' => $leave_requested])]);
        }

        return $leave_balance;
    }

    private function isPayrollGenerated($params)
    {
        $start_date  = toDate(gv($params, 'start_date'));
        $end_date  = toDate(gv($params, 'end_date'));
        $employee_id = gv($params, 'employee_id');

        $payroll = $this->payroll->filterByEmployeeId($employee_id)->where(function($q) use($start_date, $end_date) {
            $q->where(function($q1) use($start_date, $end_date) {
                $q1->where('start_date','<=',$start_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q2) use($start_date) {
                $q2->where('start_date','<=',$start_date)->where('end_date','>',$start_date);
            })->orWhere(function($q2) use($end_date) {
                $q2->where('start_date','<',$end_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q3) use($start_date, $end_date) {
                $q3->where('start_date','>',$start_date)->where('end_date','<',$end_date);
            });
        })->first();

        if ($payroll) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_cannot_requested_once_payroll_generated', ['start_date' => showDate($payroll->start_date), 'end_date' => showDate($payroll->end_date)])]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $leave_request_id = null)
    {
        $start_date    = toDate(gv($params, 'start_date'));
        $end_date    = toDate(gv($params, 'end_date'));
        $leave_type_id = gv($params, 'employee_leave_type_id');
        $employee_id   = gv($params, 'employee_id');
        $reason        = gv($params, 'reason');

        $this->isPayrollGenerated($params);

        $holidays = $this->holiday->dateBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->orderBy('date','asc')->get();

        $holiday_as_leaves = $this->getHolidayAsLeave($params, $holidays);
        $diff = dateDiff($start_date, $end_date) + 1;
        $leave_requested = $diff + count($holiday_as_leaves) - count($holidays);

        $leave_type = $this->leave_type->findOrFail($leave_type_id);

        $employee = $this->getLeaveRequestEmployee([
            'employee_id' => $employee_id
        ]);

        $this->validateLeaveRequestOverlapping([
            'leave_request_id' => $leave_request_id,
            'employee_id'      => $employee->id,
            'start_date'       => toDate($start_date),
            'end_date'         => toDate($end_date)
        ]);

        $leave_balance = $this->validateLeaveBalance([
            'employee_id'     => $employee->id,
            'employee_name'   => $employee->name,
            'start_date'      => toDate($start_date),
            'end_date'        => toDate($end_date),
            'leave_type_id'   => $leave_type->id,
            'leave_type_name' => $leave_type->name,
            'leave_requested' => $leave_requested
        ]);

        $this->validatePreviousLeaveRequest([
            'leave_request_id' => $leave_request_id,
            'leave_type_id'    => $leave_type_id,
            'employee_id'      => $employee->id,
            'employee_name'    => $employee->name,
            'leave_requested'  => $leave_requested,
            'leave_balance'    => $leave_balance
        ]);

        $formatted = [
            'employee_id'            => $employee->id,
            'employee_leave_type_id' => $leave_type->id,
            'start_date'             => toDate($start_date),
            'end_date'               => toDate($end_date),
            'reason'                 => $reason,
            'status'                 => 'pending',
            'requester_user_id'      => \Auth::user()->id,
        ];

        $all_holidays = $holidays->pluck('date')->all();
        $options['holidays']['included'] = $holiday_as_leaves;
        $options['holidays']['excluded'] = array_values(array_diff($all_holidays, $holiday_as_leaves));
        $formatted['options'] = $options;

        if (! $leave_request_id) {
            $formatted['uuid'] = Str::uuid();
            $formatted['upload_token'] = gv($params, 'upload_token');
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param LeaveRequest $leave_request
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(LeaveRequest $leave_request, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $leave_request->id, $upload_token);
        } else {
            $this->upload->update($this->module, $leave_request->id, $upload_token);
        }
    }

    private function isEditable(LeaveRequest $leave_request)
    {
        if ($leave_request->status != 'pending') {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Update given leave request.
     *
     * @param LeaveRequest $leave_request
     * @param array $params
     *
     * @return LeaveRequest
     */

    public function update(LeaveRequest $leave_request, $params)
    {
        $this->isEditable($leave_request);

        $leave_request->forceFill($this->formatParams($params, $leave_request->id))->save();

        $this->processUpload($leave_request, $params, 'update');

        return $leave_request;
    }

    /**
     * Update given leave request status.
     *
     * @param LeaveRequest $leave_request
     * @param array $params
     *
     * @return LeaveRequest
     */
    public function updateSatus(LeaveRequest $leave_request, $params)
    {
        $status = gv($params, 'status');
        $comment = gv($params, 'comment');

        $this->employee->isAccessible($leave_request->employee);

        $this->isPayrollGenerated([
            'start_date' => toDate($leave_request->start_date),
            'end_date' => toDate($leave_request->end_date),
            'employee_id' => $leave_request->employee_id
        ]);

        if (! in_array($status, ['pending','approved','rejected','cancelled'])) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
        }

        $this->leave_request_detail->forceCreate([
            'employee_leave_request_id' => $leave_request->id,
            'date_of_action' => date('Y-m-d'),
            'status' => $status,
            'comment' => $comment,
            'approver_user_id' => \Auth::user()->id,
            'options' => []
        ]);

        if ($status == $leave_request->status) {
            return $leave_request;
        }

        $leave_requested = getLeaveRequestCount($leave_request);
        $leave_allocation = $this->getLeaveAllocation($leave_request);
        $leave_allocation_detail = $leave_allocation->leaveAllocationDetails->firstWhere('employee_leave_type_id', $leave_request->employee_leave_type_id);

        if ($status == 'approved') {
            $leave_allocation_detail->increment('used', $leave_requested);
        } else if ($leave_request->status == 'approved' && in_array($status, ['pending','rejected','cancelled'])) {
            $leave_allocation_detail->decrement('used', $leave_requested);
        }

        $leave_request->status = $status;
        $leave_request->save();
        return $leave_request;
    }

    /**
     * Find leave request is deletable or not.
     *
     * @param string $uuid
     * @return bool|null
     */
    public function deletable($uuid)
    {
        $leave_request = $this->findByUuidOrFail($uuid);

        $this->isEditable($leave_request);

        return $leave_request;
    }

    /**
     * Delete leave request.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(LeaveRequest $leave_request)
    {
        return $leave_request->delete();
    }

    /**
     * Delete multiple leave requests.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->leave_request->whereIn('id', $ids)->delete();
    }
}