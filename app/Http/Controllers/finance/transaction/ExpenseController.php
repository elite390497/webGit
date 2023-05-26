<?php

namespace App\Http\Controllers\Finance\Transaction;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Finance\Transaction\Expense;
use App\Repositories\Upload\UploadRepository;
use App\Http\Requests\Finance\Transaction\ExpenseRequest;
use App\Repositories\Finance\Transaction\ExpenseRepository;

class ExpenseController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;

    protected $module = 'expense';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        ExpenseRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/expense/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Expense::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Expenses
     * @get ("/api/expense")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Expense::class);

        $expenses = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('expenses', 'filters'));
    }

    /**
     * Used to print all Expenses
     * @post ("/api/expense/print")
     * @return Response
     */
    public function print()
    {
        $expenses = $this->repo->print(request('filter'));

        return view('print.finance.transaction.expense', compact('expenses'))->render();
    }

    /**
     * Used to generate pdf all Expenses
     * @post ("/api/expense/pdf")
     * @return Response
     */
    public function pdf()
    {
        $expenses = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.transaction.expense', compact('expenses'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Expense
     * @post ("/api/expense")
     * @param ({
     *      @Parameter("transaction_category_id", type="integer", required="true", description="Transaction Category of Expense"),
     *      @Parameter("account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("date_of_expense", type="date", required="true", description="Date of Expense"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Expense"),
     *      @Parameter("description", type="text", required="optional", description="Description of Expense")
     * })
     * @return Response
     */
    public function store(ExpenseRequest $request)
    {
        $this->authorize('create', Expense::class);

        $expense = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.expense_added')]);
    }

    /**
     * Used to get Expense detail
     * @get ("/api/expense/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Expense"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', Expense::class);

        $expense = $this->repo->findByUuidOrFail($uuid);

        $attachments = $this->upload->getAttachment($this->module, $expense->id);

        return $this->success(compact('expense', 'attachments'));
    }

    /**
     * Used to get Expense detail
     * @get ("/finance/transaction/expense/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Expense"),
     * })
     * @return Response
     */
    public function printExpense($uuid)
    {
        $this->authorize('list', Expense::class);

        $expense = $this->repo->findByUuidOrFail($uuid);

        return view('print.finance.transaction.expense-receipt', compact('expense'));
    }

    /**
     * Used to update Expense
     * @patch ("/api/expense/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Expense"),
     *      @Parameter("transaction_category_id", type="integer", required="true", description="Transaction Category of Expense"),
     *      @Parameter("account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("date_of_expense", type="date", required="true", description="Date of Expense"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Expense"),
     *      @Parameter("description", type="text", required="optional", description="Description of Expense")
     * })
     * @return Response
     */
    public function update($uuid, ExpenseRequest $request)
    {
        $expense = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('update', $expense);

        $expense = $this->repo->update($expense, $this->request->all());

        return $this->success(['message' => trans('finance.expense_updated')]);
    }

    /**
     * Used to cancel Expense
     * @delete ("/api/expense/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Expense"),
     * })
     * @return Response
     */
    public function cancel($uuid)
    {
        $expense = $this->repo->cancellable($uuid);

        $this->authorize('cancel', $expense);

        $this->repo->cancel($expense);

        return $this->success(['message' => trans('finance.expense_cancelled')]);
    }

    /**
     * Used to download Expense attachment
     * @get ("/finance/transaction/expense/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Expense"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $this->authorize('list', Expense::class);

        $expense = $this->repo->findByUuidOrFail($uuid);

        $attachment = $this->upload->getAttachment($this->module, $expense->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
