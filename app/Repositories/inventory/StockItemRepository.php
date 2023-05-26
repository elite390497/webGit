<?php
namespace App\Repositories\Inventory;

use App\Models\Inventory\StockItem;
use App\Repositories\Inventory\StockCategoryRepository;
use Illuminate\Validation\ValidationException;

class StockItemRepository
{
    protected $stock_item;
    protected $stock_category;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StockItem $stock_item,
        StockCategoryRepository $stock_category
    ) {
        $this->stock_item = $stock_item;
        $this->stock_category = $stock_category;
    }

    /**
     * Get stock item query
     *
     * @return StockItem query
     */
    public function getQuery()
    {
        return $this->stock_item;
    }

    /**
     * Count stock item
     *
     * @return integer
     */
    public function count()
    {
        return $this->stock_item->count();
    }

    /**
     * Get all stock items
     *
     * @return array
     */
    public function getAll()
    {
        return $this->stock_item->all();
    }

    /**
     * List all stock items by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->stock_item->get(['name', 'id']);
    }

    /**
     * List all stock items by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->stock_item->get()->pluck('id')->all();
    }

    /**
     * Find stock item with given id.
     *
     * @param integer $id
     * @return StockItem
     */
    public function find($id)
    {
        return $this->stock_item->info()->find($id);
    }

    /**
     * Find stock item with given id or throw an error.
     *
     * @param integer $id
     * @return StockItem
     */
    public function findOrFail($id, $field = 'message')
    {
        $stock_item = $this->stock_item->info()->find($id);

        if (! $stock_item) {
            throw ValidationException::withMessages([$field => trans('inventory.could_not_find_stock_item')]);
        }

        return $stock_item;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return StockItem
     */
    public function getData($params)
    {
        $sort_by           = gv($params, 'sort_by', 'name');
        $order             = gv($params, 'order', 'desc');
        $name              = gv($params, 'name');
        $code              = gv($params, 'code');
        $stock_category_id = gv($params, 'stock_category_id');
        $stock_category_id = is_array($stock_category_id) ? $stock_category_id : ($stock_category_id ? explode(',', $stock_category_id) : []);

        $query = $this->stock_item->info();

        if (count($stock_category_id)) {
            $query->whereIn('stock_category_id', $stock_category_id);
        }

        return $query->filterByName($name)->filterByCode($code)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all stock items using given params.
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
     * @return StockItem
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get stock item pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $stock_categories = $this->stock_category->selectAll();

        return compact('stock_categories');
    }

    /**
     * Get stock item filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Create a new stock item.
     *
     * @param array $params
     * @return StockItem
     */
    public function create($params)
    {
        $stock_item = $this->stock_item->forceCreate($this->formatParams($params));

        return $stock_item;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $stock_item_id
     * @return array
     */
    private function formatParams($params, $stock_item_id = null)
    {
        $name              = gv($params, 'name');
        $code              = gv($params, 'code');
        $opening_quantity  = gv($params, 'opening_quantity', 0);
        $description       = gv($params, 'description');
        $stock_category_id = gv($params, 'stock_category_id');

        $stock_category = $this->stock_category->findOrFail($stock_category_id);

        $formatted = [
            'name'              => $name,
            'code'              => $code,
            'opening_quantity'  => $opening_quantity,
            'stock_category_id' => $stock_category_id,
            'description'       => $description
        ];

        $options = array();

        $formatted['options'] = $options;
        return $formatted;
    }

    /**
     * Update given stock item.
     *
     * @param StockItem $stock_item
     * @param array $params
     *
     * @return StockItem
     */
    public function update(StockItem $stock_item, $params)
    {
        $stock_item->forceFill($this->formatParams($params, $stock_item->id))->save();

        return $stock_item;
    }

    /**
     * Find whether stock item is deletable or not.
     *
     * @param integer $id
     * @return StockItem $stock_item
     */
    public function deletable($id)
    {
        $stock_item = $this->findOrFail($id);
        
        return $stock_item;
    }

    /**
     * Delete stock item.
     *
     * @param StockItem $stock_item
     * @return bool|null
     */
    public function delete(StockItem $stock_item)
    {
        return $stock_item->delete();
    }

    /**
     * Delete multiple stock items.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->stock_item->whereIn('id', $ids)->delete();
    }
}