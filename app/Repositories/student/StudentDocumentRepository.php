<?php
namespace App\Repositories\Student;

use App\Models\Student\StudentDocument;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Student\StudentDocumentTypeRepository;

class StudentDocumentRepository
{
    protected $student_document;
    protected $upload;
    protected $student_document_type;
    protected $module = 'student_document';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentDocument $student_document,
        UploadRepository $upload,
        StudentDocumentTypeRepository $student_document_type
    ) {
        $this->student_document = $student_document;
        $this->upload = $upload;
        $this->student_document_type = $student_document_type;
    }

    /**
     * Get student document query
     *
     * @return StudentDocument query
     */
    public function getQuery()
    {
        return $this->student_document;
    }

    /**
     * Get student document pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->student_document_type->selectAll();
    }

    /**
     * Find student document with given id.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentDocument
     */
    public function find($student_id, $id)
    {
        return $this->student_document->with('studentDocumentType')->filterByStudentId($student_id)->filterById($id)->first();
    }

    /**
     * Find student document with given id or throw an error.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentDocument
     */
    public function findOrFail($student_id, $id, $field = 'message')
    {
        $student_document = $this->student_document->with('studentDocumentType')->filterByStudentId($student_id)->filterById($id)->first();

        if (! $student_document) {
            throw ValidationException::withMessages([$field => trans('student.could_not_find_document')]);
        }

        return $student_document;
    }

    /**
     * Paginate all student documents using given params.
     *
     * @param integer $student_id
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($student_id, $params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->student_document->with('studentDocumentType')->filterByStudentId($student_id)->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Create a new student document.
     *
     * @param integer $student_id
     * @param array $params
     * @return StudentDocument
     */
    public function create($student_id, $params)
    {
        $this->validateInput($student_id, $params);

        $this->upload->validateUpload($params, $this->module);

        $student_document = $this->student_document->forceCreate($this->formatParams($params, $student_id));

        $this->processUpload($student_document, $params);

        return $student_document;
    }

    /**
     * Validate unique title with student.
     *
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput($student_id, $params, $id = null)
    {
        if (! $this->student_document_type->find(gv($params, 'student_document_type_id'))) {
            throw ValidationException::withMessages(['student_document_type_id' => trans('student.could_not_find_document_type')]);
        }

        $query = $this->student_document->filterByStudentId($student_id);

        if ($id) {
            $query->where('id', '!=', $id);
        }

        if ($query->filterByTitle(gv($params, 'title'), 1)->count()) {
            throw ValidationException::withMessages(['title' => trans('validation.unique', ['attribute' => trans('student.document_title')])]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $student_id = null, $action = 'create')
    {
        $formatted = [
            'title'                    => gv($params, 'title'),
            'description'              => gv($params, 'description'),
            'student_document_type_id' => gv($params, 'student_document_type_id')
        ];

        if ($action === 'create') {
            $formatted['student_id']   = $student_id;
            $formatted['upload_token'] = gv($params, 'upload_token');
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param StudentDocument $student_document
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(StudentDocument $student_document, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $student_document->id, $upload_token);
        } else {
            $this->upload->update($this->module, $student_document->id, $upload_token);
        }
    }

    /**
     * Update given student document.
     *
     * @param StudentDocument $student_document
     * @param array $params
     *
     * @return StudentDocument
     */
    public function update(StudentDocument $student_document, $params)
    {
        $this->validateInput($student_document->student_id, $params, $student_document->id);

        $this->upload->validateUpload($params, $this->module, $student_document->id);

        $student_document->forceFill($this->formatParams($params, null, 'update'))->save();

        $this->processUpload($student_document, $params, 'update');

        return $student_document;
    }

    /**
     * Delete student document.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StudentDocument $student_document)
    {
        return $student_document->delete();
    }

    /**
     * Delete multiple student documents.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->student_document->whereIn('id', $ids)->delete();
    }
}
