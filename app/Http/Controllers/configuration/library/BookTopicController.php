<?php

namespace App\Http\Controllers\Configuration\Library;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Library\BookTopicRequest;
use App\Repositories\Configuration\Library\BookTopicRepository;

class BookTopicController extends Controller
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
        BookTopicRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Book Topics
     * @get ("/api/library/book/topic")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Book Topics
     * @post ("/api/library/book/topic/print")
     * @return Response
     */
    public function print()
    {
        $book_topics = $this->repo->print(request('filter'));

        return view('print.configuration.library.book-topic', compact('book_topics'))->render();
    }

    /**
     * Used to generate pdf all Book Topics
     * @post ("/api/library/book/topic/pdf")
     * @return Response
     */
    public function pdf()
    {
        $book_topics = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.library.book-topic', compact('book_topics'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Book Topic
     * @post ("/api/library/book/topic")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Book Topic"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Topic")
     * })
     * @return Response
     */
    public function store(BookTopicRequest $request)
    {
        $book_topic = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('library.book_topic_added')]);
    }

    /**
     * Used to get Book Topic detail
     * @get ("/api/library/book/topic/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Topic"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Book Topic
     * @patch ("/api/library/book/topic/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Topic"),
     *      @Parameter("name", type="string", required="true", description="Name of Book Topic"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Topic")
     * })
     * @return Response
     */
    public function update($id, BookTopicRequest $request)
    {
        $book_topic = $this->repo->findOrFail($id);

        $book_topic = $this->repo->update($book_topic, $this->request->all());

        return $this->success(['message' => trans('library.book_topic_updated')]);
    }

    /**
     * Used to delete Book Topic
     * @delete ("/api/library/book/topic/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Topic"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $book_topic = $this->repo->deletable($id);

        $this->repo->delete($book_topic);

        return $this->success(['message' => trans('library.book_topic_deleted')]);
    }
}
