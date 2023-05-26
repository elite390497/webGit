<?php
namespace App\Repositories\Student;

use App\Models\Student\Student;
use App\Models\Student\StudentSibling;
use Illuminate\Validation\ValidationException;

class StudentSiblingRepository
{
    protected $student_sibling;
    protected $student;
    protected $module = 'student_sibling';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentSibling $student_sibling,
        Student $student
    ) {
        $this->student_sibling = $student_sibling;
        $this->student = $student;
    }

    /**
     * Get student sibling query
     *
     * @return StudentSibling query
     */
    public function getQuery()
    {
        return $this->student_sibling;
    }

    /**
     * Find student sibling with given id.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentSibling
     */
    public function find($student_id, $id)
    {
        return $this->student_sibling->filterByStudentId($student_id)->filterById($id)->first();
    }

    /**
     * Find student sibling with given id or throw an error.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentSibling
     */
    public function findOrFail($student_id, $id, $field = 'message')
    {
        $student_sibling = $this->student_sibling->filterByStudentId($student_id)->filterById($id)->first();

        if (! $student_sibling) {
            throw ValidationException::withMessages([$field => trans('student.could_not_find_sibling')]);
        }

        return $student_sibling;
    }

    /**
     * Paginate all student siblings using given params.
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

        return $this->student_sibling->with(['studentSibling','studentSibling.studentRecords' => function ($q) {
            $q->where('academic_session_id', config('config.default_academic_session.id'))->orderBy('date_of_entry', 'desc');
        }, 'studentSibling.studentRecords.batch','studentSibling.studentRecords.batch.course','studentSibling.studentRecords.admission'])->filterByStudentId($student_id)->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Create a new student sibling.
     *
     * @param integer $student_id
     * @param array $params
     * @return StudentSibling
     */
    public function create($student_id, $params)
    {
        $this->validateInput($student_id, $params);

        $student_sibling = $this->student_sibling->forceCreate([
            'student_id' => $student_id,
            'sibling_student_id' => gv($params, 'id'),
            'options' => []
        ]);

        if (! $this->student_sibling->filterByStudentId(gv($params, 'id'))->filterBySiblingStudentId($student_id)->count()) {
            $this->student_sibling->forceCreate([
                'student_id' => gv($params, 'id'),
                'sibling_student_id' => $student_id,
                'options' => []
            ]);
        }

        return $student_sibling;
    }

    /**
     * Validate unique sibling number with student.
     *
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput($student_id, $params)
    {
        $id = gv($params, 'id');

        if ($student_id == $id) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        if (! $this->student->filterById($id)->count()) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find_student')]);
        }
    }

    /**
     * Delete student sibling.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StudentSibling $student_sibling)
    {
        $this->student_sibling->filterByStudentId($student_sibling->sibling_student_id)->filterBySiblingStudentId($student_sibling->student_id)->delete();
        return $student_sibling->delete();
    }

    /**
     * Delete multiple student siblings.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->student_sibling->whereIn('id', $ids)->delete();
    }

    /**
     * Get Student Sibling suggestion
     *
     * @param Student $student
     * @return Student $student
     */
    public function getSuggestion(Student $student)
    {
    }

    /**
     * Get search result Student Sibling suggestion
     *
     * @param Student $student
     * @param Array $params
     * @return Student $student
     */
    public function search(Student $student, $params = array())
    {
        $query  = gv($params, 'query');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        if (! $query) {
            throw ValidationException::withMessages(['message' => trans('student.sibling_search_query_required')]);
        }

        $student_sibling_id = $student->siblings()->pluck('sibling_student_id')->all();

        array_push($student_sibling_id, $student->id);

        return $this->student->with(['studentRecords' => function ($q) {
            $q->where('academic_session_id', config('config.default_academic_session.id'))->orderBy('date_of_entry', 'desc');
        }, 'studentRecords.batch','studentRecords.batch.course','studentRecords.admission'])
            ->whereNotIn('id', $student_sibling_id)
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', '%'.$query.'%')->orWhere('last_name', 'like', '%'.$query.'%')->orWhere('first_guardian_name', 'like', '%'.$query.'%')->orWhere('second_guardian_name', 'like', '%'.$query.'%');
            })->orderBy('first_name', 'asc')->orderBy('last_name', 'asc')->paginate($page_length);
    }
}
