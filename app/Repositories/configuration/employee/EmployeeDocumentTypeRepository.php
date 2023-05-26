<?php
namespace App\Repositories\Configuration\Employee;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\EmployeeDocumentType;

class EmployeeDocumentTypeRepository
{
    protected $employee_document_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeDocumentType $employee_document_type
    ) {
        $this->employee_document_type = $employee_document_type;
    }

    /**
     * Get employee document type query
     *
     * @return EmployeeDocumentType query
     */
    public function getQuery()
    {
        return $this->employee_document_type;
    }

    /**
     * Count employee document type
     *
     * @return integer
     */
    public function count()
    {
        return $this->employee_document_type->count();
    }

    /**
     * List all employee document types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->employee_document_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all employee document types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->employee_document_type->all(['name', 'id']);
    }

    /**
     * List all employee document types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->employee_document_type->all()->pluck('id')->all();
    }

    /**
     * Get all employee document types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->employee_document_type->all();
    }

    /**
     * Find employee document type with given id.
     *
     * @param integer $id
     * @return EmployeeDocumentType
     */
    public function find($id)
    {
        return $this->employee_document_type->find($id);
    }

    /**
     * Find employee document type with given id or throw an error.
     *
     * @param integer $id
     * @return EmployeeDocumentType
     */
    public function findOrFail($id)
    {
        $employee_document_type = $this->employee_document_type->find($id);

        if (! $employee_document_type) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_document_type')]);
        }

        return $employee_document_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return EmployeeDocumentType
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->employee_document_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all employee document types using given params.
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
     * @return EmployeeDocumentType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new employee document type.
     *
     * @param array $params
     * @return EmployeeDocumentType
     */
    public function create($params)
    {
        return $this->employee_document_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $employee_document_type_id
     * @return array
     */
    private function formatParams($params, $employee_document_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given employee document type.
     *
     * @param EmployeeDocumentType $employee_document_type
     * @param array $params
     *
     * @return EmployeeDocumentType
     */
    public function update(EmployeeDocumentType $employee_document_type, $params)
    {
        return $employee_document_type->forceFill($this->formatParams($params, $employee_document_type->id))->save();
    }

    /**
     * Find employee document type & check it can be deleted or not.
     *
     * @param integer $id
     * @return EmployeeDocumentType
     */
    public function deletable($id)
    {
        $employee_document_type = $this->findOrFail($id);

        if ($employee_document_type->employeeDocuments()->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.document_type_associated_with_document')]);
        }

        return $employee_document_type;
    }

    /**
     * Delete employee document type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EmployeeDocumentType $employee_document_type)
    {
        return $employee_document_type->delete();
    }

    /**
     * Delete multiple employee document types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->employee_document_type->whereIn('id', $ids)->delete();
    }
}
