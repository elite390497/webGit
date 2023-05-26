<?php
namespace App\Repositories\Configuration\Calendar;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Calendar\EventType;

class EventTypeRepository
{
    protected $event_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EventType $event_type
    ) {
        $this->event_type = $event_type;
    }

    /**
     * Get event type query
     *
     * @return EventType query
     */
    public function getQuery()
    {
        return $this->event_type;
    }

    /**
     * Count event type
     *
     * @return integer
     */
    public function count()
    {
        return $this->event_type->count();
    }

    /**
     * List all event types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->event_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all event types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->event_type->all(['name', 'id']);
    }

    /**
     * List all event types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->event_type->all()->pluck('id')->all();
    }

    /**
     * Get all event types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->event_type->all();
    }

    /**
     * Find event type with given id.
     *
     * @param integer $id
     * @return EventType
     */
    public function find($id)
    {
        return $this->event_type->find($id);
    }

    /**
     * Find event type with given id or throw an error.
     *
     * @param integer $id
     * @return EventType
     */
    public function findOrFail($id)
    {
        $event_type = $this->event_type->find($id);

        if (! $event_type) {
            throw ValidationException::withMessages(['message' => trans('calendar.could_not_find_event_type')]);
        }

        return $event_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return EventType
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->event_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all event type using given params.
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
     * @return EventType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new event type.
     *
     * @param array $params
     * @return EventType
     */
    public function create($params)
    {
        return $this->event_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $event_type_id
     * @return array
     */
    private function formatParams($params, $event_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given event type.
     *
     * @param EventType $event_type
     * @param array $params
     *
     * @return EventType
     */
    public function update(EventType $event_type, $params)
    {
        return $event_type->forceFill($this->formatParams($params, $event_type->id))->save();
    }

    /**
     * Find event type & check it can be deleted or not.
     *
     * @param integer $id
     * @return EventType
     */
    public function deletable($id)
    {
        $event_type = $this->findOrFail($id);

        if ($event_type->events()->count()) {
            throw ValidationException::withMessages(['message' => trans('calendar.event_type_associated_with_event')]);
        }

        return $event_type;
    }

    /**
     * Delete event type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EventType $event_type)
    {
        return $event_type->delete();
    }

    /**
     * Delete multiple event types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->event_type->whereIn('id', $ids)->delete();
    }
}
