<?php

namespace App\Http\Controllers\Configuration\Exam;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Exam\AssessmentRequest;
use App\Repositories\Configuration\Exam\AssessmentRepository;

class AssessmentController extends Controller
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
        AssessmentRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Exam Assessments
     * @get ("/api/exam/assessment")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Exam Assessments
     * @post ("/api/exam/assessment/print")
     * @return Response
     */
    public function print()
    {
        $exam_assessments = $this->repo->print(request('filter'));

        return view('print.configuration.exam.assessment', compact('exam_assessments'))->render();
    }

    /**
     * Used to generate pdf all Exam Assessments
     * @post ("/api/exam/assessment/pdf")
     * @return Response
     */
    public function pdf()
    {
        $exam_assessments = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.exam.assessment', compact('exam_assessments'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Exam Assessment
     * @post ("/api/exam/assessment")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Exam Assessment"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Assessment")
     * })
     * @return Response
     */
    public function store(AssessmentRequest $request)
    {
        $exam_assessment = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('exam.assessment_added')]);
    }

    /**
     * Used to get Exam Assessment detail
     * @get ("/api/exam/assessment/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Assessment"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Exam Assessment
     * @patch ("/api/exam/assessment/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Assessment"),
     *      @Parameter("name", type="string", required="true", description="Name of Exam Assessment"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Assessment")
     * })
     * @return Response
     */
    public function update($id, AssessmentRequest $request)
    {
        $exam_assessment = $this->repo->findOrFail($id);

        $exam_assessment = $this->repo->update($exam_assessment, $this->request->all());

        return $this->success(['message' => trans('exam.assessment_updated')]);
    }
 
     /**
     * Used to reorder all Details of assessment
     * @frontend ("/api/exam/assessment/{id}/reorder")
     * @return Response
     */
    public function reorder($id)
    {
        $exam_assessment = $this->repo->findOrFail($id);

        $this->repo->reorder($exam_assessment, $this->request->all());
    
        return $this->success(['message' => trans('exam.assessment_updated')]);
    }

    /**
     * Used to delete Exam Assessment
     * @delete ("/api/exam/assessment/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Assessment"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $exam_assessment = $this->repo->deletable($id);

        $this->repo->delete($exam_assessment);

        return $this->success(['message' => trans('exam.assessment_deleted')]);
    }
}
