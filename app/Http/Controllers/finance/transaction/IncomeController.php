<?php

namespace App\Http\Controllers\Finance\Transaction;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Finance\Transaction\Income;
use App\Repositories\Upload\UploadRepository;
use App\Http\Requests\Finance\Transaction\IncomeRequest;
use App\Repositories\Finance\Transaction\IncomeRepository;

class IncomeController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;

    protected $module = 'income';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        IncomeRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/income/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Income::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Incomes
     * @get ("/api/income")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Income::class);

        $incomes = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('incomes', 'filters'));
    }

    /**
     * Used to print all Incomes
     * @post ("/api/income/print")
     * @return Response
     */
    public function print()
    {
        $incomes = $this->repo->print(request('filter'));

        return view('print.finance.transaction.income', compact('incomes'))->render();
    }

    /**
     * Used to generate pdf all Incomes
     * @post ("/api/income/pdf")
     * @return Response
     */
    public function pdf()
    {
        $incomes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.transaction.income', compact('incomes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Income
     * @post ("/api/income")
     * @param ({
     *      @Parameter("transaction_category_id", type="integer", required="true", description="Transaction Category of Income"),
     *      @Parameter("account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("date_of_income", type="date", required="true", description="Date of Income"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Income"),
     *      @Parameter("description", type="text", required="optional", description="Description of Income")
     * })
     * @return Response
     */
    public function store(IncomeRequest $request)
    {
        $this->authorize('create', Income::class);

        $income = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.income_added')]);
    }

    /**
     * Used to get Income detail
     * @get ("/api/income/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Income"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', Income::class);

        $income = $this->repo->findByUuidOrFail($uuid);

        $attachments = $this->upload->getAttachment($this->module, $income->id);

        return $this->success(compact('income', 'attachments'));
    }

    /**
     * Used to get Income detail
     * @get ("/finance/transaction/income/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Income"),
     * })
     * @return Response
     */
    public function printIncome($uuid)
    {
        $this->authorize('list', Income::class);

        $income = $this->repo->findByUuidOrFail($uuid);

        return view('print.finance.transaction.income-receipt', compact('income'));
    }

    /**
     * Used to update Income
     * @patch ("/api/income/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Income"),
     *      @Parameter("transaction_category_id", type="integer", required="true", description="Transaction Category of Income"),
     *      @Parameter("account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("date_of_income", type="date", required="true", description="Date of Income"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Income"),
     *      @Parameter("description", type="text", required="optional", description="Description of Income")
     * })
     * @return Response
     */
    public function update($uuid, IncomeRequest $request)
    {
        $income = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('update', $income);

        $income = $this->repo->update($income, $this->request->all());

        return $this->success(['message' => trans('finance.income_updated')]);
    }

    /**
     * Used to cancel Income
     * @delete ("/api/income/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Income"),
     * })
     * @return Response
     */
    public function cancel($uuid)
    {
        $income = $this->repo->cancellable($uuid);

        $this->authorize('cancel', $income);

        $this->repo->cancel($income);

        return $this->success(['message' => trans('finance.income_cancelled')]);
    }

    /**
     * Used to download Income attachment
     * @get ("/finance/transaction/income/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Income"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $this->authorize('list', Income::class);

        $income = $this->repo->findByUuidOrFail($uuid);

        $attachment = $this->upload->getAttachment($this->module, $income->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
