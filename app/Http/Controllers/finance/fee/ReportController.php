<?php

namespace App\Http\Controllers\Finance\Fee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Finance\Fee\ReportRepository;
use App\Http\Requests\Finance\Fee\SendFeeSMSRequest;

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
        $this->middleware('prohibited.test.mode')->only(['smsSummary','smsDue','smsPayment']);
	}

    /**
     * Used to get fee summary
     * @get ("/api/fee/report/summary")
     * @return Response
     */
    public function feeSummary()
    {
        $data = $this->repo->paginateFeeSummary($this->request->all());
        $list = $data['list'];
        $footer = $data['footer'];

        $filters = $this->repo->getFilters();

        return $this->success(compact('list','footer','filters'));
    }

    /**
     * Used to print all fee summary
     * @post ("/api/fee/report/summary/print")
     * @return Response
     */
    public function printFeeSummary()
    {
        $data = $this->repo->printFeeSummary(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        return view('print.finance.fee.report.summary', compact('list','footer'))->render();
    }

    /**
     * Used to generate pdf of fee summary
     * @post ("/api/fee/report/summary/pdf")
     * @return Response
     */
    public function pdfFeeSummary()
    {
        $data = $this->repo->printFeeSummary(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.report.summary', compact('list','footer'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to send fee summary via SMS
     * @post ("/api/fee/report/summary/sms")
     * @return Response
     */
    public function smsSummary(SendFeeSMSRequest $request)
    {
        $this->repo->smsSummary($this->request->all());

        return $this->success(['message' => trans('communication.sms_submitted')]);
    }

    /**
     * Used to get fee concession
     * @get ("/api/fee/report/concession")
     * @return Response
     */
    public function feeConcession()
    {
        $data = $this->repo->paginateFeeConcession($this->request->all());
        $list = $data['list'];
        $footer = $data['footer'];

        $filters = $this->repo->getFilters();

        return $this->success(compact('list','footer','filters'));
    }

    /**
     * Used to print all fee concession
     * @post ("/api/fee/report/concession/print")
     * @return Response
     */
    public function printFeeConcession()
    {
        $data = $this->repo->printFeeConcession(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        return view('print.finance.fee.report.concession', compact('list','footer'))->render();
    }

    /**
     * Used to generate pdf of fee concession
     * @post ("/api/fee/report/concession/pdf")
     * @return Response
     */
    public function pdfFeeConcession()
    {
        $data = $this->repo->printFeeConcession(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.report.concession', compact('list','footer'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get fee due
     * @get ("/api/fee/report/due")
     * @return Response
     */
    public function feeDue()
    {
        $data = $this->repo->paginateFeeDue($this->request->all());
        $list = $data['list'];
        $footer = $data['footer'];
        $is_groupBy = $data['is_groupBy'];

        $filters = $this->repo->getFilters();

        return $this->success(compact('list','footer','is_groupBy','filters'));
    }

    /**
     * Used to print all fee due
     * @post ("/api/fee/report/due/print")
     * @return Response
     */
    public function printFeeDue()
    {
        $data = $this->repo->printFeeDue(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        return view('print.finance.fee.report.due', compact('list','footer'))->render();
    }

    /**
     * Used to generate pdf of fee due
     * @post ("/api/fee/report/due/pdf")
     * @return Response
     */
    public function pdfFeeDue()
    {
        $data = $this->repo->printFeeDue(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.report.due', compact('list','footer'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to send fee due via SMS
     * @post ("/api/fee/report/due/sms")
     * @return Response
     */
    public function smsDue(SendFeeSMSRequest $request)
    {
        $this->repo->smsDue($this->request->all());

        return $this->success(['message' => trans('communication.sms_submitted')]);
    }

    /**
     * Used to get fee payment
     * @get ("/api/fee/report/payment")
     * @return Response
     */
    public function feePayment()
    {
        $data = $this->repo->paginateFeePayment($this->request->all());
        $list = $data['list'];
        $footer = $data['footer'];

        $filters = $this->repo->getFilters();

        return $this->success(compact('list','footer','filters'));
    }

    /**
     * Used to print all fee payment
     * @post ("/api/fee/report/payment/print")
     * @return Response
     */
    public function printFeePayment()
    {
        $data = $this->repo->printFeePayment(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        return view('print.finance.fee.report.payment', compact('list','footer'))->render();
    }

    /**
     * Used to generate pdf of fee payment
     * @post ("/api/fee/report/payment/pdf")
     * @return Response
     */
    public function pdfFeePayment()
    {
        $data = $this->repo->printFeePayment(request('filter'));

        $list = $data['list'];
        $footer = $data['footer'];

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.report.payment', compact('list','footer'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to send fee payment via SMS
     * @post ("/api/fee/report/payment/sms")
     * @return Response
     */
    public function smsPayment(SendFeeSMSRequest $request)
    {
        $this->repo->smsPayment($this->request->all());

        return $this->success(['message' => trans('communication.sms_submitted')]);
    }
}