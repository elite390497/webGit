<?php
namespace App\Repositories\Configuration\Library;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Library\BookLanguage;

class BookLanguageRepository
{
    protected $book_language;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        BookLanguage $book_language
    ) {
        $this->book_language = $book_language;
    }

    /**
     * Get book language query
     *
     * @return BookLanguage query
     */
    public function getQuery()
    {
        return $this->book_language;
    }

    /**
     * Count book language
     *
     * @return integer
     */
    public function count()
    {
        return $this->book_language->count();
    }

    /**
     * List all book languages by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->book_language->all()->pluck('name', 'id')->all();
    }

    /**
     * List all book languages by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->book_language->all(['name', 'id']);
    }

    /**
     * List all book languages by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->book_language->all()->pluck('id')->all();
    }

    /**
     * Get all book languages
     *
     * @return array
     */
    public function getAll()
    {
        return $this->book_language->all();
    }

    /**
     * Find book language with given id.
     *
     * @param integer $id
     * @return BookLanguage
     */
    public function find($id)
    {
        return $this->book_language->find($id);
    }

    /**
     * Find book language with given id or throw an error.
     *
     * @param integer $id
     * @return BookLanguage
     */
    public function findOrFail($id)
    {
        $book_language = $this->book_language->find($id);

        if (! $book_language) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_language')]);
        }

        return $book_language;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return BookLanguage
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->book_language->orderBy($sort_by, $order);
    }

    /**
     * Paginate all book language using given params.
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
     * @return BookLanguage
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new book language.
     *
     * @param array $params
     * @return BookLanguage
     */
    public function create($params)
    {
        return $this->book_language->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $book_language_id
     * @return array
     */
    private function formatParams($params, $book_language_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given book language.
     *
     * @param BookLanguage $book_language
     * @param array $params
     *
     * @return BookLanguage
     */
    public function update(BookLanguage $book_language, $params)
    {
        return $book_language->forceFill($this->formatParams($params, $book_language->id))->save();
    }

    /**
     * Find book language & check it can be deleted or not.
     *
     * @param integer $id
     * @return BookLanguage
     */
    public function deletable($id)
    {
        $book_language = $this->findOrFail($id);

        if ($book_language->books()->count()) {
            throw ValidationException::withMessages(['message' => trans('library.book_language_associated_with_book')]);
        }

        return $book_language;
    }

    /**
     * Delete book language.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(BookLanguage $book_language)
    {
        return $book_language->delete();
    }

    /**
     * Delete multiple book languages.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->book_language->whereIn('id', $ids)->delete();
    }
}
