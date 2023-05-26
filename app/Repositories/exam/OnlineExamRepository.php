<?php
namespace App\Repositories\Exam;

use Illuminate\Support\Str;
use App\Models\Exam\OnlineExam;
use App\Models\Exam\OnlineExamRecord;
use App\Models\Student\StudentRecord;
use App\Models\Exam\OnlineExamQuestion;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Academic\SubjectRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class OnlineExamRepository
{
    protected $online_exam;
    protected $course_group;
    protected $batch;
    protected $subject;
    protected $online_exam_question;
    protected $student;
    protected $online_exam_record;
    protected $student_record;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        OnlineExam $online_exam,
        CourseGroupRepository $course_group,
        BatchRepository $batch,
        SubjectRepository $subject,
        OnlineExamQuestion $online_exam_question,
        StudentRepository $student,
        OnlineExamRecord $online_exam_record,
        StudentRecord $student_record
    ) {
        $this->online_exam = $online_exam;
        $this->course_group = $course_group;
        $this->batch = $batch;
        $this->subject = $subject;
        $this->online_exam_question = $online_exam_question;
        $this->student = $student;
        $this->online_exam_record = $online_exam_record;
        $this->student_record = $student_record;
    }

    /**
     * Get online exam query
     *
     * @return Online Exam query
     */
    public function getQuery()
    {
        return $this->online_exam;
    }

    /**
     * Count exam
     *
     * @return integer
     */
    public function count()
    {
        return $this->online_exam->filterBySession()->count();
    }

    /**
     * List all online exams by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->online_exam->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all online exams by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->online_exam->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all online exams by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->online_exam->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all online exams
     *
     * @return array
     */
    public function getAll()
    {
        return $this->online_exam->filterBySession()->get();
    }

    /**
     * Find online exam with given id.
     *
     * @param integer $id
     * @return OnlineExam
     */
    public function find($id)
    {
        return $this->online_exam->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find online exam with given id or throw an error.
     *
     * @param integer $id
     * @return OnlineExam
     */
    public function findOrFail($id, $field = 'message')
    {
        $online_exam = $this->online_exam->info()->filterBySession()->filterById($id)->first();

        if (! $online_exam) {
            throw ValidationException::withMessages([$field => trans('exam.could_not_find_online_exam')]);
        }

        return $online_exam;
    }

    /**
     * Find online exam with given uuid.
     *
     * @param uuid $uuid
     * @return OnlineExam
     */
    public function findByUuid($uuid)
    {
        return $this->online_exam->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find online exam with given uuid or throw an error.
     *
     * @param uuid $uuid
     * @return OnlineExam
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $online_exam = $this->online_exam->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $online_exam) {
            throw ValidationException::withMessages([$field => trans('exam.could_not_find_online_exam')]);
        }

        return $online_exam;
    }

    /**
     * Find online exam with given uuid or throw an error.
     *
     * @param uuid $uuid
     * @return OnlineExam
     */
    public function findSummaryByUuidOrFail($uuid, $field = 'message')
    {
        $online_exam = $this->online_exam->summary()->filterBySession()->filterByUuid($uuid)->first();

        if (! $online_exam) {
            throw ValidationException::withMessages([$field => trans('exam.could_not_find_online_exam')]);
        }

        return $online_exam;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return OnlineExam
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'date');
        $order   = gv($params, 'order', 'desc');
        $name    = gv($params, 'name');
        
        $batch_id = gv($params, 'batch_id');
        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->online_exam->summary()->filterBySession()->filterByName($name);

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $query->whereIsPublished(1);
            $student_batch_ids = getAuthUserBatchId();
            $batch_id = $batch_id ? array_intersect($student_batch_ids, $batch_id) : $student_batch_ids;
        }

        $batch_id = array_unique($batch_id);
        if (count($batch_id)) {
            $query->whereIn('batch_id', $batch_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all online exams using given params.
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
     * @return OnlineExam
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get online exam pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $batches = $this->course_group->getBatchOption();
        $batch_with_subjects = $this->batch->getAllBatchWithSubjects();
        $exam_types = getOnlineExamTypes();
        $online_exam_question_types = getOnlineExamQuestionTypes();

        return compact('batches', 'batch_with_subjects','exam_types','online_exam_question_types');
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
     * Create a new online exam.
     *
     * @param array $params
     * @return OnlineExam
     */
    public function create($params)
    {
        return $this->online_exam->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $online_exam_id = null)
    {
        $name = gv($params, 'name');
        $description = gv($params, 'description');
        $instructions = gv($params, 'instructions');

        $batch = $this->batch->findOrFail(gv($params, 'batch_id'));

        if (! in_array(gv($params, 'subject_id'), $batch->subjects->pluck('id')->all())) {
            throw ValidationException::withMessages(['subject_id' => trans('academic.could_not_find_subject')]);
        }

        $data = getVar('data');
        $online_exam_types = gv($data, 'online_exam_types', []);

        if (! in_array(gv($params, 'exam_type'), $online_exam_types)) {
            throw ValidationException::withMessages(['exam_type' => trans('general.invalid_input')]);
        }

        $date = toDate(gv($params, 'date'));
        if (! dateBetweenSession($date)) {
            throw ValidationException::withMessages(['date' => trans('academic.invalid_session_date_range')]);
        }

        if ($date < date('Y-m-d')) {
            throw ValidationException::withMessages(['date' => trans('exam.online_exam_date_should_gte_today')]);
        }

        $start_time = gv($params, 'start_time');
        $end_time   = gv($params, 'end_time');

        if (strtotime($start_time) === false) {
            throw ValidationException::withMessages(['message' => trans('exam.invalid_exam_start_time')]);
        }

        if (strtotime($end_time) === false) {
            throw ValidationException::withMessages(['message' => trans('exam.invalid_exam_end_time')]);
        }

        if (toTime($start_time) > toTime($end_time)) {
            throw ValidationException::withMessages(['message' => trans('exam.online_exam_start_time_should_lt_end_time')]);
        }

        $query = (! $online_exam_id) ? $this->online_exam : $this->online_exam->where('id', '!=', $online_exam_id);

        $online_exam_exists = $query->filterByName($name, 1)->filterBySession()->count();

        if ($online_exam_exists) {
            throw ValidationException::withMessages(['name' => trans('exam.online_exam_exists')]);
        }

        if (gv($params, 'exam_type') == 'mcq' && $online_exam_id) {
            if ($this->online_exam_question->whereOnlineExamId($online_exam_id)->where('question_type','!=','mcq')->count()) {
                throw ValidationException::withMessages(['exam_type' => trans('exam.online_exam_mixed_question_type_found')]);
            }
        }

        $formatted = [
            'batch_id' => $batch->id,
            'subject_id' => gv($params, 'subject_id'),
            'name'         => $name,
            'description'  => $description,
            'exam_type'  => gv($params, 'exam_type'),
            'date'  => toDate($date),
            'start_time'  => toTime($start_time),
            'end_time'  => toTime($end_time),
            'passing_percentage' => gv($params, 'passing_percentage', 0),
            'is_negative_mark_applicable' => gbv($params, 'is_negative_mark_applicable'),
            'negative_mark_percentage_per_question' => gv($params, 'negative_mark_percentage_per_question', 0),
            'instructions'  => clean($instructions),
            'options'      => []
        ];

        if (! $online_exam_id) {
            $formatted['uuid'] = \Str::uuid();
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Is online exam editable
     * @param  OnlineExam $online_exam
     * @return boolean                 
     */
    private function isEditable(OnlineExam $online_exam)
    {
        if (! $online_exam->is_editable) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Update given online exam.
     *
     * @param Online Exam $online_exam
     * @param array $params
     *
     * @return Exam
     */
    public function update(OnlineExam $online_exam, $params)
    {
        $this->isEditable($online_exam);

        return $online_exam->forceFill($this->formatParams($params, $online_exam->id))->save();
    }

    /**
     * Find online exam & check it can be deleted or not.
     *
     * @param uuid $uuid
     * @return OnlineExam
     */
    public function deletable($uuid)
    {
        $online_exam = $this->findByUuidOrFail($uuid);

        $this->isEditable($online_exam);

        if ($online_exam->questions()->count()) {
            throw ValidationException::withMessages(['message' => trans('exam.online_exam_associated_with_questions')]);
        }

        return $online_exam;
    }

    /**
     * Delete online exam.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(OnlineExam $online_exam)
    {
        return $online_exam->delete();
    }

    /**
     * Delete multiple online exams.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->online_exam->whereIn('id', $ids)->delete();
    }

    /**
     * Find question or fail
     * @param  OnlineExam $online_exam
     * @param  integer $id          
     * @return OnlineExamQuestion
     */
    public function findQuestionOrFail(OnlineExam $online_exam, $id)
    {
        $online_exam_question = $this->online_exam_question->whereOnlineExamId($online_exam->id)->whereId($id)->first();

        if (! $online_exam_question) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_online_exam_question')]);
        }

        return $online_exam_question;
    }

    /**
     * Add question to exam
     * @param OnlineExam $online_exam
     * @param array      $params      
     */
    public function addQuestion(OnlineExam $online_exam, $params = array())
    {
        $this->isEditable($online_exam);

        $online_exam_question = $this->online_exam_question->forceCreate($this->formatQuestionParams($params, $online_exam));

        $online_exam->increment('max_mark', $online_exam_question->mark);

        return $online_exam_question;
    }

    /**
     * Update question of exam
     * @param OnlineExam $online_exam
     * @param array      $params      
     */
    public function updateQuestion(OnlineExamQuestion $online_exam_question, $params = array())
    {
        $this->isEditable($online_exam);

        $mark = $online_exam_question->mark;

        $online_exam_question->forceFill($this->formatQuestionParams($params, $online_exam_question->onlineExam, $online_exam_question->id))->save();

        if ($mark != $online_exam_question->mark) {
            $online_exam = $online_exam_question->onlineExam;
            $online_exam->decrement('max_mark', $mark);
            $online_exam->increment('max_mark', $online_exam_question->mark);
        }
    }

    /**
     * Format question params
     * @param  array  $params                 
     * @param  object $online_exam             
     * @param  integer $online_exam_question_id
     * @return array
     */
    private function formatQuestionParams($params = array(), $online_exam, $online_exam_question_id = null)
    {
        $question = gv($params, 'question');
        $question_type = gv($params, 'question_type');
        $mark = gv($params, 'mark');
        $image = gv($params, 'image');
        $answers = gv($params, 'options');

        if (\Storage::exists($image)) {
            throw ValidationException::withMessages(['message' => trans('exam.image_doesnt_exist')]);
        }

        $query = $this->online_exam_question->whereOnlineExamId($online_exam->id);

        if ($online_exam_question_id) {
            $query->where('id','!=',$online_exam_question_id);
        }

        $question_exists = $query->where('question','=',$question)->count();

        if ($question_exists) {
            throw ValidationException::withMessages(['message' => trans('exam.online_exam_question_exists')]);
        }

        $data = getVar('data');
        $online_exam_question_types = gv($data, 'online_exam_question_types', []);

        if (! in_array($question_type, $online_exam_question_types)) {
            throw ValidationException::withMessages(['question_type' => trans('general.invalid_input')]);
        }

        if ($online_exam->exam_type == 'mcq' && $question_type != 'mcq') {
            throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
        }

        $answers = $this->validateMCQAnswer($params);

        $formatParams = array(
            'question' => $question,
            'question_type' => $question_type,
            'mark' => $mark,
            'image' => $image,
            'answers' => $answers
        );

        if (! $online_exam_question_id) {
            $formatParams['upload_token'] = \Str::uuid();
            $formatParams['options'] = [];
            $formatParams['online_exam_id'] = $online_exam->id;
        }

        return $formatParams;
    }

    /**
     * Validate MCQ answers
     * @param  array  $params [description]
     * @return void
     */
    private function validateMCQAnswer($params = array())
    {
        $question_type = gv($params, 'question_type');
        $answers = gv($params, 'options', []);

        if ($question_type != 'mcq') {
            return;
        }

        if (! count($answers)) {
            throw ValidationException::withMessages(['message' => trans('exam.no_answer_found')]);
        }

        $titles = array();
        $no_correct_answer_count = 0;
        $data = array();
        foreach ($answers as $answer) {
            $title = gv($answer, 'title');
            $image = gv($answer, 'image');
            $is_correct_answer = gbv($answer, 'is_correct_answer');

            $titles[] = $title;

            if (! $is_correct_answer) {
                $no_correct_answer_count++;
            }

            if (\Storage::exists($image)) {
                throw ValidationException::withMessages(['message' => trans('exam.image_doesnt_exist')]);
            }

            $data[] = array(
                'title' => $title,
                'image' => $image,
                'is_correct_answer' => $is_correct_answer
            );
        }

        if (count($titles) > count(array_unique($titles))) {
            throw ValidationException::withMessages(['message' => trans('exam.duplicate_answer_found')]);
        }

        if (count($answers) == $no_correct_answer_count) {
            throw ValidationException::withMessages(['message' => trans('exam.no_correct_answer_chosen')]);
        }

        return $data;
    }

    /**
     * Delete question
     * @param  OnlineExamQuestion $online_exam_question
     * @return void
     */
    public function deleteQuestion(OnlineExamQuestion $online_exam_question)
    {
        $this->isEditable($online_exam);

        $online_exam = $online_exam_question->onlineExam;
        $online_exam->decrement('max_mark', $online_exam_question->mark);

        $online_exam_question->delete();
    }

    /**
     * Toggle online exam status
     * @param  OnlineExam $online_exam
     * @return void
     */
    public function toggleStatus(OnlineExam $online_exam) 
    {
        if ($online_exam->records->count()) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        $status = request('status');

        if (! in_array($status, ['publish', 'draft'])) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        if ($online_exam->is_published && $status == 'publish') {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        if (! $online_exam->is_published && $status == 'draft') {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $online_exam->is_published = $status == 'publish' ? 1 : 0;
        $online_exam->save();
    }

    /**
     * Is online exam available to student & parent
     * @param  OnlineExam $online_exam
     * @return boolean                 
     */
    public function isAvailableToStudentAndParent(OnlineExam $online_exam) 
    {
        if (! \Auth::user()->hasAnyRole([
            config('system.default_role.parent'),
            config('system.default_role.student')
        ])) {
            return;
        }

        if (! $online_exam->is_published) {
            throw ValidationException::withMessages(['message' => trans('exam.online_exam_restricted')]);
        }

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();
            
            if (! in_array($online_exam->batch_id, $student_batch_ids)) {
                throw ValidationException::withMessages(['message' => trans('exam.online_exam_restricted')]);
            }
        }

        if ($online_exam->status == 'upcoming') {
            throw ValidationException::withMessages(['message' => trans('exam.online_exam_restricted')]);
        }

        if (\Auth::user()->hasRole(config('system.default_role.parent')) && $online_exam->status != 'expired') {
            throw ValidationException::withMessages(['message' => trans('exam.online_exam_restricted')]);
        }
    }

    /**
     * Get online exam questions
     * @param  OnlineExam $online_exam
     * @return array
     */
    public function getOnlineExamQuestions(OnlineExam $online_exam) 
    {
        $questions = $this->online_exam_question->whereOnlineExamId($online_exam->id)->orderBy('position','asc')->get();

        $data = array();
        foreach ($questions as $question) {
            $options = $question->answers;

            $answers = array();
            foreach ($options as $option) {
                $item = array(
                    'title' => gv($option, 'title'),
                    'image' => gv($option, 'image')
                );

                if ($online_exam->status == 'expired') {
                    $item['is_correct_answer'] = gbv($option, 'is_correct_answer');
                }

                $answers[] = $item;
            }

            $data[] = array(
                'id' => $question->id,
                'question' => $question->question,
                'image' => $question->image,
                'mark' => $question->mark,
                'question_type' => $question->question_type,
                'answers' => $answers
            );
        }

        return $data;
    }

    /**
     * Get online exam record
     * @param  OnlineExam $online_exam
     * @return OnlineExamRecord
     */
    public function getOnlineExamRecord(OnlineExam $online_exam)
    {
        $student_record = $this->student->getAuthStudentRecord($online_exam->batch_id);

        if (! $student_record) {
            return;
        }

        return $this->online_exam_record->whereOnlineExamId($online_exam->id)->whereStudentRecordId($student_record->id)->first();
    }

    /**
     * Get online exam record by id
     * @param  OnlineExam $online_exam
     * @param  integer     $id          
     * @return OnlineExamRecord
     */
    public function getOnlineExamRecordById(OnlineExam $online_exam, $id)
    {
        return $this->online_exam_record->with('studentRecord','studentRecord.student','studentRecord.student.parent','studentRecord.batch','studentRecord.batch.course')->whereOnlineExamId($online_exam->id)->whereId($id)->first();
    }

    /**
     * Store online exam records
     * @param  OnlineExam $online_exam
     * @param  array      $params     
     * @return void
     */
    public function storeExam(OnlineExam $online_exam, $params = array())
    {
        $student_record = $this->student->getAuthStudentRecord($online_exam->batch_id);

        if (! $student_record) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
        }

        $online_exam_record = $this->online_exam_record->firstOrCreate([
            'online_exam_id' => $online_exam->id,
            'student_record_id' => $student_record->id
        ]);

        if ($online_exam_record->end) {
            return;
        }

        if (! $online_exam_record->start) {
            $online_exam_record->start = now();
            $online_exam_record->save();
        }

        $questions = gv($params, 'answers', []);

        $online_exam_questions = $online_exam->questions;

        $answers = array();
        $obtained_mark = 0;
        foreach ($questions as $question) {
            $question_id = gv($question, 'id');

            $online_exam_question = $online_exam_questions->firstWhere('id', $question_id);

            if (! $online_exam_question) {
                throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
            }

            $answer = gv($question, 'answer');
            if ($answer && $online_exam_question->question_type == 'mcq') {
                $question_answers = gkv($online_exam_question->answers, 'title');

                if (! in_array($answer, $question_answers)) {
                    throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
                }

                $question_answer = searchByKey($online_exam_question->answers, 'title', $answer);
                if ($question_answer && gbv($question_answer, 'is_correct_answer')) {
                    $obtained_mark += $online_exam_question->mark;
                } else if ($online_exam->is_negative_mark_applicable && $question_answer && ! gbv($question_answer, 'is_correct_answer')) {
                    $obtained_mark -= ($online_exam_question->mark * $online_exam->negative_mark_percentage_per_question / 100);
                }
            }

            $answers[] = array(
                'question_id' => $question_id,
                'answer' => $answer
            );
        }

        $online_exam_record->answers = $answers;
        $online_exam_record->obtained_mark = $obtained_mark;

        if (request('is_final')) {
            $online_exam_record->end = now();
        }

        $online_exam_record->save();
    }

    /**
     * Get Students of Online Exam
     * @param  OnlineExam $online_exam
     * @return array
     */
    public function getStudents(OnlineExam $online_exam)
    {
        $date = toDate($online_exam->date);
        $student_records = $this->student_record->with('student','student.parent','batch','batch.course')->filterBySession()->filterbyBatchId($online_exam->batch_id)->where('date_of_entry','<=',$date)->where(function($q) use($date) {
            $q->where('date_of_exit',null)->orWhere(function($q1) use($date) {
                $q1->where('date_of_exit','!=',null)->where('date_of_exit','>=',$date);
            });
        })->orderBy('roll_number','asc')->get();

        $students = array();
        $online_exam_records = $online_exam->records;
        foreach ($student_records as $student_record) {
            $online_exam_record = $online_exam_records->firstWhere('student_record_id', $student_record->id);

            $students[] = array(
                'record_id' => optional($online_exam_record)->id,
                'name' => $student_record->student->name,
                'roll_number' => getRollNumber($student_record),
                'start' => optional($online_exam_record)->start,
                'end' => optional($online_exam_record)->end,
                'mark' => optional($online_exam_record)->obtained_mark,
            );
        }

        array_multisort(array_map(function($element) {
              return $element['mark'];
        }, $students), SORT_DESC, $students);

        return $students;
    }
}