<?php

namespace App\Http\Controllers\Utility;

use App\Models\Utility\Todo;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Utility\TodoRequest;
use App\Repositories\Utility\TodoRepository;

class TodoController extends Controller
{
    protected $module = 'todo';

    private $request;
    private $repo;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        TodoRepository $repo
    ) {
        $this->request  = $request;
        $this->repo     = $repo;

        $this->middleware('feature.available:todo');
    }

    /**
     * Used to get all Todos
     * @get ("/api/todo")
     * @return Response
     */
    public function index()
    {
        $this->authorize('view', Todo::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to get all todays Todos
     * @get ("/api/todo/today")
     * @return Response
     */
    public function getTodoOfToday()
    {
        $this->authorize('view', Todo::class);

        return $this->ok($this->repo->getTodoOfToday());
    }

    /**
     * Used to store Todo
     * @post ("/api/todo")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Todo"),
     *      @Parameter("date", type="date", required="true", description="Due date of Todo"),
     * })
     * @return Response
     */
    public function store(TodoRequest $request)
    {
        $this->authorize('create', Todo::class);

        $todo = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('utility.todo_added')]);
    }

    /**
     * Used to get Todo detail
     * @get ("/api/todo/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Todo"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $todo = $this->repo->findOrFail($id);

        $this->authorize('show', $todo);

        return $this->ok($todo);
    }

    /**
     * Used to update Todo status
     * @post ("/api/todo/{id}/status")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Todo"),
     * })
     * @return Response
     */
    public function toggleStatus($id)
    {
        $todo = $this->repo->findOrFail($id);

        $this->authorize('update', $todo);

        $todo = $this->repo->toggle($todo);

        return $this->success(['message' => trans('utility.todo_updated'),'todo' => $todo]);
    }

    /**
     * Used to update Todo
     * @patch ("/api/todo/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Todo"),
     *      @Parameter("title", type="string", required="true", description="Title of Todo"),
     *      @Parameter("date", type="date", required="true", description="Due date of Todo"),
     * })
     * @return Response
     */
    public function update($id, TodoRequest $request)
    {
        $todo = $this->repo->findOrFail($id);

        $this->authorize('update', $todo);

        $todo = $this->repo->update($todo, $this->request->all());

        return $this->success(['message' => trans('utility.todo_updated')]);
    }

    /**
     * Used to delete Todo
     * @delete ("/api/todo/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Todo"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $todo = $this->repo->findOrFail($id);

        $this->authorize('delete', $todo);

        $this->repo->delete($todo);

        return $this->success(['message' => trans('utility.todo_deleted')]);
    }
}
