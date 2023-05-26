<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Http\Request;
use App\Models\Employee\Employee;
use App\Http\Controllers\Controller;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Employee\EmployeeAccountRequest;
use App\Repositories\Employee\EmployeeAccountRepository;

class EmployeeAccountController extends Controller
{
    protected $request;
    protected $repo;
    protected $employee;
    protected $module = 'employee_account';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        EmployeeAccountRepository $repo,
        EmployeeRepository $employee
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->employee = $employee;
    }

    /**
     * Used to get all employee accounts
     * @get ("/api/employee/{uuid}/account")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     * })
     * @return Response
     */
    public function index($uuid)
    {
        $this->authorize('list', Employee::class);

        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        return $this->ok($this->repo->paginate($employee->id, $this->request->all()));
    }

    /**
     * Used to store employee account
     * @post ("/api/employee/{uuid}/account")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
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
    public function store(EmployeeAccountRequest $request, $uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_account = $this->repo->create($employee->id, $this->request->all());

        return $this->success(['message' => trans('employee.account_added')]);
    }

    /**
     * Used to get Employee Account detail
     * @get ("/api/employee/{uuid}/account/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        $this->authorize('update', Employee::class);

        return $this->ok($this->repo->findOrFail($employee->id, $id));
    }

    /**
     * Used to update Employee Account
     * @patch ("/api/employee/{uuid}/account/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
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
    public function update(EmployeeAccountRequest $request, $uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_account = $this->repo->findOrFail($employee->id, $id);

        $employee_account = $this->repo->update($employee_account, $this->request->all());

        return $this->success(['message' => trans('employee.account_updated')]);
    }

    /**
     * Used to delete Employee Account
     * @delete ("/api/employee/{uuid}/account/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_account = $this->repo->findOrFail($employee->id, $id);

        $this->repo->delete($employee_account);

        return $this->success(['message' => trans('employee.account_deleted')]);
    }
}
