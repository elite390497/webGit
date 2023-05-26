<?php
namespace App\Repositories\Configuration\Library;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Library\BookPublisher;

class BookPublisherRepository
{
    protected $book_publisher;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        BookPublisher $book_publisher
    ) {
        $this->book_publisher = $book_publisher;
    }

    /**
     * Get book publisher query
     *
     * @return BookPublisher query
     */
    public function getQuery()
    {
        return $this->book_publisher;
    }

    /**
     * Count book publisher
     *
     * @return integer
     */
    public function count()
    {
        return $this->book_publisher->count();
    }

    /**
     * List all book publishers by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->book_publisher->all()->pluck('name', 'id')->all();
    }

    /**
     * List all book publishers by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->book_publisher->all(['name', 'id']);
    }

    /**
     * List all book publishers by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->book_publisher->all()->pluck('id')->all();
    }

    /**
     * Get all book publishers
     *
     * @return array
     */
    public function getAll()
    {
        return $this->book_publisher->all();
    }

    /**
     * Find book publisher with given id.
     *
     * @param integer $id
     * @return BookPublisher
     */
    public function find($id)
    {
        return $this->book_publisher->find($id);
    }

    /**
     * Find book publisher with given id or throw an error.
     *
     * @param integer $id
     * @return BookPublisher
     */
    public function findOrFail($id)
    {
        $book_publisher = $this->book_publisher->find($id);

        if (! $book_publisher) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_publisher')]);
        }

        return $book_publisher;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return BookPublisher
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->book_publisher->orderBy($sort_by, $order);
    }

    /**
     * Paginate all book publisher using given params.
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
     * @return BookPublisher
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new book publisher.
     *
     * @param array $params
     * @return BookPublisher
     */
    public function create($params)
    {
        return $this->book_publisher->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $book_publisher_id
     * @return array
     */
    private function formatParams($params, $book_publisher_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given book publisher.
     *
     * @param BookPublisher $book_publisher
     * @param array $params
     *
     * @return BookPublisher
     */
    public function update(BookPublisher $book_publisher, $params)
    {
        return $book_publisher->forceFill($this->formatParams($params, $book_publisher->id))->save();
    }

    /**
     * Find book publisher & check it can be deleted or not.
     *
     * @param integer $id
     * @return BookPublisher
     */
    public function deletable($id)
    {
        $book_publisher = $this->findOrFail($id);

        if ($book_publisher->books()->count()) {
            throw ValidationException::withMessages(['message' => trans('library.book_publisher_associated_with_book')]);
        }

        return $book_publisher;
    }

    /**
     * Delete book publisher.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(BookPublisher $book_publisher)
    {
        return $book_publisher->delete();
    }

    /**
     * Delete multiple book publishers.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->book_publisher->whereIn('id', $ids)->delete();
    }
}
