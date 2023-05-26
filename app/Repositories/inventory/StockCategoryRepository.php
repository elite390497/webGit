<?php
namespace App\Repositories\Inventory;

use Illuminate\Validation\ValidationException;
use App\Models\Inventory\StockCategory;

class StockCategoryRepository
{
    protected $stock_category;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StockCategory $stock_category
    ) {
        $this->stock_category = $stock_category;
    }

    /**
     * Get stock category query
     *
     * @return StockCategory query
     */
    public function getQuery()
    {
        return $this->stock_category;
    }

    /**
     * Count stock category
     *
     * @return integer
     */
    public function count()
    {
        return $this->stock_category->count();
    }

    /**
     * Get all stock categories
     *
     * @return array
     */
    public function getAll()
    {
        return $this->stock_category->all();
    }

    /**
     * List all stock categories by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->stock_category->get(['name', 'id']);
    }

    /**
     * Find stock category with given id.
     *
     * @param integer $id
     * @return StockCategory
     */
    public function find($id)
    {
        return $this->stock_category->info()->find($id);
    }

    /**
     * Find stock category with given id or throw an error.
     *
     * @param integer $id
     * @return StockCategory
     */
    public function findOrFail($id, $field = 'message')
    {
        $stock_category = $this->stock_category->info()->find($id);

        if (! $stock_category) {
            throw ValidationException::withMessages([$field => trans('inventory.could_not_find_stock_category')]);
        }

        return $stock_category;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return StockCategory
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'desc');
        $name    = gv($params, 'name');

        return $this->stock_category->info()->filterByName($name)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all stock categories using given params.
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
     * @return StockCategory
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get stock category pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return [];
    }

    /**
     * Get stock category filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return [];
    }

    /**
     * Create a new stock category.
     *
     * @param array $params
     * @return StockCategory
     */
    public function create($params)
    {
        $stock_category = $this->stock_category->forceCreate($this->formatParams($params));

        return $stock_category;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $stock_category_id
     * @return array
     */
    private function formatParams($params, $stock_category_id = null)
    {
        $name        = gv($params, 'name');
        $description = gv($params, 'description');

        $formatted = [
            'name'        => $name,
            'description' => $description
        ];

        $options = array();

        $formatted['options'] = $options;
        return $formatted;
    }

    /**
     * Update given stock category.
     *
     * @param StockCategory $stock_category
     * @param array $params
     *
     * @return StockCategory
     */
    public function update(StockCategory $stock_category, $params)
    {
        $stock_category->forceFill($this->formatParams($params, $stock_category->id))->save();

        return $stock_category;
    }

    /**
     * Find whether stock category is deletable or not.
     *
     * @param integer $id
     * @return StockCategory $stock_category
     */
    public function deletable($id)
    {
        $stock_category = $this->findOrFail($id);
        
        if ($this->stock_category->items()->count()) {
            throw ValidationException::withMessages(['message' => trans('inventory.stock_category_associated_with_item')]);
        }

        return $stock_category;
    }

    /**
     * Delete stock category.
     *
     * @param StockCategory $stock_category
     * @return bool|null
     */
    public function delete(StockCategory $stock_category)
    {
        return $stock_category->delete();
    }

    /**
     * Delete multiple stock categories.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->stock_category->whereIn('id', $ids)->delete();
    }
}