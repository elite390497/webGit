<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Academic\Course;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\CourseRequest;
use App\Repositories\Academic\CourseRepository;

class CourseController extends Controller
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
        CourseRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/course/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Course::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Courses
     * @get ("/api/course")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Course::class);

        $courses = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('courses', 'filters'));
    }
 
     /**
     * Used to reorder all Courses
     * @frontend ("/api/course/reorder")
     * @return Response
     */
    public function reorder()
    {
        $this->authorize('update', Course::class);

        $this->repo->reorder($this->request->all());
    
        return $this->success(['message' => trans('academic.course_updated')]);
    }
 
     /**
     * Used to reorder all Batches of course
     * @frontend ("/api/course/{id}/batch/reorder")
     * @return Response
     */
    public function batchReorder($id)
    {
        $this->authorize('update', Course::class);

        $course = $this->repo->findOrFail($id);

        $this->repo->batchReorder($course, $this->request->all());
    
        return $this->success(['message' => trans('academic.batch_updated')]);
    }

    /**
     * Used to print all Courses
     * @post ("/api/course/print")
     * @return Response
     */
    public function print()
    {
        $courses = $this->repo->print(request('filter'));

        return view('print.academic.course', compact('courses'))->render();
    }

    /**
     * Used to generate pdf all Courses
     * @post ("/api/course/pdf")
     * @return Response
     */
    public function pdf()
    {
        $courses = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.course', compact('courses'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Course
     * @post ("/api/course")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Course"),
     *      @Parameter("description", type="text", required="optional", description="Description of Course")
     * })
     * @return Response
     */
    public function store(CourseRequest $request)
    {
        $this->authorize('create', Course::class);

        $course = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.course_added')]);
    }

    /**
     * Used to get Course detail
     * @get ("/api/course/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Course"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Course::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Course
     * @patch ("/api/course/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Course"),
     *      @Parameter("name", type="string", required="true", description="Name of Course"),
     *      @Parameter("description", type="text", required="optional", description="Description of Course")
     * })
     * @return Response
     */
    public function update($id, CourseRequest $request)
    {
        $this->authorize('update', Course::class);

        $course = $this->repo->findOrFail($id);

        $course = $this->repo->update($course, $this->request->all());

        return $this->success(['message' => trans('academic.course_updated')]);
    }

    /**
     * Used to delete Course
     * @delete ("/api/course/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Course"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Course::class);

        $course = $this->repo->deletable($id);

        $this->repo->delete($course);

        return $this->success(['message' => trans('academic.course_deleted')]);
    }
}
