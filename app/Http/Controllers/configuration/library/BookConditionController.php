<?php

namespace App\Http\Controllers\Configuration\Library;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Library\BookConditionRequest;
use App\Repositories\Configuration\Library\BookConditionRepository;

class BookConditionController extends Controller
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
        BookConditionRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Book Conditions
     * @get ("/api/library/book/condition")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Book Conditions
     * @post ("/api/library/book/condition/print")
     * @return Response
     */
    public function print()
    {
        $book_conditions = $this->repo->print(request('filter'));

        return view('print.configuration.library.book-condition', compact('book_conditions'))->render();
    }

    /**
     * Used to generate pdf all Book Conditions
     * @post ("/api/library/book/condition/pdf")
     * @return Response
     */
    public function pdf()
    {
        $book_conditions = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.library.book-condition', compact('book_conditions'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Book Condition
     * @post ("/api/library/book/condition")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Book Condition"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Condition")
     * })
     * @return Response
     */
    public function store(BookConditionRequest $request)
    {
        $book_condition = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('library.book_condition_added')]);
    }

    /**
     * Used to get Book Condition detail
     * @get ("/api/library/book/condition/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Condition"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Book Condition
     * @patch ("/api/library/book/condition/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Condition"),
     *      @Parameter("name", type="string", required="true", description="Name of Book Condition"),
     *      @Parameter("description", type="text", required="optional", description="Description of Book Condition")
     * })
     * @return Response
     */
    public function update($id, BookConditionRequest $request)
    {
        $book_condition = $this->repo->findOrFail($id);

        $book_condition = $this->repo->update($book_condition, $this->request->all());

        return $this->success(['message' => trans('library.book_condition_updated')]);
    }

    /**
     * Used to delete Book Condition
     * @delete ("/api/library/book/condition/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Book Condition"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $book_condition = $this->repo->deletable($id);

        $this->repo->delete($book_condition);

        return $this->success(['message' => trans('library.book_condition_deleted')]);
    }
}
