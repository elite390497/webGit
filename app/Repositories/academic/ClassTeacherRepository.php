<?php
namespace App\Repositories\Academic;

use App\Models\Academic\Batch;
use App\Models\Employee\Employee;
use App\Models\Academic\ClassTeacher;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\Designation;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class ClassTeacherRepository
{
    protected $class_teacher;
    protected $batch;
    protected $employee;
    protected $designation;
    protected $course_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        ClassTeacher $class_teacher,
        Batch $batch,
        Employee $employee,
        Designation $designation,
        CourseGroupRepository $course_group
    ) {
        $this->class_teacher = $class_teacher;
        $this->batch = $batch;
        $this->employee = $employee;
        $this->designation = $designation;
        $this->course_group = $course_group;
    }

    /**
     * Find class teacher with given id.
     *
     * @param integer $id
     * @return ClassTeacher
     */
    public function find($id)
    {
        return $this->class_teacher->find($id);
    }

    /**
     * Find class teacher with given id or throw an error.
     *
     * @param integer $id
     * @return ClassTeacher
     */
    public function findOrFail($id)
    {
        $class_teacher = $this->class_teacher->find($id);

        if (! $class_teacher) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_class_teacher')]);
        }

        return $class_teacher;
    }

    /**
     * Get batch wise class teacher list.
     *
     * @return Array
     */
    public function getBatchWiseList($params = array())
    {
        $batch_id = gv($params, 'batch_id');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->batch->filterBySession();

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();
            $batch_id = $batch_id ? array_intersect($student_batch_ids, $batch_id) : $student_batch_ids;
        }
        
        if (count($batch_id)) {
            $query->whereIn('id', $batch_id);
        }

        $batches = $query->orderBy('name', 'asc')->paginate($page_length);
        $batches->load(['course','classTeachers','classTeachers.employee','classTeachers.employee.employeeDesignations','classTeachers.employee.employeeDesignations.designation','classTeachers.employee.employeeDesignations.designation.employeeCategory']);

        $batches->sortBy('course.position');

        return $batches;
    }

    public function getFilters()
    {
        $courses = $this->course_group->getBatchOption();

        return compact('courses');
    }

    /**
     * Get class teacher list.
     *
     * @return Array
     */
    public function getList($params = array())
    {
        $course_id = gv($params, 'course_id');

        $course_id = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);

        $query = $this->batch->with(['course','classTeachers' => function ($q) {
            $q->orderBy('date_effective', 'desc');
        }, 'classTeachers.employee','classTeachers.employee.employeeDesignations','classTeachers.employee.employeeDesignations.designation','classTeachers.employee.employeeDesignations.designation.employeeCategory']);

        if (count($course_id)) {
            $query->whereIn('course_id', $course_id);
        }

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $query->whereIn('id', getAuthUserBatchId());
        }

        $batches = $query->orderBy('name', 'asc')->get();

        $course_groups = $this->course_group->getAll();

        $courses = $this->course_group->getCourseOption();

        $employees = $this->getEmployeeQuery()->get()->pluck('name_with_code', 'id');

        $class_teachers = generateSelectOption($employees);

        return compact('batches', 'class_teachers', 'course_groups', 'courses');
    }

    /**
     * Get employee query
     *
     * @param integer $employee_id
     * @param date $date
     * @return Employee
     */
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
     * Create a new class teacher.
     *
     * @param array $params
     * @return void
     */
    public function store($params)
    {
        $this->validateInput($params);

        $batches = gv($params, 'batches', []);

        foreach ($batches as $index => $batch) {
            if (gbv($batch, 'change')) {
                $this->class_teacher->forceCreate([
                    'batch_id' => gv($batch, 'batch_id'),
                    'employee_id' => gv($batch, 'employee_id'),
                    'date_effective' => toDate(gv($batch, 'date_effective')),
                    'description' => gv($batch, 'description'),
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
        $batches = gv($params, 'batches', []);

        if (! $batches) {
            return;
        }

        $batch_ids = $this->batch->filterBySession()->get()->pluck('id')->all();
        $class_teachers = $this->class_teacher->whereIn('batch_id', $batch_ids)->get();

        foreach ($batches as $index => $batch) {
            $change = gbv($batch, 'change');

            if (! $change) {
                continue;
            }

            $batch_id = gv($batch, 'batch_id');

            if (! in_array($batch_id, $batch_ids)) {
                throw ValidationException::withMessages(['message' => trans('academic.could_not_find_batch')]);
            }

            $date_effective = toDate(gv($batch, 'date_effective'));

            if (! $date_effective) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('validation.required', ['attribute' => trans('academic.date_effective')])]);
            }

            if (! dateBetweenSession($date_effective)) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('academic.invalid_session_date_range')]);
            }

            $employee_id = gv($batch, 'employee_id');

            if (! $employee_id) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('validation.required', ['attribute' => trans('employee.employee')])]);
            }

            if (! $this->getEmployeeQuery($employee_id, $date_effective)->first()) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('employee.invalid_employee_for_selected_date')]);
            }

            if ($class_teachers->filter(function ($class_teacher, $key) use ($date_effective, $batch_id) {
                return $class_teacher->batch_id == $batch_id && $class_teacher->date_effective >= toDate($date_effective);
            })->count()) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('academic.class_teacher_exists_after_given_date')]);
            }

            $last_class_teacher = $class_teachers->where('batch_id', $batch_id)->sortByDesc('date_effective')->filter(function ($class_teacher, $key) use ($date_effective) {
                return $class_teacher->date_effective <= toDate($date_effective);
            })->first();

            if ($employee_id == optional($last_class_teacher)->employee_id) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('academic.same_as_previous_class_teacher')]);
            }
        }
    }

    /**
     * Find class teacher & check it can be deleted or not.
     *
     * @param integer $id
     * @return ClassTeacher
     */
    public function deletable($id)
    {
        $class_teacher = $this->findOrFail($id);

        if ($this->class_teacher->filterByBatchId($class_teacher->batch_id)->where('date_effective', '>', $class_teacher->date_effective)->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.latest_class_teacher_can_be_deleted')]);
        }

        return $class_teacher;
    }

    /**
     * Delete class teacher.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(ClassTeacher $class_teacher)
    {
        return $class_teacher->delete();
    }

    /**
     * Delete multiple class teachers.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->class_teacher->whereIn('id', $ids)->delete();
    }
}
