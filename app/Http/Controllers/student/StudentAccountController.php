<?php

namespace App\Http\Controllers\Student;

use Illuminate\Http\Request;
use App\Models\Student\Student;
use App\Http\Controllers\Controller;
use App\Repositories\Student\StudentRepository;
use App\Http\Requests\Student\StudentAccountRequest;
use App\Repositories\Student\StudentAccountRepository;

class StudentAccountController extends Controller
{
    protected $request;
    protected $repo;
    protected $student;
    protected $module = 'student_account';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        StudentAccountRepository $repo,
        StudentRepository $student
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->student = $student;
    }

    /**
     * Used to get all student accounts
     * @get ("/api/student/{uuid}/account")
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
     * Used to store student account
     * @post ("/api/student/{uuid}/account")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("name", type="string", required="true", description="Name of Account"),
     *      @Parameter("account_number", type="string", required="true", description="Number of Account"),
     *      @Parameter("bank_name", type="string", required="true", description="Bank Name of Account"),
     *      @Parameter("branch_name", type="string", required="true", description="Branch Name of Account"),
     *      @Parameter("bank_identification_code", type="string", required="true", description="Bank Identification Code of Account"),
     *      @Parameter("is_primary", type="boolean", required="optional", description="Is account Primary"),
     *      @Parameter("description", type="text", required="optional", description="Description of Account")
     * })
     * @return Response
     */
    public function store(StudentAccountRequest $request, $uuid)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_account = $this->repo->create($student->id, $this->request->all());

        return $this->success(['message' => trans('student.account_added')]);
    }

    /**
     * Used to get Student Account detail
     * @get ("/api/student/{uuid}/account/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
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
     * Used to update Student Account
     * @patch ("/api/student/{uuid}/account/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("name", type="string", required="true", description="Name of Account"),
     *      @Parameter("account_number", type="string", required="true", description="Number of Account"),
     *      @Parameter("bank_name", type="string", required="true", description="Bank Name of Account"),
     *      @Parameter("branch_name", type="string", required="true", description="Branch Name of Account"),
     *      @Parameter("bank_identification_code", type="string", required="true", description="Bank Identification Code of Account"),
     *      @Parameter("is_primary", type="boolean", required="optional", description="Is account Primary"),
     *      @Parameter("description", type="text", required="optional", description="Description of Account")
     * })
     * @return Response
     */
    public function update(StudentAccountRequest $request, $uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_account = $this->repo->findOrFail($student->id, $id);

        $student_account = $this->repo->update($student_account, $this->request->all());

        return $this->success(['message' => trans('student.account_updated')]);
    }

    /**
     * Used to delete Student Account
     * @delete ("/api/student/{uuid}/account/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_account = $this->repo->findOrFail($student->id, $id);

        $this->repo->delete($student_account);

        return $this->success(['message' => trans('student.account_deleted')]);
    }
}
