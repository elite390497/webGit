<?php

namespace App\Http\Controllers\Configuration\Student;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Student\StudentGroupRequest;
use App\Repositories\Configuration\Student\StudentGroupRepository;

class StudentGroupController extends Controller
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
        StudentGroupRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Student Groups
     * @get ("/api/student/group")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Student Groups
     * @post ("/api/student/group/print")
     * @return Response
     */
    public function print()
    {
        $student_groups = $this->repo->print(request('filter'));

        return view('print.configuration.student.student-group', compact('student_groups'))->render();
    }

    /**
     * Used to generate pdf all Student Groups
     * @post ("/api/student/group/pdf")
     * @return Response
     */
    public function pdf()
    {
        $student_groups = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.student.student-group', compact('student_groups'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Student Group
     * @post ("/api/student/group")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Student Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Student Group")
     * })
     * @return Response
     */
    public function store(StudentGroupRequest $request)
    {
        $student_group = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('student.student_group_added')]);
    }

    /**
     * Used to get Student Group detail
     * @get ("/api/student/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Student Group"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Student Group
     * @patch ("/api/student/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Student Group"),
     *      @Parameter("name", type="string", required="true", description="Name of Student Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Student Group")
     * })
     * @return Response
     */
    public function update($id, StudentGroupRequest $request)
    {
        $student_group = $this->repo->findOrFail($id);

        $student_group = $this->repo->update($student_group, $this->request->all());

        return $this->success(['message' => trans('student.student_group_updated')]);
    }

    /**
     * Used to delete Student Group
     * @delete ("/api/student/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Student Group"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $student_group = $this->repo->deletable($id);

        $this->repo->delete($student_group);

        return $this->success(['message' => trans('student.student_group_deleted')]);
    }
}
