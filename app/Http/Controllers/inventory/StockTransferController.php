<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StockTransferRequest;
use App\Http\Requests\Inventory\StockTransferReturnRequest;
use App\Models\Inventory\StockTransfer;
use App\Repositories\Inventory\StockTransferRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StockTransferController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'stock_transfer';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        StockTransferRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/stock/transfer/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', StockTransfer::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Stock Transfers
     * @get ("/api/stock/transfer")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', StockTransfer::class);

        $stock_transfers = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('stock_transfers', 'filters'));
    }

    /**
     * Used to print all Stock Transfers
     * @post ("/api/stock/transfer/print")
     * @return Response
     */
    public function print()
    {
        $stock_transfers = $this->repo->print(request('filter'));

        return view('print.inventory.stock-transfer', compact('stock_transfers'))->render();
    }

    /**
     * Used to generate pdf all Stock Transfers
     * @post ("/api/stock/transfer/pdf")
     * @return Response
     */
    public function pdf()
    {
        $stock_transfers = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.inventory.stock-transfer', compact('stock_transfers'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Stock Transfer
     * @post ("/api/stock/transfer")
     * @param ({
     *      @Parameter("vendor_id", type="integer", required="required", description="Id of Vendor"),
     *      @Parameter("date", type="date", required="required", description="Date of Transfer"),
     * })
     * @return Response
     */
    public function store(StockTransferRequest $request)
    {
        $this->authorize('create', StockTransfer::class);

        $stock_transfer = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('inventory.stock_transfer_added')]);
    }

    /**
     * Used to get Stock Transfer detail
     * @get ("/api/stock/transfer/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Stock Transfer"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', StockTransfer::class);

        $stock_transfer = $this->repo->findOrFail($id);

        $attachments = $this->upload->getAttachment($this->module, $stock_transfer->id);

        $selected_student = ($stock_transfer->student_id) ? ['id' => $stock_transfer->student_id, 'name' => $stock_transfer->Student->name.' ('.$stock_transfer->Student->Parent->first_guardian_name.' '.$stock_transfer->Student->contact_number.')'] : [];

        $selected_employee = ($stock_transfer->employee_id) ? ['id' => $stock_transfer->employee_id, 'name' => $stock_transfer->Employee->name.' ('.$stock_transfer->Employee->contact_number.')'] : [];

        $selected_room = ($stock_transfer->room_id) ? ['id' => $stock_transfer->room_id, 'name' => $stock_transfer->room->name] : [];

        return $this->success(compact('stock_transfer', 'attachments','selected_student','selected_employee','selected_room'));
    }

    /**
     * Used to update Stock Transfer
     * @patch ("/api/stock/transfer/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Stock Transfer"),
     *      @Parameter("vendor_id", type="integer", required="required", description="Id of Vendor"),
     *      @Parameter("date", type="date", required="required", description="Date of Transfer"),
     * })
     * @return Response
     */
    public function update($id, StockTransferRequest $request)
    {
        $this->authorize('update', StockTransfer::class);

        $stock_transfer = $this->repo->findOrFail($id);

        $stock_transfer = $this->repo->update($stock_transfer, $this->request->all());

        return $this->success(['message' => trans('inventory.stock_transfer_updated')]);
    }

    /**
     * Used to delete Stock Transfer
     * @delete ("/api/stock/transfer/{id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Unique Id of Stock Transfer"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', StockTransfer::class);

        $stock_transfer = $this->repo->findOrFail($id);

        $this->upload->delete($this->module, $stock_transfer->id);

        $this->repo->delete($stock_transfer);

        return $this->success(['message' => trans('inventory.stock_transfer_deleted')]);
    }

    /**
     * Used to return Stock Transfer Item
     * @post ("/api/stock/transfer/{id}/return")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Stock Transfer")
     * })
     * @return Response
     */
    public function returnItem($id, StockTransferReturnRequest $request)
    {
        $this->authorize('update', StockTransfer::class);

        $stock_transfer = $this->repo->findOrFail($id);

        $stock_transfer = $this->repo->returnItem($stock_transfer, $this->request->all());

        return $this->success(['message' => trans('inventory.stock_transfer_updated')]);
    }

    /**
     * Used to delete Stock Transfer Return
     * @delete ("/api/stock/transfer/{id}/return/{return_id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Unique Id of Stock Transfer"),
     * })
     * @return Response
     */
    public function destroyReturn($id, $return_id)
    {
        $this->authorize('delete', StockTransfer::class);

        $stock_transfer = $this->repo->findOrFail($id);

        $this->repo->deleteReturn($stock_transfer, $return_id);

        return $this->success(['message' => trans('inventory.stock_transfer_return_deleted')]);
    }

    /**
     * Used to download Stock Transfer Attachments
     * @get ("/stock/transfer/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Stock Transfer"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($id, $attachment_uuid)
    {
        $this->authorize('list', StockTransfer::class);
        
        $stock_transfer = $this->repo->findOrFail($id);

        $attachment = $this->upload->getAttachment($this->module, $stock_transfer->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}