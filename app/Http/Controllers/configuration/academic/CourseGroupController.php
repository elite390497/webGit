<?php

namespace App\Http\Controllers\Configuration\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Academic\CourseGroupRequest;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class CourseGroupController extends Controller
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
        CourseGroupRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Course Groups
     * @get ("/api/academic/course/group")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }
 
     /**
     * Used to reorder all Course Groups
     * @frontend ("/api/academic/course/group/reorder")
     * @return Response
     */
    public function reorder()
    {
        $this->repo->reorder($this->request->all());
    
        return $this->success(['message' => trans('academic.course_group_updated')]);
    }

    /**
     * Used to print all Course Groups
     * @post ("/api/academic/course/group/print")
     * @return Response
     */
    public function print()
    {
        $course_groups = $this->repo->print(request('filter'));

        return view('print.academic.course-group', compact('course_groups'))->render();
    }

    /**
     * Used to generate pdf all Course Groups
     * @post ("/api/academic/course/group/pdf")
     * @return Response
     */
    public function pdf()
    {
        $course_groups = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.course-group', compact('course_groups'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Course Group
     * @post ("/api/academic/course/group")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Course Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Course Group")
     * })
     * @return Response
     */
    public function store(CourseGroupRequest $request)
    {
        $course_group = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.course_group_added')]);
    }

    /**
     * Used to get Course Group detail
     * @get ("/api/academic/course/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of CourseGroup"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Course Group
     * @patch ("/api/academic/course/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Course Group"),
     *      @Parameter("name", type="string", required="true", description="Name of Course Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Course Group")
     * })
     * @return Response
     */
    public function update($id, CourseGroupRequest $request)
    {
        $course_group = $this->repo->findOrFail($id);

        $course_group = $this->repo->update($course_group, $this->request->all());

        return $this->success(['message' => trans('academic.course_group_updated')]);
    }

    /**
     * Used to delete Course Group
     * @delete ("/api/academic/course/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Course Group"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $course_group = $this->repo->deletable($id);

        $this->repo->delete($course_group);

        return $this->success(['message' => trans('academic.course_group_deleted')]);
    }
}
