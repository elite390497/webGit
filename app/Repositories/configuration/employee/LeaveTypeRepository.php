<?php
namespace App\Repositories\Configuration\Employee;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\LeaveType;

class LeaveTypeRepository
{
    protected $leave_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        LeaveType $leave_type
    ) {
        $this->leave_type = $leave_type;
    }

    /**
     * Get leave type query
     *
     * @return LeaveType query
     */
    public function getQuery()
    {
        return $this->leave_type;
    }

    /**
     * Count leave type
     *
     * @return integer
     */
    public function count()
    {
        return $this->leave_type->count();
    }

    /**
     * List all leave types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->leave_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all leave types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->leave_type->all(['name', 'id']);
    }

    /**
     * List all active leave types by name & id for select option
     *
     * @return array
     */

    public function selectAllActive()
    {
        return $this->leave_type->filterByStatus(1)->get(['name', 'id']);
    }

    /**
     * List all leave types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->leave_type->all()->pluck('id')->all();
    }

    /**
     * Get all leave types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->leave_type->all();
    }

    /**
     * Find leave type with given id.
     *
     * @param integer $id
     * @return LeaveType
     */
    public function find($id)
    {
        return $this->leave_type->find($id);
    }

    /**
     * Find leave type with given id or throw an error.
     *
     * @param integer $id
     * @return LeaveType
     */
    public function findOrFail($id)
    {
        $leave_type = $this->leave_type->find($id);

        if (! $leave_type) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_leave_type')]);
        }

        return $leave_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return LeaveType
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->leave_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all leave types using given params.
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
     * @return LeaveType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new leave type.
     *
     * @param array $params
     * @return LeaveType
     */
    public function create($params)
    {
        return $this->leave_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $leave_type_id
     * @return array
     */
    private function formatParams($params, $leave_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description'),
            'alias'       => gv($params, 'alias'),
            'is_active'   => gbv($params, 'is_active')
        ];

        return $formatted;
    }

    /**
     * Update given leave type.
     *
     * @param LeaveType $leave_type
     * @param array $params
     *
     * @return LeaveType
     */
    public function update(LeaveType $leave_type, $params)
    {
        return $leave_type->forceFill($this->formatParams($params, $leave_type->id))->save();
    }

    /**
     * Find leave type & check it can be deleted or not.
     *
     * @param integer $id
     * @return LeaveType
     */
    public function deletable($id)
    {
        $leave_type = $this->findOrFail($id);

        if ($leave_type->leaveRequests()->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_type_associated_with_leave_request')]);
        }

        if ($leave_type->leaveAllocationDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.leave_type_associated_with_leave_allocation')]);
        }

        return $leave_type;
    }

    /**
     * Delete leave type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(LeaveType $leave_type)
    {
        return $leave_type->delete();
    }

    /**
     * Delete multiple leave types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->leave_type->whereIn('id', $ids)->delete();
    }
}
