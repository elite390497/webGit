<?php
namespace App\Repositories\Configuration\Library;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Library\BookCondition;

class BookConditionRepository
{
    protected $book_condition;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        BookCondition $book_condition
    ) {
        $this->book_condition = $book_condition;
    }

    /**
     * Get book condition query
     *
     * @return BookCondition query
     */
    public function getQuery()
    {
        return $this->book_condition;
    }

    /**
     * Count book condition
     *
     * @return integer
     */
    public function count()
    {
        return $this->book_condition->count();
    }

    /**
     * List all book conditions by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->book_condition->all()->pluck('name', 'id')->all();
    }

    /**
     * List all book conditions by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->book_condition->all(['name', 'id']);
    }

    /**
     * List all book conditions by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->book_condition->all()->pluck('id')->all();
    }

    /**
     * Get all book conditions
     *
     * @return array
     */
    public function getAll()
    {
        return $this->book_condition->all();
    }

    /**
     * Find book condition with given id.
     *
     * @param integer $id
     * @return BookCondition
     */
    public function find($id)
    {
        return $this->book_condition->find($id);
    }

    /**
     * Find book condition with given id or throw an error.
     *
     * @param integer $id
     * @return BookCondition
     */
    public function findOrFail($id)
    {
        $book_condition = $this->book_condition->find($id);

        if (! $book_condition) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_condition')]);
        }

        return $book_condition;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return BookCondition
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->book_condition->orderBy($sort_by, $order);
    }

    /**
     * Paginate all book condition using given params.
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
     * @return BookCondition
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new book condition.
     *
     * @param array $params
     * @return BookCondition
     */
    public function create($params)
    {
        return $this->book_condition->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $book_condition_id
     * @return array
     */
    private function formatParams($params, $book_condition_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given book condition.
     *
     * @param BookCondition $book_condition
     * @param array $params
     *
     * @return BookCondition
     */
    public function update(BookCondition $book_condition, $params)
    {
        return $book_condition->forceFill($this->formatParams($params, $book_condition->id))->save();
    }

    /**
     * Find book condition & check it can be deleted or not.
     *
     * @param integer $id
     * @return BookCondition
     */
    public function deletable($id)
    {
        $book_condition = $this->findOrFail($id);

        if ($book_condition->bookPostDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('library.book_condition_associated_with_book')]);
        }

        return $book_condition;
    }

    /**
     * Delete book condition.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(BookCondition $book_condition)
    {
        return $book_condition->delete();
    }

    /**
     * Delete multiple book conditions.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->book_condition->whereIn('id', $ids)->delete();
    }
}
