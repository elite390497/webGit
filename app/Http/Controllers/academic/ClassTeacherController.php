<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Academic\ClassTeacher;
use App\Repositories\Academic\ClassTeacherRepository;
use App\Http\Resources\Academic\ClassTeacherBatchWiseCollection;

class ClassTeacherController extends Controller
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
        ClassTeacherRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get lists batch wise
     * @get ("/api/class-teacher")
     * @return Response
     */
    public function list()
    {
        $this->authorize('list', ClassTeacher::class);

        $filters = $this->repo->getFilters();

        return (new ClassTeacherBatchWiseCollection($this->repo->getBatchWiseList($this->request->all())))->additional(['meta' => [
                'courses' => gv($filters, 'courses', [])
            ]]);
    }

    /**
     * Used to get lists
     * @get ("/api/class/teacher")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', ClassTeacher::class);

        return $this->success($this->repo->getList($this->request->all()));
    }

    /**
     * Used to print all Class Teachers
     * @post ("/api/class/teacher/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', ClassTeacher::class);

        $data = $this->repo->getList(request('filter'));

        $data['filter'] = request('filter');

        return view('print.academic.class-teacher', $data)->render();
    }

    /**
     * Used to generate pdf all Class Teachers
     * @post ("/api/class/teacher/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', ClassTeacher::class);
        
        $data = $this->repo->getList(request('filter'));

        $data['filter'] = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.class-teacher', $data)->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Class Teachers
     * @post ("/api/class/teacher")
     * @param ({
     *      @Parameter("batches", type="array", required="true", description="Array of Batches")
     * })
     * @return Response
     */
    public function store()
    {
        $this->authorize('store', ClassTeacher::class);

        $this->repo->store($this->request->all());

        return $this->success(['message' => trans('academic.class_teacher_added')]);
    }

    /**
     * Used to delete Class Teacher
     * @delete ("/api/class/teacher/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Class Teacher"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', ClassTeacher::class);

        $class_teacher = $this->repo->deletable($id);

        $this->repo->delete($class_teacher);

        return $this->success(['message' => trans('academic.class_teacher_deleted')]);
    }
}
