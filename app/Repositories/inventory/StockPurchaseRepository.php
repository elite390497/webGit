<?php
namespace App\Repositories\Inventory;

use App\Models\Inventory\StockPurchase;
use App\Models\Inventory\StockPurchaseDetail;
use App\Repositories\Inventory\StockItemRepository;
use App\Repositories\Inventory\VendorRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StockPurchaseRepository
{
    protected $stock_purchase;
    protected $stock_purchase_detail;
    protected $vendor;
    protected $stock_item;
    protected $upload;
    protected $module = 'stock_purchase';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StockPurchase $stock_purchase,
        StockPurchaseDetail $stock_purchase_detail,
        VendorRepository $vendor,
        StockItemRepository $stock_item,
        UploadRepository $upload
    ) {
        $this->stock_purchase = $stock_purchase;
        $this->stock_purchase_detail = $stock_purchase_detail;
        $this->vendor = $vendor;
        $this->stock_item = $stock_item;
        $this->upload = $upload;
    }

    /**
     * Find stock purchase with given id.
     *
     * @param integer $id
     * @return StockPurchase
     */
    public function find($id)
    {
        return $this->stock_purchase->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find stock purchase with given id or throw an error.
     *
     * @param integer $id
     * @return StockPurchase
     */
    public function findOrFail($id, $field = 'message')
    {
        $stock_purchase = $this->stock_purchase->info()->filterBySession()->filterById($id)->first();

        if (! $stock_purchase) {
            throw ValidationException::withMessages([$field => trans('inventory.could_not_find_stock_purchase')]);
        }

        return $stock_purchase;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return StockPurchase
     */
    public function getData($params)
    {
        $sort_by           = gv($params, 'sort_by', 'date');
        $order             = gv($params, 'order', 'desc');
        $vendor_id   = gv($params, 'vendor_id', []);

        $vendor_id   = is_array($vendor_id) ? $vendor_id : ($vendor_id ? explode(',', $vendor_id) : []);

        $date_start_date = gv($params, 'date_start_date');
        $date_end_date   = gv($params, 'date_end_date');

        $query = $this->stock_purchase->info()->filterBySession()->dateBetween([
            'start_date' => $date_start_date,
            'end_date' => $date_end_date
        ]);

        if (count($vendor_id)) {
            $query->whereIn('vendor_id', $vendor_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all stock purchases using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return StockPurchase
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get stock purchase filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $vendors   = $this->vendor->selectAll();
        $stock_items   = $this->stock_item->selectAll();

        return compact('vendors', 'stock_items');
    }

    /**
     * Create a new stock purchase.
     *
     * @param array $params
     * @return StockPurchase
     */
    public function create($params)
    {
        $this->validateInput($params);

        beginTransaction();

        $stock_purchase = $this->stock_purchase->forceCreate([
            'date'         => toDate(gv($params, 'date')),
            'number'       => gv($params, 'number'),
            'vendor_id'    => gv($params, 'vendor_id'),
            'description'  => gv($params, 'description'),
            'user_id'      => \Auth::user()->id,
            'upload_token' => gv($params, 'upload_token') ? : Str::uuid(),
            'options'      => []
        ]);

        foreach (gv($params, 'details') as $detail) {
            $stock_purchase_detail = $this->stock_purchase_detail->forceCreate([
                'stock_purchase_id' => $stock_purchase->id,
                'quantity'      => gv($detail, 'quantity', 0),
                'unit_price'    => gv($detail, 'unit_price', 0),
                'stock_item_id' => gv($detail, 'stock_item_id'),
                'description'   => gv($detail, 'description'),
                'options'       => []
            ]);

            $stock_item = $stock_purchase_detail->item;
            $stock_item->increment('quantity', $stock_purchase_detail->quantity);
        }
        
        $this->processUpload($stock_purchase, $params);

        commitTransaction();

        return $stock_purchase;
    }

    /**
     * Upload attachment
     *
     * @param StockPurchase $stock_purchase
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(StockPurchase $stock_purchase, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $stock_purchase->id, $upload_token);
        } else {
            $this->upload->update($this->module, $stock_purchase->id, $upload_token);
        }
    }

    /**
     * Validate stock purchase input.
     *
     * @param array $params
     * @return void
     */
    public function validateInput($params, $stock_purchase_id = null)
    {
        $vendor = $this->vendor->findOrFail(gv($params, 'vendor_id'));

        if (! dateBetweenSession(gv($params, 'date'))) {
            throw ValidationException::withMessages(['date' => trans('academic.invalid_session_date_range')]);
        }

        $details = gv($params, 'details');

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('inventory.no_item_found')]);
        }

        $stock_item_ids    = $this->stock_item->listId();

        $item_ids = array();
        foreach ($details as $index => $detail) {
            $stock_item_id = gv($detail, 'stock_item_id');
            $quantity      = gv($detail, 'quantity', 0);
            $unit_price    = gv($detail, 'unit_price', 0);

            if (! isInteger($quantity) || $quantity <= 0) {
                throw ValidationException::withMessages([$index.'_quantity' => trans('validation.required', ['attribute' => trans('inventory.stock_purchase_quantity')])]);
            }

            if (! is_numeric($unit_price) || $unit_price < 0) {
                throw ValidationException::withMessages([$index.'_unit_price' => trans('validation.required', ['attribute' => trans('inventory.stock_purchase_unit_price')])]);
            }

            if (! in_array($stock_item_id, $stock_item_ids)) {
                throw ValidationException::withMessages([$index.'_stock_item_id' => trans('inventory.could_not_find_stock_item')]);
            }

            $item_ids[] = $stock_item_id;
        }

        if (count($item_ids) > count(array_unique($item_ids))) {
            throw ValidationException::withMessages(['message' => trans('inventory.duplicate_item_found')]);
        }
    }

    /**
     * Update given stock purchase.
     *
     * @param StockPurchase $stock_purchase
     * @param array $params
     *
     * @return StockPurchase
     */
    public function update(StockPurchase $stock_purchase, $params)
    {
        $this->validateInput($params, $stock_purchase->id);

        beginTransaction();

        $stock_purchase->date        = toDate(gv($params, 'date'));
        $stock_purchase->number      = gv($params, 'number');
        $stock_purchase->vendor_id   = gv($params, 'vendor_id');
        $stock_purchase->description = gv($params, 'description');
        $stock_purchase->save();

        $stock_item_id = array();
        foreach ($params['details'] as $detail) {
            $stock_item_id[] = gv($detail, 'stock_item_id');
        }

        $existing_stock_item_ids = $stock_purchase->details->pluck('stock_item_id')->all();
        foreach ($existing_stock_item_ids as $existing_stock_item_id) {
            if (! in_array($existing_stock_item_id, $stock_item_id)) {
                $stock_purchase_detail = $this->stock_purchase_detail->whereStockItemId($existing_stock_item_id)->first();
                $stock_item = $stock_purchase_detail->item;
                $stock_item->decrement('quantity', $stock_purchase_detail->quantity);
                $stock_purchase_detail->delete();
            }
        }

        foreach ($params['details'] as $detail) {
            $stock_purchase_detail = $this->stock_purchase_detail->firstOrCreate([
                'stock_item_id' => gv($detail, 'stock_item_id')
            ]);

            $old_quantity = $stock_purchase_detail->quantity ? : 0;

            $stock_purchase_detail->quantity    = gv($detail, 'quantity', 0);
            $stock_purchase_detail->unit_price  = gv($detail, 'unit_price', 0);
            $stock_purchase_detail->description = gv($detail, 'description');
            $stock_purchase_detail->options     = [];
            $stock_purchase_detail->save();

            if ($old_quantity != $stock_purchase_detail->quantity) {
                $stock_item = $stock_purchase_detail->item;
                $stock_item->decrement('quantity', $old_quantity);
                $stock_item->increment('quantity', $stock_purchase_detail->quantity);
            }
        }

        $this->processUpload($stock_purchase, $params, 'update');

        commitTransaction();
    }

    /**
     * Delete stock purchase.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StockPurchase $stock_purchase)
    {
        beginTransaction();

        foreach ($stock_purchase->details as $detail) {
            $stock_item = $detail->item;
            $stock_item->decrement('quantity', $detail->quantity);
        }

        $stock_purchase->delete();

        commitTransaction();
    }

    /**
     * Delete multiple stock purchase.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->stock_purchase->whereIn('id', $ids)->delete();
    }
}
