<?php

namespace App\Http\Controllers\Finance\Transaction;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Finance\Transaction\AccountTransfer;
use App\Repositories\Upload\UploadRepository;
use App\Http\Requests\Finance\Transaction\AccountTransferRequest;
use App\Repositories\Finance\Transaction\AccountTransferRepository;

class AccountTransferController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;

    protected $module = 'account-transfer';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        AccountTransferRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/account/transfer/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', AccountTransfer::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Account Transfer
     * @get ("/api/account/transfer")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', AccountTransfer::class);

        $account_transfers = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('account_transfers', 'filters'));
    }

    /**
     * Used to print all Account Transfer
     * @post ("/api/account/transfer/print")
     * @return Response
     */
    public function print()
    {
        $account_transfers = $this->repo->print(request('filter'));

        return view('print.finance.transaction.account-transfer', compact('account_transfers'))->render();
    }

    /**
     * Used to generate pdf all Account Transfer
     * @post ("/api/account/transfer/pdf")
     * @return Response
     */
    public function pdf()
    {
        $account_transfers = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.transaction.account-transfer', compact('account_transfers'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Account Transfer
     * @post ("/api/account/transfer")
     * @param ({
     *      @Parameter("from_account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("to_account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("date_of_account_transfer", type="date", required="true", description="Date of Account Transfer"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Account Transfer"),
     *      @Parameter("description", type="text", required="optional", description="Description of Account Transfer")
     * })
     * @return Response
     */
    public function store(AccountTransferRequest $request)
    {
        $this->authorize('create', AccountTransfer::class);

        $account_transfer = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.account_transfer_added')]);
    }

    /**
     * Used to get Account Transfer detail
     * @get ("/api/account/transfer/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Account Transfer"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', AccountTransfer::class);

        $account_transfer = $this->repo->findByUuidOrFail($uuid);

        $attachments = $this->upload->getAttachment($this->module, $account_transfer->id);

        return $this->success(compact('account_transfer', 'attachments'));
    }

    /**
     * Used to get Account Transfer detail
     * @get ("/finance/transaction/account/transfer/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Account Transfer"),
     * })
     * @return Response
     */
    public function printAccountTransfer($uuid)
    {
        $this->authorize('list', AccountTransfer::class);

        $account_transfer = $this->repo->findByUuidOrFail($uuid);

        return view('print.finance.transaction.account-transfer-receipt', compact('account_transfer'));
    }

    /**
     * Used to update Account Transfer
     * @patch ("/api/account/transfer/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Account Transfer"),
     *      @Parameter("from_account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("to_account_id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("payment_method_id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("date_of_account_transfer", type="date", required="true", description="Date of Account Transfer"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Account Transfer"),
     *      @Parameter("description", type="text", required="optional", description="Description of Account Transfer")
     * })
     * @return Response
     */
    public function update($uuid, AccountTransferRequest $request)
    {
        $account_transfer = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('update', $account_transfer);

        $account_transfer = $this->repo->update($account_transfer, $this->request->all());

        return $this->success(['message' => trans('finance.account_transfer_updated')]);
    }

    /**
     * Used to cancel Account Transfer
     * @delete ("/api/account/transfer/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Account Transfer"),
     * })
     * @return Response
     */
    public function cancel($uuid)
    {
        $account_transfer = $this->repo->cancellable($uuid);

        $this->authorize('cancel', $account_transfer);

        $this->repo->cancel($account_transfer);

        return $this->success(['message' => trans('finance.account_transfer_cancelled')]);
    }

    /**
     * Used to download Account Transfer attachment
     * @get ("/finance/transaction/account/transfer/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Account Transfer"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $this->authorize('list', AccountTransfer::class);

        $account_transfer = $this->repo->findByUuidOrFail($uuid);

        $attachment = $this->upload->getAttachment($this->module, $account_transfer->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
