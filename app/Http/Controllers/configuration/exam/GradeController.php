<?php

namespace App\Http\Controllers\Configuration\Exam;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Exam\GradeRequest;
use App\Repositories\Configuration\Exam\GradeRepository;

class GradeController extends Controller
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
        GradeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Exam Grades
     * @get ("/api/exam/grade")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Exam Grades
     * @post ("/api/exam/grade/print")
     * @return Response
     */
    public function print()
    {
        $exam_grades = $this->repo->print(request('filter'));

        return view('print.configuration.exam.grade', compact('exam_grades'))->render();
    }

    /**
     * Used to generate pdf all Exam Grades
     * @post ("/api/exam/grade/pdf")
     * @return Response
     */
    public function pdf()
    {
        $exam_grades = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.exam.grade', compact('exam_grades'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Exam Grade
     * @post ("/api/exam/grade")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Exam Grade"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Grade")
     * })
     * @return Response
     */
    public function store(GradeRequest $request)
    {
        $exam_grade = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('exam.grade_added')]);
    }

    /**
     * Used to get Exam Grade detail
     * @get ("/api/exam/grade/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Grade"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Exam Grade
     * @patch ("/api/exam/grade/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Grade"),
     *      @Parameter("name", type="string", required="true", description="Name of Exam Grade"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Grade")
     * })
     * @return Response
     */
    public function update($id, GradeRequest $request)
    {
        $exam_grade = $this->repo->findOrFail($id);

        $exam_grade = $this->repo->update($exam_grade, $this->request->all());

        return $this->success(['message' => trans('exam.grade_updated')]);
    }

    /**
     * Used to delete Exam Grade
     * @delete ("/api/exam/grade/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Grade"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $exam_grade = $this->repo->deletable($id);

        $this->repo->delete($exam_grade);

        return $this->success(['message' => trans('exam.grade_deleted')]);
    }
}
