<?php

namespace App\Repositories\Student;

use Illuminate\Support\Str;
use App\Models\Student\StudentParent;
use Illuminate\Validation\ValidationException;

class StudentParentRepository
{
    protected $student_parent;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentParent $student_parent
    ) {
        $this->student_parent = $student_parent;
    }

    /**
     * Get parent query
     *
     * @return StudentParent query
     */
    public function getQuery()
    {
        return $this->student_parent;
    }

    /**
     * Count parent
     *
     * @return integer
     */
    public function count()
    {
        return $this->student_parent->count();
    }

    /**
     * List all parents by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->student_parent->all()->pluck('id')->all();
    }

    /**
     * Get all parents
     *
     * @return array
     */
    public function getAll()
    {
        return $this->student_parent->all();
    }

    /**
     * Find parent with given id.
     *
     * @param integer $id
     * @return StudentParent
     */
    public function find($id)
    {
        return $this->student_parent->find($id);
    }

    /**
     * Find parent with given id or throw an error.
     *
     * @param integer $id
     * @return StudentParent
     */
    public function findOrFail($id, $field = 'message')
    {
        $student_parent = $this->student_parent->find($id);

        if (! $student_parent) {
            throw ValidationException::withMessages([$field => trans('student.could_not_find_parent')]);
        }

        return $student_parent;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return StudentParent
     */
    public function getData($params)
    {
        $sort_by                         = gv($params, 'sort_by', 'created_at');
        $order                           = gv($params, 'order', 'desc');
        $first_guardian_name             = gv($params, 'first_guardian_name');
        $first_guardian_relation         = gv($params, 'first_guardian_relation');
        $second_guardian_name            = gv($params, 'second_guardian_name');
        $second_guardian_relation        = gv($params, 'second_guardian_relation');
        $first_guardian_contact_number_1 = gv($params, 'first_guardian_contact_number_1');

        $query = $this->student_parent->filterByFirstGuardianName($first_guardian_name)->filterBySecondGuardianName($second_guardian_name)->filterByFirstGuardianContactNumber1($first_guardian_contact_number_1);

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all parents using given params.
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
     * @return StudentParent
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Search parent by first or second guardian name
     *
     * @param integer $id
     * @return StudentParent
     */
    public function searchByFirstOrSecondName($params = array())
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));
        $query = gv($params, 'query');

        if (! $query) {
            throw ValidationException::withMessages(['message' => trans('student.parent_search_query_required')]);
        }

        return $this->student_parent->where('first_guardian_name', 'like', '%'.$query.'%')->orWhere('second_guardian_name', 'like', '%'.$query.'%')->paginate($page_length);
    }

    /**
     * Create a new parent.
     *
     * @param array $params
     * @return StudentParent
     */
    public function create($params)
    {
        $this->validateInput($params);

        return $this->student_parent->forceCreate($this->formatParams($params));
    }

    /**
     * Validate all input.
     *
     * @param array $params
     */
    public function validateInput($params = array(), $id = null)
    {
        $existing_parent = $this->getExistingParent($params, $id);

        if ($existing_parent) {
            throw ValidationException::withMessages(['message' => trans('student.parent_exists')]);
        }
    }

    public function getExistingParent($params = array(), $id = null)
    {
        $first_guardian_name             = gv($params, 'first_guardian_name');
        $first_guardian_relation         = gv($params, 'first_guardian_relation');
        $second_guardian_name            = gv($params, 'second_guardian_name');
        $second_guardian_relation        = gv($params, 'second_guardian_relation');
        $first_guardian_contact_number_1 = gv($params, 'first_guardian_contact_number_1');

        $parent_exists = ($id) ? $this->student_parent->where('id', '!=', $id) : $this->student_parent->whereNotNull('id');

        return $parent_exists->filterByFirstGuardianName($first_guardian_name, 1)->where('first_guardian_relation', $first_guardian_relation)->filterByFirstGuardianContactNumber1($first_guardian_contact_number_1)->first();
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @return array
     */
    private function formatParams($params)
    {
        $formatted = [
            'first_guardian_name'             => gv($params, 'first_guardian_name'),
            'first_guardian_relation'         => gv($params, 'first_guardian_relation'),
            'second_guardian_name'            => gv($params, 'second_guardian_name'),
            'second_guardian_relation'        => gv($params, 'second_guardian_relation'),
            'first_guardian_contact_number_1' => gv($params, 'first_guardian_contact_number_1'),
            'first_guardian_email'            => gv($params, 'first_guardian_email'),
            'options'                         => array()
        ];

        return $formatted;
    }

    /**
     * Find parent & check it can be deleted or not.
     *
     * @param integer $id
     * @return StudentParent
     */
    public function deletable($id)
    {
        $student_parent = $this->findOrFail($id);

        if ($student_parent->students()->count()) {
            throw ValidationException::withMessages(['message' => trans('student.parent_associated_with_student')]);
        }

        return $student_parent;
    }

    /**
     * Delete parent.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StudentParent $student_parent)
    {
        return $student_parent->delete();
    }

    /**
     * Delete multiple parent.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->student_parent->whereIn('id', $ids)->delete();
    }
}
