<?php
namespace App\Repositories\Transport;

use App\Models\Transport\TransportRoute;
use App\Models\Transport\TransportRouteDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Transport\TransportStoppageRepository;

class TransportRouteRepository
{
    protected $transport_route;
    protected $transport_stoppage;
    protected $transport_route_detail;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        TransportRoute $transport_route,
        TransportStoppageRepository $transport_stoppage,
        TransportRouteDetail $transport_route_detail
    ) {
        $this->transport_route = $transport_route;
        $this->transport_stoppage = $transport_stoppage;
        $this->transport_route_detail = $transport_route_detail;
    }

    /**
     * Get transport route query
     *
     * @return TransportRoute query
     */
    public function getQuery()
    {
        return $this->transport_route;
    }

    /**
     * Count transport route
     *
     * @return integer
     */
    public function count()
    {
        return $this->transport_route->filterBySession()->count();
    }

    /**
     * List all transport routes by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->transport_route->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all transport routes by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->transport_route->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all transport routes by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->transport_route->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all transport routes
     *
     * @return array
     */
    public function getAll()
    {
        return $this->transport_route->filterBySession()->get();
    }

    /**
     * Find transport route with given id.
     *
     * @param integer $id
     * @return TransportRoute
     */
    public function find($id)
    {
        return $this->transport_route->filterBySession()->filterById($id)->first();
    }

    /**
     * Find transport route with given id or throw an error.
     *
     * @param integer $id
     * @return TransportRoute
     */
    public function findOrFail($id, $field = 'message')
    {
        $transport_route = $this->transport_route->with('transportRouteDetails','transportRouteDetails.transportStoppage')->filterBySession()->filterById($id)->first();

        if (! $transport_route) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_route')]);
        }

        return $transport_route;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return TransportRoute
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $name    = gv($params, 'name');

        $query = $this->transport_route->with([
            'transportRouteDetails' => function($q) {
                $q->orderBy('position','asc');
            }, 
            'transportRouteDetails.transportStoppage'
        ])->filterBySession();

        if ($name) {
            $query->filterByName($name);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all transport routes using given params.
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
     * @return TransportRoute
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get transport route pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->transport_stoppage->getAll();
    }

    /**
     * Create a new transport route.
     *
     * @param array $params
     * @return TransportRoute
     */
    public function create($params)
    {
        $transport_route = $this->transport_route->forceCreate($this->formatParams($params));

        $this->updateTransportRouteDetail($transport_route, $params);

        return $transport_route;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $transport_route = null)
    {
        $name = gv($params, 'name');
        $description = gv($params, 'description');

        $transport_route_exist_query = (! $transport_route) ? $this->transport_route : $this->transport_route->where('id', '!=', $transport_route->id);

        $transport_route_exists = $transport_route_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($transport_route_exists) {
            throw ValidationException::withMessages(['name' => trans('transport.route_exists')]);
        }

        $this->validateTransportStoppage($params);

        $formatted = [
            'name'        => $name,
            'description' => $description
        ];

        if (! $transport_route) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Validate transport stoppages
     *
     * @param array $params
     * @return void
     */
    public function validateTransportStoppage($params = array())
    {
        $transport_stoppages = gv($params, 'transport_stoppages', []);

        if (! $transport_stoppages) {
            throw ValidationException::withMessages(['message' => trans('transport.could_not_find_any_stoppage')]);
        }

        if (count($transport_stoppages) != count(array_unique($transport_stoppages))) {
            throw ValidationException::withMessages(['message' => trans('transport.duplicate_stoppage_found')]);
        }

        $transport_stoppage_ids = $this->transport_stoppage->listId();

        foreach ($transport_stoppages as $transport_stoppage_id) {
            if (! in_array($transport_stoppage_id, $transport_stoppage_ids)) {
                throw ValidationException::withMessages(['transport_stoppages' => trans('transport.could_not_find_stoppage')]);
            }
        }
    }

    /**
     * Update transport route details
     *
     * @param TransportRoute $transport_route
     * @param array $params
     * @return void
     */
    public function updateTransportRouteDetail(TransportRoute $transport_route, $params)
    {
        $transport_stoppages = gv($params, 'transport_stoppages', []);

        foreach ($transport_stoppages as $index => $transport_stoppage_id) {
            $transport_route_detail = $this->transport_route_detail->firstOrNew(['transport_route_id' => $transport_route->id, 'transport_stoppage_id' => $transport_stoppage_id]);
            $transport_route_detail->position = $index;
            $transport_route_detail->save();
        }
    }

    /**
     * Get selected transport stoppage.
     *
     * @param TransportRoute $transport_route
     * @return Array
     */
    public function getSelectedTransportStoppages(TransportRoute $transport_route)
    {
        $selected = array();
        foreach ($transport_route->transportRouteDetails as $detail) {
            $selected[] = ['id' => $detail->transport_stoppage_id, 'name' => $detail->transportStoppage->name];
        }

        return $selected;
    }

    /**
     * Update given transport route.
     *
     * @param TransportRoute $transport_route
     * @param array $params
     *
     * @return TransportRoute
     */
    public function update(TransportRoute $transport_route, $params)
    {
        $transport_route->forceFill($this->formatParams($params, $transport_route))->save();

        $this->updateTransportRouteDetail($transport_route, $params);

        return $transport_route;
    }

    /**
     * Reorder all stoppage of a route
     *
     * @param array $params
     */
    public function stoppageReorder(TransportRoute $transport_route, $params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $transport_route_detail = $this->transport_route_detail->filterByTransportRouteId($transport_route->id)->whereHas('transportStoppage', function($q) use($item) {
                $q->where('name', $item);
            })->first();
            $transport_route_detail->position = $index;
            $transport_route_detail->save();
        }
    }

    /**
     * Find transport route & check it can be deleted or not.
     *
     * @param integer $id
     * @return TransportRoute
     */
    public function deletable($id)
    {
        $transport_route = $this->findOrFail($id);

        // if ($transport_route->routeInstallments()->count()) {
        //     throw ValidationException::withMessages(['message' => trans('transport.route_associated_with_installment')]);
        // }

        return $transport_route;
    }

    /**
     * Delete transport route.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(TransportRoute $transport_route)
    {
        return $transport_route->delete();
    }

    /**
     * Delete multiple transport routes.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->transport_route->whereIn('id', $ids)->delete();
    }
}
