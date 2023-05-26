<?php

namespace App\Http\Controllers\Transport;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Transport\ReportRepository;

class ReportController extends Controller
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
		ReportRepository $repo
	) {
		$this->request = $request;
		$this->repo = $repo;
	}

    /**
     * Used to get pre requisites
     * @get ("/api/transport/report/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getFilters());
    }

    /**
     * Used to get route wise report
     * @get ("/api/transport/report/route")
     * @return Response
     */
    public function routeWiseReport()
    {
        return $this->ok($this->repo->paginateRouteWiseReport($this->request->all()));
    }

    /**
     * Used to print all route wise report
     * @post ("/api/transport/report/route/print")
     * @return Response
     */
    public function printRouteWiseReport()
    {
        $transport_route_students = $this->repo->printRouteWiseReport(request('filter'));

        return view('print.transport.report.route', compact('transport_route_students'))->render();
    }

    /**
     * Used to generate pdf of route wise report
     * @post ("/api/transport/report/route/pdf")
     * @return Response
     */
    public function pdfRouteWiseReport()
    {
        $transport_route_students = $this->repo->printRouteWiseReport(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.report.route', compact('transport_route_students'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get stoppage wise report
     * @get ("/api/transport/report/stoppage")
     * @return Response
     */
    public function stoppageWiseReport()
    {
        return $this->ok($this->repo->paginateStoppageWiseReport($this->request->all()));
    }

    /**
     * Used to print all stoppage wise report
     * @post ("/api/transport/report/stoppage/print")
     * @return Response
     */
    public function printStoppageWiseReport()
    {
        $transport_route_students = $this->repo->printStoppageWiseReport(request('filter'));

        return view('print.transport.report.stoppage', compact('transport_route_students'))->render();
    }

    /**
     * Used to generate pdf of stoppage wise report
     * @post ("/api/transport/report/stoppage/pdf")
     * @return Response
     */
    public function pdfStoppageWiseReport()
    {
        $transport_route_students = $this->repo->printStoppageWiseReport(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.report.stoppage', compact('transport_route_students'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }
}