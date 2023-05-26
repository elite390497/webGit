<?php

namespace App\Http\Controllers\Exam;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Exam\Schedule;
use App\Http\Controllers\Controller;
use App\Models\Student\StudentRecord;
use App\Http\Requests\Exam\ScheduleRequest;
use App\Repositories\Exam\ScheduleRepository;

class ScheduleController extends Controller
{
    protected $request;
    protected $repo;
    protected $student_record;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        ScheduleRepository $repo,
        StudentRecord $student_record
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
        $this->student_record = $student_record;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/exam/schedule/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Schedule::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Exam Schedules
     * @get ("/api/exam/schedule")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Schedule::class);

        $exam_schedules = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->ok(compact('exam_schedules', 'filters'));
    }

    /**
     * Used to print all Exam Schedules
     * @post ("/api/exam/schedule/print")
     * @return Response
     */
    public function print()
    {
        $exam_schedules = $this->repo->print(request('filter'));

        return view('print.exam.schedule', compact('exam_schedules'))->render();
    }

    /**
     * Used to generate pdf all Exam Schedules
     * @post ("/api/exam/pdf")
     * @return Response
     */
    public function pdf()
    {
        $exam_schedules = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.exam.schedule', compact('exam_schedules'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to print admit card
     * @post ("/api/exam/schedule/{id}/admit-card/print")
     * @return Response
     */
    public function printAdmitCard($id)
    {
        $this->authorize('list', Schedule::class);

        $exam_schedule = $this->repo->findOrFail($id);

        $first_day_of_exam = $exam_schedule->records->where('date','!=',null)->sortBy('date')->first()->date;

        $student_records = $this->student_record->with('student','student.parent','admission','batch','batch.course','studentFeeRecords','studentFeeRecords.feeInstallment')->whereBatchId($exam_schedule->batch_id)->where(function($q) {
                $q->whereNull('date_of_exit')->orWhere('date_of_exit','>',today());
            })->select('student_records.*', \DB::raw('(SELECT concat_ws(" ", first_name,middle_name,last_name) FROM students WHERE student_records.student_id = students.id ) as name'))->orderBy('name','asc')->simplePaginate(10);

        $print_options = array();

        return view('print.exam.admit_card', compact('exam_schedule','student_records','first_day_of_exam','print_options'));
    }

    /**
     * Used to store Exam Schedule
     * @post ("/api/exam/schedule")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch"),
     *      @Parameter("exam_id", type="integer", required="true", description="Id of Exam"),
     *      @Parameter("exam_grade_id", type="integer", required="true", description="Id of Exam Grade"),
     *      @Parameter("records", type="array", required="required", description="Array of Subjects")
     * })
     * @return Response
     */
    public function store(ScheduleRequest $request)
    {
        $this->authorize('create', Schedule::class);

        $exam = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('exam.exam_added')]);
    }

    /**
     * Used to get Exam Schedule detail
     * @get ("/api/exam/schedule/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Schedule"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Schedule::class);

        $exam_schedule = $this->repo->findOrFail($id);

        $exam_name = $exam_schedule->exam->name;

        if ($exam_schedule->exam->exam_term_id) {
            $exam_name .= ' ('.$exam_schedule->exam->term->courseGroup->name.')';
        }

        $selected_exam = array(
            'id' => $exam_schedule->exam_id,
            'name' => $exam_name,
            'course_group_id' => $exam_schedule->exam->exam_term_id ? $exam_schedule->exam->term->course_group_id : null,
            'course_group_name' => $exam_schedule->exam->exam_term_id ? $exam_schedule->exam->term->courseGroup->name : null
        );

        return $this->success(compact('exam_schedule','selected_exam'));
    }

    /**
     * Used to update Exam Schedule
     * @patch ("/api/exam/schedule/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Schedule"),
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch"),
     *      @Parameter("exam_id", type="integer", required="true", description="Id of Exam"),
     *      @Parameter("exam_grade_id", type="integer", required="true", description="Id of Exam Grade"),
     *      @Parameter("records", type="array", required="required", description="Array of Subjects")
     * })
     * @return Response
     */
    public function update($id, ScheduleRequest $request)
    {
        $this->authorize('update', Schedule::class);

        $exam_schedule = $this->repo->findOrFail($id);

        $exam_schedule = $this->repo->update($exam_schedule, $this->request->all());

        return $this->success(['message' => trans('exam.schedule_updated')]);
    }

    /**
     * Used to delete Exam Schedule
     * @delete ("/api/exam/schedule/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Schedule"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Schedule::class);

        $exam_schedule = $this->repo->deletable($id);

        $this->repo->delete($exam_schedule);

        return $this->success(['message' => trans('exam.schedule_deleted')]);
    }
}