<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\LeaveAllocationRequest;
use App\Repositories\Employee\LeaveAllocationRepository;

class LeaveAllocationController extends Controller
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
        LeaveAllocationRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:manage-leave-allocation')->except(['employeeLeaveAllocation']);
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/leave/allocation/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Leave Allocations
     * @get ("/api/employee/leave/allocation")
     * @return Response
     */
    public function index()
    {
        $leave_allocations = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('leave_allocations', 'filters'));
    }

    /**
     * Used to print all Leave Allocations
     * @post ("/api/employee/leave/allocation/print")
     * @return Response
     */
    public function print()
    {
        $leave_allocations = $this->repo->print(request('filter'));

        return view('print.employee.leave.allocation', compact('leave_allocations'))->render();
    }

    /**
     * Used to generate pdf all Leave Allocations
     * @post ("/api/employee/leave/allocation/pdf")
     * @return Response
     */
    public function pdf()
    {
        $leave_allocations = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.employee.leave.allocation', compact('leave_allocations'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Leave Allocation
     * @post ("/api/employee/leave/allocation")
     * @param ({
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("start_date", type="date", required="true", description="Start date of Leave Allocation"),
     *      @Parameter("end_date", type="date", required="true", description="End date of Leave Allocation"),
     *      @Parameter("description", type="text", required="optional", description="Description of Leave Allocation")
     * })
     * @return Response
     */
    public function store(LeaveAllocationRequest $request)
    {
        $leave_allocation = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.leave_allocation_added')]);
    }

    /**
     * Used to get Leave Allocation detail
     * @get ("/api/employee/leave/allocation/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Leave Allocation"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $leave_allocation = $this->repo->findByUuidOrFail($uuid);
        
        return $this->success(compact('leave_allocation'));
    }

    /**
     * Used to get Employee Leave Allocation detail
     * @post ("/api/employee/leave/allocation/fetch")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee"),
     * })
     * @return Response
     */
    public function employeeLeaveAllocation()
    {
        $leave_allocations = $this->repo->employeeLeaveAllocation($this->request->all());

        return $this->success(compact('leave_allocations'));
    }

    /**
     * Used to update Leave Allocation
     * @patch ("/api/employee/leave/allocation/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Leave Allocation"),
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("start_date", type="date", required="true", description="Start date of Leave Allocation"),
     *      @Parameter("end_date", type="date", required="true", description="End date of Leave Allocation"),
     *      @Parameter("description", type="text", required="optional", description="Description of Leave Allocation")
     * })
     * @return Response
     */
    public function update(LeaveAllocationRequest $request, $uuid)
    {
        $leave_allocation = $this->repo->findByUuidOrFail($uuid);

        $leave_allocation = $this->repo->update($leave_allocation, $this->request->all());

        return $this->success(['message' => trans('employee.leave_allocation_updated')]);
    }

    /**
     * Used to delete Leave Allocation
     * @delete ("/api/employee/leave/allocation/{uuid}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Unique Id of Leave Allocation"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $leave_allocation = $this->repo->deletable($uuid);

        $this->repo->delete($leave_allocation);

        return $this->success(['message' => trans('employee.leave_allocation_deleted')]);
    }
}
