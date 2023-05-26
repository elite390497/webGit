<?php
namespace App\Repositories\Configuration\Employee;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\Department;

class DepartmentRepository
{
    protected $department;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Department $department
    ) {
        $this->department = $department;
    }

    /**
     * Get department query
     *
     * @return Department query
     */
    public function getQuery()
    {
        return $this->department;
    }

    /**
     * Count department
     *
     * @return integer
     */
    public function count()
    {
        return $this->department->count();
    }

    /**
     * List all department by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->department->all()->pluck('name', 'id')->all();
    }

    /**
     * List all department by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->department->all(['name', 'id']);
    }

    /**
     * List all department by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->department->all()->pluck('id')->all();
    }

    /**
     * Get all department
     *
     * @return array
     */
    public function getAll()
    {
        return $this->department->all();
    }

    /**
     * Find department with given id.
     *
     * @param integer $id
     * @return Department
     */
    public function find($id)
    {
        return $this->department->find($id);
    }

    /**
     * Find department with given id or throw an error.
     *
     * @param integer $id
     * @return Department
     */
    public function findOrFail($id, $field = 'message')
    {
        $department = $this->department->find($id);

        if (! $department) {
            throw ValidationException::withMessages([$field => trans('employee.could_not_find_department')]);
        }

        return $department;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Department
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->department->orderBy($sort_by, $order);
    }

    /**
     * Paginate all department using given params.
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
     * @return Department
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new department.
     *
     * @param array $params
     * @return Department
     */
    public function create($params)
    {
        return $this->department->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $department_id
     * @return array
     */
    private function formatParams($params, $department_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given department.
     *
     * @param Department $department
     * @param array $params
     *
     * @return Department
     */
    public function update(Department $department, $params)
    {
        return $department->forceFill($this->formatParams($params, $department->id))->save();
    }

    /**
     * Find department & check it can be deleted or not.
     *
     * @param integer $id
     * @return Department
     */
    public function deletable($id)
    {
        $department = $this->findOrFail($id);

        if ($department->employeeDesignations()->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.department_associated_with_term')]);
        }

        return $department;
    }

    /**
     * Delete department.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Department $department)
    {
        return $department->delete();
    }

    /**
     * Delete multiple department.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->department->whereIn('id', $ids)->delete();
    }
}
