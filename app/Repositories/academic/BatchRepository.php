<?php
namespace App\Repositories\Academic;

use App\Models\Exam\Schedule;
use App\Models\Academic\Batch;
use App\Models\Academic\Subject;
use App\Models\Configuration\Exam\Grade;
use App\Models\Configuration\Exam\Observation;
use Illuminate\Validation\ValidationException;
use App\Repositories\Academic\CourseRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class BatchRepository
{
    protected $batch;
    protected $course;
    protected $course_group;
    protected $subject;
    protected $exam_grade;
    protected $exam_observation;
    protected $exam_schedule;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Batch $batch,
        CourseRepository $course,
        CourseGroupRepository $course_group,
        Subject $subject,
        Grade $exam_grade,
        Observation $exam_observation,
        Schedule $exam_schedule
    ) {
        $this->batch = $batch;
        $this->course = $course;
        $this->course_group = $course_group;
        $this->subject = $subject;
        $this->exam_grade = $exam_grade;
        $this->exam_observation = $exam_observation;
        $this->exam_schedule = $exam_schedule;
    }

    /**
     * Get batch query
     *
     * @return Batch query
     */
    public function getQuery()
    {
        return $this->batch;
    }

    /**
     * Count batch
     *
     * @return integer
     */
    public function count()
    {
        return $this->batch->filterBySession()->count();
    }

    /**
     * List all batches by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->batch->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all batches except given batches by name & id
     *
     * @return array
     */
    public function listIdOfCourseExceptIds($course_id, $batch_ids)
    {
        return $this->batch->filterBySession()->filterByCourseId($course_id)->whereNotIn('id', $batch_ids)->get()->pluck('id')->all();
    }

    /**
     * List all batches by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return generateSelectOption($this->batch->filterBySession()->get()->pluck('batch_with_course', 'id')->all());
    }

    /**
     * List all batches except given by name & id for select option
     *
     * @return array
     */

    public function selectAllExceptIds($batch_ids)
    {
        return generateSelectOption($this->batch->filterBySession()->whereNotIn('id', $batch_ids)->get()->pluck('batch_with_course', 'id')->all());
    }

    /**
     * List all batches by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->batch->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all batches
     *
     * @return array
     */
    public function getAll()
    {
        return $this->batch->all();
    }

    /**
     * Get all batches with subjects
     *
     * @return array
     */
    public function getAllBatchWithSubjects()
    {
        return $this->batch->filterBySession()->with('subjects')->get();
    }

    /**
     * Get all batches with subjects according to role
     *
     * @return array
     */
    public function getAllBatchWithSubjectsAccordingtoRole($subject_ids)
    {
        return $this->batch->filterBySession()->with(['subjects' => function($q) use($subject_ids){
            $q->whereIn('id', $subject_ids)->orderBy('name','asc');
        }])->get();
    }

    /**
     * Find batch with given id.
     *
     * @param integer $id
     * @return Batch
     */
    public function find($id)
    {
        return $this->batch->with('course','grade','observation')->filterBySession()->filterById($id)->first();
    }

    /**
     * Find batch with given id or throw an error.
     *
     * @param integer $id
     * @return Batch
     */
    public function findOrFail($id, $field = 'message')
    {
        $batch = $this->batch->with('course','grade','observation')->filterBySession()->filterById($id)->first();

        if (! $batch) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_batch')]);
        }

        return $batch;
    }

    /**
     * Find batch with given id and session or throw an error.
     *
     * @param integer $id
     * @return Batch
     */
    public function findWithSessionOrFail($id, $session_id = null, $field = 'message')
    {
        $batch = $this->batch->with('course','grade','observation')->filterBySession($session_id)->filterById($id)->first();

        if (! $batch) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_batch')]);
        }

        return $batch;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Batch
     */
    public function getData($params)
    {
        $sort_by   = gv($params, 'sort_by', 'name');
        $order     = gv($params, 'order', 'asc');
        $course_id = gv($params, 'course_id');

        $course_id = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);

        $query = $this->batch->with(['course:id,name','grade','observation'])->withCount(['studentRecords' => function ($q) {
            $q->whereNull('date_of_exit');
        }])->filterBySession();

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();
            $query->whereIn('id', $student_batch_ids);
        }

        if (count($course_id)) {
            $query->whereIn('course_id', $course_id);
        }

        if ($sort_by == 'name') {
            $query->orderBy('course_id', 'asc');
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all batches using given params.
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
     * @return Batch
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get batch pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $courses = $this->course_group->getCourseOption();

        $exam_grades = $this->exam_grade->filterBySession()->get(['name','id']);
        $exam_observations = $this->exam_observation->filterBySession()->get(['name','id']);

        $attendance_methods = getStudentAttendanceMethods();

        return compact('courses','exam_grades','exam_observations','attendance_methods');
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $courses = $this->course_group->getCourseOption();
        return compact('courses');
    }

    /**
     * Create a new batch.
     *
     * @param array $params
     * @return Batch
     */
    public function create($params)
    {
        return $this->batch->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $batch_id = null)
    {
        $name = gv($params, 'name');
        $course_id = gv($params, 'course_id');
        $description = gv($params, 'description');

        $course = $this->course->findOrFail($course_id, 'course_id');

        $batch_exist_query = (! $batch_id) ? $this->batch : $this->batch->where('id', '!=', $batch_id);

        $batch_exists = $batch_exist_query->filterByName($name, 1)->filterByCourseId($course_id)->count();

        if ($batch_exists) {
            throw ValidationException::withMessages(['name' => trans('academic.batch_exists')]);
        }

        $exam_grade_id = gv($params, 'exam_grade_id');
        if ($exam_grade_id) {
            $exam_grade = $this->exam_grade->filterBySession()->filterById($exam_grade_id)->first();

            if (! $exam_grade_id) {
                throw ValidationException::withMessages(['exam_grade_id' => trans('exam.could_not_find_grade')]);
            }
        }

        $exam_observation_id = gv($params, 'exam_observation_id');
        if ($exam_observation_id) {
            $exam_observation = $this->exam_observation->filterBySession()->filterById($exam_observation_id)->first();

            if (! $exam_observation_id) {
                throw ValidationException::withMessages(['exam_observation_id' => trans('exam.could_not_find_observation')]);
            }
        }

        $options['max_strength']       = gv($params, 'max_strength', config('config.default_max_strength_per_batch'));
        $options['roll_number_prefix'] = gv($params, 'roll_number_prefix', config('config.default_roll_number_prefix'));
        $options['default_attendance_method'] = gv($params, 'default_attendance_method');
        $options['roll_number_digit']  = gv($params, 'roll_number_digit', 0);
        $options['holidays_except'] = gv($params, 'holidays_except', []);

        $formatted = [
            'name'                => $name,
            'course_id'           => $course_id,
            'exam_grade_id'       => $exam_grade_id,
            'exam_observation_id' => $exam_observation_id,
            'description'         => $description,
            'options'             => $options
        ];

        return $formatted;
    }

    /**
     * Update given batch.
     *
     * @param Batch $batch
     * @param array $params
     *
     * @return Batch
     */
    public function update(Batch $batch, $params)
    {
        if ($batch->exam_observation_id != gv($params, 'exam_observation_id')) {
            $exam_schedules = $this->exam_schedule->filterByBatchId($batch->id)->get()->pluck('observation_marks')->all();

            foreach ($exam_schedules as $exam_schedule) {
                if (count($exam_schedule)) {
                    throw ValidationException::withMessages(['message' => trans('exam.observation_associated_with_exam')]);
                }
            }
        }

        return $batch->forceFill($this->formatParams($params, $batch->id))->save();
    }

    /**
     * Reorder all subject of a batch
     *
     * @param array $params
     */
    public function subjectReorder(Batch $batch, $params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $subject = $this->subject->filterByBatchId($batch->id)->filterByName($item, 1)->first();
            $subject->position = $index;
            $subject->save();
        }
    }

    /**
     * Find batch & check it can be deleted or not.
     *
     * @param integer $id
     * @return Batch
     */
    public function deletable($id)
    {
        $batch = $this->findOrFail($id);

        if ($batch->classTeachers()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.batch_associated_with_class_teacher')]);
        }

        if ($batch->subjects()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.batch_associated_with_subject')]);
        }

        if ($batch->studentRecords()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.batch_associated_with_student_record')]);
        }

        if ($batch->admissions()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.batch_associated_with_admission')]);
        }

        if ($batch->timetables()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.batch_associated_with_timetable')]);
        }

        return $batch;
    }

    /**
     * Delete batch.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Batch $batch)
    {
        return $batch->delete();
    }

    /**
     * Delete multiple batches.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->batch->whereIn('id', $ids)->delete();
    }

    /**
     * Fetch batch strength.
     *
     * @param integer $id
     *
     * @return integer
     */
    public function fetchStrength($id)
    {
        $batch = $this->batch->filterById($id)->withCount(['studentRecords' => function ($q) {
            $q->whereNull('date_of_exit');
        }])->filterBySession()->first();

        return ($batch) ? $batch->student_records_count : 0;
    }

    /**
     * Fetch batch subjects.
     *
     * @param integer $id
     *
     * @return array
     */
    public function fetchSubjects($id)
    {
        $batch = $this->batch->with('subjects')->filterById($id)->filterBySession()->first();

        if (! $batch) {
            return [];
        }

        $subjects = array();
        foreach ($batch->subjects as $subject) {
            $subjects[] = array(
                'id' => $subject->id,
                'name' => $subject->name.' ('.$subject->code.')'
            );
        }

        $subject_details = $batch->subjects;
        return compact('subjects','subject_details');
    }
}
