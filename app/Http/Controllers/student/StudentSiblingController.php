<?php

namespace App\Http\Controllers\Student;

use Illuminate\Http\Request;
use App\Models\Student\Student;
use App\Http\Controllers\Controller;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Student\StudentSiblingRepository;

class StudentSiblingController extends Controller
{
    protected $request;
    protected $repo;
    protected $student;
    protected $module = 'student_sibling';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        StudentSiblingRepository $repo,
        StudentRepository $student
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->student = $student;
    }

    /**
     * Used to get all student siblings
     * @get ("/api/student/{uuid}/sibling")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     * })
     * @return Response
     */
    public function index($uuid)
    {
        $this->authorize('list', Student::class);

        $student = $this->student->findByUuidOrFail($uuid);

        return $this->ok($this->repo->paginate($student->id, $this->request->all()));
    }

    /**
     * Used to store student sibling
     * @post ("/api/student/{uuid}/sibling")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Sibling Student")
     * })
     * @return Response
     */
    public function store($uuid)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_sibling = $this->repo->create($student->id, $this->request->all());

        return $this->success(['message' => trans('student.sibling_added')]);
    }

    /**
     * Used to get Student Sibling detail
     * @get ("/api/student/{uuid}/sibling/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Sibling Student"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        return $this->ok($this->repo->findOrFail($student->id, $id));
    }

    /**
     * Used to delete Student Sibling
     * @delete ("/api/student/{uuid}/sibling/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Sibling Student"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_sibling = $this->repo->findOrFail($student->id, $id);

        $this->repo->delete($student_sibling);

        return $this->success(['message' => trans('student.sibling_deleted')]);
    }

    /**
     * Used to get Student Sibling suggestion
     * @get ("/api/student/{uuid}/sibling/suggestion")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student")
     * })
     * @return Response
     */
    public function suggestion($uuid)
    {
        $this->authorize('list', Student::class);

        $student = $this->student->findByUuidOrFail($uuid);

        return $this->ok($this->repo->getSuggestion($student));
    }

    /**
     * Used to search Student Sibling suggestion
     * @get ("/api/student/{uuid}/sibling/search")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student")
     * })
     * @return Response
     */
    public function search($uuid)
    {
        $this->authorize('list', Student::class);

        $student = $this->student->findByUuidOrFail($uuid);

        return $this->ok($this->repo->search($student, $this->request->all()));
    }
}
