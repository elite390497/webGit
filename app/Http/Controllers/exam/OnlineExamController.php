<?php

namespace App\Http\Controllers\Exam;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Exam\OnlineExam;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\QuestionRequest;
use App\Http\Requests\Exam\OnlineExamRequest;
use App\Repositories\Exam\OnlineExamRepository;

class OnlineExamController extends Controller
{
    protected $request;
    protected $repo;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        OnlineExamRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/online-exam/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', OnlineExam::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Online Exams
     * @get ("/api/online-exam")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', OnlineExam::class);

        $online_exams = $this->repo->paginate($this->request->all());
        $filters = $this->repo->getFilters();

        return $this->ok(compact('online_exams', 'filters'));
    }

    /**
     * Used to print all Online Exams
     * @post ("/api/online-exam/print")
     * @return Response
     */
    public function print()
    {
        $online_exams = $this->repo->print(request('filter'));

        return view('print.exam.online_exam', compact('online_exams'))->render();
    }

    /**
     * Used to generate pdf all Online Exams
     * @post ("/api/online-exam/pdf")
     * @return Response
     */
    public function pdf()
    {
        $online_exams = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.exam.exam', compact('online_exams'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Exam
     * @post ("/api/online-exam")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Online Exam"),
     *      @Parameter("description", type="text", required="optional", description="Description of Online Exam")
     * })
     * @return Response
     */
    public function store(OnlineExamRequest $request)
    {
        $this->authorize('create', OnlineExam::class);

        $online_exam = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('exam.online_exam_added')]);
    }

    /**
     * Used to get Online Exam detail
     * @get ("/api/online-exam/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', OnlineExam::class);

        $online_exam = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAvailableToStudentAndParent($online_exam);

        $start_time = [
                'hour' => ($online_exam->start_time) ? date('h', strtotime($online_exam->start_time)) : '',
                'minute' => ($online_exam->start_time) ? date('i', strtotime($online_exam->start_time)) : '',
                'meridiem' => ($online_exam->start_time) ? date('a', strtotime($online_exam->start_time)) : ''
            ];

        $end_time = [
                'hour' => ($online_exam->end_time) ? date('h', strtotime($online_exam->end_time)) : '',
                'minute' => ($online_exam->end_time) ? date('i', strtotime($online_exam->end_time)) : '',
                'meridiem' => ($online_exam->end_time) ? date('a', strtotime($online_exam->end_time)) : ''
            ];

        $selected_batch = array('id' => $online_exam->batch_id, 'name' => $online_exam->batch->course->name.' '.$online_exam->batch->name);
        $selected_subject = array('id' => $online_exam->subject_id, 'name' => $online_exam->subject->name.' ('.$online_exam->subject->code.')');

        $students = [];

        if (request('student')) {
            $students = $this->repo->getStudents($online_exam);
        }

        return $this->success(compact('online_exam','start_time','end_time','selected_batch','selected_subject','students'));
    }

    /**
     * Used to get Online Exam for exam
     * @get ("/api/online-exam/{uuid}/exam")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function exam($uuid)
    {
        $online_exam = $this->repo->findSummaryByUuidOrFail($uuid);

        $this->authorize('exam', $online_exam);

        $questions = $this->repo->getOnlineExamQuestions($online_exam);
        $end_time = Carbon::parse(toDate($online_exam->date).' '.$online_exam->end_time);
        $countdown = abs($end_time->diffInSeconds(Carbon::now(), false) * 1000);

        $online_exam_record = $this->repo->getOnlineExamRecord($online_exam);
        $is_final_submitted = optional($online_exam_record)->end ? true : false;

        return $this->success(compact('online_exam','questions', 'countdown', 'online_exam_record','is_final_submitted'));
    }

    /**
     * Used to get Online Exam report
     * @get ("/api/online-exam/{uuid}/exam/{id}")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     *      @Parameter("id", type="integer", required="true", description="Id of Online Exam Record"),
     * })
     * @return Response
     */
    public function getExam($uuid, $id)
    {
        $online_exam = $this->repo->findSummaryByUuidOrFail($uuid);

        $this->authorize('getExam', $online_exam);

        $questions = $this->repo->getOnlineExamQuestions($online_exam);

        $online_exam_record = $this->repo->getOnlineExamRecordById($online_exam, $id);

        return $this->success(compact('online_exam','questions', 'online_exam_record'));
    }

    /**
     * Used to submit question in Online Exam
     * @post ("/api/online-exam/{uuid}/exam")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function storeExam($uuid)
    {
        $online_exam = $this->repo->findSummaryByUuidOrFail($uuid);

        $this->authorize('exam', $online_exam);

        $this->repo->storeExam($online_exam, $this->request->all());

        $message = (request('is_final')) ? trans('exam.online_exam_finished') : trans('exam.online_exam_saved');

        return $this->success(['message' => $message]);
    }

    /**
     * Used to update Online Exam
     * @patch ("/api/online-exam/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     *      @Parameter("name", type="string", required="true", description="Name of Online Exam"),
     *      @Parameter("description", type="text", required="optional", description="Description of Online Exam")
     * })
     * @return Response
     */
    public function update($uuid, OnlineExamRequest $request)
    {
        $this->authorize('update', OnlineExam::class);

        $online_exam = $this->repo->findByUuidOrFail($uuid);

        $online_exam = $this->repo->update($online_exam, $this->request->all());

        return $this->success(['message' => trans('exam.online_exam_updated')]);
    }

    /**
     * Used to delete Online Exam
     * @delete ("/api/online-exam/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', OnlineExam::class);

        $online_exam = $this->repo->deletable($uuid);

        $this->repo->delete($online_exam);

        return $this->success(['message' => trans('exam.online_exam_deleted')]);
    }

    /**
     * Used to upload question image
     * @post ("/api/online-exam/question/image")
     * @param ({
     *      @Parameter("image", type="image", required="true", description="Image to be uploaded"),
     * })
     * @return Response
     */
    public function uploadQuestionImage()
    {
        $file = \Storage::disk('public')->putFile('online-exam-question-image', request()->file('image'));
        $img = \Image::make(\Storage::disk('public')->get($file));
        $height = $img->width();
        if ($height > 640) {
            $img->resize(640, null, function ($constraint) {
                $constraint->aspectRatio();
            })->stream();
        } else {
            $img->stream();
        }
        \Storage::disk('public')->put($file, $img);

        return $this->success(['message' => trans('exam.image_uploaded'),'image' => 'storage/'.$file]);
    }

    /**
     * Used to remove main or sidebar image
     * @delete ("/api/online-exam/question/image")
     * @return Response
     */
    public function removeQuestionImage()
    {
        return $this->success(['message' => trans('exam.image_removed')]);
    }

    /**
     * Used to toggle status of Online Exam
     * @post ("/api/online-exam/{uuid}/status")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function toggleStatus($uuid)
    {
        $this->authorize('update', OnlineExam::class);

        $online_exam = $this->repo->findByUuidOrFail($uuid);

        $this->repo->toggleStatus($online_exam);

        return $this->success(['message' => trans('exam.online_exam_updated')]);
    }

    /**
     * Used to add question in Online Exam
     * @post ("/api/online-exam/{uuid}/question")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function addQuestion($uuid, QuestionRequest $request)
    {
        $this->authorize('update', OnlineExam::class);

        $online_exam = $this->repo->findByUuidOrFail($uuid);

        $this->repo->addQuestion($online_exam, $this->request->all());

        return $this->success(['message' => trans('exam.online_exam_question_added')]);
    }

    /**
     * Used to update question in Online Exam
     * @patch ("/api/online-exam/{uuid}/question/{id}")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function updateQuestion($uuid, $id, QuestionRequest $request)
    {
        $this->authorize('update', OnlineExam::class);

        $online_exam = $this->repo->findByUuidOrFail($uuid);

        $online_exam_question = $this->repo->findQuestionOrFail($online_exam, $id);

        $this->repo->updateQuestion($online_exam_question, $this->request->all());

        return $this->success(['message' => trans('exam.online_exam_question_updated')]);
    }

    /**
     * Used to delete question in Online Exam
     * @delete ("/api/online-exam/{uuid}/question/{id}")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Online Exam"),
     * })
     * @return Response
     */
    public function deleteQuestion($uuid, $id)
    {
        $this->authorize('update', OnlineExam::class);

        $online_exam = $this->repo->findByUuidOrFail($uuid);

        $online_exam_question = $this->repo->findQuestionOrFail($online_exam, $id);

        $this->repo->deleteQuestion($online_exam_question);

        return $this->success(['message' => trans('exam.online_exam_question_deleted')]);
    }
}