<?php

namespace App\Http\Controllers\Configuration\Library;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Library\BookAuthorRequest;
use App\Repositories\Configuration\Library\BookAuthorRepository;

class BookAuthorController extends Controller
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
        BookAuthorRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Book Authors
     * @get ("/api/library/book/author")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Book Authors
     * @post ("/api/library/book/author/print")
     * @return Response
     */
    public function print()
    {
        $book_authors = $this->repo->print(request('filter'));

        return view('print.configuration.library.book-author', compact('book_authors'))->render();
    }

    /**
     * Used to generate pdf all Book Authors
     * @post ("/api/library/book/author/pdf")
     * @return Response
     */
    public function pdf()
    {
        $book_authors = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.library.book-author', compact('book_authors'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Book Author
     * @post ("/api/library/book/author")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Book Author"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Author")
     * })
     * @return Response
     */
    public function store(BookAuthorRequest $request)
    {
        $book_author = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('library.book_author_added')]);
    }

    /**
     * Used to get Book Author detail
     * @get ("/api/library/book/author/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Author"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Book Author
     * @patch ("/api/library/book/author/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Author"),
     *      @Parameter("name", type="string", required="true", description="Name of Book Author"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Author")
     * })
     * @return Response
     */
    public function update($id, BookAuthorRequest $request)
    {
        $book_author = $this->repo->findOrFail($id);

        $book_author = $this->repo->update($book_author, $this->request->all());

        return $this->success(['message' => trans('library.book_author_updated')]);
    }

    /**
     * Used to delete Book Author
     * @delete ("/api/library/book/author/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Author"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $book_author = $this->repo->deletable($id);

        $this->repo->delete($book_author);

        return $this->success(['message' => trans('library.book_author_deleted')]);
    }
}
