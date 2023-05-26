<?php

namespace App\Http\Controllers\Library;

use Illuminate\Support\Str;
use App\Models\Library\Book;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Library\BookRequest;
use App\Repositories\Library\BookRepository;
use App\Http\Requests\Library\BookPostRequest;
use App\Http\Requests\Library\BookPostDetailRequest;

class BookController extends Controller
{
    protected $request;
    protected $repo;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        BookRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/book/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Book::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get book post pre requisites
     * @get ("/api/book/post/pre-requisite")
     * @return Response
     */
    public function bookPostPreRequisite()
    {
        $this->authorize('preRequisite', Book::class);

        return $this->success($this->repo->getBookPostPreRequisite());
    }

    /**
     * Used to get all Books
     * @get ("/api/book")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Book::class);

        $books = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('books', 'filters'));
    }

    /**
     * Used to print all Books
     * @post ("/api/book/print")
     * @return Response
     */
    public function print()
    {
        $books = $this->repo->print(request('filter'));

        return view('print.library.book', compact('books'))->render();
    }

    /**
     * Used to generate pdf all Books
     * @post ("/api/book/pdf")
     * @return Response
     */
    public function pdf()
    {
        $books = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.library.book', compact('books'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Book
     * @post ("/api/book")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Book"),
     *      @Parameter("isbn_number", type="string", required="optional", description="ISBN Number of Book"),
     *      @Parameter("book_author_id", type="integer", required="true", description="Author of Book"),
     *      @Parameter("book_language_id", type="integer", required="true", description="Language of Book"),
     *      @Parameter("book_publisher_id", type="integer", required="true", description="Publisher of Book"),
     *      @Parameter("book_topic_id", type="integer", required="true", description="Topic of Book"),
     *      @Parameter("edition", type="string", required="optional", description="Edition of Book"),
     *      @Parameter("type", type="string", required="true", description="Type of Book, can be reference or text book"),
     *      @Parameter("page", type="integer", required="true", description="No of Pages in Book"),
     *      @Parameter("price", type="integer", required="true", description="Price of Book"),
     *      @Parameter("summary", type="string", required="true", description="Summary of Book"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book")
     * })
     * @return Response
     */
    public function store(BookRequest $request)
    {
        $this->authorize('create', Book::class);

        $book = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('library.book_added')]);
    }

    /**
     * Used to get Book detail
     * @get ("/api/book/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', Book::class);

        $book = $this->repo->findByUuidOrFail($uuid);

        $selected_book_author    = ($book->book_author_id) ? ['id' => $book->book_author_id,'name' => $book->BookAuthor->name] : [];
        $selected_book_language  = ($book->book_language_id) ? ['id' => $book->book_language_id,'name' => $book->BookLanguage->name] : [];
        $selected_book_topic     = ($book->book_topic_id) ? ['id' => $book->book_topic_id,'name' => $book->BookTopic->name] : [];
        $selected_book_publisher = ($book->book_publisher_id) ? ['id' => $book->book_publisher_id,'name' => $book->BookPublisher->name] : [];

        $last_book_number = $this->repo->getLastBookNumber();

        return $this->success(compact('book', 'selected_book_author', 'selected_book_language', 'selected_book_topic', 'selected_book_publisher', 'last_book_number'));
    }

    /**
     * Used to update Book
     * @patch ("/api/book/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book"),
     *      @Parameter("title", type="string", required="true", description="Title of Book"),
     *      @Parameter("isbn_number", type="string", required="optional", description="ISBN Number of Book"),
     *      @Parameter("book_author_id", type="integer", required="true", description="Author of Book"),
     *      @Parameter("book_language_id", type="integer", required="true", description="Language of Book"),
     *      @Parameter("book_publisher_id", type="integer", required="true", description="Publisher of Book"),
     *      @Parameter("book_topic_id", type="integer", required="true", description="Topic of Book"),
     *      @Parameter("edition", type="string", required="optional", description="Edition of Book"),
     *      @Parameter("type", type="string", required="true", description="Type of Book, can be reference or text book"),
     *      @Parameter("page", type="integer", required="true", description="No of Pages in Book"),
     *      @Parameter("price", type="integer", required="true", description="Price of Book"),
     *      @Parameter("summary", type="string", required="true", description="Summary of Book"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book")
     * })
     * @return Response
     */
    public function update($uuid, BookRequest $request)
    {
        $this->authorize('update', Book::class);

        $book = $this->repo->findByUuidOrFail($uuid);

        $book = $this->repo->update($book, $this->request->all());

        return $this->success(['message' => trans('library.book_updated')]);
    }

    /**
     * Used to delete Book
     * @delete ("/api/book/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Book::class);

        $book = $this->repo->deletable($uuid);

        $this->repo->delete($book);

        return $this->success(['message' => trans('library.book_deleted')]);
    }

    /**
     * Used to post Book
     * @post ("/api/book/{uuid}/post")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book"),
     *      @Parameter("date_of_addition", type="date", required="required", description="Date of Addition of Book"),
     *      @Parameter("quantity", type="integer", required="true", description="Quantity of Book"),
     *      @Parameter("details", type="array", required="true", description="Array of Book Details")
     * })
     * @return Response
     */
    public function post(BookPostRequest $request, $uuid)
    {
        $this->authorize('create', Book::class);

        $book = $this->repo->findByUuidOrFail($uuid);

        $book = $this->repo->post($book, $this->request->all());

        return $this->success(['message' => trans('library.book_posted')]);
    }

    /**
     * Used to update book post detail
     * @patch ("/api/book/{uuid}/post/detail/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book"),
     *      @Parameter("id", type="integer", required="required", description="Id of Book Post Detail"),
     *      @Parameter("number", type="integer", required="required", description="Book Number"),
     *      @Parameter("location", type="string", required="optional", description="Location of Book"),
     *      @Parameter("condition", type="string", required="required", description="Condition of Book"),
     *      @Parameter("is_not_available", type="boolean", required="optional", description="Is book not available?"),
     *      @Parameter("remarks", type="text", required="required", description="Remarks")
     * })
     * @return Response
     */
    public function updateBookDetail(BookPostDetailRequest $request, $uuid, $id)
    {
        $this->authorize('update', Book::class);

        $book = $this->repo->findByUuidOrFail($uuid);

        $book = $this->repo->updateBookDetail($book, $id, $this->request->all());

        return $this->success(['message' => trans('library.book_updated')]);
    }

    /**
     * Used to delete Book Post
     * @delete ("/api/book/{uuid}/post/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book"),
     *      @Parameter("id", type="integer", required="required", description="Id of Book Post")
     * })
     * @return Response
     */
    public function destroyBookPost($uuid, $id)
    {
        $this->authorize('delete', Book::class);

        $book = $this->repo->findByUuidOrFail($uuid);

        $this->repo->deleteBookPost($book, $id);

        return $this->success(['message' => trans('library.book_post_deleted')]);
    }

    /**
     * Used to delete Book Post Detail
     * @delete ("/api/book/{uuid}/post/detail/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book"),
     *      @Parameter("id", type="integer", required="required", description="Id of Book Post Detail")
     * })
     * @return Response
     */
    public function destroyBookPostDetail($uuid, $id)
    {
        $this->authorize('delete', Book::class);

        $book = $this->repo->findByUuidOrFail($uuid);

        $this->repo->deleteBookPostDetail($book, $id);

        return $this->success(['message' => trans('library.book_deleted')]);
    }

    /**
     * Used to search book by number
     * @delete ("/api/book/search/number")
     * @param ({
     *      @Parameter("number", type="string", required="true", description="Number of Book")
     * })
     * @return Response
     */
    public function searchByNumber()
    {
        return $this->ok($this->repo->searchByNumber($this->request->all()));
    }
}
