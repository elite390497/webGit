<?php
namespace App\Repositories\Utility;

use Carbon\Carbon;
use App\Models\Utility\Todo;
use Illuminate\Validation\ValidationException;

class TodoRepository
{
    private $todo;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Todo $todo
    ) {
        $this->todo = $todo;
    }

    /**
     * Get todo query
     *
     * @return Todo query
     */

    public function getQuery()
    {
        return $this->todo;
    }

    /**
     * Find todo with given id or throw an error.
     *
     * @param integer $id
     * @return Todo
     */

    public function findOrFail($id)
    {
        $todo = $this->todo->find($id);

        if (! $todo) {
            throw ValidationException::withMessages(['message' => trans('utility.could_not_find_todo')]);
        }

        return $todo;
    }

    /**
     * Paginate all todos using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */

    public function paginate($params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));
        $keyword     = gv($params, 'keyword');
        $status      = gv($params, 'status', 0);
        $start_date  = gv($params, 'start_date');
        $end_date    = gv($params, 'end_date');

        $query = $this->todo->filterByUserId(\Auth::user()->id)->filterByTitleOrDescription($keyword)->filterCompletedTodo($status)->dateBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ]);

        return $query->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Get all todo of today.
     *
     * @return Todo
     */
    public function getTodoOfToday()
    {
        return $this->todo->filterByUserId(\Auth::user()->id)->dateBetween([
            'start_date' => date('Y-m-d'),
            'end_date' => date('Y-m-d')
        ])->get();
    }

    /**
     * Create a new todo.
     *
     * @param array $params
     * @return Todo
     */
    public function create($params)
    {
        return $this->todo->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $action = 'create')
    {
        $formatted = [
            'title'       => gv($params, 'title'),
            'description' => gv($params, 'description'),
            'date'        => toDate(gv($params, 'date'))
        ];

        if ($action === 'create') {
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Update given todo.
     *
     * @param Todo $todo
     * @param array $params
     *
     * @return Todo
     */
    public function update(Todo $todo, $params)
    {
        $todo->forceFill($this->formatParams($params, 'update'))->save();

        return $todo;
    }

    /**
     * Delete todo.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Todo $todo)
    {
        return $todo->delete();
    }

    /**
     * Delete multiple todos.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->todo->whereIn('id', $ids)->delete();
    }

    /**
     * Toggle given todo status.
     *
     * @param Todo $todo
     * @param array $params
     *
     * @return Todo
     */
    public function toggle(Todo $todo)
    {
        $todo->forceFill([
            'completed_at' => (! $todo->status) ? Carbon::now() : null,
            'status'       => ! $todo->status
        ])->save();

        return $todo;
    }
}
