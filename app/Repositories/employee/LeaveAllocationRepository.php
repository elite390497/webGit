<?php
namespace App\Repositories\Employee;

use Illuminate\Support\Str;
use App\Models\Employee\LeaveRequest;
use App\Models\Employee\LeaveAllocation;
use App\Models\Employee\LeaveAllocationDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Configuration\Employee\LeaveTypeRepository;

class LeaveAllocationRepository
{
    protected $leave_allocation;
    protected $leave_type;
    protected $employee;
    protected $leave_allocation_detail;
    protected $leave_request;


    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        LeaveAllocation $leave_allocation,
        LeaveTypeRepository $leave_type,
        EmployeeRepository $employee,
        LeaveAllocationDetail $leave_allocation_detail,
        LeaveRequest $leave_request
    ) {
        $this->leave_allocation = $leave_allocation;
        $this->leave_type = $leave_type;
        $this->employee = $employee;
        $this->leave_allocation_detail = $leave_allocation_detail;
        $this->leave_request = $leave_request;
    }

    /**
     * Find leave allocation with given id or throw an error.
     *
     * @param integer $id
     * @return LeaveAllocation
     */

    public function findOrFail($id)
    {
        $leave_allocation = $this->leave_allocation->info()->filterBySession()->filterById($id)->first();

        if (! $leave_allocation) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_leave_allocation')]);
        }

        return $leave_allocation;
    }

    /**
     * Find leave allocation with given uuid or throw an error.
     *
     * @param string $uuid
     * @return LeaveAllocation
     */
    public function findByUuidOrFail($uuid)
    {
        $leave_allocation = $this->leave_allocation->info()->filterBySession()->whereUuid($uuid)->first();

        if (! $leave_allocation) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_leave_allocation')]);
        }

        return $leave_allocation;
    }

    /**
     * Find employee leave allocation with given id or throw an error.
     *
     * @param array $params
     * @return LeaveAllocation
     */
    public function employeeLeaveAllocation($params)
    {
        if (! \Auth::user()->can('request-leave')) {
            throw ValidationException::withMessages(['message' => trans('general.permission_denied')]);
        }

        $id = gv($params, 'id', optional(\Auth::user()->Employee)->id);

        if (! $id) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
        }

        $employee = $this->employee->findOrFail($id);

        if (\Auth::user()->Employee->id != $id) {
            $this->employee->isAccessible($employee);
        }

        return $this->leave_allocation->info()->filterBySession()->filterByEmployeeId($employee->id)->get();
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return LeaveAllocation
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'created_at');
        $order    = gv($params, 'order', 'desc');
        $employee_id = gv($params, 'employee_id');

        $employee_id = is_array($employee_id) ? $employee_id : ($employee_id ? explode(',', $employee_id) : []);

        $query = $this->leave_allocation->info()->filterBySession();

        if (count($employee_id)) {
            $query->whereIn('employee_id', $employee_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all leave allocations using given params.
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
     * @return LeaveAllocation
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get leave allocation filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $leave_types = $this->leave_type->selectAll();
        $employees = $this->employee->getAccessibleEmployeeList();

        return compact('leave_types','employees');
    }

    /**
     * Get leave allocation pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->getFilters();
    }

    /**
     * Create a new leave allocation.
     *
     * @param array $params
     * @return void
     */
    public function create($params = array())
    {
        $this->validateLeaveTypes($params);

        $leave_allocation = $this->leave_allocation->forceCreate($this->formatParams($params));

        $this->updateLeaveAllocationDetail($leave_allocation, $params);
    }

    /**
     * Update leave allocation details
     *
     * @param LeaveAllocation $leave_allocation
     * @param array $params
     * @return void
     */
    private function updateLeaveAllocationDetail(LeaveAllocation $leave_allocation, $params)
    {
        $leave_types = gv($params, 'leave_types', []);

        $leave_allocation_details = $leave_allocation->LeaveAllocationDetails;

        foreach ($leave_types as $index => $leave_type) {

            $leave_allocation_detail = $this->leave_allocation_detail->firstOrCreate([
                'employee_leave_allocation_id' => $leave_allocation->id,
                'employee_leave_type_id' => gv($leave_type, 'id')
            ]);

            $leave_allocation_detail->allotted = gv($leave_type, 'allotted', 0);
            $leave_allocation_detail->save();
        }
    }

    /**
     * Validate leave types
     *
     * @param array $params
     * @return void
     */
    private function validateLeaveTypes($params)
    {
        $leave_types = gv($params, 'leave_types', []);

        foreach ($leave_types as $index => $leave_type) {
            $allotted = gv($leave_type, 'allotted', 0);

            if (! isInteger($allotted)) {
                throw ValidationException::withMessages([$index.'_leave_type' => trans('validation.integer', ['attribute' => gv($leave_type, 'name')])]);
            }

            if ($allotted < 0) {
                throw ValidationException::withMessages([$index.'_leave_type' => trans('validation.min.numeric', ['attribute' => gv($leave_type, 'name'), 'min' => $allotted])]);
            }
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $leave_allocation_id = null)
    {
        $employee_id = gv($params, 'employee_id');
        $start_date  = toDate(gv($params, 'start_date'));
        $end_date  = toDate(gv($params, 'end_date'));
        $description = gv($params, 'description');

        $employee = $this->employee->findOrFail($employee_id);

        $this->employee->isAccessible($employee);

        $back_date_query = $this->leave_allocation->filterByEmployeeId($employee_id);

        if ($leave_allocation_id) {
            $back_date_query->where('id','!=',$leave_allocation_id);
        }

        if ($back_date_query->where('start_date','<=',$start_date)->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_allocation_exists_for_previous_date')]);
        }

        $overlapping_query = $this->leave_allocation->filterByEmployeeId($employee_id);

        if ($leave_allocation_id) {
            $overlapping_query->where('id','!=',$leave_allocation_id);
        }

        $overlapping = $overlapping_query->where(function ($q) use ($start_date, $end_date) {
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
            throw ValidationException::withMessages(['start_date' => trans('employee.leave_allocation_overlapping')]);
        }

        $formatted = [
            'employee_id' => gv($params, 'employee_id'),
            'start_date'  => toDate(gv($params, 'start_date')),
            'end_date'  => toDate(gv($params, 'end_date')),
            'description' => gv($params, 'description'),
            'options'     => []
        ];

        if (! $leave_allocation_id) {
            $formatted['uuid'] = Str::uuid();
        }

        return $formatted;
    }

    /**
     * Update given leave allocation.
     *
     * @param LeaveAllocation $leave_allocation
     * @param array $params
     *
     * @return LeaveAllocation
     */

    public function update(LeaveAllocation $leave_allocation, $params)
    {
        $this->validateLeaveTypes($params);

        $leave_requests = $this->leave_request->filterByEmployeeId($leave_allocation->employee_id)->where('start_date','>=', toDate($leave_allocation->start_date))->where('end_date','<=', toDate($leave_allocation->end_date))->get();

        $first_leave_request = $leave_requests->sortBy('start_date')->first();
        $last_leave_request = $leave_requests->sortByDesc('end_date')->first();

        if ($leave_requests->count() && (gv($params, 'start_date') > toDate($first_leave_request->start_date) || gv($params, 'end_date') < toDate($last_leave_request->end_date))) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_allocation_limit_date_between', ['start_date' => showDate($first_leave_request->start_date), 'end_date' => showDate($last_leave_request->end_date)])]);
        }

        $leave_types = gv($params, 'leave_types', []);
        $leave_allocation_details = $leave_allocation->leaveAllocationDetails;

        foreach ($leave_types as $index => $leave_type) {
            $allotted = gv($leave_type, 'allotted', 0);

            $leave_allocation_detail = $leave_allocation_details->firstWhere('employee_leave_type_id', gv($leave_type, 'id'));

            if (! $leave_allocation_detail) {
                continue;
            }

            if ($allotted < $leave_allocation_detail->used) {
                throw ValidationException::withMessages(['message' => trans('employee.leave_balance_less_than_allotted', ['name' => $leave_allocation->employee->name, 'leave_type' => gv($leave_type, 'name'), 'used' => $leave_allocation_detail->used, 'allotted' => $allotted])]);
            }
        }

        $params['employee_id'] = $leave_allocation->employee_id;
        $leave_allocation->forceFill($this->formatParams($params, $leave_allocation->id))->save();

        $this->updateLeaveAllocationDetail($leave_allocation, $params);

        return $leave_allocation;
    }

    /**
     * Find leave allocation is deletable or not.
     *
     * @param string $uuid
     * @return bool|null
     */
    public function deletable($uuid)
    {
        $leave_allocation = $this->findByUuidOrFail($uuid);

        $leave_requests = $this->leave_request->filterByEmployeeId($leave_allocation->employee_id)->where('start_date','>=', toDate($leave_allocation->start_date))->where('end_date','<=', toDate($leave_allocation->end_date))->get();

        if ($leave_requests->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_allocation_associated_with_leave_request')]);
        }

        return $leave_allocation;
    }

    /**
     * Delete leave allocation.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(LeaveAllocation $leave_allocation)
    {
        return $leave_allocation->delete();
    }

    /**
     * Delete multiple leave allocations.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->leave_allocation->whereIn('id', $ids)->delete();
    }
}