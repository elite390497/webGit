<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Models\Finance\Transaction\Transaction;
use App\Http\Requests\Employee\PayrollTransactionRequest;
use App\Repositories\Employee\PayrollTransactionRepository;

class PayrollTransactionController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'payroll_transaction';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        PayrollTransactionRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/payroll/transaction/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('getPayrollTransactionPreRequisite', Transaction::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Payroll Transactions
     * @get ("/api/employee/payroll/transaction")
     * @return Response
     */
    public function index()
    {
        $this->authorize('listPayrollTransaction', Transaction::class);

        $payroll_transactions = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('payroll_transactions', 'filters'));
    }

    /**
     * Used to print all Payroll Transactions
     * @post ("/api/employee/payroll/transaction/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('listPayrollTransaction', Transaction::class);

        $payroll_transactions = $this->repo->print(request('filter'));

        return view('print.employee.payroll.transaction', compact('payroll_transactions'))->render();
    }

    /**
     * Used to generate pdf all Payroll Transactions
     * @post ("/api/employee/payroll/transaction/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('listPayrollTransaction', Transaction::class);

        $payroll_transactions = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.employee.payroll.transaction', compact('payroll_transactions'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get advance balance of an employee
     * @post ("/api/employee/payroll/transaction/advance/balance")
     * @return Response
     */
    public function advanceBalance()
    {
        $this->authorize('listPayrollTransaction', Transaction::class);

        return $this->success($this->repo->advanceBalance($this->request->all()));
    }

    /**
     * Used to store Payroll Transaction
     * @post ("/api/employee/payroll/transaction")
     * @param ({
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Transaction"),
     *      @Parameter("date", type="date", required="true", description="Date of Transaction"),
     *      @Parameter("remarks", type="text", required="optional", description="Remarks for Transaction")
     * })
     * @return Response
     */
    public function store(PayrollTransactionRequest $request)
    {
        $this->authorize('createPayrollTransaction', Transaction::class);

        $payroll_transaction = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.payroll_transaction_added')]);
    }

    /**
     * Used to get Payroll Transaction detail
     * @get ("/api/employee/payroll/transaction/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll Transaction"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('listPayrollTransaction', Transaction::class);

        $payroll_transaction = $this->repo->findByUuidOrFail($uuid);

        $attachments = $this->upload->getAttachment($this->module, $payroll_transaction->id);

        $selected_employee = getSelectedEmployee($payroll_transaction->employee);

        return $this->success(compact('payroll_transaction','selected_employee'));
    }

    /**
     * Used to update Payroll Transaction
     * @patch ("/api/employee/payroll/transaction/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll Transaction"),
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Transaction"),
     *      @Parameter("date", type="date", required="true", description="Date of Transaction"),
     *      @Parameter("remarks", type="text", required="optional", description="Remarks for Transaction")
     * })
     * @return Response
     */
    public function update(PayrollTransactionRequest $request, $uuid)
    {
        $payroll_transaction = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('updatePayrollTransaction', $payroll_transaction);

        $payroll_transaction = $this->repo->update($payroll_transaction, $this->request->all());

        return $this->success(['message' => trans('employee.payroll_transaction_updated')]);
    }

    /**
     * Used to cancel Payroll Transaction
     * @delete ("/api/employee/payroll/transaction/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll Transaction"),
     * })
     * @return Response
     */
    public function cancel($uuid)
    {
        $payroll_transaction = $this->repo->cancellable($uuid);

        $this->authorize('cancelPayrollTransaction', $payroll_transaction);

        $this->repo->cancel($payroll_transaction);

        return $this->success(['message' => trans('employee.payroll_transaction_cancelled')]);
    }

    /**
     * Used to download Payroll Transaction Attachments
     * @get ("/employee/payroll/transaction/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Payroll Transaction"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $this->authorize('listPayrollTransaction', Transaction::class);
        
        $payroll_transaction = $this->repo->findByUuidOrFail($uuid);

        $attachment = $this->upload->getAttachment($this->module, $payroll_transaction->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
