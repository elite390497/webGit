<?php
namespace App\Repositories\Configuration\Employee;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\EmployeeGroup;

class EmployeeGroupRepository
{
    protected $employee_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeGroup $employee_group
    ) {
        $this->employee_group = $employee_group;
    }

    /**
     * Get employee group query
     *
     * @return EmployeeGroup query
     */
    public function getQuery()
    {
        return $this->employee_group;
    }

    /**
     * Count employee group
     *
     * @return integer
     */
    public function count()
    {
        return $this->employee_group->count();
    }

    /**
     * List all employee groups by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->employee_group->all()->pluck('name', 'id')->all();
    }

    /**
     * List all employee groups by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->employee_group->all(['name', 'id']);
    }

    /**
     * List all employee groups by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->employee_group->all()->pluck('id')->all();
    }

    /**
     * Get all employee groups
     *
     * @return array
     */
    public function getAll()
    {
        return $this->employee_group->all();
    }

    /**
     * Find employee group with given id.
     *
     * @param integer $id
     * @return EmployeeGroup
     */
    public function find($id)
    {
        return $this->employee_group->find($id);
    }

    /**
     * Find employee group with given id or throw an error.
     *
     * @param integer $id
     * @return EmployeeGroup
     */
    public function findOrFail($id)
    {
        $employee_group = $this->employee_group->find($id);

        if (! $employee_group) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_employee_group')]);
        }

        return $employee_group;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return EmployeeGroup
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->employee_group->orderBy($sort_by, $order);
    }

    /**
     * Paginate all employee groups using given params.
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
     * @return EmployeeGroup
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new employee group.
     *
     * @param array $params
     * @return EmployeeGroup
     */
    public function create($params)
    {
        return $this->employee_group->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $employee_group_id
     * @return array
     */
    private function formatParams($params, $employee_group_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given employee group.
     *
     * @param EmployeeGroup $employee_group
     * @param array $params
     *
     * @return EmployeeGroup
     */
    public function update(EmployeeGroup $employee_group, $params)
    {
        return $employee_group->forceFill($this->formatParams($params, $employee_group->id))->save();
    }

    /**
     * Find employee group & check it can be deleted or not.
     *
     * @param integer $id
     * @return EmployeeGroup
     */
    public function deletable($id)
    {
        $employee_group = $this->findOrFail($id);

        return $employee_group;
    }

    /**
     * Delete employee group.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EmployeeGroup $employee_group)
    {
        return $employee_group->delete();
    }

    /**
     * Delete multiple employee groups.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->employee_group->whereIn('id', $ids)->delete();
    }
}
