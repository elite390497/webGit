<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\SalaryRequest;
use App\Repositories\Employee\SalaryRepository;

class SalaryController extends Controller
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
        SalaryRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:define-employee-salary');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/payroll/salary/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Salaries
     * @get ("/api/employee/payroll/salary")
     * @return Response
     */
    public function index()
    {
        $salaries = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('salaries', 'filters'));
    }

    /**
     * Used to print all Salaries
     * @post ("/api/employee/payroll/salary/print")
     * @return Response
     */
    public function print()
    {
        $salaries = $this->repo->print(request('filter'));

        return view('print.employee.payroll.salary', compact('salaries'))->render();
    }

    /**
     * Used to generate pdf all Salaries
     * @post ("/api/employee/payroll/salary/pdf")
     * @return Response
     */
    public function pdf()
    {
        $salaries = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.employee.payroll.salary', compact('salaries'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Salary
     * @post ("/api/employee/payroll/salary")
     * @param ({
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("date_effective", type="date", required="true", description="Salary Date Effective"),
     *      @Parameter("pay_heads", type="array", required="true", description="Pay Heads of Salary"),
     *      @Parameter("description", type="text", required="optional", description="Description of Salary")
     * })
     * @return Response
     */
    public function store(SalaryRequest $request)
    {
        $salary = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.salary_structure_added')]);
    }

    /**
     * Used to get Salary detail
     * @get ("/api/employee/payroll/salary/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Salary"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $salary = $this->repo->findByUuidOrFail($uuid);

        $salary = $this->repo->compute($salary);

        $selected_employee = getSelectedEmployee($salary->employee);
        
        return $this->success(compact('salary','selected_employee'));
    }

    /**
     * Used to update Salary
     * @patch ("/api/employee/payroll/salary/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Salary"),
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("date_effective", type="date", required="true", description="Salary Date Effective"),
     *      @Parameter("pay_heads", type="array", required="true", description="Pay Heads of Salary"),
     *      @Parameter("description", type="text", required="optional", description="Description of Salary")
     * })
     * @return Response
     */
    public function update(SalaryRequest $request, $uuid)
    {
        $salary = $this->repo->findByUuidOrFail($uuid);

        $salary = $this->repo->update($salary, $this->request->all());

        return $this->success(['message' => trans('employee.salary_structure_updated')]);
    }

    /**
     * Used to delete Salary
     * @delete ("/api/employee/payroll/salary/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Salary"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $salary = $this->repo->deletable($uuid);

        $this->repo->delete($salary);

        return $this->success(['message' => trans('employee.salary_structure_deleted')]);
    }
}
