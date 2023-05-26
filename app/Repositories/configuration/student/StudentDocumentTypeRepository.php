<?php
namespace App\Repositories\Configuration\Student;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Student\StudentDocumentType;

class StudentDocumentTypeRepository
{
    protected $student_document_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentDocumentType $student_document_type
    ) {
        $this->student_document_type = $student_document_type;
    }

    /**
     * Get student document type query
     *
     * @return StudentDocumentType query
     */
    public function getQuery()
    {
        return $this->student_document_type;
    }

    /**
     * Count student document type
     *
     * @return integer
     */
    public function count()
    {
        return $this->student_document_type->count();
    }

    /**
     * List all student document types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->student_document_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all student document types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->student_document_type->all(['name', 'id']);
    }

    /**
     * List all student document types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->student_document_type->all()->pluck('id')->all();
    }

    /**
     * Get all student document types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->student_document_type->all();
    }

    /**
     * Find student document type with given id.
     *
     * @param integer $id
     * @return StudentDocumentType
     */
    public function find($id)
    {
        return $this->student_document_type->find($id);
    }

    /**
     * Find student document type with given id or throw an error.
     *
     * @param integer $id
     * @return StudentDocumentType
     */
    public function findOrFail($id)
    {
        $student_document_type = $this->student_document_type->find($id);

        if (! $student_document_type) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find_document_type')]);
        }

        return $student_document_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return StudentDocumentType
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->student_document_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all student document types using given params.
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
     * @return StudentDocumentType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new student document type.
     *
     * @param array $params
     * @return StudentDocumentType
     */
    public function create($params)
    {
        return $this->student_document_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $student_document_type_id
     * @return array
     */
    private function formatParams($params, $student_document_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given student document type.
     *
     * @param StudentDocumentType $student_document_type
     * @param array $params
     *
     * @return StudentDocumentType
     */
    public function update(StudentDocumentType $student_document_type, $params)
    {
        return $student_document_type->forceFill($this->formatParams($params, $student_document_type->id))->save();
    }

    /**
     * Find student document type & check it can be deleted or not.
     *
     * @param integer $id
     * @return StudentDocumentType
     */
    public function deletable($id)
    {
        $student_document_type = $this->findOrFail($id);

        if ($student_document_type->studentDocuments()->count()) {
            throw ValidationException::withMessages(['message' => trans('student.document_type_associated_with_document')]);
        }

        return $student_document_type;
    }

    /**
     * Delete student document type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StudentDocumentType $student_document_type)
    {
        return $student_document_type->delete();
    }

    /**
     * Delete multiple student document types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->student_document_type->whereIn('id', $ids)->delete();
    }
}
