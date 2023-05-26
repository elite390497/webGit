<?php
namespace App\Repositories\Configuration\Post;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Post\ArticleType;

class ArticleTypeRepository
{
    protected $article_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        ArticleType $article_type
    ) {
        $this->article_type = $article_type;
    }

    /**
     * Get article type query
     *
     * @return ArticleType query
     */
    public function getQuery()
    {
        return $this->article_type;
    }

    /**
     * Count article type
     *
     * @return integer
     */
    public function count()
    {
        return $this->article_type->count();
    }

    /**
     * List all article types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->article_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all article types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->article_type->all(['name', 'id']);
    }

    /**
     * List all article types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->article_type->all()->pluck('id')->all();
    }

    /**
     * Get all article types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->article_type->all();
    }

    /**
     * Find article type with given id.
     *
     * @param integer $id
     * @return ArticleType
     */
    public function find($id)
    {
        return $this->article_type->find($id);
    }

    /**
     * Find article type with given id or throw an error.
     *
     * @param integer $id
     * @return ArticleType
     */
    public function findOrFail($id)
    {
        $article_type = $this->article_type->find($id);

        if (! $article_type) {
            throw ValidationException::withMessages(['message' => trans('calendar.could_not_find_article_type')]);
        }

        return $article_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return ArticleType
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->article_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all article type using given params.
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
     * @return ArticleType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new article type.
     *
     * @param array $params
     * @return ArticleType
     */
    public function create($params)
    {
        return $this->article_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $article_type_id
     * @return array
     */
    private function formatParams($params, $article_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given article type.
     *
     * @param ArticleType $article_type
     * @param array $params
     *
     * @return ArticleType
     */
    public function update(ArticleType $article_type, $params)
    {
        return $article_type->forceFill($this->formatParams($params, $article_type->id))->save();
    }

    /**
     * Find article type & check it can be deleted or not.
     *
     * @param integer $id
     * @return ArticleType
     */
    public function deletable($id)
    {
        $article_type = $this->findOrFail($id);

        if ($article_type->articles()->count()) {
            throw ValidationException::withMessages(['message' => trans('calendar.article_type_associated_with_article')]);
        }

        return $article_type;
    }

    /**
     * Delete article type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(ArticleType $article_type)
    {
        return $article_type->delete();
    }

    /**
     * Delete multiple article types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->article_type->whereIn('id', $ids)->delete();
    }
}
