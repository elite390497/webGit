<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\DepartmentRequest;
use App\Repositories\Configuration\Employee\DepartmentRepository;

class DepartmentController extends Controller
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
        DepartmentRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Departments
     * @get ("/api/employee/department")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Departments
     * @post ("/api/employee/department/print")
     * @return Response
     */
    public function print()
    {
        $departments = $this->repo->print(request('filter'));

        return view('print.configuration.employee.department', compact('departments'))->render();
    }

    /**
     * Used to generate pdf all Departments
     * @post ("/api/employee/department/pdf")
     * @return Response
     */
    public function pdf()
    {
        $departments = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.department', compact('departments'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Department
     * @post ("/api/employee/department")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Department"),
     *      @Parameter("description", type="text", required="optional", description="Description of Department")
     * })
     * @return Response
     */
    public function store(DepartmentRequest $request)
    {
        $department = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.department_added')]);
    }

    /**
     * Used to get Department detail
     * @get ("/api/employee/department/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Department"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Department
     * @patch ("/api/employee/department/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Department"),
     *      @Parameter("name", type="string", required="true", description="Name of Department"),
     *      @Parameter("description", type="text", required="optional", description="Description of Department")
     * })
     * @return Response
     */
    public function update($id, DepartmentRequest $request)
    {
        $department = $this->repo->findOrFail($id);

        $department = $this->repo->update($department, $this->request->all());

        return $this->success(['message' => trans('employee.department_updated')]);
    }

    /**
     * Used to delete Department
     * @delete ("/api/employee/department/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Department"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $department = $this->repo->deletable($id);

        $this->repo->delete($department);

        return $this->success(['message' => trans('employee.department_deleted')]);
    }
}
