<?php

namespace App\Http\Controllers\Student;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Student\StudentParent;
use App\Http\Requests\Student\StudentParentRequest;
use App\Repositories\Student\StudentParentRepository;

class StudentParentController extends Controller
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
        StudentParentRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get all Parents
     * @get ("/api/student/parent")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', StudentParent::class);

        $student_parents = $this->repo->paginate($this->request->all());

        return $this->success(compact('student_parents'));
    }

    /**
     * Used to print all Parents
     * @post ("/api/student/parent/print")
     * @return Response
     */
    public function print()
    {
        $student_parents = $this->repo->print(request('filter'));

        return view('print.student.parent', compact('student_parents'))->render();
    }

    /**
     * Used to generate pdf all Parents
     * @post ("/api/student/parent/pdf")
     * @return Response
     */
    public function pdf()
    {
        $student_parents = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.student.parent', compact('student_parents'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Parent
     * @post ("/api/student/parent")
     * @param ({
     *      @Parameter("first_guardian_name", type="string", required="true", description="First Guardian Name of Student"),
     *      @Parameter("first_guardian_contact_number_1", type="string", required="true", description="First Guardian Contact Number"),
     *      @Parameter("second_guardian_name", type="string", required="true", description="Second Guardian Name of Student"),
     * })
     * @return Response
     */
    public function store(StudentParentRequest $request)
    {
        $this->authorize('create', StudentParent::class);

        $student_parent = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('student.parent_added')]);
    }

    /**
     * Used to search parent
     * @get ("/api/student/parent/search")
     * @return Response
     */
    public function search()
    {
        $this->authorize('search', StudentParent::class);

        return $this->ok($this->repo->searchByFirstOrSecondName($this->request->all()));
    }

    /**
     * Used to delete Parent
     * @delete ("/api/student/parent/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Head"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('create', StudentParent::class);

        $student_parent = $this->repo->deletable($id);

        $this->repo->delete($student_parent);

        return $this->success(['message' => trans('student.parent_deleted')]);
    }
}
