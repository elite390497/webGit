<?php

namespace App\Http\Controllers\Library;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Library\BookLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Library\BookLogRequest;
use App\Repositories\Library\BookLogRepository;
use App\Http\Requests\Library\BookLogReturnRequest;

class BookLogController extends Controller
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
        BookLogRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get all Book Logs
     * @get ("/api/book/log")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', BookLog::class);

        $book_logs = $this->repo->paginate($this->request->all());

        return $this->success(compact('book_logs'));
    }

    /**
     * Used to print all Book Logs
     * @post ("/api/book/log/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', BookLog::class);

        $book_logs = $this->repo->print(request('filter'));

        return view('print.library.issue-return', compact('book_logs'))->render();
    }

    /**
     * Used to generate pdf all Book Logs
     * @post ("/api/book/log/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', BookLog::class);

        $book_logs = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.library.issue-return', compact('book_logs'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to issue book
     * @post ("/api/book/log")
     * @param ({
     *      @Parameter("date_of_issue", type="date", required="true", description="Date of Issue"),
     *      @Parameter("type", type="string", required="true", description="Issue to student or employee"),
     *      @Parameter("student_id", type="integer", required="optional", description="Id of Student"),
     *      @Parameter("employee_id", type="integer", required="optional", description="Id of Employee"),
     *      @Parameter("issue_remarks", type="text", required="optional", description="Issue Remarks"),
     *      @Parameter("books", type="array", required="true", description="Array of Number of Book")
     * })
     * @return Response
     */
    public function store(BookLogRequest $request)
    {
        $this->authorize('create', BookLog::class);

        $book_log = $this->repo->issue($this->request->all());

        return $this->success(['message' => trans('library.book_issued')]);
    }

    /**
     * Used to get late fee payment pre requisites
     * @get ("/api/book/log/fee/pre-requisite")
     * @return Response
     */
    public function feePreRequisite()
    {
        $this->authorize('list', BookLog::class);

        return $this->success($this->repo->getFeePreRequisite());
    }

    /**
     * Used to get Book Log detail
     * @get ("/api/book/log/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book Log"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', BookLog::class);

        $book_log = $this->repo->findByUuidOrFail($uuid);

        return $this->success(compact('book_log'));
    }

    /**
     * Used to return book
     * @post ("/api/book/log/{uuid}/return")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Book Log")
     * })
     * @return Response
     */
    public function returnBook(BookLogReturnRequest $request, $uuid)
    {
        $this->authorize('returnBook', BookLog::class);

        $book_log = $this->repo->findByUuidOrFail($uuid);

        $book_log = $this->repo->returnBook($book_log, $this->request->all());

        return $this->success(['message' => trans('library.book_returned')]);
    }

    /**
     * Used to unreturned books
     * @post ("/api/book/log/unreturned")
     * @return Response
     */
    public function unreturnedBooks()
    {
        $this->authorize('create', BookLog::class);

        return $this->ok($this->repo->unreturnedBooks($this->request->all()));
    }
}
