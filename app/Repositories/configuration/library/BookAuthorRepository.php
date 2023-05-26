<?php
namespace App\Repositories\Configuration\Library;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Library\BookAuthor;

class BookAuthorRepository
{
    protected $book_author;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        BookAuthor $book_author
    ) {
        $this->book_author = $book_author;
    }

    /**
     * Get book author query
     *
     * @return BookAuthor query
     */
    public function getQuery()
    {
        return $this->book_author;
    }

    /**
     * Count book author
     *
     * @return integer
     */
    public function count()
    {
        return $this->book_author->count();
    }

    /**
     * List all book authors by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->book_author->all()->pluck('name', 'id')->all();
    }

    /**
     * List all book authors by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->book_author->all(['name', 'id']);
    }

    /**
     * List all book authors by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->book_author->all()->pluck('id')->all();
    }

    /**
     * Get all book authors
     *
     * @return array
     */
    public function getAll()
    {
        return $this->book_author->all();
    }

    /**
     * Find book author with given id.
     *
     * @param integer $id
     * @return BookAuthor
     */
    public function find($id)
    {
        return $this->book_author->find($id);
    }

    /**
     * Find book author with given id or throw an error.
     *
     * @param integer $id
     * @return BookAuthor
     */
    public function findOrFail($id)
    {
        $book_author = $this->book_author->find($id);

        if (! $book_author) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_author')]);
        }

        return $book_author;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return BookAuthor
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->book_author->orderBy($sort_by, $order);
    }

    /**
     * Paginate all book author using given params.
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
     * @return BookAuthor
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new book author.
     *
     * @param array $params
     * @return BookAuthor
     */
    public function create($params)
    {
        return $this->book_author->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $book_author_id
     * @return array
     */
    private function formatParams($params, $book_author_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given book author.
     *
     * @param BookAuthor $book_author
     * @param array $params
     *
     * @return BookAuthor
     */
    public function update(BookAuthor $book_author, $params)
    {
        return $book_author->forceFill($this->formatParams($params, $book_author->id))->save();
    }

    /**
     * Find book author & check it can be deleted or not.
     *
     * @param integer $id
     * @return BookAuthor
     */
    public function deletable($id)
    {
        $book_author = $this->findOrFail($id);

        if ($book_author->books()->count()) {
            throw ValidationException::withMessages(['message' => trans('library.book_author_associated_with_book')]);
        }

        return $book_author;
    }

    /**
     * Delete book author.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(BookAuthor $book_author)
    {
        return $book_author->delete();
    }

    /**
     * Delete multiple book authors.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->book_author->whereIn('id', $ids)->delete();
    }
}
