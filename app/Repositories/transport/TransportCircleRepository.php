<?php
namespace App\Repositories\Transport;

use App\Models\Transport\TransportCircle;
use Illuminate\Validation\ValidationException;

class TransportCircleRepository
{
    protected $transport_circle;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        TransportCircle $transport_circle
    ) {
        $this->transport_circle = $transport_circle;
    }

    /**
     * Get transport circle query
     *
     * @return TransportCircle query
     */
    public function getQuery()
    {
        return $this->transport_circle;
    }

    /**
     * Count transport circle
     *
     * @return integer
     */
    public function count()
    {
        return $this->transport_circle->filterBySession()->count();
    }

    /**
     * List all transport circles by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->transport_circle->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all transport circles by name & id for select option
     *
     * @return array
     */

    public function selectAll($session_id = null)
    {
        return $this->transport_circle->filterBySession($session_id)->get(['name', 'id']);
    }

    /**
     * List all transport circles by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->transport_circle->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all transport circles
     *
     * @return array
     */
    public function getAll()
    {
        return $this->transport_circle->filterBySession()->get();
    }

    /**
     * Find transport circle with given id.
     *
     * @param integer $id
     * @return TransportCircle
     */
    public function find($id)
    {
        return $this->transport_circle->filterBySession()->filterById($id)->first();
    }

    /**
     * Find transport circle with given id or throw an error.
     *
     * @param integer $id
     * @return TransportCircle
     */
    public function findOrFail($id, $field = 'message')
    {
        $transport_circle = $this->transport_circle->filterBySession()->filterById($id)->first();

        if (! $transport_circle) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_circle')]);
        }

        return $transport_circle;
    }

    /**
     * Find transport circle with given id and session or throw an error.
     *
     * @param integer $id
     * @return TransportCircle
     */
    public function findWithSessionOrFail($id, $session_id = null, $field = 'message')
    {
        $transport_circle = $this->transport_circle->filterBySession($session_id)->filterById($id)->first();

        if (! $transport_circle) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_circle')]);
        }

        return $transport_circle;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return TransportCircle
     */
    public function getData($params)
    {
        $sort_by             = gv($params, 'sort_by', 'name');
        $order               = gv($params, 'order', 'asc');
        $name                = gv($params, 'name');

        $query = $this->transport_circle->filterBySession();

        if ($name) {
            $query->filterByName($name);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all transport circles using given params.
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
     * @return TransportCircle
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new transport circle.
     *
     * @param array $params
     * @return TransportCircle
     */
    public function create($params)
    {
        return $this->transport_circle->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $transport_circle_id = null)
    {
        $name = gv($params, 'name');

        $transport_circle_exist_query = (! $transport_circle_id) ? $this->transport_circle : $this->transport_circle->where('id', '!=', $transport_circle_id);

        $transport_circle_exists = $transport_circle_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($transport_circle_exists) {
            throw ValidationException::withMessages(['name' => trans('transport.transport_circle_exists')]);
        }

        $formatted = [
            'name'                => gv($params, 'name'),
            'description'         => gv($params, 'description')
        ];

        if (! $transport_circle_id) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Update given transport circle.
     *
     * @param TransportCircle $transport_circle
     * @param array $params
     *
     * @return TransportCircle
     */
    public function update(TransportCircle $transport_circle, $params)
    {
        return $transport_circle->forceFill($this->formatParams($params, $transport_circle->id))->save();
    }

    /**
     * Find transport circle & check it can be deleted or not.
     *
     * @param integer $id
     * @return TransportCircle
     */
    public function deletable($id)
    {
        $transport_circle = $this->findOrFail($id);

        if ($transport_circle->studentFeeRecords()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.circle_associated_with_student_fee_record')]);
        }

        return $transport_circle;
    }

    /**
     * Delete transport circle.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(TransportCircle $transport_circle)
    {
        return $transport_circle->delete();
    }

    /**
     * Delete multiple transport circles.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->transport_circle->whereIn('id', $ids)->delete();
    }
}
