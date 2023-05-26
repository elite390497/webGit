<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\PayrollTemplateRequest;
use App\Repositories\Employee\PayrollTemplateRepository;

class PayrollTemplateController extends Controller
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
        PayrollTemplateRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:manage-payroll-template');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/payroll/template/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Payroll Templates
     * @get ("/api/employee/payroll/template")
     * @return Response
     */
    public function index()
    {
        $payroll_templates = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('payroll_templates', 'filters'));
    }

    /**
     * Used to print all Payroll Templates
     * @post ("/api/employee/payroll/template/print")
     * @return Response
     */
    public function print()
    {
        $payroll_templates = $this->repo->print(request('filter'));

        return view('print.employee.payroll.template', compact('payroll_templates'))->render();
    }

    /**
     * Used to generate pdf all Payroll Templates
     * @post ("/api/employee/payroll/template/pdf")
     * @return Response
     */
    public function pdf()
    {
        $payroll_templates = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.employee.payroll.template', compact('payroll_templates'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Payroll Template
     * @post ("/api/employee/payroll/template")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Payroll Template"),
     *      @Parameter("is_active", type="boolean", required="true", description="Status of Payroll Template"),
     *      @Parameter("pay_heads", type="array", required="true", description="Pay Heads of Payroll Template"),
     *      @Parameter("description", type="text", required="optional", description="Description of Payroll Template")
     * })
     * @return Response
     */
    public function store(PayrollTemplateRequest $request)
    {
        $payroll_template = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.payroll_template_added')]);
    }

    /**
     * Used to get Payroll Template detail
     * @get ("/api/employee/payroll/template/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll Template"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $payroll_template = $this->repo->findByUuidOrFail($uuid);
        
        return $this->success(compact('payroll_template'));
    }

    /**
     * Used to update Payroll Template
     * @patch ("/api/employee/payroll/template/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll Template"),
     *      @Parameter("name", type="string", required="true", description="Name of Payroll Template"),
     *      @Parameter("is_active", type="boolean", required="true", description="Status of Payroll Template"),
     *      @Parameter("pay_heads", type="array", required="true", description="Pay Heads of Payroll Template"),
     *      @Parameter("description", type="text", required="optional", description="Description of Payroll Template")
     * })
     * @return Response
     */
    public function update(PayrollTemplateRequest $request, $uuid)
    {
        $payroll_template = $this->repo->findByUuidOrFail($uuid);

        $payroll_template = $this->repo->update($payroll_template, $this->request->all());

        return $this->success(['message' => trans('employee.payroll_template_updated')]);
    }

    /**
     * Used to delete Payroll Template
     * @delete ("/api/employee/payroll/template/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll Template"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $payroll_template = $this->repo->deletable($uuid);

        $this->repo->delete($payroll_template);

        return $this->success(['message' => trans('employee.payroll_template_deleted')]);
    }
}
