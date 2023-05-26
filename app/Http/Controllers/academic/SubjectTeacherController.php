<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Academic\SubjectTeacher;
use App\Repositories\Academic\SubjectTeacherRepository;

class SubjectTeacherController extends Controller
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
        SubjectTeacherRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get subject teacher list
     * @get ("/api/subject/teacher")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', SubjectTeacher::class);

        return $this->success($this->repo->getList());
    }

    /**
     * Used to print all Subject Teachers
     * @post ("/api/subject/teacher/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', SubjectTeacher::class);

        $filter = request('filter');

        $batch_id = gv($filter, 'batch_id');

        $subjects = $this->repo->getSubjects($batch_id);

        $batch = $this->repo->getBatchDetail($batch_id);

        $filter = request('filter');

        return view('print.academic.subject-teacher', compact('subjects', 'batch', 'filter'))->render();
    }

    /**
     * Used to generate pdf all Subject Teachers
     * @post ("/api/subject/teacher/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', SubjectTeacher::class);

        $filter = request('filter');

        $batch_id = gv($filter, 'batch_id');

        $data['subjects'] = $this->repo->getSubjects($batch_id);

        $data['batch'] = $this->repo->getBatchDetail($batch_id);

        $data['filter'] = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.subject-teacher', $data)->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get subjects
     * @get ("/api/subject/teacher/{batch_id}")
     * @return Response
     */
    public function getSubjects($batch_id)
    {
        $this->authorize('list', SubjectTeacher::class);

        return $this->ok($this->repo->getSubjects($batch_id));
    }

    /**
     * Used to store Subject Teachers
     * @post ("/api/subject/teacher")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch"),
     *      @Parameter("subjects", type="array", required="true", description="Array of Subjects")
     * })
     * @return Response
     */
    public function store()
    {
        $this->authorize('store', SubjectTeacher::class);

        $this->repo->store($this->request->all());

        return $this->success(['message' => trans('academic.subject_teacher_added')]);
    }

    /**
     * Used to delete Subject Teacher
     * @delete ("/api/subject/teacher/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Subject Teacher"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', SubjectTeacher::class);

        $subject_teacher = $this->repo->deletable($id);

        $this->repo->delete($subject_teacher);

        return $this->success(['message' => trans('academic.subject_teacher_deleted')]);
    }
}
