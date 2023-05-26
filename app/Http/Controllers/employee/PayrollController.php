<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Employee\Payroll;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\PayrollRequest;
use App\Repositories\Employee\PayrollRepository;

class PayrollController extends Controller
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
        PayrollRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/payroll/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Payroll::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Payrolls
     * @get ("/api/employee/payroll")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Payroll::class);

        $payrolls = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('payrolls', 'filters'));
    }

    /**
     * Used to print all Payrolls
     * @post ("/api/employee/payroll/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', Payroll::class);

        $payrolls = $this->repo->print(request('filter'));

        return view('print.employee.payroll.index', compact('payrolls'))->render();
    }

    /**
     * Used to generate pdf all Payrolls
     * @post ("/api/employee/payroll/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', Payroll::class);

        $payrolls = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.employee.payroll.index', compact('payrolls'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get first unpaid payroll of given employee
     * @post ("/api/employee/payroll/unpaid")
     * @return Response
     */
    public function fetchUnpaid()
    {
        $this->authorize('list', Payroll::class);

        return $this->success($this->repo->fetchUnpaid($this->request->all()));
    }

    /**
     * Used to fetch Payroll detail
     * @post ("/api/employee/payroll/fetch")
     * @param ({
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("start_date", type="date", required="true", description="Start Date of Payroll"),
     *      @Parameter("end_date", type="date", required="true", description="End Date of Payroll")
     * })
     * @return Response
     */
    public function fetch(PayrollRequest $request)
    {
        $this->authorize('generate', Payroll::class);

        return $this->success($this->repo->fetch($this->request->all()));
    }

    /**
     * Used to generate Payroll
     * @post ("/api/employee/payroll/payroll")
     * @param ({
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("start_date", type="date", required="true", description="Start Date of Payroll"),
     *      @Parameter("end_date", type="date", required="true", description="End Date of Payroll"),
     *      @Parameter("remarks", type="text", required="optional", description="Remarks for Payroll")
     * })
     * @return Response
     */
    public function generate(PayrollRequest $request)
    {
        $this->authorize('generate', Payroll::class);

        $payroll = $this->repo->generate($this->request->all());

        return $this->success(['message' => trans('employee.payroll_generated')]);
    }

    /**
     * Used to get Payroll detail
     * @get ("/api/employee/payroll/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', Payroll::class);

        $payroll = $this->repo->findByUuidOrFail($uuid);

        $data = $this->repo->fetch([
            'start_date'  => $payroll->start_date,
            'end_date'    => $payroll->end_date,
            'employee_id' => $payroll->employee_id,
            'payroll_id'  => $payroll->id,
            'self'        => 1
        ]);

        $attendance_types = gv($data, 'attendance_types');
        $salary = gv($data, 'salary');
        
        return $this->success(compact('payroll','attendance_types','salary'));
    }

    /**
     * Used to print Payroll slip
     * @get ("/employee/payroll/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll"),
     * })
     * @return Response
     */
    public function printPayrollSlip($uuid)
    {
        $this->authorize('list', Payroll::class);

        $payroll = $this->repo->findByUuidOrFail($uuid);

        $data = $this->repo->fetch([
            'start_date'  => $payroll->start_date,
            'end_date'    => $payroll->end_date,
            'employee_id' => $payroll->employee_id,
            'payroll_id'  => $payroll->id,
            'self'        => 1
        ]);

        $attendance_types = gv($data, 'attendance_types');
        $salary = gv($data, 'salary');
        
        return view('print.employee.payroll.slip', compact('payroll','attendance_types','salary'));
    }

    /**
     * Used to update Payroll
     * @patch ("/api/employee/payroll/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll"),
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("start_date", type="date", required="true", description="Start Date of Payroll"),
     *      @Parameter("end_date", type="date", required="true", description="End Date of Payroll"),
     *      @Parameter("remarks", type="text", required="optional", description="Remarks for Payroll")
     * })
     * @return Response
     */
    public function update(PayrollRequest $request, $uuid)
    {
        $this->authorize('update', Payroll::class);

        $payroll = $this->repo->findByUuidOrFail($uuid);

        $payroll = $this->repo->update($payroll, $this->request->all());

        return $this->success(['message' => trans('employee.payroll_updated')]);
    }

    /**
     * Used to delete Payroll
     * @delete ("/api/employee/payroll/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Payroll::class);

        $payroll = $this->repo->deletable($uuid);

        $this->repo->delete($payroll);

        return $this->success(['message' => trans('employee.payroll_deleted')]);
    }
}
