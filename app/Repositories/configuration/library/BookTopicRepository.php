<?php
namespace App\Repositories\Configuration\Library;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Library\BookTopic;

class BookTopicRepository
{
    protected $book_topic;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        BookTopic $book_topic
    ) {
        $this->book_topic = $book_topic;
    }

    /**
     * Get book topic query
     *
     * @return BookTopic query
     */
    public function getQuery()
    {
        return $this->book_topic;
    }

    /**
     * Count book topic
     *
     * @return integer
     */
    public function count()
    {
        return $this->book_topic->count();
    }

    /**
     * List all book topics by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->book_topic->all()->pluck('name', 'id')->all();
    }

    /**
     * List all book topics by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->book_topic->all(['name', 'id']);
    }

    /**
     * List all book topics by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->book_topic->all()->pluck('id')->all();
    }

    /**
     * Get all book topics
     *
     * @return array
     */
    public function getAll()
    {
        return $this->book_topic->all();
    }

    /**
     * Find book topic with given id.
     *
     * @param integer $id
     * @return BookTopic
     */
    public function find($id)
    {
        return $this->book_topic->find($id);
    }

    /**
     * Find book topic with given id or throw an error.
     *
     * @param integer $id
     * @return BookTopic
     */
    public function findOrFail($id)
    {
        $book_topic = $this->book_topic->find($id);

        if (! $book_topic) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_topic')]);
        }

        return $book_topic;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return BookTopic
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->book_topic->orderBy($sort_by, $order);
    }

    /**
     * Paginate all book topic using given params.
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
     * @return BookTopic
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new book topic.
     *
     * @param array $params
     * @return BookTopic
     */
    public function create($params)
    {
        return $this->book_topic->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $book_topic_id
     * @return array
     */
    private function formatParams($params, $book_topic_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given book topic.
     *
     * @param BookTopic $book_topic
     * @param array $params
     *
     * @return BookTopic
     */
    public function update(BookTopic $book_topic, $params)
    {
        return $book_topic->forceFill($this->formatParams($params, $book_topic->id))->save();
    }

    /**
     * Find book topic & check it can be deleted or not.
     *
     * @param integer $id
     * @return BookTopic
     */
    public function deletable($id)
    {
        $book_topic = $this->findOrFail($id);

        if ($book_topic->books()->count()) {
            throw ValidationException::withMessages(['message' => trans('library.book_topic_associated_with_book')]);
        }

        return $book_topic;
    }

    /**
     * Delete book topic.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(BookTopic $book_topic)
    {
        return $book_topic->delete();
    }

    /**
     * Delete multiple book topics.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->book_topic->whereIn('id', $ids)->delete();
    }
}
