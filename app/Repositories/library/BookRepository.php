<?php
namespace App\Repositories\Library;

use Illuminate\Support\Str;
use App\Models\Library\Book;
use App\Models\Library\BookLogDetail;
use App\Models\Library\BookPost;
use App\Models\Library\BookPostDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Library\BookAuthorRepository;
use App\Repositories\Configuration\Library\BookTopicRepository;
use App\Repositories\Configuration\Library\BookLanguageRepository;
use App\Repositories\Configuration\Library\BookConditionRepository;
use App\Repositories\Configuration\Library\BookPublisherRepository;

class BookRepository
{
    protected $book;
    protected $book_author;
    protected $book_language;
    protected $book_topic;
    protected $book_publisher;
    protected $book_post;
    protected $book_post_detail;
    protected $book_condition;
    protected $book_log_detail;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Book $book,
        BookAuthorRepository $book_author,
        BookLanguageRepository $book_language,
        BookTopicRepository $book_topic,
        BookPublisherRepository $book_publisher,
        BookPost $book_post,
        BookPostDetail $book_post_detail,
        BookConditionRepository $book_condition,
        BookLogDetail $book_log_detail
    ) {
        $this->book = $book;
        $this->book_author = $book_author;
        $this->book_language = $book_language;
        $this->book_topic = $book_topic;
        $this->book_publisher = $book_publisher;
        $this->book_post = $book_post;
        $this->book_post_detail = $book_post_detail;
        $this->book_condition = $book_condition;
        $this->book_log_detail = $book_log_detail;
    }

    /**
     * Get book query
     *
     * @return Book query
     */
    public function getQuery()
    {
        return $this->book;
    }

    /**
     * Count book
     *
     * @return integer
     */
    public function count()
    {
        return $this->book->count();
    }

    /**
     * List all books by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->book->get()->pluck('title', 'id')->all();
    }

    /**
     * List all books by title & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->book->all(['title','id']);
    }

    /**
     * List all books by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->book->get()->pluck('id')->all();
    }

    /**
     * Get all books
     *
     * @return array
     */
    public function getAll()
    {
        return $this->book->all();
    }

    /**
     * Find book with given id.
     *
     * @param integer $id
     * @return Book
     */
    public function find($id)
    {
        return $this->book->info()->filterById($id)->first();
    }

    /**
     * Find book with given id or throw an error.
     *
     * @param integer $id
     * @return Book
     */
    public function findOrFail($id)
    {
        $book = $this->book->info()->filterById($id)->first();

        if (! $book) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book')]);
        }

        return $book;
    }

    /**
     * Find book with given uuid.
     *
     * @param string $uuid
     * @return Book
     */
    public function findByUuid($uuid)
    {
        return $this->book->info()->filterByUuid($id)->first();
    }

    /**
     * Find book with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Book
     */
    public function findByUuidOrFail($uuid)
    {
        $book = $this->book->info()->filterByUuid($uuid)->first();

        if (! $book) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book')]);
        }

        return $book;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Book
     */
    public function getData($params)
    {
        $sort_by           = gv($params, 'sort_by', 'title');
        $order             = gv($params, 'order', 'asc');
        $title             = gv($params, 'title');
        $book_author_id    = gv($params, 'book_author_id');
        $book_language_id  = gv($params, 'book_language_id');
        $book_topic_id     = gv($params, 'book_topic_id');
        $book_publisher_id = gv($params, 'book_publisher_id');

        $book_author_id    = is_array($book_author_id) ? $book_author_id : ($book_author_id ? explode(',', $book_author_id) : []);
        $book_language_id  = is_array($book_language_id) ? $book_language_id : ($book_language_id ? explode(',', $book_language_id) : []);
        $book_topic_id     = is_array($book_topic_id) ? $book_topic_id : ($book_topic_id ? explode(',', $book_topic_id) : []);
        $book_publisher_id = is_array($book_publisher_id) ? $book_publisher_id : ($book_publisher_id ? explode(',', $book_publisher_id) : []);

        $query = $this->book->info()->withCount(['bookPostDetails'])->filterByTitle($title);

        if (count($book_author_id)) {
            $query->whereIn('book_author_id', $book_author_id);
        }

        if (count($book_language_id)) {
            $query->whereIn('book_language_id', $book_language_id);
        }

        if (count($book_topic_id)) {
            $query->whereIn('book_topic_id', $book_topic_id);
        }

        if (count($book_publisher_id)) {
            $query->whereIn('book_publisher_id', $book_publisher_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all books using given params.
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
     * @return Book
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get book pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $book_authors = $this->book_author->selectAll();
        $book_languages = $this->book_language->selectAll();
        $book_topics = $this->book_topic->selectAll();
        $book_publishers = $this->book_publisher->selectAll();

        return compact('book_authors', 'book_languages', 'book_topics', 'book_publishers');
    }

    /**
     * Get book post pre requisite.
     *
     * @return Array
     */
    public function getBookPostPreRequisite()
    {
        $book_conditions = $this->book_condition->selectAll();

        return compact('book_conditions');
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Create a new book.
     *
     * @param array $params
     * @return Book
     */
    public function create($params)
    {
        return $this->book->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $book_id = null)
    {
        $title             = gv($params, 'title');
        $book_author_id    = gv($params, 'book_author_id');
        $book_language_id  = gv($params, 'book_language_id');
        $book_topic_id   = gv($params, 'book_topic_id');
        $book_publisher_id = gv($params, 'book_publisher_id');
        $description       = gv($params, 'description');

        $this->book_author->findOrFail($book_author_id);

        $this->book_language->findOrFail($book_language_id);

        $this->book_topic->findOrFail($book_topic_id);

        $this->book_publisher->findOrFail($book_publisher_id);

        $book_exist_query = (! $book_id) ? $this->book : $this->book->where('id', '!=', $book_id);

        $book_exists = $book_exist_query->filterByTitle($title, 1)->filterByBookAuthorId($book_author_id)->count();

        if ($book_exists) {
            throw ValidationException::withMessages(['name' => trans('library.book_exists')]);
        }

        $formatted = [
            'title'             => $title,
            'isbn_number'       => gv($params, 'isbn_number'),
            'book_author_id'    => $book_author_id,
            'book_language_id'  => $book_language_id,
            'book_topic_id'    => $book_topic_id,
            'book_publisher_id' => $book_publisher_id,
            'edition'           => gv($params, 'edition'),
            'page'              => gv($params, 'page',0),
            'price'             => gv($params, 'price',0),
            'type'              => gv($params, 'type'),
            'summary'           => gv($params, 'summary'),
            'description'       => gv($params, 'description')
        ];

        if (! $book_id) {
            $formatted['uuid'] = Str::uuid();
        }

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given book.
     *
     * @param Book $book
     * @param array $params
     *
     * @return Book
     */
    public function update(Book $book, $params)
    {
        return $book->forceFill($this->formatParams($params, $book->id))->save();
    }

    /**
     * Find book & check it can be deleted or not.
     *
     * @param string $uuid
     * @return Book
     */
    public function deletable($uuid)
    {
        $book = $this->findByUuidOrFail($uuid);

        if ($book->BookPosts->count()) {
            throw ValidationException::withMessages(['message' => trans('library.book_associated_with_post') ]);
        }

        return $book;
    }

    /**
     * Delete book.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Book $book)
    {
        return $book->delete();
    }

    /**
     * Delete multiple books.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->book->whereIn('id', $ids)->delete();
    }

    /**
     * Get last book number.
     *
     * @return integer
     */
    public function getLastBookNumber()
    {
        $last_book = $this->book_post_detail->max('number');

        return $last_book ? $last_book + 1 : 1;
    }

    /**
     * Post books.
     *
     * @param Book $book
     * @param Array $params
     * @return Book
     */
    public function post(Book $book, $params)
    {
        $date_of_addition = toDate(gv($params, 'date_of_addition'));
        $quantity = gv($params, 'quantity', 0);
        $details = gv($params, 'details');

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('library.no_book_post_found')]);
        }

        if ($quantity != count($details)) {
            throw ValidationException::withMessages(['quantity' => trans('library.book_quantity_mismatch_with_detail')]);
        }

        if ($this->book_post->filterByBookId($book->id)->where('date_of_addition', '>', $date_of_addition)->count()) {
            throw ValidationException::withMessages(['date_of_addition' => trans('library.book_post_found_on_previous_date')]);
        }

        $book_condition_ids = $this->book_condition->listId();

        $book_numbers = array();
        foreach ($details as $index => $detail) {
            $book_number = gv($detail, 'number');

            if (! is_numeric($book_number)) {
                throw ValidationException::withMessages([$index.'_number' => trans('validation.integer', ['attribute' => $book_number])]);
            }

            if ($book_number < 1) {
                throw ValidationException::withMessages([$index.'_number' => trans('validation.min.numeric', ['attribute' => $book_number, 'min' => 1])]);
            }

            $book_condition_id = gv($detail, 'book_condition_id');

            if ($book_condition_id && ! in_array($book_condition_id, $book_condition_ids)) {
                throw ValidationException::withMessages([$index.'_condition' => trans('library.could_not_find_book_condition')]);
            }

            $book_numbers[] = $book_number;
        }

        if (count($book_numbers) > count(array_unique($book_numbers))) {
            throw ValidationException::withMessages(['message' => trans('library.duplicate_book_number_found')]);
        }

        $existing_books = $this->book_post_detail->whereIn('number', $book_numbers)->get();

        foreach ($details as $index => $detail) {
            $existing_book = $existing_books->firstWhere('number', gv($detail, 'number'));

            if ($existing_book) {
                throw ValidationException::withMessages([$index.'_number' => trans('library.book_number_exists', ['number' => $existing_book->number]) ]);
            }
        }

        $book_post = $this->book_post->forceCreate([
            'book_id' => $book->id,
            'date_of_addition' => toDate($date_of_addition),
            'quantity' => $quantity,
            'remarks' => gv($params, 'remarks'),
            'options' => array()
        ]);

        foreach ($details as $detail) {
            $this->book_post_detail->forceCreate([
                'book_post_id' => $book_post->id,
                'number' => gv($detail, 'number'),
                'location' => gv($detail, 'location'),
                'book_condition_id' => gv($detail, 'book_condition_id'),
                'options' => array()
            ]);
        }

        return $book;
    }

    /**
     * Update book detail.
     *
     * @param Book $book
     * @param Integer $id
     * @param Array $params
     * @return Book
     */
    public function updateBookDetail(Book $book, $id, $params)
    {
        $book_post_detail = $this->book_post_detail->whereHas('bookPost', function ($q) use ($book) {
            $q->where('book_id', $book->id);
        })->filterById($id)->first();

        if (! $book_post_detail) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book')]);
        }

        $number            = gv($params, 'number');
        $location          = gv($params, 'location');
        $book_condition_id = gv($params, 'book_condition_id');
        $remarks           = gv($params, 'remarks');
        $is_not_available  = gbv($params, 'is_not_available');

        if ($this->book_post_detail->where('id', '!=', $id)->filterByNumber($number)->count()) {
            throw ValidationException::withMessages(['number' => trans('library.book_number_exists', ['number' => $number])]);
        }

        if ($book_condition_id) {
            $book_condition = $this->book_condition->findOrFail($book_condition_id);
        }

        $book_post_detail->number = $number;
        $book_post_detail->location = $location;
        $book_post_detail->book_condition_id = $book_condition_id;
        $book_post_detail->remarks = $remarks;
        $book_post_detail->is_not_available = $is_not_available;
        $book_post_detail->save();

        return $book;
    }

    /**
     * Delete book post.
     *
     * @param Book $book
     * @param integer $id
     * @return bool|null
     */
    public function deleteBookPost(Book $book, $id)
    {
        $book_post = $this->book_post->filterById($id)->filterByBookId($book->id)->first();

        if (! $book_post) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_post')]);
        }

        $book_post_detail_ids = $book_post->BookPostDetails->pluck('id')->all();

        if ($this->book_log_detail->whereIn('book_post_detail_id', $book_post_detail_ids)->count()) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_delete_book_if_book_log_exists')]);
        }

        $book_post->delete();
    }

    /**
     * Delete book post detail.
     *
     * @param Book $book
     * @param integer $id
     * @return bool|null
     */
    public function deleteBookPostDetail(Book $book, $id)
    {
        $book_post_detail = $this->book_post_detail->filterById($id)->whereHas('bookPost',function($q) use($book) {
            $q->where('book_id',$book->id);
        })->first();

        if (! $book_post_detail) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book')]);
        }

        if ($this->book_log_detail->where('book_post_detail_id', $id)->count()) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_delete_book_if_book_log_exists')]);
        }

        $book_post_detail->delete();
    }

    /**
     * Get book post detail
     *
     * @param integer $number
     * @param date $date
     * @return null
     */
    public function getBookPostDetail($number, $date)
    {
        $date = toDate($date);
        $book_post_detail = $this->book_post_detail->with('bookPost', 'bookLogDetails', 'bookLogDetails.bookLog')->filterByAvailability()->filterByNumber($number)->first();

        if (! $book_post_detail) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book')]);
        }

        $date_of_addition = toDate($book_post_detail->bookPost->date_of_addition);
        if ($date_of_addition > $date) {
            throw ValidationException::withMessages(['message' => trans('library.book_added_after_given_date', ['number' => $number, 'date_of_addition' => showDate($date_of_addition), 'date_of_issue' => showDate($date)])]);
        }

        $last_issued = $book_post_detail->bookLogDetails->sortByDesc('id')->first();

        if ($last_issued) {
            if ($last_issued->date_of_return && toDate($last_issued->date_of_return) > $date) {
                throw ValidationException::withMessages(['message' => trans('library.book_last_returned_after_given_date', ['number' => $number, 'date_of_issue' => showDate($last_issued->date_of_return)])]);
            }

            if (! $last_issued->date_of_return) {
                throw ValidationException::withMessages(['message' => trans('library.book_not_returned', ['number' => $number])]);
            }

            // $last_issued_date = toDate($last_issued->bookLog->date_of_issue);
            // if ($last_issued_date > $date) {
            //     throw ValidationException::withMessages(['message' => trans('library.book_last_issued_after_given_date', ['number' => $number, 'date_of_issue' => showDate($last_issued_date)])]);
            // }
        }

        return $book_post_detail;
    }

    /**
     * Search book by number.
     *
     * @param Array $params
     * @return BookPostDetail
     */
    public function searchByNumber($params = array())
    {
        $number = gv($params, 'number');
        $date = toDate(gv($params, 'date'));

        if (! $number) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book')]);
        }

        $book_post_detail = $this->getBookPostDetail($number, $date);

        return $book_post_detail->load('bookPost.book', 'bookPost.book.bookAuthor', 'bookPost.book.bookLanguage', 'bookPost.book.bookTopic', 'bookPost.book.bookPublisher', 'bookCondition');
    }
}
