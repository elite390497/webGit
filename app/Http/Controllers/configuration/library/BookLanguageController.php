<?php

namespace App\Http\Controllers\Configuration\Library;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Library\BookLanguageRequest;
use App\Repositories\Configuration\Library\BookLanguageRepository;

class BookLanguageController extends Controller
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
        BookLanguageRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Book Languages
     * @get ("/api/library/book/language")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Book Languages
     * @post ("/api/library/book/language/print")
     * @return Response
     */
    public function print()
    {
        $book_languages = $this->repo->print(request('filter'));

        return view('print.configuration.library.book-language', compact('book_languages'))->render();
    }

    /**
     * Used to generate pdf all Book Languages
     * @post ("/api/library/book/language/pdf")
     * @return Response
     */
    public function pdf()
    {
        $book_languages = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.library.book-language', compact('book_languages'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Book Language
     * @post ("/api/library/book/language")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Book Language"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Language")
     * })
     * @return Response
     */
    public function store(BookLanguageRequest $request)
    {
        $book_language = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('library.book_language_added')]);
    }

    /**
     * Used to get Book Language detail
     * @get ("/api/library/book/language/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Language"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Book Language
     * @patch ("/api/library/book/language/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Language"),
     *      @Parameter("name", type="string", required="true", description="Name of Book Language"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Language")
     * })
     * @return Response
     */
    public function update($id, BookLanguageRequest $request)
    {
        $book_language = $this->repo->findOrFail($id);

        $book_language = $this->repo->update($book_language, $this->request->all());

        return $this->success(['message' => trans('library.book_language_updated')]);
    }

    /**
     * Used to delete Book Language
     * @delete ("/api/library/book/language/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Language"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $book_language = $this->repo->deletable($id);

        $this->repo->delete($book_language);

        return $this->success(['message' => trans('library.book_language_deleted')]);
    }
}
