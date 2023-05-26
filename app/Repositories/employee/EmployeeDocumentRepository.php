<?php
namespace App\Repositories\Employee;

use App\Models\Employee\EmployeeDocument;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Employee\EmployeeDocumentTypeRepository;

class EmployeeDocumentRepository
{
    protected $employee_document;
    protected $upload;
    protected $employee_document_type;
    protected $module = 'employee_document';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeDocument $employee_document,
        UploadRepository $upload,
        EmployeeDocumentTypeRepository $employee_document_type
    ) {
        $this->employee_document = $employee_document;
        $this->upload = $upload;
        $this->employee_document_type = $employee_document_type;
    }

    /**
     * Get employee document query
     *
     * @return EmployeeDocument query
     */
    public function getQuery()
    {
        return $this->employee_document;
    }

    /**
     * Get employee document pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->employee_document_type->selectAll();
    }

    /**
     * Find employee document with given id.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeDocument
     */
    public function find($employee_id, $id)
    {
        return $this->employee_document->with('employeeDocumentType')->filterByEmployeeId($employee_id)->filterById($id)->first();
    }

    /**
     * Find employee document with given id or throw an error.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeDocument
     */
    public function findOrFail($employee_id, $id, $field = 'message')
    {
        $employee_document = $this->employee_document->with('employeeDocumentType')->filterByEmployeeId($employee_id)->filterById($id)->first();

        if (! $employee_document) {
            throw ValidationException::withMessages([$field => trans('employee.could_not_find_document')]);
        }

        return $employee_document;
    }

    /**
     * Paginate all employee documents using given params.
     *
     * @param integer $employee_id
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($employee_id, $params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->employee_document->with('employeeDocumentType')->filterByEmployeeId($employee_id)->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Create a new employee document.
     *
     * @param integer $employee_id
     * @param array $params
     * @return EmployeeDocument
     */
    public function create($employee_id, $params)
    {
        $this->validateInput($employee_id, $params);

        $this->upload->validateUpload($params, $this->module);

        $employee_document = $this->employee_document->forceCreate($this->formatParams($params, $employee_id));

        $this->processUpload($employee_document, $params);

        return $employee_document;
    }

    /**
     * Validate unique title with employee.
     *
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput($employee_id, $params, $id = null)
    {
        if (! $this->employee_document_type->find(gv($params, 'employee_document_type_id'))) {
            throw ValidationException::withMessages(['employee_document_type_id' => trans('employee.could_not_find_document_type')]);
        }

        $query = $this->employee_document->filterByEmployeeId($employee_id);

        if ($id) {
            $query->where('id', '!=', $id);
        }

        if ($query->filterByTitle(gv($params, 'title'), 1)->count()) {
            throw ValidationException::withMessages(['title' => trans('validation.unique', ['attribute' => trans('employee.document_title')])]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $employee_id = null, $action = 'create')
    {
        $formatted = [
            'title'                    => gv($params, 'title'),
            'description'              => gv($params, 'description'),
            'employee_document_type_id' => gv($params, 'employee_document_type_id')
        ];

        if ($action === 'create') {
            $formatted['employee_id']   = $employee_id;
            $formatted['upload_token'] = gv($params, 'upload_token');
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param EmployeeDocument $employee_document
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(EmployeeDocument $employee_document, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $employee_document->id, $upload_token);
        } else {
            $this->upload->update($this->module, $employee_document->id, $upload_token);
        }
    }

    /**
     * Update given employee document.
     *
     * @param EmployeeDocument $employee_document
     * @param array $params
     *
     * @return EmployeeDocument
     */
    public function update(EmployeeDocument $employee_document, $params)
    {
        $this->validateInput($employee_document->employee_id, $params, $employee_document->id);

        $this->upload->validateUpload($params, $this->module, $employee_document->id);

        $employee_document->forceFill($this->formatParams($params, null, 'update'))->save();

        $this->processUpload($employee_document, $params, 'update');

        return $employee_document;
    }

    /**
     * Delete employee document.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EmployeeDocument $employee_document)
    {
        return $employee_document->delete();
    }

    /**
     * Delete multiple employee documents.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->employee_document->whereIn('id', $ids)->delete();
    }
}
