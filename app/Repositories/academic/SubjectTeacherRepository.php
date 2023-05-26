<?php
namespace App\Repositories\Academic;

use App\Models\Academic\Batch;
use App\Models\Academic\Subject;
use App\Models\Employee\Employee;
use App\Models\Academic\SubjectTeacher;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\Designation;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class SubjectTeacherRepository
{
    protected $subject_teacher;
    protected $batch;
    protected $subject;
    protected $employee;
    protected $designation;
    protected $course_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        SubjectTeacher $subject_teacher,
        Batch $batch,
        Subject $subject,
        Employee $employee,
        Designation $designation,
        CourseGroupRepository $course_group
    ) {
        $this->subject_teacher = $subject_teacher;
        $this->batch = $batch;
        $this->subject = $subject;
        $this->employee = $employee;
        $this->designation = $designation;
        $this->course_group = $course_group;
    }

    /**
     * Find subject teacher with given id.
     *
     * @param integer $id
     * @return SubjectTeacher
     */
    public function find($id)
    {
        return $this->subject_teacher->find($id);
    }

    /**
     * Find subject teacher with given id or throw an error.
     *
     * @param integer $id
     * @return SubjectTeacher
     */
    public function findOrFail($id)
    {
        $subject_teacher = $this->subject_teacher->find($id);

        if (! $subject_teacher) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_subject_teacher')]);
        }

        return $subject_teacher;
    }

    /**
     * Get subject teacher list.
     *
     * @return Array
     */
    public function getList()
    {
        $batches = $this->course_group->getBatchOption();
        
        $employees = $this->getEmployeeQuery()->get()->pluck('name_with_code', 'id');

        $subject_teachers = generateSelectOption($employees);

        return compact('batches', 'subject_teachers');
    }

    /**
     * Get subjects for given batch id.
     *
     * @return Array
     */
    public function getSubjects($batch_id = null)
    {
        $batch = $this->batch->filterBySession()->filterById($batch_id)->first();

        if (! $batch) {
            throw ValidationException::withMessages(['batch_id' => trans('academic.could_not_find_batch')]);
        }

        return $this->subject->with(['subjectTeachers'  => function ($q) {
            $q->orderBy('date_effective', 'desc');
        }, 'subjectTeachers.employee'])->filterByBatchId($batch->id)->get();
    }

    /**
     * Get batch detail for given batch id.
     *
     * @return Array
     */
    public function getBatchDetail($batch_id = null)
    {
        return $this->batch->with('course', 'course.courseGroup')->filterBySession()->filterById($batch_id)->first();
    }


    private function getEmployeeQuery($employee_id = null, $date = null)
    {
        $date = ($date) ? : date('Y-m-d');

        $query = $employee_id ? $this->employee->whereId($employee_id) : $this->employee;

        return $query->whereHas('employeeTerms', function ($q) use ($date) {
            $q->where('date_of_joining', '<=', $date)->where(function ($q1) use ($date) {
                $q1->where('date_of_leaving', '=', null)->orWhere('date_of_leaving', '>=', $date);
            })->orderBy('date_of_joining', 'desc')->take(1);
        })->whereHas('employeeDesignations', function ($q) use ($date) {
            $q->where('date_effective', '<=', $date)->whereHas('designation', function ($q1) {
                $q1->where('is_teaching_employee', '=', 1);
            })->orderBy('date_effective', 'desc')->take(1);
        });
    }

    /**
     * Create a new subject teacher.
     *
     * @param array $params
     * @return void
     */
    public function store($params)
    {
        $this->validateInput($params);

        $subjects = gv($params, 'subjects', []);

        foreach ($subjects as $index => $subject) {
            if (gbv($subject, 'change')) {
                $this->subject_teacher->forceCreate([
                    'subject_id' => gv($subject, 'subject_id'),
                    'employee_id' => gv($subject, 'employee_id'),
                    'date_effective' => toDate(gv($subject, 'date_effective')),
                    'description' => gv($subject, 'description'),
                    'options' => []
                ]);
            }
        }

        return true;
    }

    /**
     * Validate input
     *
     * @param array $params
     * @return void
     */
    public function validateInput($params)
    {
        $batch = $this->batch->filterBySession()->filterById(gv($params, 'batch_id'))->first();

        if (! $batch) {
            throw ValidationException::withMessages(['batch_id' => trans('academic.could_not_find_batch')]);
        }

        $subjects = gv($params, 'subjects', []);

        if (! $subjects) {
            return;
        }

        $subject_ids = $this->subject->filterByBatchId($batch->id)->get()->pluck('id')->all();
        $subject_teachers = $this->subject_teacher->whereIn('subject_id', $subject_ids)->get();

        foreach ($subjects as $index => $subject) {
            $change = gbv($subject, 'change');

            if (! $change) {
                continue;
            }

            $subject_id = gv($subject, 'subject_id');

            if (! in_array($subject_id, $subject_ids)) {
                throw ValidationException::withMessages(['message' => trans('academic.could_not_find_subject')]);
            }

            $date_effective = toDate(gv($subject, 'date_effective'));

            if (! $date_effective) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('validation.required', ['attribute' => trans('academic.date_effective')])]);
            }

            if (! dateBetweenSession($date_effective)) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('academic.invalid_session_date_range')]);
            }

            $employee_id = gv($subject, 'employee_id');

            if (! $employee_id) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('validation.required', ['attribute' => trans('employee.employee')])]);
            }

            if (! $this->getEmployeeQuery($employee_id, $date_effective)->first()) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('employee.invalid_employee_for_selected_date')]);
            }

            if ($subject_teachers->filter(function ($subject_teacher, $key) use ($date_effective, $subject_id) {
                return $subject_teacher->subject_id == $subject_id && $subject_teacher->date_effective >= toDate($date_effective);
            })->count()) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('academic.subject_teacher_exists_after_given_date')]);
            }

            $last_subject_teacher = $subject_teachers->where('subject_id', $subject_id)->sortByDesc('date_effective')->filter(function ($subject_teacher, $key) use ($date_effective) {
                return $subject_teacher->date_effective <= toDate($date_effective);
            })->first();

            if ($employee_id == optional($last_subject_teacher)->employee_id) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('academic.same_as_previous_subject_teacher')]);
            }
        }
    }

    /**
     * Find subject teacher & check it can be deleted or not.
     *
     * @param integer $id
     * @return SubjectTeacher
     */
    public function deletable($id)
    {
        $subject_teacher = $this->findOrFail($id);

        if ($this->subject_teacher->filterBySubjectId($subject_teacher->subject_id)->where('date_effective', '>', $subject_teacher->date_effective)->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.latest_subject_teacher_can_be_deleted')]);
        }

        return $subject_teacher;
    }

    /**
     * Delete subject teacher.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(SubjectTeacher $subject_teacher)
    {
        return $subject_teacher->delete();
    }

    /**
     * Delete multiple subject teachers.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->subject_teacher->whereIn('id', $ids)->delete();
    }
}
