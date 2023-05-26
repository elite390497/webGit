<?php

namespace App\Http\Controllers\Finance\Transaction;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Finance\Transaction\ReportRepository;

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
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get transaction summary
     * @get ("/api/transaction/report/summary")
     * @return Response
     */
    public function summary()
    {
        $data = $this->repo->paginateSummary($this->request->all());
        $list = $data['list'];
        $footer = $data['footer'];

        return $this->success(compact('list','footer'));
    }

    /**
     * Used to print all transaction summary
     * @post ("/api/transaction/report/summary/print")
     * @return Response
     */
    public function printSummary()
    {
        $data = $this->repo->printSummary(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        return view('print.finance.transaction.report.summary', compact('list','footer'))->render();
    }

    /**
     * Used to generate pdf of transaction summary
     * @post ("/api/transaction/report/summary/pdf")
     * @return Response
     */
    public function pdfSummary()
    {
        $data = $this->repo->printSummary(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.transaction.report.summary', compact('list','footer'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get transaction day book
     * @get ("/api/transaction/report/day-book")
     * @return Response
     */
    public function dayBook()
    {
        $data = $this->repo->paginateDayBook($this->request->all());
        $list = $data['list'];
        $footer = $data['footer'];

        return $this->success(compact('list','footer'));
    }

    /**
     * Used to print all transaction day book
     * @post ("/api/transaction/report/day-book/print")
     * @return Response
     */
    public function printDayBook()
    {
        $data = $this->repo->printDayBook(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        return view('print.finance.transaction.report.day_book', compact('list','footer'))->render();
    }

    /**
     * Used to generate pdf of transaction day book
     * @post ("/api/transaction/report/day-book/pdf")
     * @return Response
     */
    public function pdfDayBook()
    {
        $data = $this->repo->printDayBook(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.transaction.report.day_book', compact('list','footer'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }
}