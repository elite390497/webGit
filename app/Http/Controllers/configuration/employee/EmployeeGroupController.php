<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\EmployeeGroupRequest;
use App\Repositories\Configuration\Employee\EmployeeGroupRepository;

class EmployeeGroupController extends Controller
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
        EmployeeGroupRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Employee Groups
     * @get ("/api/employee/group")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Employee Groups
     * @post ("/api/employee/group/print")
     * @return Response
     */
    public function print()
    {
        $employee_groups = $this->repo->print(request('filter'));

        return view('print.configuration.employee.employee-group', compact('employee_groups'))->render();
    }

    /**
     * Used to generate pdf all Employee Groups
     * @post ("/api/employee/group/pdf")
     * @return Response
     */
    public function pdf()
    {
        $employee_groups = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.employee-group', compact('employee_groups'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Employee Group
     * @post ("/api/employee/group")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Employee Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Group")
     * })
     * @return Response
     */
    public function store(EmployeeGroupRequest $request)
    {
        $employee_group = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.employee_group_added')]);
    }

    /**
     * Used to get Employee Group detail
     * @get ("/api/employee/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Group"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Employee Group
     * @patch ("/api/employee/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Group"),
     *      @Parameter("name", type="string", required="true", description="Name of Employee Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Group")
     * })
     * @return Response
     */
    public function update($id, EmployeeGroupRequest $request)
    {
        $employee_group = $this->repo->findOrFail($id);

        $employee_group = $this->repo->update($employee_group, $this->request->all());

        return $this->success(['message' => trans('employee.employee_group_updated')]);
    }

    /**
     * Used to delete Employee Group
     * @delete ("/api/employee/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Group"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $employee_group = $this->repo->deletable($id);

        $this->repo->delete($employee_group);

        return $this->success(['message' => trans('employee.employee_group_deleted')]);
    }
}
