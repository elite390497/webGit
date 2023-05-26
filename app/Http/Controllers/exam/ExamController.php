<?php

namespace App\Http\Controllers\Exam;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Exam\Exam;
use App\Http\Requests\Exam\ExamRequest;
use App\Repositories\Exam\ExamRepository;

class ExamController extends Controller
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
        ExamRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/exam/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Exam::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Exams
     * @get ("/api/exam")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Exam::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Exams
     * @post ("/api/exam/print")
     * @return Response
     */
    public function print()
    {
        $exams = $this->repo->print(request('filter'));

        return view('print.exam.exam', compact('exams'))->render();
    }

    /**
     * Used to generate pdf all Exams
     * @post ("/api/exam/pdf")
     * @return Response
     */
    public function pdf()
    {
        $exams = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.exam.exam', compact('exams'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Exam
     * @post ("/api/exam")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Exam"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam")
     * })
     * @return Response
     */
    public function store(ExamRequest $request)
    {
        $this->authorize('create', Exam::class);

        $exam = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('exam.exam_added')]);
    }

    /**
     * Used to get Exam detail
     * @get ("/api/exam/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Exam::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Exam
     * @patch ("/api/exam/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam"),
     *      @Parameter("name", type="string", required="true", description="Name of Exam"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam")
     * })
     * @return Response
     */
    public function update($id, ExamRequest $request)
    {
        $this->authorize('update', Exam::class);

        $exam = $this->repo->findOrFail($id);

        $exam = $this->repo->update($exam, $this->request->all());

        return $this->success(['message' => trans('exam.exam_updated')]);
    }
 
     /**
     * Used to reorder all Exams
     * @frontend ("/api/exam/reorder")
     * @return Response
     */
    public function reorder()
    {
        $this->authorize('update', Exam::class);

        $this->repo->reorder($this->request->all());
    
        return $this->success(['message' => trans('exam.exam_updated')]);
    }

    /**
     * Used to delete Exam
     * @delete ("/api/exam/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Exam::class);

        $exam = $this->repo->deletable($id);

        $this->repo->delete($exam);

        return $this->success(['message' => trans('exam.exam_deleted')]);
    }
}
