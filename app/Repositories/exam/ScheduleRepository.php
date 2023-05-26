<?php
namespace App\Repositories\Exam;

use App\Models\Exam\Record;
use Illuminate\Support\Str;
use App\Models\Exam\Schedule;
use App\Repositories\Exam\ExamRepository;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Configuration\Exam\GradeRepository;
use App\Repositories\Configuration\Exam\AssessmentRepository;
use App\Repositories\Configuration\Exam\ObservationRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class ScheduleRepository
{
    protected $exam_schedule;
    protected $course_group;
    protected $batch;
    protected $exam_grade;
    protected $exam_assessment;
    protected $exam;
    protected $record;
    protected $student;
    protected $exam_observation;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Schedule $exam_schedule,
        CourseGroupRepository $course_group,
        BatchRepository $batch,
        GradeRepository $exam_grade,
        AssessmentRepository $exam_assessment,
        ExamRepository $exam,
        Record $record,
        StudentRepository $student,
        ObservationRepository $exam_observation
    ) {
        $this->exam_schedule = $exam_schedule;
        $this->course_group = $course_group;
        $this->batch = $batch;
        $this->exam_grade = $exam_grade;
        $this->exam_assessment = $exam_assessment;
        $this->exam = $exam;
        $this->record = $record;
        $this->student = $student;
        $this->exam_observation = $exam_observation;
    }

    /**
     * Get exam schedule query
     *
     * @return Schedule query
     */
    public function getQuery()
    {
        return $this->exam_schedule;
    }

    /**
     * Count Exam Schedule
     *
     * @return integer
     */
    public function count()
    {
        return $this->exam_schedule->filterBySession()->count();
    }

    /**
     * List all exam schedule by topic & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->exam_schedule->filterBySession()->get()->pluck('topic', 'id')->all();
    }

    /**
     * Get all exam schedules
     *
     * @return array
     */
    public function getAll()
    {
        return $this->exam_schedule->all();
    }

    /**
     * Find exam schedule with given id.
     *
     * @param integer $id
     * @return Schedule
     */
    public function find($id)
    {
        return $this->exam_schedule->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find exam schedule with given id or throw an error.
     *
     * @param integer $id
     * @return Schedule
     */
    public function findOrFail($id, $field = 'message')
    {
        $exam_schedule = $this->exam_schedule->info()->filterBySession()->filterById($id)->first();

        if (! $exam_schedule) {
            throw ValidationException::withMessages([$field => trans('exam.could_not_find_schedule')]);
        }

        return $exam_schedule;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Schedule
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'created_at');
        $order    = gv($params, 'order', 'desc');

        $batch_id      = gv($params, 'batch_id');
        $exam_id       = gv($params, 'exam_id');
        $exam_grade_id = gv($params, 'exam_grade_id');

        $batch_id      = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);
        $exam_id       = is_array($exam_id) ? $exam_id : ($exam_id ? explode(',', $exam_id) : []);
        $exam_grade_id = is_array($exam_grade_id) ? $exam_grade_id : ($exam_grade_id ? explode(',', $exam_grade_id) : []);

        $query = $this->exam_schedule->info()->filterBySession();

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();
            $batch_id = $batch_id ? array_intersect($student_batch_ids, $batch_id) : $student_batch_ids;
        }

        $batch_id = array_unique($batch_id);
        if (count($batch_id)) {
            $query->whereIn('batch_id', $batch_id);
        }

        if (count($exam_id)) {
            $query->whereIn('exam_id', $exam_id);
        }
        
        if (count($exam_grade_id)) {
            $query->whereIn('exam_grade_id', $exam_grade_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all exam schedule using given params.
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
     * @return Schedule
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get exam schedule pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $batches = $this->course_group->getBatchOption();
        $batch_with_subjects = $this->batch->getAllBatchWithSubjects();
        $exam_grades = $this->exam_grade->selectAll();
        $exam_assessments = $this->exam_assessment->selectAll();
        $exam_assessment_with_details = $this->exam_assessment->getAll();
        $exams = $this->exam->selectAll();

        return compact('batches', 'batch_with_subjects', 'exam_grades', 'exam_assessments', 'exams', 'exam_assessment_with_details');
    }

    /**
     * Get exam schedule filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Create a new exam schedule.
     *
     * @param array $params
     * @return Schedule
     */
    public function create($params)
    {
        $exam_schedule = $this->exam_schedule->forceCreate($this->formatParams($params));

        $this->updateRecord($exam_schedule, $params);

        return $exam_schedule;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $exam_schedule_id
     * @return array
     */
    private function formatParams($params, $exam_schedule_id = null)
    {
        $batch_id            = gv($params, 'batch_id');
        $exam_id             = gv($params, 'exam_id');
        $exam_grade_id       = gv($params, 'exam_grade_id');
        $exam_assessment_id  = gv($params, 'exam_assessment_id');
        $records             = gv($params, 'records', []);

        $query = $exam_schedule_id ? $this->exam_schedule->where('id', '!=', $exam_schedule_id) : $this->exam_schedule;

        $exam_schedule_exists = $query->filterByExamId($exam_id)->filterByBatchId($batch_id)->count();

        if ($exam_schedule_exists) {
            throw ValidationException::withMessages(['message' => trans('validation.unique', ['attribute' => trans('exam.schedule')])]);
        }

        $batch           = $this->batch->findOrFail($batch_id);
        $exam            = $this->exam->findOrFail($exam_id);
        $exam_assessment = $this->exam_assessment->findOrFail($exam_assessment_id);

        if ($exam->exam_term_id && $batch->course->course_group_id != $exam->term->courseGroup->id) {
            throw ValidationException::withMessages(['message' => trans('exam.batch_course_group_is_different_than_exam_course_group')]);
        }

        if ($exam_grade_id) {
            $exam_grade = $this->exam_grade->findOrFail($exam_grade_id);
        }

        $exam_assessment_detail_ids = $exam_assessment->details->pluck('id')->all();

        if (! $records) {
            throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => 'academic.subject'])]);
        }

        $subject_ids = $batch->Subjects->pluck('id')->all();

        $subjects = array();
        foreach ($records as $index => $record) {
            $subject_id         = gv($record, 'subject_id');
            $has_no_exam        = gbv($record, 'has_no_exam');
            $date               = toDate(gv($record, 'date'));
            $assessment_details = gv($record, 'assessment_details');

            if (! in_array($subject_id, $subject_ids)) {
                throw ValidationException::withMessages(['message' => trans('academic.could_not_find_subject')]);
            }

            if ($has_no_exam) {
                continue;
            }

            if (! $date) {
                throw ValidationException::withMessages([$index.'_schedule_date' => trans('validation.required', ['attribute' => trans('exam.schedule_date')])]);
            }

            if (! validateDate($date)) {
                throw ValidationException::withMessages([$index.'_schedule_date' => trans('validation.date', ['attribute' => trans('exam.schedule_date')])]);
            }

            if (! dateBetweenSession($date)) {
                throw ValidationException::withMessages([$index.'_schedule_date' => trans('academic.invalid_session_date_range')]);
            }

            $is_not_applicable = 0;
            foreach ($assessment_details as $idx => $assessment_detail) {
                $id = gv($assessment_detail, 'id');
                $is_applicable = gbv($assessment_detail, 'is_applicable');
                $max_mark = gv($assessment_detail, 'max_mark', 0);
                $is_not_applicable += (! $is_applicable) ? 1 : 0;

                if (! in_array($id, $exam_assessment_detail_ids)) {
                    throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
                }

                if ($is_applicable && ! is_numeric($max_mark)) {
                    throw ValidationException::withMessages([$index.'_'.$idx.'_max_mark' => trans('validation.numeric', ['attribute' => trans('exam.observation_detail_max_mark')])]);
                }

                if ($is_applicable && $max_mark < 0) {
                    throw ValidationException::withMessages([$index.'_'.$idx.'_max_mark' => trans('validation.min.numeric', ['attribute' => trans('exam.observation_detail_max_mark'), 'min' => 0])]);
                }
            }

            if (count($assessment_details) > 1 && $is_not_applicable == count($assessment_details)) {
                throw ValidationException::withMessages(['message' => trans('exam.atleast_one_assessment_detail_required')]);
            }

            $subjects[] = $subject_id;
        }

        if (count($subjects) != count(array_unique($subjects))) {
            throw ValidationException::withMessages(['message' => trans('exam.schedule_duplicate_subject')]);
        }

        $formatted = [
            'exam_id'            => $exam_id,
            'batch_id'           => $batch_id,
            'exam_grade_id'      => $exam_grade_id,
            'exam_assessment_id' => $exam_assessment_id
        ];

        if (! $exam_schedule_id) {
            $formatted['observation_marks'] = [];
        }

        $formatted['options'] = array(
            'overall_pass_percentage' => gv($params, 'overall_pass_percentage'),
            'show_result' => gbv($params, 'show_result')
        );

        return $formatted;
    }

    /**
     * Update exam schedule records.
     *
     * @param Schedule $exam_schedule
     * @param array $params
     *
     * @return Schedule
     */
    public function updateRecord(Schedule $exam_schedule, $params)
    {
        $records = gv($params, 'records');

        $previous_subjects = $exam_schedule->Records->pluck('subject_id')->all();

        $subjects = array();
        foreach ($records as $record) {
            $subject_id         = gv($record, 'subject_id');
            $has_no_exam        = gbv($record, 'has_no_exam');
            $date               = toDate(gv($record, 'date'));
            $assessment_details = gv($record, 'assessment_details', []);

            $record = $this->record->firstOrCreate([
                'exam_schedule_id' => $exam_schedule->id,
                'subject_id'       => $subject_id
            ]);

            $options['has_no_exam'] = $has_no_exam ? 1 : 0;
            $options['assessment_details'] = $assessment_details;

            $record->date = (! $has_no_exam) ? toDate($date) : null;
            $record->options = $options;
            $record->marks = $record->marks ? : [];
            $record->save();

            $subjects[] = $subject_id;
        }

        foreach ($previous_subjects as $previous_subject) {
            if (!in_array($previous_subject, $subjects)) {
                $this->record->filterByExamScheduleId($exam_schedule->id)->filterBySubjectId($previous_subject)->delete();
            }
        }
    }

    /**
     * Update given exam schedule.
     *
     * @param Schedule $exam_schedule
     * @param array $params
     *
     * @return Schedule
     */
    public function update(Schedule $exam_schedule, $params)
    {
        foreach ($exam_schedule->records as $record) {
            if (is_array($record->marks) && count($record->marks)) {
                throw ValidationException::withMessages(['message' => trans('exam.schedule_associated_with_exam')]);
            }
        }

        $exam_schedule->forceFill($this->formatParams($params, $exam_schedule->id))->save();

        $this->updateRecord($exam_schedule, $params);

        $exam_schedule_options = $exam_schedule->options;
        $exam_schedule_options['overall_pass_percentage'] = gv($params, 'overall_pass_percentage');
        $exam_schedule_options['show_result'] = gbv($params, 'show_result');
        $exam_schedule->options = $exam_schedule_options;
        $exam_schedule->save();

        return $exam_schedule;
    }

    /**
     * Find exam schedule & check it can be deleted or not.
     *
     * @param integer $id
     * @return Assessment
     */
    public function deletable($id)
    {
        $exam_schedule = $this->findOrFail($id);

        $exam_records = $exam_schedule->records;

        foreach ($exam_records as $exam_record) {
            if ($exam_record->marks) {
                throw ValidationException::withMessages(['message' => trans('exam.schedule_associated_with_exam')]);
            }
        }

        return $exam_schedule;
    }

    /**
     * Delete exam schedule.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Schedule $exam_schedule)
    {
        return $exam_schedule->delete();
    }

    /**
     * Delete multiple exam schedule.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->exam_schedule->whereIn('id', $ids)->delete();
    }
}
