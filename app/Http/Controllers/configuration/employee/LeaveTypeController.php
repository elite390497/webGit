<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\LeaveTypeRequest;
use App\Repositories\Configuration\Employee\LeaveTypeRepository;

class LeaveTypeController extends Controller
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
        LeaveTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Employee Leave Types
     * @get ("/api/employee/leave/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Employee Leave Types
     * @post ("/api/employee/leave/type/print")
     * @return Response
     */
    public function print()
    {
        $employee_leave_types = $this->repo->print(request('filter'));

        return view('print.configuration.employee.leave-type', compact('employee_leave_types'))->render();
    }

    /**
     * Used to generate pdf all Employee Leave Types
     * @post ("/api/employee/leave/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $employee_leave_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.leave-type', compact('employee_leave_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Employee Leave Type
     * @post ("/api/employee/leave/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Employee Leave Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Leave Type")
     * })
     * @return Response
     */
    public function store(LeaveTypeRequest $request)
    {
        $employee_leave_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.leave_type_added')]);
    }

    /**
     * Used to get Employee Leave Type detail
     * @get ("/api/employee/leave/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Leave Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Employee Leave Type
     * @patch ("/api/employee/leave/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Leave Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Employee Leave Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Leave Type")
     * })
     * @return Response
     */
    public function update($id, LeaveTypeRequest $request)
    {
        $employee_leave_type = $this->repo->findOrFail($id);

        $employee_leave_type = $this->repo->update($employee_leave_type, $this->request->all());

        return $this->success(['message' => trans('employee.leave_type_updated')]);
    }

    /**
     * Used to delete Employee Leave Type
     * @delete ("/api/employee/leave/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Leave Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $employee_leave_type = $this->repo->deletable($id);

        $this->repo->delete($employee_leave_type);

        return $this->success(['message' => trans('employee.leave_type_deleted')]);
    }
}
