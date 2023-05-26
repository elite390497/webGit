<?php
namespace App\Repositories\Transport;

use Carbon\Carbon;
use App\Traits\CollectionPaginator;
use App\Models\Transport\TransportRoute;
use App\Models\Transport\TransportStoppage;
use Illuminate\Validation\ValidationException;
use App\Models\Transport\TransportRouteStudent;

class ReportRepository
{
    protected $transport_route;
    protected $transport_stoppage;
    protected $transport_route_student;

    use CollectionPaginator;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
	public function __construct(
        TransportRoute $transport_route,
        TransportStoppage $transport_stoppage,
        TransportRouteStudent $transport_route_student
	) {
        $this->transport_route = $transport_route;
        $this->transport_stoppage = $transport_stoppage;
        $this->transport_route_student = $transport_route_student;
	}

    /**
     * Get filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $transport_routes = generateSelectOption($this->transport_route->filterBySession()->get()->pluck('name', 'id')->all());
        $transport_stoppages = generateSelectOption($this->transport_stoppage->filterBySession()->get()->pluck('name', 'id')->all());
        return compact('transport_routes', 'transport_stoppages');
    }

    /**
     * Get route wise report data.
     *
     * @param array $params
     * @return Array
     */
    public function getRouteWiseData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');
        $transport_route = gv($params, 'transport_route', []);

        return $this->transport_route_student->with([
            'transportRouteDetail',
            'transportRouteDetail.transportStoppage',
            'transportRouteDetail.transportRoute',
            'studentRecord',
            'studentRecord.batch',
            'studentRecord.batch.course',
            'studentRecord.student',
            'studentRecord.admission'
        ])->whereHas('transportRouteDetail', function($q) use($transport_route) {
            $q->whereHas('transportRoute', function($q1) use($transport_route) {
                $q1->where('id', $transport_route);
            });
        });
    }

    /**
     * Get route wise report
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateRouteWiseReport($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getRouteWiseData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Array
     */
    public function printRouteWiseReport($params)
    {
        return $this->getRouteWiseData($params)->get();
    }

    /**
     * Get stoppage wise report data.
     *
     * @param array $params
     * @return Array
     */
    public function getStoppageWiseData($params)
    {
        $sort_by            = gv($params, 'sort_by', 'name');
        $order              = gv($params, 'order', 'asc');
        $transport_stoppage = gv($params, 'transport_stoppage', []);

        return $this->transport_route_student->with([
            'transportRouteDetail',
            'transportRouteDetail.transportStoppage',
            'transportRouteDetail.transportRoute',
            'studentRecord',
            'studentRecord.batch',
            'studentRecord.batch.course',
            'studentRecord.student',
            'studentRecord.admission'
        ])->whereHas('transportRouteDetail', function($q) use($transport_stoppage) {
            $q->whereHas('transportStoppage', function($q1) use($transport_stoppage) {
                $q1->where('id', $transport_stoppage);
            });
        });
    }

    /**
     * Get stoppage wise report
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateStoppageWiseReport($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getStoppageWiseData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Array
     */
    public function printStoppageWiseReport($params)
    {
        return $this->getStoppageWiseData($params)->get();
    }
}