<?php
namespace App\Repositories\Exam;

use App\Models\Exam\Exam;
use App\Models\Exam\Schedule;
use App\Models\Calendar\Holiday;
use App\Models\Academic\ClassTeacher;
use App\Models\Student\StudentRecord;
use App\Models\Configuration\Exam\Term;
use App\Models\Student\StudentAttendance;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\Student\StudentListCollection;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class ReportRepository
{
    protected $course_group;
    protected $batch;
    protected $class_teacher;
    protected $student_record;
    protected $exam_schedule;
    protected $exam;
    protected $exam_term;
    protected $holiday;
    protected $attendance;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CourseGroupRepository $course_group,
        BatchRepository $batch,
        ClassTeacher $class_teacher,
        StudentRecord $student_record,
        Schedule $exam_schedule,
        Exam $exam,
        Term $exam_term,
        Holiday $holiday,
        StudentAttendance $attendance
    ) {
        $this->course_group = $course_group;
        $this->batch = $batch;
        $this->class_teacher = $class_teacher;
        $this->student_record = $student_record;
        $this->exam_schedule = $exam_schedule;
        $this->exam = $exam;
        $this->exam_term = $exam_term;
        $this->holiday = $holiday;
        $this->attendance = $attendance;
    }

    /**
     * Get exam report pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $batches = $this->course_group->getBatchOption();

        $exams = $this->exam->summary()->filterBySession()->get();

        $exam_terms = $this->exam_term->filterBySession()->get();

        $data = array();

        foreach ($exams as $exam) {
            $exam_name = $exam->name;

            if ($exam->exam_term_id) {
                $exam_name .= ' ('.$exam->term->courseGroup->name.')';
            }

            $data[] = array(
                'id' => $exam->id,
                'name' => $exam_name,
                'course_group_id' => $exam->exam_term_id ? $exam->term->course_group_id : null,
                'course_group_name' => $exam->exam_term_id ? $exam->term->courseGroup->name : null,
            );
        }

        $term_exam = $exams->where('exam_term_id', '!=', null)->count();

        if ($term_exam == count($exams)) {
            $types = [
                array('text' => trans('exam.term_wise_report'), 'value' => 'term')
            ];
        } elseif (! $term_exam) {
            $types = [
                array('text' => trans('exam.no_term_wise_report'), 'value' => 'no_term')
            ];
        } else {
            $types = [
                array('text' => trans('exam.term_wise_report'), 'value' => 'term'),
                array('text' => trans('exam.no_term_wise_report'), 'value' => 'no_term')
            ];
        }

        $exams = $data;

        return compact('batches', 'types', 'exams', 'exam_terms');
    }

    /**
     * Get students for exam report
     *
     * @param array $array
     * @return array
     */
    public function getStudents($params = array())
    {
        $batch_id = gv($params, 'batch_id');

        $batch = $this->batch->findOrFail($batch_id);

        $query = $this->student_record->with('student', 'batch')->filterBySession()->filterbyBatchId($batch_id);

        if (\Auth::user()->hasRole(config('system.default_role.parent'))) {
            $student_ids = \Auth::user()->Parent->Students->pluck('id')->all();
            $query->whereHas('student', function ($q) use ($student_ids) {
                $q->whereIn('id', $student_ids);
            });
        } elseif (\Auth::user()->hasRole(config('system.default_role.student'))) {
            $student_id = \Auth::user()->Student->id;
            $query->whereHas('student', function ($q) use ($student_id) {
                $q->where('id', $student_id);
            });
        }

        if (\Auth::user()->can('access-exam-report')) {
        } elseif (\Auth::user()->can('access-class-teacher-wise-exam-report')) {
            $class_teachers = $this->getClassTeachers($batch_id);

            if (! amIClassTeacherOnDate($class_teachers)) {
                $query->whereNull('id');
            }
        }

        $student_records = $query->select('student_records.*', \DB::raw('(SELECT concat_ws(" ", first_name,middle_name,last_name) FROM students WHERE student_records.student_id = students.id ) as name'))->orderBy('name','asc')->get()->sortBy('roll_number');

        $students = new StudentListCollection($student_records);

        return compact('students');
    }

    /**
     * Get class teachers for exam report
     * @param  integer $batch_id
     * @return ClassTeacher
     */
    private function getClassTeachers($batch_id)
    {
        $class_teachers = $this->class_teacher->filterByBatchId($batch_id)->orderBy('date_effective', 'desc')->get(['employee_id','date_effective']);

        $employee_id = optional(\Auth::user()->Employee)->id;
        foreach ($class_teachers as $class_teacher) {
            $class_teacher->is_me = ($class_teacher->employee_id == $employee_id) ? true : false;
        }

        return $class_teachers;
    }

    public function getReport($params)
    {
        $batch_id = gv($params, 'batch_id');
        $batch = $this->batch->findOrFail($batch_id);
        $student_record_id = gv($params, 'student_record_id');

        $query = $this->student_record->with('student', 'admission', 'batch', 'batch.course', 'batch.subjects', 'student.parent');

        if (\Auth::user()->hasRole(config('system.default_role.parent'))) {
            $student_ids = \Auth::user()->Parent->Students->pluck('id')->all();
            $query->whereHas('student', function ($q) use ($student_ids) {
                $q->whereIn('id', $student_ids);
            });
        } elseif (\Auth::user()->hasRole(config('system.default_role.student'))) {
            $student_id = \Auth::user()->Student->id;
            $query->whereHas('student', function ($q) use ($student_id) {
                $q->where('id', $student_id);
            });
        }

        if (\Auth::user()->can('access-exam-report')) {
        } elseif (\Auth::user()->can('access-class-teacher-wise-exam-report')) {
            $class_teachers = $this->getClassTeachers($batch_id);

            if (! amIClassTeacherOnDate($class_teachers)) {
                $query->whereNull('id');
            }
        }

        $student_record = $query->filterById($student_record_id)->first();

        if (! $student_record) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        $type = gv($params, 'type');

        $summary = array();
        $term_header = array();
        $header = array();

        if ($type == 'term') {
            $exam_terms = $this->exam_term->with([
                'exams',
                'exams.schedules' => function ($q1) use ($batch_id) {
                    $q1->where('batch_id', $batch_id);
                },
                'exams.schedules.assessment',
                'exams.schedules.assessment.details',
                'exams.schedules.records',
                'exams.schedules.records.subject'
            ])->filterBySession()->whereHas('exams', function ($q2) use ($batch_id) {
                $q2->whereHas('schedules', function ($q3) use ($batch_id) {
                    $q3->where('batch_id', $batch_id);
                });
            })->orderBy('position', 'asc')->get();

            $previous_colspan = 0;
            foreach ($exam_terms as $exam_term) {
                $colspan = 0;
                $header = $this->getHeader($exam_term->exams, $header);
                foreach ($header as $value) {
                    $colspan += count(gv($value, 'assessment_details'));
                }

                array_push($term_header, array(
                    'id' => $exam_term->id,
                    'name' => $exam_term->name,
                    'colspan' => $colspan - $previous_colspan
                ));
                $previous_colspan = $colspan;
            }
        } else {
            $exams = $this->exam->whereNull('exam_term_id')->filterBySession()->with([
                'schedules' => function ($q1) use ($batch_id) {
                    $q1->where('batch_id', $batch_id);
                },
                'schedules.grade',
                'schedules.grade.details',
                'schedules.assessment',
                'schedules.assessment.details',
                'schedules.records',
                'schedules.records.subject'
            ])->whereHas('schedules', function ($q2) use ($batch_id) {
                $q2->where('batch_id', $batch_id);
            })->orderBy('position', 'asc')->get();

            $header = $this->getHeader($exams, $header);
        }


        $summary['term_header'] = $term_header;
        $summary['header'] = $header;

        $subjects = array();
        $exam_total = array();
        $subject_assessment_total = array();
        $exam_assessment_total = array();
        $assessment_total = array();
        $last_date = config('config.default_academic_session.start_date');
        foreach ($student_record->batch->subjects->sortBy('position') as $subject) {
            $marks = array();
            $has_no_exam = false;
            foreach ($header as $exam) {
                $single_assessment_detail_id = gv($exam, 'single_assessment_detail_id');
                $records = gv($exam, 'records');
                $show_subject_total = gbv($exam, 'show_subject_total');
                $grade = gv($exam, 'grade');
                $schedule_id = gv($exam, 'schedule_id');
                $assessment_details = gv($exam, 'assessment_details');
                $record = $records->firstWhere('subject_id', $subject->id);
                /**/
                $_options = gv($record,'options');
                $_assDetails = null;
                if($_options){
                    $_assDetails = gv($_options,'assessment_details');
                }
                /**/
                $student_marks = $record ? ($record->marks ? : []) : [];
                $date = $record ? toDate($record->date) : null;

                $student_mark = searchByKey($student_marks, 'id', $student_record->id);

                if ($date && $student_marks) {
                    $last_date = $last_date > $date ? $last_date : $date;
                }

                $is_absent = gbv($student_mark, 'is_absent');
                $not_available = gbv($student_mark, 'not_available');
                $obtained_marks = gv($student_mark, 'assessment_details', []);

                $subject_total = '';
                foreach ($assessment_details as $assessment_detail) {
                    $assessment_detail_id = gv($assessment_detail, 'id', 0);
                    $is_max_mark = gv($assessment_detail, 'is_max_mark', false);
                    $assessment_detail_max_mark = gv($assessment_detail, 'max_mark');
                    if($_assDetails && isset($_assDetails[0])){
                        $assessment_detail_max_mark = $_assDetails[0]['max_mark'];
                    }
                    $assessment_detail_is_applicable = 1;

                    if ($record && $record->getOption('assessment_details')) {
                        if ($assessment_detail_id > 0) {
                            $assess_detail = searchByKey($record->getOption('assessment_details'), 'id', $assessment_detail_id);
                            $assessment_detail_is_applicable = gbv($assess_detail, 'is_applicable');
                            if ($not_available) {
                                $assessment_detail_max_mark = 0;
                            } else {
                                $assessment_detail_max_mark = ($assessment_detail_is_applicable) ? gv($assess_detail, 'max_mark',0) : 0;
                            }
                        } else {
                            $assessment_detail_max_mark = 0;
                            if ($not_available) {
                                $assessment_detail_max_mark = 0;
                            } else {
                                foreach ($record->getOption('assessment_details') as $assess_detail) {
                                    $assessment_detail_max_mark += gbv($assess_detail, 'is_applicable') ? gv($assess_detail, 'max_mark', 0) : 0;
                                }
                            }
                        }
                    }

                    $obtained_mark = searchByKey($obtained_marks, 'id', $assessment_detail_id);

                    if ($date && $assessment_detail_is_applicable) {
                        if ($is_absent) {
                            $mark = trans('exam.absent_code');
                        } else if($obtained_mark) {
                            $is_absent = gbv($obtained_mark, 'is_absent');
                            $mark = $is_absent ? config('exam.absent_code') : (float) gv($obtained_mark, 'ob', 0);
                        } else if($not_available) {
                            $mark = trans('exam.not_available_code');
                        } else {
                            $mark = '';
                        }
                    } else {
                        $mark = '-';
                    }

                    if ($assessment_detail_id > 0) {
                        if (is_numeric($mark)) {
                            $subject_total = is_numeric($subject_total) ? $subject_total : 0;
                            $subject_total += $mark;
                        }
                    } elseif (! $assessment_detail_id) {
                        $mark = $subject_total;
                    }

                    $assessment_total[$schedule_id][$assessment_detail_id] = isset($assessment_total[$schedule_id][$assessment_detail_id]) ? $assessment_total[$schedule_id][$assessment_detail_id] : 0;
                    if (is_numeric($assessment_total[$schedule_id][$assessment_detail_id]) && $date && $assessment_detail_id > 0) {
                        $assessment_total[$schedule_id][$assessment_detail_id] += $assessment_detail_max_mark;
                    }

                    $exam_assessment_total[$schedule_id] = isset($exam_assessment_total[$schedule_id]) ? $exam_assessment_total[$schedule_id] : 0;
                    if (is_numeric($exam_assessment_total[$schedule_id]) && $date && $assessment_detail_id > 0) {
                        $exam_assessment_total[$schedule_id] += $assessment_detail_max_mark;
                    }

                    if (is_numeric($mark)) {
                        if ($assessment_detail_id >= 0) {
                            $subject_assessment_total[$schedule_id][$assessment_detail_id] = isset($subject_assessment_total[$schedule_id][$assessment_detail_id]) && is_numeric($subject_assessment_total[$schedule_id][$assessment_detail_id]) ? $subject_assessment_total[$schedule_id][$assessment_detail_id] : 0;
                            $subject_assessment_total[$schedule_id][$assessment_detail_id] += $mark;
                        }

                        if ($assessment_detail_id > 0) {
                            $exam_total[$schedule_id] = isset($exam_total[$schedule_id]) && is_numeric($exam_total[$schedule_id]) ? $exam_total[$schedule_id] : 0;
                            $exam_total[$schedule_id] += $mark;
                        }
                    } else {
                        $subject_assessment_total[$schedule_id][$assessment_detail_id] = isset($subject_assessment_total[$schedule_id][$assessment_detail_id]) ? $subject_assessment_total[$schedule_id][$assessment_detail_id] : $mark;

                        $exam_total[$schedule_id] = isset($exam_total[$schedule_id]) ? $exam_total[$schedule_id] : $mark;
                    }

                    if ($assessment_detail_id < 1) {
                        $mark = is_numeric($subject_total) ? $subject_total : ($date ? ($is_absent ? trans('exam.absent_code') : '') : '-');
                    }

                    if ($grade && is_numeric($mark) && $assessment_detail_id == -1) {
                        $mark = $this->getGrade($mark, $assessment_detail_max_mark, $grade);
                    }

                    if ($not_available && $assessment_detail_id == 3) {
                        $mark = $assessment_detail_max_mark;
                    } else if (!$assessment_detail_max_mark && $is_max_mark && $assessment_detail_id == 3) {
                        $mark = gv($assessment_detail, 'max_mark');
                        if($_assDetails && isset($_assDetails[0])){
                            $mark = $_assDetails[0]['max_mark'];
                        }
                        $subject_assessment_total[$schedule_id][$assessment_detail_id] = $exam_assessment_total[$schedule_id];
                    }

                    $marks[] = $mark;
                }

                if ($grade && $assessment_detail_id < 0) {
                    $max_mark = $show_subject_total ? $subject_assessment_total[$schedule_id][0] : ($single_assessment_detail_id ? $subject_assessment_total[$schedule_id][$single_assessment_detail_id] : 0);

                    $subject_assessment_total[$schedule_id][-1] = $this->getGrade($max_mark, $exam_assessment_total[$schedule_id], $grade, 1);
                }
            }
            $subjects[] = array(
                'id'        => $subject->id,
                'code'      => $subject->code,
                'name'      => $subject->name,
                'shortcode' => $subject->shortcode,
                'marks'     => $marks
            );
        }

        foreach ($subjects as $index => $subject) {
            $unique = array_values(array_unique($subject['marks']));
            if (count($unique) === 1 && $unique[0] == '-') {
                unset($subjects[$index]);
            }
        }

        $summary['subjects'] = $subjects;
        $summary['assessment_total'] = $assessment_total;
        $summary['exam_assessment_total'] = $exam_assessment_total;
        $summary['subject_assessment_total'] = $subject_assessment_total;
        $summary['exam_total'] = $exam_total;

        $observation_term_header = array();
        $observation_header = array();
        $batch->load('observation', 'observation.details', 'grade', 'grade.details');

        if ($type == 'term') {
            $observation_exam_terms = $this->getExams($batch, 'term');
            foreach ($observation_exam_terms as $exam_term) {
                $include_term = 0;
                foreach ($exam_term->exams as $exam) {
                    $schedule = $exam->schedules->first();
                    if ($schedule && $schedule->observation_marks) {
                        array_push($observation_header, array(
                            'exam_id' => $exam->id,
                            'name' => $exam->name,
                            'schedule' => $schedule
                        ));
                        $include_term++;
                    }
                }

                if ($include_term) {
                    array_push($observation_term_header, array(
                        'id' => $exam_term->id,
                        'name' => $exam_term->name,
                        'colspan' => $exam_term->exams->count()
                    ));
                }
            }
        } else {
            $observation_exams = $this->getExams($batch);
            foreach ($observation_exams as $exam) {
                $schedule = $exam->schedules->first();
                if ($schedule->observation_marks) {
                    array_push($observation_header, array(
                        'exam_id' => $exam->id,
                        'name' => $exam->name,
                        'schedule' => $schedule
                    ));
                }
            }
        }

        $observation_params = array();
        $observation_enabled = 0;
        $observation_details = $batch->exam_observation_id ? $batch->observation->details : [];
        foreach ($observation_details as $detail) {
            $marks = array();
            foreach ($observation_header as $exam) {
                $schedule = gv($exam, 'schedule');
                $observation_marks = $schedule->observation_marks;
                if ($schedule->observation_marks) {
                    $observation_enabled = 1;
                }
                $observation_mark = searchByKey($observation_marks, 'id', $student_record->id);
                $obtained_marks = gv($observation_mark, 'observation_details', []);
                $obtained_mark = searchByKey($obtained_marks, 'id', $detail->id);
                $mark = gv($obtained_mark, 'ob', 0);

                if (is_numeric($mark)) {
                    array_push($marks, $this->getGrade($mark, $detail->max_mark, $batch->grade));
                } else {
                    array_push($marks, "");
                }
            }

            if ($observation_enabled) {
                $observation_params[] = array(
                    'id' => $detail->id,
                    'name' => $detail->name,
                    'marks' => $marks
                );
            }
        }

        $last_date = (! $last_date) ? config('config.default_academic_session.end_date') : $last_date;
        $start_date = config('config.default_academic_session.start_date') >= toDate($student_record->date_of_entry) ? config('config.default_academic_session.start_date') : toDate($student_record->date_of_entry);
        $holidays = $this->holiday->filterBySession()->where('date', '<=', $last_date)->count();
        $working_days = dateDiff($start_date, $last_date);

        $attendances = $this->attendance->dateOfAttendanceBetween(['start_date' => $start_date, 'end_date' => $last_date])->whereBatchId($batch_id)->where(function ($q) {
            $q->where(function ($q1) {
                $q1->whereNull('subject_id')->whereNull('session')->whereIsDefault(0);
            })->orWhere('is_default', 1);
        })->get();
        $working_days = $attendances->count();

        $total_absent = 0;
        foreach ($attendances as $attendance) {
            $absentees = $attendance->getAttendance('data');
            if (searchByKey($absentees, 'id', $student_record->id)) {
                $total_absent++;
            }
        }

        $summary['observation_term_header'] = $observation_term_header;
        $summary['observation_header'] = $observation_header;
        $summary['observation_params'] = $observation_params;
        $summary['grade'] = isset($grade) ? $grade : null;
        $summary['working_days'] = $working_days;
        $summary['attendance'] = $working_days - $total_absent;
        $summary['attendance_percentage'] = $working_days ? round((($working_days - $total_absent) / $working_days) * 100, 2) : 0;

        return compact('student_record', 'summary');
    }

    /**
     * Get report for all students
     * @param  array  $params
     * @return array
     */
    public function getAllReport($params)
    {
        $batch_id = gv($params, 'batch_id');
        $batch = $this->batch->findOrFail($batch_id);

        $query = $this->student_record->with('student', 'admission', 'batch', 'batch.course', 'batch.subjects', 'student.parent')->filterBySession()->filterbyBatchId($batch_id);

        if (\Auth::user()->hasRole(config('system.default_role.parent'))) {
            $student_ids = \Auth::user()->Parent->Students->pluck('id')->all();
            $query->whereHas('student', function ($q) use ($student_ids) {
                $q->whereIn('id', $student_ids);
            });
        } elseif (\Auth::user()->hasRole(config('system.default_role.student'))) {
            $student_id = \Auth::user()->Student->id;
            $query->whereHas('student', function ($q) use ($student_id) {
                $q->where('id', $student_id);
            });
        }

        if (\Auth::user()->can('access-exam-report')) {
        } elseif (\Auth::user()->can('access-class-teacher-wise-exam-report')) {
            $class_teachers = $this->getClassTeachers($batch_id);

            if (! amIClassTeacherOnDate($class_teachers)) {
                $query->whereNull('id');
            }
        }

        $student_records = $query->get()->sortBy('roll_number');
        // $student_records->dump(); exit;
        if (! $student_records) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        $type = gv($params, 'type');

        $summary = array();
        $term_header = array();
        $header = array();

        if ($type == 'term') {
            $exam_terms = $this->exam_term->with([
                'exams',
                'exams.schedules' => function ($q1) use ($batch_id) {
                    $q1->where('batch_id', $batch_id);
                },
                'exams.schedules.assessment',
                'exams.schedules.assessment.details',
                'exams.schedules.records',
                'exams.schedules.records.subject'
            ])->filterBySession()->whereHas('exams', function ($q2) use ($batch_id) {
                $q2->whereHas('schedules', function ($q3) use ($batch_id) {
                    $q3->where('batch_id', $batch_id);
                });
            })->orderBy('position', 'asc')->get();

            $previous_colspan = 0;
            foreach ($exam_terms as $exam_term) {
                $colspan = 0;
                $header = $this->getHeader($exam_term->exams, $header);
                foreach ($header as $value) {
                    $colspan += count(gv($value, 'assessment_details'));
                }

                array_push($term_header, array(
                    'id' => $exam_term->id,
                    'name' => $exam_term->name,
                    'colspan' => $colspan - $previous_colspan
                ));
                $previous_colspan = $colspan;
            }
        } else {
            $exams = $this->exam->whereNull('exam_term_id')->filterBySession()->with([
                'schedules' => function ($q1) use ($batch_id) {
                    $q1->where('batch_id', $batch_id);
                },
                'schedules.grade',
                'schedules.grade.details',
                'schedules.assessment',
                'schedules.assessment.details',
                'schedules.records',
                'schedules.records.subject'
            ])->whereHas('schedules', function ($q2) use ($batch_id) {
                $q2->where('batch_id', $batch_id);
            })->orderBy('position', 'asc')->get();

            $header = $this->getHeader($exams, $header);
        }


        $summary['term_header'] = $term_header;
        $summary['header'] = $header;
        $observation_term_header = array();
        $observation_header = array();
        $batch->load('observation', 'observation.details', 'grade', 'grade.details');

        if ($type == 'term') {
            $observation_exam_terms = $this->getExams($batch, 'term');
            foreach ($observation_exam_terms as $exam_term) {
                $include_term = 0;
                foreach ($exam_term->exams as $exam) {
                    $schedule = $exam->schedules->first();
                    if ($schedule && $schedule->observation_marks) {
                        array_push($observation_header, array(
                            'exam_id' => $exam->id,
                            'name' => $exam->name,
                            'schedule' => $schedule
                        ));
                        $include_term++;
                    }
                }

                if ($include_term) {
                    array_push($observation_term_header, array(
                        'id' => $exam_term->id,
                        'name' => $exam_term->name,
                        'colspan' => $exam_term->exams->count()
                    ));
                }
            }
        } else {
            $observation_exams = $this->getExams($batch);
            foreach ($observation_exams as $exam) {
                $schedule = $exam->schedules->first();
                if ($schedule->observation_marks) {
                    array_push($observation_header, array(
                        'exam_id' => $exam->id,
                        'name' => $exam->name,
                        'schedule' => $schedule
                    ));
                }
            }
        }

        foreach ($student_records as $student_record) {
        // foreach ($student_records as $key => $student_record) {
            $subjects = array();
            $exam_total = array();
            $subject_assessment_total = array();
            $exam_assessment_total = array();
            $assessment_total = array();
            $last_date = config('config.default_academic_session.start_date');
            foreach ($student_record->batch->subjects->sortBy('position') as $subject) {
                $marks = array();
                $has_no_exam = false;
                foreach ($header as $exam) {
                    $single_assessment_detail_id = gv($exam, 'single_assessment_detail_id');
                    $records = gv($exam, 'records');
                    $show_subject_total = gbv($exam, 'show_subject_total');
                    $grade = gv($exam, 'grade');
                    $schedule_id = gv($exam, 'schedule_id');
                    $assessment_details = gv($exam, 'assessment_details');
                    $record = $records->firstWhere('subject_id', $subject->id);
                    /**/
                    $_options = gv($record,'options');
                    $_assDetails = null;
                    if($_options){
                        $_assDetails = gv($_options,'assessment_details');
                    }
                    /**/
                    $student_marks = $record ? ($record->marks ? : []) : [];
                    $date = $record ? toDate($record->date) : null;

                    $student_mark = searchByKey($student_marks, 'id', $student_record->id);

                    if ($date && $student_marks) {
                        $last_date = $last_date > $date ? $last_date : $date;
                    }

                    $is_absent = gbv($student_mark, 'is_absent');
                    $not_available = gbv($student_mark, 'not_available');
                    $obtained_marks = gv($student_mark, 'assessment_details', []);

                    $subject_total = '';
                    foreach ($assessment_details as $assessment_detail) {
                        $assessment_detail_id = gv($assessment_detail, 'id', 0);
                        $is_max_mark = gv($assessment_detail, 'is_max_mark', false);
                        $assessment_detail_max_mark = gv($assessment_detail, 'max_mark');
                        if($_assDetails && isset($_assDetails[0])){
                            $assessment_detail_max_mark = $_assDetails[0]['max_mark'];
                        }
                        $assessment_detail_is_applicable = 1;

                        if ($record && $record->getOption('assessment_details')) {
                            if ($assessment_detail_id > 0) {
                                $assess_detail = searchByKey($record->getOption('assessment_details'), 'id', $assessment_detail_id);
                                $assessment_detail_is_applicable = gbv($assess_detail, 'is_applicable');
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    $assessment_detail_max_mark = ($assessment_detail_is_applicable) ? gv($assess_detail, 'max_mark',0) : 0;
                                }
                            } else {
                                $assessment_detail_max_mark = 0;
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    foreach ($record->getOption('assessment_details') as $assess_detail) {
                                        $assessment_detail_max_mark += gbv($assess_detail, 'is_applicable') ? gv($assess_detail, 'max_mark', 0) : 0;
                                    }
                                }
                            }
                        }

                        $obtained_mark = searchByKey($obtained_marks, 'id', $assessment_detail_id);

                        if ($date && $assessment_detail_is_applicable) {
                            if ($is_absent) {
                                $mark = trans('exam.absent_code');
                            } else if($obtained_mark) {
                                $is_absent = gbv($obtained_mark, 'is_absent');
                                $mark = $is_absent ? config('exam.absent_code') : (float) gv($obtained_mark, 'ob', 0);
                            } else if($not_available) {
                                $mark = trans('exam.not_available_code');
                            } else {
                                $mark = '';
                            }
                        } else {
                            $mark = '-';
                        }

                        if ($assessment_detail_id > 0) {
                            if (is_numeric($mark)) {
                                $subject_total = is_numeric($subject_total) ? $subject_total : 0;
                                $subject_total += $mark;
                            }
                        } elseif (! $assessment_detail_id) {
                            $mark = $subject_total;
                        }

                        $assessment_total[$schedule_id][$assessment_detail_id] = isset($assessment_total[$schedule_id][$assessment_detail_id]) ? $assessment_total[$schedule_id][$assessment_detail_id] : 0;
                        if (is_numeric($assessment_total[$schedule_id][$assessment_detail_id]) && $date && $assessment_detail_id > 0) {
                            $assessment_total[$schedule_id][$assessment_detail_id] += $assessment_detail_max_mark;
                        }

                        $exam_assessment_total[$schedule_id] = isset($exam_assessment_total[$schedule_id]) ? $exam_assessment_total[$schedule_id] : 0;
                        if (is_numeric($exam_assessment_total[$schedule_id]) && $date && $assessment_detail_id > 0) {
                            $exam_assessment_total[$schedule_id] += $assessment_detail_max_mark;
                        }

                        if (is_numeric($mark)) {
                            if ($assessment_detail_id >= 0) {
                                $subject_assessment_total[$schedule_id][$assessment_detail_id] = isset($subject_assessment_total[$schedule_id][$assessment_detail_id]) && is_numeric($subject_assessment_total[$schedule_id][$assessment_detail_id]) ? $subject_assessment_total[$schedule_id][$assessment_detail_id] : 0;
                                $subject_assessment_total[$schedule_id][$assessment_detail_id] += $mark;
                            }

                            if ($assessment_detail_id > 0) {
                                $exam_total[$schedule_id] = isset($exam_total[$schedule_id]) && is_numeric($exam_total[$schedule_id]) ? $exam_total[$schedule_id] : 0;
                                $exam_total[$schedule_id] += $mark;
                            }
                        } else {
                            $subject_assessment_total[$schedule_id][$assessment_detail_id] = isset($subject_assessment_total[$schedule_id][$assessment_detail_id]) ? $subject_assessment_total[$schedule_id][$assessment_detail_id] : $mark;

                            $exam_total[$schedule_id] = isset($exam_total[$schedule_id]) ? $exam_total[$schedule_id] : $mark;
                        }

                        if ($assessment_detail_id < 1) {
                            $mark = is_numeric($subject_total) ? $subject_total : ($date ? ($is_absent ? trans('exam.absent_code') : '') : '-');
                        }

                        if ($grade && is_numeric($mark) && $assessment_detail_id == -1) {
                            $mark = $this->getGrade($mark, $assessment_detail_max_mark, $grade);
                        }

                        if ($not_available && $assessment_detail_id == 3) {
                            $mark = $assessment_detail_max_mark;
                        } else if (!$assessment_detail_max_mark && $is_max_mark && $assessment_detail_id == 3) {
                            $mark = gv($assessment_detail, 'max_mark');
                            if($_assDetails && isset($_assDetails[0])){
                                $mark = $_assDetails[0]['max_mark'];
                            }
                            $subject_assessment_total[$schedule_id][$assessment_detail_id] = $exam_assessment_total[$schedule_id];
                        }

                        $marks[] = $mark;
                    }

                    if ($grade && $assessment_detail_id < 0) {
                        $max_mark = $show_subject_total ? $subject_assessment_total[$schedule_id][0] : ($single_assessment_detail_id ? $subject_assessment_total[$schedule_id][$single_assessment_detail_id] : 0);

                        $subject_assessment_total[$schedule_id][-1] = $this->getGrade($max_mark, $exam_assessment_total[$schedule_id], $grade, 1);
                    }
                }
                $subjects[] = array(
                    'id'        => $subject->id,
                    'code'      => $subject->code,
                    'name'      => $subject->name,
                    'shortcode' => $subject->shortcode,
                    'marks'     => $marks
                );
            }

            foreach ($subjects as $index => $subject) {
                $unique = array_values(array_unique($subject['marks']));
                if (count($unique) === 1 && $unique[0] == '-') {
                    unset($subjects[$index]);
                }
            }

            $summary[$student_record->roll_number]['subjects'] = $subjects;
            $summary[$student_record->roll_number]['assessment_total'] = $assessment_total;
            $summary[$student_record->roll_number]['exam_assessment_total'] = $exam_assessment_total;
            $summary[$student_record->roll_number]['subject_assessment_total'] = $subject_assessment_total;
            $summary[$student_record->roll_number]['exam_total'] = $exam_total;

            $observation_params = array();
            $observation_enabled = 0;
            $observation_details = $batch->exam_observation_id ? $batch->observation->details : [];
            foreach ($observation_details as $detail) {
                $marks = array();
                foreach ($observation_header as $exam) {
                    $schedule = gv($exam, 'schedule');
                    $observation_marks = $schedule->observation_marks;
                    if ($schedule->observation_marks) {
                        $observation_enabled = 1;
                    }
                    $observation_mark = searchByKey($observation_marks, 'id', $student_record->id);
                    $obtained_marks = gv($observation_mark, 'observation_details', []);
                    $obtained_mark = searchByKey($obtained_marks, 'id', $detail->id);
                    $mark = gv($obtained_mark, 'ob', 0);

                    if (is_numeric($mark)) {
                        array_push($marks, $this->getGrade($mark, $detail->max_mark, $batch->grade));
                    } else {
                        array_push($marks, "");
                    }
                }

                if ($observation_enabled) {
                    $observation_params[] = array(
                        'id' => $detail->id,
                        'name' => $detail->name,
                        'marks' => $marks
                    );
                }
            }

            $last_date = (! $last_date) ? config('config.default_academic_session.end_date') : $last_date;
            $start_date = config('config.default_academic_session.start_date') >= toDate($student_record->date_of_entry) ? config('config.default_academic_session.start_date') : toDate($student_record->date_of_entry);
            $holidays = $this->holiday->filterBySession()->where('date', '<=', $last_date)->count();
            $working_days = dateDiff($start_date, $last_date);

            $attendances = $this->attendance->dateOfAttendanceBetween(['start_date' => $start_date, 'end_date' => $last_date])->whereBatchId($batch_id)->where(function ($q) {
                $q->where(function ($q1) {
                    $q1->whereNull('subject_id')->whereNull('session')->whereIsDefault(0);
                })->orWhere('is_default', 1);
            })->get();
            $working_days = $attendances->count();

            $total_absent = 0;
            foreach ($attendances as $attendance) {
                $absentees = $attendance->getAttendance('data');
                if (searchByKey($absentees, 'id', $student_record->id)) {
                    $total_absent++;
                }
            }

            $summary[$student_record->roll_number]['observation_term_header'] = $observation_term_header;
            $summary[$student_record->roll_number]['observation_header'] = $observation_header;
            $summary[$student_record->roll_number]['observation_params'] = $observation_params;
            $summary[$student_record->roll_number]['grade'] = isset($grade) ? $grade : null;
            $summary[$student_record->roll_number]['working_days'] = $working_days;
            $summary[$student_record->roll_number]['attendance'] = $working_days - $total_absent;
            $summary[$student_record->roll_number]['attendance_percentage'] = $working_days ? round((($working_days - $total_absent) / $working_days) * 100, 2) : 0;
        }
        // var_dump($summary[9]); exit;
        return compact('student_records', 'summary');
    }

    /**
     * Get headers for exam
     * @param  Exam $exams
     * @param  array  $header
     * @return array
     */
    private function getHeader($exams, $header = array())
    {
        foreach ($exams as $exam) {
            $schedule = $exam->schedules->first();

            if (! $schedule) {
                continue;
            }

            $assessment_details = $schedule->assessment->details->sortBy('position')->all();
            $grade = $schedule->grade;

            $show_subject_total = (count($assessment_details) > 1) ? true : true;

            $single_assessment_detail_id = $schedule->assessment->details->first()->id;
            /*if ($show_subject_total) {
                array_push($assessment_details, array(
                    'id'              => 0,
                    'name'            => trans('exam.total'),
                    'code'            => trans('exam.total_code'),
                    'position'        => 100,
                    'max_mark'        => $schedule->assessment->details->sum('max_mark'),
                    'pass_percentage' => 0
                ));
            }*/

            if ($show_subject_total) {
                array_push($assessment_details, array(
                    'id'              => 3,
                    'name'            => trans('exam.max_mark'),
                    'code'            => trans('exam.max_mark_code'),
                    'position'        => 101,
                    'is_max_mark'      => true,
                    'max_mark'        => $schedule->assessment->details->sum('max_mark'),
                    'pass_percentage' => 0
                ));
            }

            if ($grade) {
                array_push($assessment_details, array(
                    'id'              => -1,
                    'name'            => trans('exam.grade'),
                    'code'            => trans('exam.grade_code'),
                    'position'        => 102,
                    'is_grading'      => true,
                    'max_mark'        => $schedule->assessment->details->sum('max_mark'),
                    'pass_percentage' => 0
                ));
            }

            $records = $schedule->records;
            $header[] = array(
                'exam_id'            => $exam->id,
                'schedule_id'        => $schedule->id,
                'name'               => $exam->name,
                'records'            => $records,
                'grade'              => $grade,
                'assessment_details' => $assessment_details,
                'show_subject_total' => $show_subject_total,
                'single_assessment_detail_id' => $single_assessment_detail_id,
                'overall_pass_percentage' => $schedule->getOption('overall_pass_percentage'),
                'show_result' => $schedule->getOption('show_result')
            );
        }

        return $header;
    }

    /**
     * Get grade for given marks
     * @param  numeric $mark
     * @param  Grade $grade
     * @return string
     */
    private function getGrade($mark, $max_mark, $grade, $show = false)
    {
        if (! is_numeric($mark) || ! $max_mark || ! is_numeric($max_mark)) {
            return;
        }

        $percentage = round(formatNumber(($mark / $max_mark) * 100));

        $grade_detail = $grade->details->sortByDesc('min_percentage')->filter(function ($elem, $key) use ($percentage) {
            return $elem->min_percentage <= $percentage && $elem->max_percentage >= $percentage;
        })->first();

        if ($grade_detail) {
            return $grade_detail->name;
        }

        return;
    }

    /**
     * Get exam lists
     * @param  Batch $batch
     * @param  string $type
     * @return array
     */
    private function getExams($batch, $type = null)
    {
        if (! $batch->exam_observation_id) {
            return  [];
        }

        if ($type == 'term') {
            return $this->exam_term->with([
                'exams',
                'exams.schedules' => function ($q1) use ($batch) {
                    $q1->where('batch_id', $batch->id);
                }
            ])->filterBySession()->whereHas('exams', function ($q2) use ($batch) {
                $q2->whereHas('schedules', function ($q3) use ($batch) {
                    $q3->where('batch_id', $batch->id);
                });
            })->orderBy('position', 'asc')->get();
        } else {
            return $this->exam->whereNull('exam_term_id')->filterBySession()->with([
                'schedules' => function ($q1) use ($batch) {
                    $q1->where('batch_id', $batch->id);
                }
            ])->whereHas('schedules', function ($q2) use ($batch) {
                $q2->where('batch_id', $batch->id);
            })->orderBy('position', 'asc')->get();
        }
    }

    /**
     * Get topper list
     * @param  array  $params
     * @return array
     */
    public function topperReport($params = array())
    {
        $batch_id = gv($params, 'batch_id');
        $exam_id = gv($params, 'exam_id');

        if (\Auth::user()->hasAnyRole([config('system.default_role.student'), config('system.default_role.parent')])) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        if (! \Auth::user()->can('access-exam-report') && \Auth::user()->can('access-class-teacher-wise-exam-report')) {
            $class_teachers = $this->getClassTeachers($batch_id);

            if (! amIClassTeacherOnDate($class_teachers)) {
                throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
            }
        }

        $exam_schedule = $this->exam_schedule->with([
            'exam',
            'assessment',
            'assessment.details',
            'grade',
            'grade.details',
            'records' => function ($q) {
                $q->whereNotNull('date')->orderBy('date', 'asc');
            }
        ])->filterByExamId($exam_id)->filterByBatchId($batch_id)->first();

        if (! $exam_schedule) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_schedule')]);
        }
        
        $batch = $this->batch->findOrFail($batch_id);

        $batch->load('subjects');

        $last_date_of_exam = $exam_schedule->records->last()->date;
        $last_date_of_exam = toDate($last_date_of_exam);
        $student_records = $this->student_record->with('student', 'admission')->filterBySession()->filterbyBatchId($batch_id)->where('date_of_entry', '<=', $last_date_of_exam)->where(function ($q) use ($last_date_of_exam) {
            $q->where('date_of_exit', null)->orWhere(function ($q1) use ($last_date_of_exam) {
                $q1->where('date_of_exit', '!=', null)->where('date_of_exit', '>=', $last_date_of_exam);
            });
        })->get();

        $exam_assessment_details = $exam_schedule->assessment->details->sortBy('position');
        $subjects = $batch->subjects->sortBy('position');

        $header = array();
        $assessment_header = array();
        foreach ($subjects as $subject) {
            $record = $exam_schedule->records->where('date', '!=', null)->where('subject_id', $subject->id)->first();
            if ($record) {
                $header[] = array('name' => $subject->code, 'shortcode' => $subject->shortcode, 'colspan' => $exam_assessment_details->count());
            }
        }

        foreach ($exam_assessment_details as $exam_assessment_detail) {
            $assessment_header[] = $exam_assessment_detail->code;
        }

        $data = array();
        foreach ($student_records as $student_record) {
            $row = array();

            $student_total = 0;
            $max_mark = 0;
            foreach ($subjects as $subject) {
                $record = $exam_schedule->records->where('date', '!=', null)->where('subject_id', $subject->id)->first();
                if (! $record) {
                    continue;
                }

                $marks = $record->marks ? : [];
                $student_marks = searchByKey($marks, 'id', $student_record->id);
                $assessment_marks = gv($student_marks, 'assessment_details', []);
                $is_absent = gbv($student_marks, 'is_absent');
                $not_available = gbv($student_marks, 'not_available');

                foreach ($exam_assessment_details as $exam_assessment_detail) {
                    $assessment_detail_is_applicable = 1;
                    $assessment_detail_max_mark = $exam_assessment_detail->max_mark;

                    if ($record->getOption('assessment_details')) {
                        if ($exam_assessment_detail->id > 0) {
                            $assess_detail = searchByKey($record->getOption('assessment_details'), 'id', $exam_assessment_detail->id);
                            $assessment_detail_is_applicable = gbv($assess_detail, 'is_applicable');
                            if ($not_available) {
                                $assessment_detail_max_mark = 0;
                            } else {
                                $assessment_detail_max_mark = ($assessment_detail_is_applicable) ? gv($assess_detail, 'max_mark',0) : 0;
                            }
                        } else {
                            $assessment_detail_max_mark = 0;
                            if ($not_available) {
                                $assessment_detail_max_mark = 0;
                            } else {
                                foreach ($record->getOption('assessment_details') as $assess_detail) {
                                    $assessment_detail_max_mark += gbv($assess_detail, 'is_applicable') ? gv($assess_detail, 'max_mark', 0) : 0;
                                }
                            }
                        }
                    }

                    $max_mark += $assessment_detail_max_mark;

                    $obtained_mark = searchByKey($assessment_marks, 'id', $exam_assessment_detail->id);

                    if ($assessment_detail_is_applicable){
                        if ($is_absent) {
                            $mark = trans('exam.absent_code');
                        } else if($obtained_mark) {
                            $is_absent = gbv($obtained_mark, 'is_absent');
                            $mark = $is_absent ? config('exam.absent_code') : (float) gv($obtained_mark, 'ob', 0);
                        } else if($not_available) {
                            $mark = trans('exam.not_available_code');
                        } else {
                            $mark = '';
                        }
                    } else {
                        $mark = '-';
                    }

                    $student_total += (is_numeric($mark)) ? $mark : 0;

                    array_push($row, $mark);
                }
            }
                
            $data['rows'][] = array(
                'student' => $student_record->student->name,
                'admission_number' => $student_record->admission->admission_number,
                'marks' => $row,
                'total' => $student_total,
                'percentage' => ($max_mark) ? formatNumber(($student_total/$max_mark) * 100) : 0,
                'grade' => ($exam_schedule->grade) ? $this->getGrade($student_total, $max_mark, $exam_schedule->grade) : null
            );
        }

        array_multisort(array_column($data['rows'], 'total'), SORT_DESC, $data['rows']);

        $data['header'] = $header;
        $data['assessment_header'] = $assessment_header;
        $data['exam'] = $exam_schedule->exam->name;
        $data['batch'] = $batch->batch_with_course;
        $data['grade'] = $exam_schedule->grade ? true : false;

        return $data;
    }

    /**
     * Get student exam report
     * @param  string $student_uuid
     * @param  integer $student_record_id
     * @return array
     */
    public function studentExamReport($student_uuid, $student_record_id)
    {
        $query = $this->student_record->with('batch', 'batch.subjects')->filterBySession()->whereId($student_record_id);

        if (\Auth::user()->hasRole(config('system.default_role.student'))) {
            $query->whereHas('student', function($q) use($student_uuid) {
                $q->whereUuid($student_uuid)->whereId(\Auth::user()->Student->id);
            });
        } else if (\Auth::user()->hasRole(config('system.default_role.parent'))) {
            $query->whereHas('student', function($q) use($student_uuid) {
                $q->whereUuid($student_uuid)->whereIn('id', \Auth::user()->Parent->Students->pluck('id')->all());
            });
        } else {
            $query->whereHas('student', function($q) use($student_uuid) {
                $q->whereUuid($student_uuid);
            });
        }

        $student_record = $query->first();

        if (! $student_record) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
        }

        $exam_schedules = $this->exam_schedule->with('exam', 'records', 'assessment', 'assessment.details')->filterBySession()->whereBatchId($student_record->batch_id)->get();

        $rows = array();
        $header[] = array('key' => 'subject_name', 'label' => trans('academic.subject'), 'description' => '');
        foreach($exam_schedules as $index => $exam_schedule) {

            $exam_assessment_details = $exam_schedule->assessment->details->sortBy('position');

            $exam_total = 0;
            $exam_max_mark_total = 0;
            $columns = array();
            $no_exams = $exam_schedule->records->count();
            foreach ($student_record->batch->subjects as $subject_index => $subject) {
                if ($index === 0) {
                    $header[] = array('key' => 'subject_'.$subject->id, 'label' => $subject->name, 'description' => '');
                }

                if ($subject_index === 0) {
                    $columns[] = array('key' => 'exam_schedule_'.$exam_schedule->id, 'label' => $exam_schedule->exam->name, 'description' => '');
                }

                $record = $exam_schedule->records->where('date','!=',null)->where('subject_id', $subject->id)->first();

                if (! $record) {
                    $no_exams--;
                    $columns[] = array('key' => 'marks_'.$exam_schedule->id.'_'.$subject->id, 'label' => '-', 'description' => '');
                } else {

                    $marks = $record->marks ? : [];
                    $student_marks = searchByKey($marks, 'id', $student_record->id);
                    $assessment_marks = gv($student_marks, 'assessment_details', []);
                    $is_absent = gbv($student_marks, 'is_absent');
                    $not_available = gbv($student_marks, 'not_available');

                    $ob_marks = array();
                    $subject_total = 0;
                    $max_mark = 0;
                    $no_subject_exam = $exam_assessment_details->count();
                    foreach ($exam_assessment_details as $exam_assessment_detail) {
                        $assessment_detail_is_applicable = 1;
                        $assessment_detail_max_mark = $exam_assessment_detail->max_mark;

                        if ($record->getOption('assessment_details')) {
                            if ($exam_assessment_detail->id > 0) {
                                $assess_detail = searchByKey($record->getOption('assessment_details'), 'id', $exam_assessment_detail->id);
                                $assessment_detail_is_applicable = gbv($assess_detail, 'is_applicable');
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    $assessment_detail_max_mark = ($assessment_detail_is_applicable) ? gv($assess_detail, 'max_mark',0) : 0;
                                }
                            } else {
                                $assessment_detail_max_mark = 0;
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    foreach ($record->getOption('assessment_details') as $assess_detail) {
                                        $assessment_detail_max_mark += gbv($assess_detail, 'is_applicable') ? gv($assess_detail, 'max_mark', 0) : 0;
                                    }
                                }
                            }
                        }

                        $max_mark += $assessment_detail_max_mark;

                        $obtained_mark = searchByKey($assessment_marks, 'id', $exam_assessment_detail->id);

                        if ($assessment_detail_is_applicable){
                            if ($is_absent) {
                                $mark = trans('exam.absent_code');
                            } else if($obtained_mark) {
                                $is_absent = gbv($obtained_mark, 'is_absent');
                                $mark = $is_absent ? config('exam.absent_code') : (float) gv($obtained_mark, 'ob', 0);
                            } else if($not_available) {
                                $mark = trans('exam.not_available_code');
                            } else {
                                $mark = '';
                            }
                        } else {
                            $mark = '-';
                        }

                        $ob_marks[] = array(
                            'assessment_detail_name' => $exam_assessment_detail->name,
                            'assessment_detail_code' => $exam_assessment_detail->code,
                            'assessment_detail_max_mark' => $assessment_detail_max_mark,
                            'mark' => $mark
                        );
                        $subject_total += (is_numeric($mark)) ? $mark : 0;
                        $exam_total += (is_numeric($mark)) ? $mark : 0;
                        $exam_max_mark_total += $assessment_detail_max_mark;
                    }

                    if ($no_subject_exam === 0) {
                        $no_exams--;
                    }

                    $columns[] = array('key' => 'marks_'.$exam_schedule->id.'_'.$subject->id, 'label' => $subject_total, 'detail' => $ob_marks, 'description' => '');
                }
            }

            $columns[] = array('key' => 'total_'.$exam_schedule->id, 'label' => $exam_total.'/'.$exam_max_mark_total, 'detail' => '', 'no_exams' => ($no_exams === 0 ? 1 : 0), 'description' => '');
            $columns[] = array('key' => 'percentage_'.$exam_schedule->id, 'label' => ($exam_max_mark_total ? round(($exam_total / $exam_max_mark_total) * 100, 2) : ''), 'detail' => '', 'no_exams' => ($no_exams === 0 ? 1 : 0), 'description' => '');

            $rows[] = $columns;
        }

        $header[] = array('key' => 'total', 'label' => trans('general.total'), 'description' => '');
        $header[] = array('key' => 'percentage', 'label' => trans('exam.percentage'), 'description' => '');

        return compact('header', 'rows');
    }

    /**
     * Get exam wise consolidated list
     * @param  array  $params
     * @return array
     */
    public function examWiseReport($params = array())
    {
        $batch_id = gv($params, 'batch_id');
        $exam_id = gv($params, 'exam_id');

        if (\Auth::user()->hasAnyRole([config('system.default_role.student'), config('system.default_role.parent')])) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        if (! \Auth::user()->can('access-exam-report') && \Auth::user()->can('access-class-teacher-wise-exam-report')) {
            $class_teachers = $this->getClassTeachers($batch_id);

            if (! amIClassTeacherOnDate($class_teachers)) {
                throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
            }
        }

        $result = $this->class_teacher->filterByBatchId($batch_id)->first();
        if ($result->count() > 0) {
            $class_teacher_name = $result->employee->first_name. ' '. $result->employee->middle_name. ' '. $result->employee->last_name;
        } else {
            $class_teacher_name = '';
        }

        $exam_schedule = $this->exam_schedule->with([
            'exam',
            'assessment',
            'assessment.details',
            'grade',
            'grade.details',
            'records' => function($q) {
                $q->whereNotNull('date')->orderBy('date','asc');
            }
        ])->filterByExamId($exam_id)->filterByBatchId($batch_id)->first();

        if (! $exam_schedule) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_schedule')]);
        }
        
        $batch = $this->batch->findOrFail($batch_id);

        $batch->load('subjects');

        $last_date_of_exam = $exam_schedule->records->last()->date;
        $last_date_of_exam = toDate($last_date_of_exam);
        $student_records = $this->student_record->with('student','admission')->filterBySession()->filterbyBatchId($batch_id)->where('date_of_entry','<=', $last_date_of_exam)->where(function($q) use($last_date_of_exam) {
            $q->where('date_of_exit',null)->orWhere(function($q1) use($last_date_of_exam) {
                $q1->where('date_of_exit','!=',null)->where('date_of_exit','>=',$last_date_of_exam);
            });
        })->get()->sortBy('roll_number');
        $exam_assessment_details = $exam_schedule->assessment->details->sortBy('position');
        $subjects = $batch->subjects->sortBy('position');

        $data = array();
        foreach ($student_records as $student_record) {
            $rows = array();

            $student_total = 0;
            $max_mark = 0;
            $row = array();
            $header = array();
            foreach ($subjects as $subject) {
                $record = $exam_schedule->records->where('date','!=',null)->where('subject_id',$subject->id)->first();
                if (!$record) {
                    continue;
                } else {
                    $header[] = array('name' => $subject->code, 'shortcode' => $subject->shortcode);
                    $marks = $record->marks ? $record->marks : [];
                    $student_marks = searchByKey($marks, 'id', $student_record->id);
                    $assessment_marks = gv($student_marks, 'assessment_details', []);
                    $is_absent = gbv($student_marks, 'is_absent');
                    $not_available = gbv($student_marks, 'not_available');

                    $subject_total = 0;
                    $subject_max_mark_total = 0;
                    $assessment_header = array();
                    foreach ($exam_assessment_details as $exam_assessment_detail) {
                        $assessment_header[] = $exam_assessment_detail->code;
                        $assessment_detail_is_applicable = 1;
                        $assessment_detail_max_mark = $exam_assessment_detail->max_mark;

                        if ($record->getOption('assessment_details')) {
                            if ($exam_assessment_detail->id > 0) {
                                $assess_detail = searchByKey($record->getOption('assessment_details'), 'id', $exam_assessment_detail->id);
                                $assessment_detail_is_applicable = gbv($assess_detail, 'is_applicable');
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    $assessment_detail_max_mark = ($assessment_detail_is_applicable) ? gv($assess_detail, 'max_mark',0) : 0;
                                }
                            } else {
                                $assessment_detail_max_mark = 0;
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    foreach ($record->getOption('assessment_details') as $assess_detail) {
                                        $assessment_detail_max_mark += gbv($assess_detail, 'is_applicable') ? gv($assess_detail, 'max_mark', 0) : 0;
                                    }
                                }
                            }
                        } else {
                            $assessment_detail_max_mark = 0;
                        }

                        $max_mark += $assessment_detail_max_mark;
                        $subject_max_mark_total += $assessment_detail_max_mark;

                        $obtained_mark = searchByKey($assessment_marks, 'id', $exam_assessment_detail->id);

                        if ($assessment_detail_is_applicable){
                            if ($is_absent) {
                                $mark = trans('exam.absent_code');
                            } else if($obtained_mark) {
                                $is_absent = gbv($obtained_mark, 'is_absent');
                                $mark = $is_absent ? config('exam.absent_code') : (float) gv($obtained_mark, 'ob', 0);
                            } else if($not_available) {
                                $mark = trans('exam.not_available_code');
                            } else {
                                $mark = '';
                            }
                        } else {
                            $mark = '-';
                        }
                        $subject_total += (is_numeric($mark)) ? $mark : 0;
                        $student_total += (is_numeric($mark)) ? $mark : 0;

                        array_push($row, $mark);
                    }
                    array_push($rows, array('code' => $subject->code, 'shortcode' => $subject->shortcode, 'mark' => $subject_total, 'max_mark' => $subject_max_mark_total));
                }
            }
                    
            $percentage = ($max_mark) ? formatNumber(($student_total/$max_mark) * 100) : 0;
            $grade = ($exam_schedule->grade) ? $student_total ? $this->getGrade($student_total, $max_mark, $exam_schedule->grade) : null : null;

            $subject_wise_total = array();
            $subject_wise_max_total = array();
            $subject_wise_grade = array();
            foreach ($subjects as $subject) {
                $record = $exam_schedule->records->where('date','!=',null)->where('subject_id',$subject->id)->first();
                if ($record) {
                    $subject_wise_total[$subject->code] = 0;
                    $subject_wise_max_total[$subject->code] = 0;
                    $subject_wise_grade[$subject->code] = null;
                }
            }
            $is_total = 0;
            foreach ($rows as $mark) {
                $obtained_mark1 = gv($mark, 'mark');
                $max_mark1 = gv($mark, 'max_mark');
                $subject_wise_total[gv($mark, 'code')] += (is_numeric($obtained_mark1)) ? $obtained_mark1 : 0;
                $subject_wise_max_total[gv($mark, 'code')] += (is_numeric($max_mark1) && is_numeric($obtained_mark1)) ? $max_mark1 : 0;
                if ($subject_wise_total[gv($mark, 'code')]) {
                    $is_total = 1;
                }
            }   
            $is_grade = 0; 
            foreach ($subjects as $subject) {
                $record = $exam_schedule->records->where('date','!=',null)->where('subject_id',$subject->id)->first();
                if ($record) {
                    $subject_wise_grade[$subject->code] = $exam_schedule->grade && $subject_wise_total[$subject->code] ? $this->getGrade($subject_wise_total[$subject->code], $subject_wise_max_total[$subject->code], $exam_schedule->grade) : null;
                    if ($subject_wise_grade[$subject->code]) {
                        $is_grade = 1;
                    }
                }
            }

            $data['rows'][] = array(
                'roll_number' => $student_record->roll_number,
                'student' => $student_record->student->name,
                'admission_number' => $student_record->admission->admission_number,
                'marks' => $row,
                'rowspan' => count($assessment_header) + $is_total + $is_grade,
                'total' => $student_total,
                'max_mark'   => $max_mark,
                'percentage' => $percentage,
                'grade' => $grade,
                'subject_wise_total' => $subject_wise_total,
                'subject_wise_max_total' => $subject_wise_max_total,
                'subject_wise_grade' => $subject_wise_grade,
                'is_total' => $is_total,
                'is_grade' => $is_grade,
            );
        }

        array_multisort(array_column($data['rows'], 'roll_number'), SORT_ASC, $data['rows']);

        $data['header'] = $header;
        $data['class_teacher_name'] = $class_teacher_name;
        $data['assessment_header'] = $assessment_header;
        $data['exam'] = $exam_schedule->exam->name;
        $data['batch'] = $batch->batch_with_course;
        $data['grade'] = $exam_schedule->grade ? true : false;
        return $data;
    }

    /**
     * Get term wise consolidated list
     * @param  array  $params
     * @return array
     */
    public function termWiseReport($params = array())
    {
        $batch_id = gv($params, 'batch_id');
        $exam_term_id = gv($params, 'exam_term_id');

        if (\Auth::user()->hasAnyRole([config('system.default_role.student'), config('system.default_role.parent')])) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        if (! \Auth::user()->can('access-exam-report') && \Auth::user()->can('access-class-teacher-wise-exam-report')) {
            $class_teachers = $this->getClassTeachers($batch_id);

            if (! amIClassTeacherOnDate($class_teachers)) {
                throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
            }
        }

        $result = $this->class_teacher->filterByBatchId($batch_id)->first();
        if ($result->count() > 0) {
            $class_teacher_name = $result->employee->first_name. ' '. $result->employee->middle_name. ' '. $result->employee->last_name;
        } else {
            $class_teacher_name = '';
        }

        $exam_schedules = $this->exam_schedule->with([
            'exam',
            'exam.term',
            'assessment',
            'assessment.details',
            'grade',
            'grade.details',
            'records' => function($q) {
                $q->whereNotNull('date')->orderBy('date','asc');
            }
        ])->whereHas('exam', function($q) use($exam_term_id) {
            $q->where('exam_term_id', $exam_term_id);
        })->filterByBatchId($batch_id)->get();

        if (! $exam_schedules) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_schedule')]);
        }

        $exam_term = $this->exam_term->find($exam_term_id);
        
        $batch = $this->batch->findOrFail($batch_id);

        $batch->load('subjects');

        $student_records = $this->student_record->with('student','admission')->filterBySession()->filterbyBatchId($batch_id)->get()->sortBy('roll_number');

        $subjects = $batch->subjects->sortBy('position');

        $header = array();
        foreach ($subjects as $subject) {
            $header[] = array('name' => $subject->code, 'shortcode' => $subject->shortcode);
        }

        $data = array();
        foreach ($student_records as $student_record) {
            $exam_rows = array();
            $exam_row = array();
            $is_total = 0;
            $is_grade = 0;
            foreach ($exam_schedules as $exam_schedule) {

                $student_total = 0;
                $max_mark = 0;

                $exam_name = $exam_schedule->exam->name;
                $rows = array();
                // $row = array();
                
                foreach ($subjects as $subject) {
                    $record = $exam_schedule->records->where('date','!=',null)->where('subject_id',$subject->id)->first();
                    if (!$record) {
                        array_push($rows, array('code' => $subject->code, 'shortcode' => $subject->shortcode, 'mark' => '-'));
                        continue;
                    }
                    $marks = $record->marks ? : [];
                    $student_marks = searchByKey($marks, 'id', $student_record->id);
                    $assessment_marks = gv($student_marks, 'assessment_details', []);
                    $is_absent = gbv($student_marks, 'is_absent');
                    $not_available = gbv($student_marks, 'not_available');

                    $exam_assessment_details = $exam_schedule->assessment->details->sortBy('position');
                    $subject_total = 0;
                    $subject_max_mark_total = 0;
                    $assessment_header = array();

                    foreach ($exam_assessment_details as $exam_assessment_detail) {
                        $assessment_header[] = $exam_assessment_detail->code;
                        $assessment_detail_is_applicable = 1;
                        $assessment_detail_max_mark = $exam_assessment_detail->max_mark;

                        if ($record->getOption('assessment_details')) {
                            if ($exam_assessment_detail->id > 0) {
                                $assess_detail = searchByKey($record->getOption('assessment_details'), 'id', $exam_assessment_detail->id);
                                $assessment_detail_is_applicable = gbv($assess_detail, 'is_applicable');
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    $assessment_detail_max_mark = ($assessment_detail_is_applicable) ? gv($assess_detail, 'max_mark',0) : 0;
                                }
                            } else {
                                $assessment_detail_max_mark = 0;
                                if ($not_available) {
                                    $assessment_detail_max_mark = 0;
                                } else {
                                    foreach ($record->getOption('assessment_details') as $assess_detail) {
                                        $assessment_detail_max_mark += gbv($assess_detail, 'is_applicable') ? gv($assess_detail, 'max_mark', 0) : 0;
                                    }
                                }
                            }
                        }

                        $max_mark += $assessment_detail_max_mark;
                        $subject_max_mark_total += $assessment_detail_max_mark;

                        $obtained_mark = searchByKey($assessment_marks, 'id', $exam_assessment_detail->id);

                        if ($assessment_detail_is_applicable){
                            if ($is_absent) {
                                $mark = trans('exam.absent_code');
                            } else if($obtained_mark) {
                                $is_absent = gbv($obtained_mark, 'is_absent');
                                $mark = $is_absent ? config('exam.absent_code') : (float) gv($obtained_mark, 'ob', 0);
                            } else if($not_available) {
                                $mark = trans('exam.not_available_code');
                            } else {
                                $mark = '';
                            }
                        } else {
                            $mark = '-';
                        }

                        $student_total += (is_numeric($mark)) ? $mark : 0;
                        $subject_total += (is_numeric($mark)) ? $mark : 0;
                        // array_push($row, $mark);
                    }
                    array_push($rows, array('code' => $subject->code, 'shortcode' => $subject->shortcode, 'mark' => $subject_total, 'max_mark' => $subject_max_mark_total));

                }
                
                $percentage = ($max_mark) ? formatNumber(($student_total/$max_mark) * 100) : 0;
                $grade = ($exam_schedule->grade) ? $student_total ? $this->getGrade($student_total, $max_mark, $exam_schedule->grade) : null : null;
                $subject_wise_total = array();
                $subject_wise_max_total = array();
                $subject_wise_grade = array();
                foreach ($subjects as $key => $subject) {
                    $subject_wise_total[$subject->code] = 0;
                    $subject_wise_max_total[$subject->code] = 0;
                    $subject_wise_grade[$subject->code] = null;
                }
                $is_total = 0;
                foreach ($rows as $mark) {
                    $obtained_mark1 = gv($mark, 'mark');
                    $max_mark1 = gv($mark, 'max_mark');
                    $subject_wise_total[gv($mark, 'code')] += (is_numeric($obtained_mark1)) ? $obtained_mark1 : 0;
                    $subject_wise_max_total[gv($mark, 'code')] += (is_numeric($max_mark1) && is_numeric($obtained_mark1)) ? $max_mark1 : 0;
                    if ($subject_wise_total[gv($mark, 'code')]) {
                        $is_total = 1;
                    }
                }   
                $is_grade = 0; 
                foreach ($subjects as $key => $subject) {
                    $subject_wise_grade[$subject->code] = $exam_schedule->grade && $subject_wise_total[$subject->code] ? $this->getGrade($subject_wise_total[$subject->code], $subject_wise_max_total[$subject->code], $exam_schedule->grade) : null;
                    if ($subject_wise_grade[$subject->code]) {
                        $is_grade = 1;
                    }
                }
                $exam_rows[] = array(
                    'exam_name'  => $exam_name,
                    'marks'      => $rows,
                    'total'      => $student_total,
                    'max_mark'   => $max_mark,
                    'percentage' => $percentage,
                    'grade'      => $grade,
                    'subject_wise_total' => $subject_wise_total,
                    'subject_wise_max_total' => $subject_wise_max_total,
                    'subject_wise_grade' => $subject_wise_grade,
                );
            }

            $exams_wise_total = array();
            $exams_wise_max_total = array();
            $exams_wise_grade = array();
            $grand_total = 0;
            $grand_max_mark = 0;
            $grand_percentage = 0;
            foreach ($subjects as $key => $subject) {
                $exams_wise_total[$subject->code] = 0;
                $exams_wise_max_total[$subject->code] = 0;
                $exams_wise_grade[$subject->code] = null;
            }

            foreach ($exam_rows as $exam_row) {
                $grand_total += gv($exam_row, 'total');
                $grand_max_mark += gv($exam_row, 'max_mark');
                foreach (gv($exam_row, 'marks', []) as $mark) {
                    $obtained_mark = gv($mark, 'mark');
                    $max_mark = gv($mark, 'max_mark');
                    $exams_wise_total[gv($mark, 'code')] += (is_numeric($obtained_mark)) ? $obtained_mark : 0;
                    $exams_wise_max_total[gv($mark, 'code')] += (is_numeric($max_mark) && is_numeric($obtained_mark)) ? $max_mark : 0;
                }
            }
            foreach ($exam_schedules as $exam_schedule) {
                foreach ($subjects as $key => $subject) {
                    $exams_wise_grade[$subject->code] = $exam_schedule->grade && $exams_wise_total[$subject->code] ? $this->getGrade($exams_wise_total[$subject->code], $exams_wise_max_total[$subject->code], $exam_schedule->grade) : null;
                }
            }

            $grand_percentage = ($grand_max_mark) ? formatNumber(($grand_total/$grand_max_mark) * 100) : 0;
            
            $data['rows'][] = array(
                'roll_number' => $student_record->roll_number,
                'student' => $student_record->student->name,
                'rowspan' => $exam_schedules->count(),
                'ah_rowspan' => 2,
                'admission_number' => $student_record->admission->admission_number,
                'exam_rows' => $exam_rows,
                'exams_wise_total' => $exams_wise_total,
                'exams_wise_max_total' => $exams_wise_max_total,
                'grand_total' => $grand_total,
                'grand_max_mark' => $grand_max_mark,
                'grand_percentage' => $grand_percentage,
                'exams_wise_grade' => $exams_wise_grade
            );
        }

        array_multisort(array_column($data['rows'], 'roll_number'), SORT_ASC, $data['rows']);

        $data['header'] = $header;
        $data['class_teacher_name'] = $class_teacher_name;
        $data['exam_term'] = $exam_term->name;
        $data['batch'] = $batch->batch_with_course;
        return $data;
    }
}
