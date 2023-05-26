<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Transport\Vehicle\ReportRepository;

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
     * Used to get summary report
     * @get ("/api/vehicle/report/summary")
     * @return Response
     */
    public function summaryReport()
    {
        $data = $this->repo->paginateSummaryReport($this->request->all());
        $list = $data['list'];
        $footer = $data['footer'];

        $filters = $this->repo->getFilters();

        return $this->success(compact('list','footer','filters'));
    }

    /**
     * Used to print all summary report
     * @post ("/api/vehicle/report/summary/print")
     * @return Response
     */
    public function printSummaryReport()
    {
        $data = $this->repo->printSummaryReport(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        return view('print.transport.vehicle.report.summary', compact('list','footer'))->render();
    }

    /**
     * Used to generate pdf of summary report
     * @post ("/api/vehicle/report/summary/pdf")
     * @return Response
     */
    public function pdfSummaryReport()
    {
        $data = $this->repo->printFeeSummary(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle.report.summary', compact('list','footer'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }
}