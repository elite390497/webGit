<?php
namespace App\Repositories\Exam;
ini_set('max_execution_time', 0);

use Illuminate\Support\Str;
use App\Models\Student\StudentRecord;
use App\Models\Academic\SubjectTeacher;
use App\Repositories\Exam\ExamRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Academic\CourseGroup;
use App\Models\Configuration\Exam\Grade as ExamGrade;
use App\Models\Configuration\Exam\Assessment as ExamAssessment;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class ReportAnalysisRepository
{
    protected $course_group;
    protected $exam_assessment;
    protected $exam_grade;
    protected $subject_teacher;
    protected $student_record;
    protected $course_group_repository;
    protected $exam;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CourseGroup $course_group,
        ExamAssessment $exam_assessment,
        ExamGrade $exam_grade,
        SubjectTeacher $subject_teacher,
        StudentRecord $student_record,
        CourseGroupRepository $course_group_repository,
        ExamRepository $exam
    ) {
        $this->course_group = $course_group;
        $this->exam_assessment = $exam_assessment;
        $this->exam_grade = $exam_grade;
        $this->subject_teacher = $subject_teacher;
        $this->student_record = $student_record;
        $this->course_group_repository = $course_group_repository;
        $this->exam = $exam;
    }

    /**
     * Get pre requisite
     * @return array
     */
    public function getPreRequisite()
    {
        $course_groups = $this->course_group_repository->selectAll();

        $batches = $this->course_group_repository->getBatchOption();

        $exams = $this->exam->selectAll();

        $types = array(
            array('text' => 'Course Group Wise', 'value' => 'course-group-wise'),
            array('text' => 'Batch Wise', 'value' => 'batch-wise'),
            array('text' => 'Exam Wise', 'value' => 'exam-wise')
        );

        $employee_code = null;
        $students = [];
        if (\Auth::user()->hasAnyRole([
            config('system.default_role.admin'),
            config('system.default_role.principal'),
            config('system.default_role.manager'),
        ])) {

        } else if (\Auth::user()->hasRole(config('system.default_role.student'))) {
            $student = \Auth::user()->Student;
            $student_records = $this->student_record->with('admission', 'batch', 'batch.course')->whereStudentId($student->id)->filterBySession()->whereNull('date_of_exit')->get();

            foreach ($student_records as $student_record) {
                array_push($students, array(
                    'name' => $student->name,
                    'batch' => $student_record->batch->course->name.' '.$student_record->batch->name,
                    'admission_number' => $student_record->admission->admission_number
                ));
            }

        } else if (\Auth::user()->hasRole(config('system.default_role.parent'))) {
            $student_ids = \Auth::user()->Parent->Students->pluck('id')->all();;

            $student_records = $this->student_record->with('admission','student','batch','batch.course')->whereIn('student_id', $student_ids)->filterBySession()->whereNull('date_of_exit')->get();

            foreach ($student_records as $student_record) {
                array_push($students, array(
                    'id' => Str::random(10),
                    'name' => $student_record->student->name,
                    'batch' => $student_record->batch->course->name.' '.$student_record->batch->name,
                    'admission_number' => $student_record->admission->admission_number
                ));
            }

        } else {
            $employee_code = \Auth::user()->Employee->employee_code;
        }

        return compact('course_groups', 'batches', 'exams', 'types', 'employee_code', 'students');
    }

    /**
     * Export exam report
     *
     * @return Array
     */
    public function export()
    {
        if (! config('config.default_academic_session.options.exam_report_analysis')) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $type = request('type');

        if (! in_array($type, ['course-group-wise', 'batch-wise', 'exam-wise'])) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $batch_id = request('batch_id');
        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $course_groups = $this->course_group->with([
            'courses',
            'courses.batches' => function($q) use($batch_id) {
                if (request('type') === 'batch-wise') {
                    $q->whereIn('id', $batch_id)->orderBy('position','asc');
                } else {
                    $q->orderBy('position','asc');
                }
            } ,
            'courses.batches.schedules' => function($q) {
                if (request('type') === 'exam-wise') {
                    $q->where('exam_id', request('exam_id'));
                } else {
                    $q->where('exam_id','!=',null);
                }
            },
            'courses.batches.schedules.exam',
            'courses.batches.schedules.exam.term',
            'courses.batches.schedules.records',
            'courses.batches.schedules.records.subject',
        ])->filterBySession()->when($type, function($query, $type) {
            if ($type === 'course-group-wise') {
                $course_group_id = request('course_group_id');
                $course_group_id = is_array($course_group_id) ? $course_group_id : ($course_group_id ? explode(',', $course_group_id) : []);

                return $query->whereIn('id', $course_group_id);
            }
        })->get();

        $student_records = $this->student_record->with('student','admission')->filterBySession()->get();
        $subject_teachers = $this->subject_teacher->with('employee')->where('date_effective', '>=', config('config.default_academic_session.start_date'))->where('date_effective', '<=', config('config.default_academic_session.end_date'))->orderBy('date_effective', 'desc')->get();

        $exam_assessments = $this->exam_assessment->with('details')->filterBySession()->get();

        $exam_grades = $this->exam_grade->with('details')->filterBySession()->get();

        $data = array();
        array_push($data, array(
            'Session',
            'School',
            'Compartment',
            'Term',
            'Exam',
            'Class',
            'Section',
            'Teacher',
            'Teacher Code',
            'Subject',
            'Subject Group',
            'Admission No',
            'Roll No',
            'Student Name',
            'Mark',
            'Grade',
            'Leave'
        ));

        foreach ($course_groups as $course_group) {

            foreach ($course_group->courses as $course) {
                foreach ($course->batches as $batch) {

                    $batch_student_records = $student_records->where('batch_id', $batch->id);

                    foreach($batch->schedules as $schedule) {
                        $exam_assessment = $exam_assessments->firstWhere('id', $schedule->exam_assessment_id);
                        $exam_grade = $exam_grades->firstWhere('id', $schedule->exam_grade_id);

                        $exam_term_name = $schedule->exam->exam_term_id ? $schedule->exam->term->name : '';
                        $exam_name = $schedule->exam ? $schedule->exam->name : '';

                        foreach ($schedule->records as $record) {
                            $marks = $record->marks ? : [];

                            $subject_name = $record->subject->name;
                            $subject_group = $record->subject->getOption('group') ? : $record->subject->name;

                            if ($record->date) {
                                $subject_teacher = $subject_teachers->where('date_effective','<=',$record->date)->where('subject_id', $record->subject_id)->first();
                                $subject_teacher_name = $subject_teacher ? $subject_teacher->employee->name : '';
                                $subject_teacher_code = $subject_teacher ? $subject_teacher->employee->employee_code : '';
                            } else {
                                $subject_teacher_name = '';
                                $subject_teacher_code = '';
                            }
                            

                            foreach ($marks as $mark) {

                                $row = array();
                                array_push($row, config('config.default_academic_session.name'));
                                array_push($row, config('config.institute_name'));
                                array_push($row, $course_group->name);
                                array_push($row, $exam_term_name);
                                array_push($row, $exam_name);
                                array_push($row, $course->name);
                                array_push($row, $batch->name);
                                array_push($row, $subject_teacher_name);
                                array_push($row, $subject_teacher_code);
                                array_push($row, $subject_name);
                                array_push($row, $subject_group);

                                $student_record_id = gv($mark, 'id');

                                $student_record = $batch_student_records->firstWhere('id', $student_record_id);

                                if (! $student_record) {
                                    continue;
                                }

                                $student_name = $student_record->student->name;
                                $student_admission_number = $student_record->admission->admission_number;
                                $student_roll_number = $student_record->full_roll_number;

                                array_push($row, $student_admission_number);
                                array_push($row, $student_roll_number);
                                array_push($row, $student_name);

                                $is_absent = gbv($mark, 'is_absent');

                                if (! $is_absent) {
                                    $mark_assessment_details = gv($mark, 'assessment_details', []);
                                    $obtained_mark = 0;
                                    $max_mark = 0;
                                    foreach ($mark_assessment_details as $mark_assessment_detail) {
                                        $exam_assessment_detail = $exam_assessment->details->firstWhere('id', gv($mark_assessment_detail, 'id'));

                                        $max_mark += $exam_assessment_detail ? $exam_assessment_detail->max_mark : 0;
                                        $obtained_mark += is_numeric(gv($mark_assessment_detail, 'ob')) ? gv($mark_assessment_detail, 'ob') : 0;
                                    }

                                    $percentage = $max_mark ? round((($obtained_mark/$max_mark) * 100), 2) : 0;
                                    $exam_grade_detail = $exam_grade ? $exam_grade->details->where('min_percentage','<=',$percentage)->where('max_percentage','>=',$percentage)->first() : null;

                                    $grade = $exam_grade_detail ? $exam_grade_detail->name : '';

                                    array_push($row, $percentage);
                                    array_push($row, $grade);
                                    array_push($row, '');

                                } else {
                                    array_push($row, '');
                                    array_push($row, '');
                                    array_push($row, 'Yes');
                                }

                                $data[] = $row;
                            }
                        }
                    }
                }
            }
        }

        return $data;
    }
}