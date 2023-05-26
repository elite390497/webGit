<?php
namespace App\Repositories\Exam;

use App\Models\Exam\Record;
use Illuminate\Support\Str;
use App\Models\Exam\Schedule;
use App\Models\Academic\ClassTeacher;
use App\Models\Student\StudentRecord;
use App\Models\Academic\SubjectTeacher;
use App\Repositories\Exam\ExamRepository;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Exam\GradeRepository;
use App\Repositories\Configuration\Exam\AssessmentRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class RecordRepository
{
    protected $course_group;
    protected $batch;
    protected $exam_grade;
    protected $exam_assessment;
    protected $exam;
    protected $student_record;
    protected $exam_record;
    protected $class_teacher;
    protected $subject_teacher;
    protected $exam_schedule;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CourseGroupRepository $course_group,
        BatchRepository $batch,
        GradeRepository $exam_grade,
        AssessmentRepository $exam_assessment,
        ExamRepository $exam,
        StudentRecord $student_record,
        Record $exam_record,
        ClassTeacher $class_teacher,
        SubjectTeacher $subject_teacher,
        Schedule $exam_schedule
    ) {
        $this->course_group = $course_group;
        $this->batch = $batch;
        $this->exam_grade = $exam_grade;
        $this->exam_assessment = $exam_assessment;
        $this->exam = $exam;
        $this->student_record = $student_record;
        $this->exam_record = $exam_record;
        $this->class_teacher = $class_teacher;
        $this->subject_teacher = $subject_teacher;
        $this->exam_schedule = $exam_schedule;
    }

    /**
     * Get exam record query
     *
     * @return Record query
     */
    public function getQuery()
    {
        return $this->exam_record;
    }

    /**
     * Get exam record pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $exams = $this->exam->selectAll();
        $batches = $this->course_group->getBatchOption();
        if (! \Auth::user()->hasRole(config('system.default_role.admin'))) {
            $employee_id = \Auth::user()->Employee->id;
            $subject_ids = $this->subject_teacher->filterByEmployeeId($employee_id)->get()->pluck('subject_id')->all();
            $batch_with_subjects = $this->batch->getAllBatchWithSubjectsAccordingtoRole($subject_ids);
        } else {
            $batch_with_subjects = $this->batch->getAllBatchWithSubjects();
        }

        return compact('batches','batch_with_subjects','exams');
    }

    /**
     * Get observation record pre requisite.
     *
     * @return Array
     */
    public function getObservationPreRequisite()
    {
        $batches = $this->course_group->getBatchOption();
        $exams = $this->exam->selectAll();

        return compact('batches','exams');
    }

    /**
     * Get students for record entry
     *
     * @param array $array
     * @return array
     */
    public function getStudents($params = array())
    {
        $exam_id = gv($params, 'exam_id');
        $batch_id = gv($params, 'batch_id');
        $subject_id = gv($params, 'subject_id');

        $exam = $this->exam->findOrFail($exam_id);
        $batch = $this->batch->findOrFail($batch_id);

        $course_group_id = $exam->exam_term_id ? $exam->term->course_group_id : null;

        if ($course_group_id && $batch->course->course_group_id != $course_group_id) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_batch')]);
        }

        if (! in_array($subject_id, $batch->Subjects->pluck('id')->all())) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_subject')]);
        }

        $exam_record = $this->exam_record->filterBySubjectId($subject_id)->whereHas('schedule', function($q) use($exam_id, $batch_id) {
            $q->filterByExamId($exam_id)->filterByBatchId($batch_id);
        })->first();

        if (! $exam_record) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_schedule')]);
        }

        if (! $exam_record->date) {
            throw ValidationException::withMessages(['message' => trans('exam.subject_has_no_exam')]);
        }

        $exam_record->load('schedule','schedule.grade','schedule.assessment','schedule.assessment.details');

        $student_records = [];

        $date_of_exam = toDate($exam_record->date);
        $student_records = $this->student_record->filterBySession()->filterbyBatchId($batch_id)->where('date_of_entry','<=', $date_of_exam)->where(function($q) use($date_of_exam) {
            $q->where('date_of_exit',null)->orWhere(function($q1) use($date_of_exam) {
                $q1->where('date_of_exit','!=',null)->where('date_of_exit','>=',$date_of_exam);
            });
        })->get();

        $student_records->load('student','admission','batch');

        $exam_assessment = $exam_record->schedule->assessment;

        $disable_input = true;

        if (\Auth::user()->can('store-exam-mark')) {
            $disable_input = false;
        } else if (\Auth::user()->can('store-class-teacher-wise-exam-mark')) {
            $class_teachers = $this->getClassTeachers($batch_id);
            $disable_input = amIClassTeacherOnDate($class_teachers, $date_of_exam) ? false : true;
        } else if (\Auth::user()->can('store-subject-teacher-wise-exam-mark')) {
            $subject_teachers = $this->getSubjectTeachers($subject_id);
            $disable_input = amISubjectTeacherOnDate($subject_teachers, $date_of_exam) ? false : true;
        }

        $exam_record->disable_input = $disable_input;

        return compact('student_records','exam_assessment','exam_record');
    }


    /**
     * Get students for observation record entry
     *
     * @param array $array
     * @return array
     */
    public function getStudentsForObservationRecord($params = array())
    {
        $exam_id = gv($params, 'exam_id');
        $batch_id = gv($params, 'batch_id');

        $exam = $this->exam->findOrFail($exam_id);
        $batch = $this->batch->findOrFail($batch_id);
        
        $course_group_id = $exam->exam_term_id ? $exam->term->course_group_id : null;

        if ($course_group_id && $batch->course->course_group_id != $course_group_id) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_batch')]);
        }

        $exam_schedule = $this->exam_schedule->filterByExamId($exam_id)->filterByBatchId($batch_id)->first();

        if (! $exam_schedule || ! $batch->exam_observation_id) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_schedule')]);
        }

        $batch->load('observation','observation.details');

        $student_records = [];

        $date_of_exam = $exam_schedule->records->where('date','!=',null)->sortBy('date')->last()->date;
        
        if (! $date_of_exam) {
            throw ValidationException::withMessages(['message' => trans('exam.subject_has_no_exam')]);
        }
        
        $date_of_exam = toDate($date_of_exam);
        
        $student_records = $this->student_record->filterBySession()->filterbyBatchId($batch_id)->where('date_of_entry','<=', $date_of_exam)->where(function($q) use($date_of_exam) {
            $q->where('date_of_exit',null)->orWhere(function($q1) use($date_of_exam) {
                $q1->where('date_of_exit','!=',null)->where('date_of_exit','>=',$date_of_exam);
            });
        })->get();

        $student_records->load('student','admission','batch');

        $exam_observation = $batch->observation;

        $disable_input = true;

        if (\Auth::user()->can('store-exam-mark')) {
            $disable_input = false;
        } else if (\Auth::user()->can('store-class-teacher-wise-exam-mark')) {
            $class_teachers = $this->getClassTeachers($batch_id);
            $disable_input = amIClassTeacherOnDate($class_teachers, $date_of_exam) ? false : true;
        }

        $exam_schedule->disable_input = $disable_input;

        return compact('student_records','exam_observation','exam_schedule');
    }

    /**
     * Get class teachers for exam entry
     * @param  integer $batch_id
     * @return ClassTeacher
     */
    private function getClassTeachers($batch_id)
    {
        $class_teachers = $this->class_teacher->filterByBatchId($batch_id)->orderBy('date_effective','desc')->get(['employee_id','date_effective']);

        $employee_id = optional(\Auth::user()->Employee)->id;
        foreach ($class_teachers as $class_teacher) {
            $class_teacher->is_me = ($class_teacher->employee_id == $employee_id) ? true : false;
        }

        return $class_teachers;
    }

    /**
     * Get subject teachers for exam entry
     * @param  object $subject
     * @return SubjectTeacher
     */
    private function getSubjectTeachers($subject_id)
    {
        $subject_teachers = $this->subject_teacher->filterBySubjectId($subject_id)->orderBy('date_effective','desc')->get(['employee_id','date_effective']);

        $employee_id = optional(\Auth::user()->Employee)->id;
        foreach ($subject_teachers as $subject_teacher) {
            $subject_teacher->is_me = ($subject_teacher->employee_id == $employee_id) ? true : false;
        }

        return $subject_teachers;
    }

    /**
     * Store exam records
     * @param  array  $params
     * @return void
     */
    public function store($params = array())
    {
        $data = $this->getStudents($params);

        $student_records = gv($data, 'student_records');
        $exam_assessment = gv($data, 'exam_assessment');
        $exam_record = gv($data, 'exam_record');

        if ($exam_record->disable_input) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        unset($exam_record->disable_input);

        $marks = gv($params, 'marks');
        $student_record_ids = $student_records->pluck('id')->all();

        foreach ($marks as $index => $mark) {
            $student_mark = [];
            $student_record_id = gv($mark, 'id');

            if (! in_array($student_record_id, $student_record_ids)) {
                continue;
            }

            $is_absent = gbv($mark, 'is_absent');
            $not_available = gbv($mark, 'not_available');

            if ($is_absent || $not_available) {
                continue;
            }

            $ob_marks = gv($mark, 'ob_marks');

            foreach ($ob_marks as $idx => $ob_mark) {
                $ob = gv($ob_mark, 'ob');


                // if (! $ob || ! is_numeric($ob)) {
                //     throw ValidationException::withMessages([$index.'_'.$idx.'_mark' => trans('validation.numeric', ['attribute' => trans('exam.obtained_mark')])]);
                // }

                if ($ob < 0) {
                    throw ValidationException::withMessages([$index.'_'.$idx.'_mark' => trans('validation.min.numeric', ['attribute' => trans('exam.obtained_mark'), 'min' => 0])]);
                }

                $exam_assessment_detail_id = gv($ob_mark, 'id');

                if ($exam_record->getOption('assessment_details')) {
                    $assessment_detail = searchByKey($exam_record->getOption('assessment_details'), 'id', $exam_assessment_detail_id);

                    if (! $assessment_detail || ! gv($assessment_detail, 'is_applicable')) {
                        throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
                    }

                    $max_mark = gv($assessment_detail, 'max_mark');

                } else {
                    $exam_assessment_detail = $exam_assessment->details->firstWhere('id', $exam_assessment_detail_id);

                    if (! $exam_assessment_detail) {
                        throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
                    }

                    $max_mark = $exam_assessment_detail->max_mark;
                }
                $countalpha = 0;
                for ($i = 0; $i < strlen($ob); $i++){
                       $char = $ob[$i];
                       if (is_numeric($char)) {
                        if ($ob > $max_mark) {
                            throw ValidationException::withMessages([$index.'_'.$idx.'_mark' => trans('validation.max.numeric', ['attribute' => trans('exam.obtained_mark'), 'max' => formatNumber($max_mark)])]);
                        }
                       } else {
                          $countalpha++;
                       }
                }
            }
        }

        $student_marks = array();
        foreach ($marks as $mark) {
            $student_record_id = gv($mark, 'id');

            if (! in_array($student_record_id, $student_record_ids)) {
                continue;
            }

            $is_absent = gbv($mark, 'is_absent');
            $not_available = gbv($mark, 'not_available');
            $comment = gv($mark, 'comment');

            if ($is_absent) {
                array_push($student_marks, array('id' => $student_record_id, 'is_absent' => true, 'comment' => $comment));
            } else if ($not_available) {
                array_push($student_marks, array('id' => $student_record_id, 'not_available' => true, 'comment' => $comment));
            } else {

                $ob_marks = gv($mark, 'ob_marks');

                $assessment_details = array();

                foreach ($ob_marks as $idx => $ob_mark) {
                    $count = 0;
                    $exam_assessment_detail_id = gv($ob_mark, 'id');
                    $ob = gv($ob_mark, 'ob',0);
                    if (is_numeric($ob)) {
                    }
                    else {
                        if($ob == "AB" || $ob == "NA") {
                        }
                        else {
                            throw ValidationException::withMessages(['message' => 'Enter valid string']);
                        }
                    }
                    // for ($i = 0; $i < strlen($ob); $i++){
                    //    $char = $ob[$i];
                    //    if (is_numeric($char)) {
                    //    } else {
                    //         $count++;
                    //    }
                    // }
                    // if($countother > 0) {
                    //     throw ValidationException::withMessages(['message' => 'Enter AB or NA']);
                    // }
                    // if($count > 4) {
                    //     throw ValidationException::withMessages(['message' => 'Enter only 4 characters.']);
                    // }
                    // for ($i = 0; $i < strlen($ob); $i++){
                    //    $char = $ob[$i];
                    //    if (is_numeric($char)) {
                    //    } else {
                    //         if($char == 'A' || $char == 'B' || $char == 'N') {
                    //             $count++;
                    //         }
                    //         else {
                    //             $countother++;
                    //         }

                    //    }
                    // }
                    // if($countother > 0) {
                    //     throw ValidationException::withMessages(['message' => 'Enter AB or NA']);
                    // }
                    array_push($assessment_details, array('id' => $exam_assessment_detail_id, 'ob' => $ob, 'is_absent' => false, 'comment' => null));
                }

                array_push($student_marks, array('id' => $student_record_id, 'is_absent' => false, 'not_available' => false, 'assessment_details' => array_values($assessment_details), 'comment' => $comment));

            }
        }

        $exam_record->marks = $student_marks;
        $exam_record->save();

        return $exam_record;
    }

    /**
     * Store exam observation records
     * @param  array  $params
     * @return void
     */
    public function storeObservation($params = array())
    {
        $data = $this->getStudentsForObservationRecord($params);

        $student_records = gv($data, 'student_records');
        $exam_observation = gv($data, 'exam_observation');
        $exam_schedule = gv($data, 'exam_schedule');

        if ($exam_schedule->disable_input) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
        unset($exam_schedule->disable_input);

        $observation_marks = gv($params, 'observation_marks');
        $student_record_ids = $student_records->pluck('id')->all();

        foreach ($observation_marks as $index => $observation_mark) {
            $student_mark = [];
            $student_record_id = gv($observation_mark, 'id');

            if (! in_array($student_record_id, $student_record_ids)) {
                continue;
            }

            $ob_marks = gv($observation_mark, 'ob_marks');

            foreach ($ob_marks as $idx => $ob_mark) {
                $ob = gv($ob_mark, 'ob', 0);

                if (! is_numeric($ob)) {
                    throw ValidationException::withMessages([$index.'_'.$idx.'_mark' => trans('validation.numeric', ['attribute' => trans('exam.obtained_mark')])]);
                }

                if ($ob < 0) {
                    throw ValidationException::withMessages([$index.'_'.$idx.'_mark' => trans('validation.min.numeric', ['attribute' => trans('exam.obtained_mark'), 'min' => 0])]);
                }

                $exam_observation_detail_id = gv($ob_mark, 'id');
                $exam_observation_detail = $exam_observation->details->firstWhere('id', $exam_observation_detail_id);

                if (! $exam_observation_detail) {
                    throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
                }

                $max_mark = $exam_observation_detail->max_mark;

                if ($ob > $max_mark) {
                    throw ValidationException::withMessages([$index.'_'.$idx.'_mark' => trans('validation.max.numeric', ['attribute' => trans('exam.obtained_mark'), 'max' => formatNumber($max_mark)])]);
                }
            }
        }

        $student_marks = array();
        foreach ($observation_marks as $observation_mark) {
            $student_record_id = gv($observation_mark, 'id');

            if (! in_array($student_record_id, $student_record_ids)) {
                continue;
            }

            $comment = gv($observation_mark, 'comment');

            $ob_marks = gv($observation_mark, 'ob_marks');

            $observation_details = array();

            foreach ($ob_marks as $idx => $ob_mark) {
                $exam_observation_detail_id = gv($ob_mark, 'id');
                $ob = formatNumber(gv($ob_mark, 'ob',0));
                array_push($observation_details, array('id' => $exam_observation_detail_id, 'ob' => $ob, 'comment' => null));
            }

            array_push($student_marks, array('id' => $student_record_id, 'observation_details' => array_values($observation_details), 'comment' => $comment));

        }

        $exam_schedule->observation_marks = $student_marks;
        $exam_schedule->save();

        return $exam_schedule;
    }

    /**
     * Delete exam record
     * @param  array $params
     * @return void
     */
    public function deleteRecord($params)
    {
        $data = $this->getStudents($params);

        $exam_record = gv($data, 'exam_record');

        if ($exam_record->disable_input) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        unset($exam_record->disable_input);

        $exam_record->marks = [];
        $exam_record->save();
    }

    /**
     * Delete exam record
     * @param  array $params
     * @return void
     */
    public function deleteObservationRecord($params)
    {
        $data = $this->getStudentsForObservationRecord($params);

        $exam_schedule = gv($data, 'exam_schedule');

        if ($exam_schedule->disable_input) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        unset($exam_schedule->disable_input);

        $exam_schedule->observation_marks = [];
        $exam_schedule->save();
    }
}