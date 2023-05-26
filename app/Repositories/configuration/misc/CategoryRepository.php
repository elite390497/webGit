<?php
namespace App\Repositories\Configuration\Misc;

use App\Models\Configuration\Misc\Category;
use Illuminate\Validation\ValidationException;

class CategoryRepository
{
    protected $category;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Category $category
    ) {
        $this->category = $category;
    }

    /**
     * Get category query
     *
     * @return Category query
     */
    public function getQuery()
    {
        return $this->category;
    }

    /**
     * Count category
     *
     * @return integer
     */
    public function count()
    {
        return $this->category->count();
    }

    /**
     * List all categories by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->category->all()->pluck('name', 'id')->all();
    }

    /**
     * List all categories by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->category->all(['name', 'id']);
    }

    /**
     * List all categories by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->category->all()->pluck('id')->all();
    }

    /**
     * Get all categories
     *
     * @return array
     */
    public function getAll()
    {
        return $this->category->all();
    }

    /**
     * Find category with given id.
     *
     * @param integer $id
     * @return Category
     */
    public function find($id)
    {
        return $this->category->find($id);
    }

    /**
     * Find category with given id or throw an error.
     *
     * @param integer $id
     * @return Category
     */
    public function findOrFail($id)
    {
        $category = $this->category->find($id);

        if (! $category) {
            throw ValidationException::withMessages(['message' => trans('misc.could_not_find_category')]);
        }

        return $category;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Category
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->category->orderBy($sort_by, $order);
    }

    /**
     * Paginate all categories using given params.
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
     * @return Category
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new category.
     *
     * @param array $params
     * @return Category
     */
    public function create($params)
    {
        return $this->category->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $category_id
     * @return array
     */
    private function formatParams($params, $category_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given category.
     *
     * @param Category $category
     * @param array $params
     *
     * @return Category
     */
    public function update(Category $category, $params)
    {
        return $category->forceFill($this->formatParams($params, $category->id))->save();
    }

    /**
     * Delete category.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Category $category)
    {
        return $category->delete();
    }

    /**
     * Delete multiple categories.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->category->whereIn('id', $ids)->delete();
    }
}
