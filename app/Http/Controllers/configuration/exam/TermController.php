<?php

namespace App\Http\Controllers\Configuration\Exam;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Exam\TermRequest;
use App\Repositories\Configuration\Exam\TermRepository;

class TermController extends Controller
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
        TermRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/exam/term/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Exam Terms
     * @get ("/api/exam/term")
     * @return Response
     */
    public function index()
    {
        $exam_terms = $this->repo->paginate($this->request->all());
        $filters = $this->repo->getFilters();

        return $this->success(compact('exam_terms','filters'));
    }
 
     /**
     * Used to reorder all Exam Terms
     * @frontend ("/api/exam/term/reorder")
     * @return Response
     */
    public function reorder()
    {
        $this->repo->reorder($this->request->all());
    
        return $this->success(['message' => trans('exam.term_updated')]);
    }

    /**
     * Used to print all Exam Terms
     * @post ("/api/exam/term/print")
     * @return Response
     */
    public function print()
    {
        $exam_terms = $this->repo->print(request('filter'));

        return view('print.configuration.exam.term', compact('exam_terms'))->render();
    }

    /**
     * Used to generate pdf all Exam Terms
     * @post ("/api/exam/term/pdf")
     * @return Response
     */
    public function pdf()
    {
        $exam_terms = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.exam.term', compact('exam_terms'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Exam Term
     * @post ("/api/exam/term")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Exam Term"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Term")
     * })
     * @return Response
     */
    public function store(TermRequest $request)
    {
        $exam_term = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('exam.term_added')]);
    }

    /**
     * Used to get Exam Term detail
     * @get ("/api/exam/term/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Term"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Exam Term
     * @patch ("/api/exam/term/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Term"),
     *      @Parameter("name", type="string", required="true", description="Name of Exam Term"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Term")
     * })
     * @return Response
     */
    public function update($id, TermRequest $request)
    {
        $exam_term = $this->repo->findOrFail($id);

        $exam_term = $this->repo->update($exam_term, $this->request->all());

        return $this->success(['message' => trans('exam.term_updated')]);
    }

    /**
     * Used to delete Exam Term
     * @delete ("/api/exam/term/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Term"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $exam_term = $this->repo->deletable($id);

        $this->repo->delete($exam_term);

        return $this->success(['message' => trans('exam.term_deleted')]);
    }
}
