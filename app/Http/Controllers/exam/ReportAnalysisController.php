<?php

namespace App\Http\Controllers\Exam;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\Exam\ExportReport;
use App\Repositories\Exam\ReportAnalysisRepository;

class ReportAnalysisController extends Controller
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
        ReportAnalysisRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisite
     * @get ("/api/exam/report/analysis/pre-requisite")
     * @return array
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to export exam report
     * @get ("/api/exam/report/analysis/export")
     * @return Response
     */
    public function export()
    {
        return Excel::download(new ExportReport($this->repo->export()), 'Exam Report.xlsx');
    }
}