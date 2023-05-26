<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StockPurchaseRequest;
use App\Models\Inventory\StockPurchase;
use App\Repositories\Inventory\StockPurchaseRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StockPurchaseController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'stock_purchase';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        StockPurchaseRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/stock/purchase/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', StockPurchase::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Stock Purchases
     * @get ("/api/stock/purchase")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', StockPurchase::class);

        $stock_purchases = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('stock_purchases', 'filters'));
    }

    /**
     * Used to print all Stock Purchases
     * @post ("/api/stock/purchase/print")
     * @return Response
     */
    public function print()
    {
        $stock_purchases = $this->repo->print(request('filter'));

        return view('print.inventory.stock-purchase', compact('stock_purchases'))->render();
    }

    /**
     * Used to generate pdf all Stock Purchases
     * @post ("/api/stock/purchase/pdf")
     * @return Response
     */
    public function pdf()
    {
        $stock_purchases = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.inventory.stock-purchase', compact('stock_purchases'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Stock Purchase
     * @post ("/api/stock/purchase")
     * @param ({
     *      @Parameter("vendor_id", type="integer", required="required", description="Id of Vendor"),
     *      @Parameter("date", type="date", required="required", description="Date of Purchase"),
     * })
     * @return Response
     */
    public function store(StockPurchaseRequest $request)
    {
        $this->authorize('create', StockPurchase::class);

        $stock_purchase = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('inventory.stock_purchase_added')]);
    }

    /**
     * Used to get Stock Purchase detail
     * @get ("/api/stock/purchase/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Stock Purchase"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', StockPurchase::class);

        $stock_purchase = $this->repo->findOrFail($id);

        $attachments = $this->upload->getAttachment($this->module, $stock_purchase->id);

        return $this->success(compact('stock_purchase', 'attachments'));
    }

    /**
     * Used to update Stock Purchase
     * @patch ("/api/stock/purchase/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Stock Purchase"),
     *      @Parameter("vendor_id", type="integer", required="required", description="Id of Vendor"),
     *      @Parameter("date", type="date", required="required", description="Date of Purchase"),
     * })
     * @return Response
     */
    public function update($id, StockPurchaseRequest $request)
    {
        $this->authorize('update', StockPurchase::class);

        $stock_purchase = $this->repo->findOrFail($id);

        $stock_purchase = $this->repo->update($stock_purchase, $this->request->all());

        return $this->success(['message' => trans('inventory.stock_purchase_updated')]);
    }

    /**
     * Used to delete Stock Purchase
     * @delete ("/api/stock/purchase/{id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Unique Id of Stock Purchase"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', StockPurchase::class);

        $stock_purchase = $this->repo->findOrFail($id);

        $this->upload->delete($this->module, $stock_purchase->id);

        $this->repo->delete($stock_purchase);

        return $this->success(['message' => trans('inventory.stock_purchase_deleted')]);
    }

    /**
     * Used to download Stock Purchase Attachments
     * @get ("/stock/purchase/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Stock Purchase"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($id, $attachment_uuid)
    {
        $this->authorize('list', StockPurchase::class);
        
        $stock_purchase = $this->repo->findOrFail($id);

        $attachment = $this->upload->getAttachment($this->module, $stock_purchase->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}