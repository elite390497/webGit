<?php

namespace App\Http\Controllers\Student;

use Illuminate\Http\Request;
use PayPal\Api\Item;
use PayPal\Api\Payer;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Payment;
use PayPal\Api\ItemList;
use PayPal\Api\Transaction;
use PayPal\Rest\ApiContext;
use PayPal\Api\RedirectUrls;
use PayPal\Api\ExecutePayment;
use PayPal\Api\PaymentExecution;
use PayPal\Auth\OAuthTokenCredential;
use App\Http\Controllers\Controller;
use App\Models\Student\StudentRecord;
use App\Repositories\Student\StudentRecordRepository;
use App\Repositories\Student\StudentFeePaymentRepository;

class StudentFeePaymentController extends Controller
{
	protected $request;
	protected $repo;
	protected $student_record;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
	public function __construct(
		Request $request,
		StudentFeePaymentRepository $repo,
		StudentRecordRepository $student_record
	) {
		$this->request = $request;
		$this->repo = $repo;
		$this->student_record = $student_record;
		
        $paypal_conf = config('paypal');
        $this->_api_context = new ApiContext(new OAuthTokenCredential($paypal_conf['client_id'], $paypal_conf['secret']));
        $this->_api_context->setConfig($paypal_conf['settings']);
	}

	public function razorpayPayment($uuid, $record_id)
	{
        $this->authorize('makePaymentAsParent', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $this->repo->razorpayPayment($student_record, $this->request->all());

        return $this->success(['message' => trans('finance.fee_paid')]);
	}

	public function stripePayment($uuid, $record_id)
	{
        $this->authorize('makePaymentAsParent', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $this->repo->stripePayment($student_record, $this->request->all());

        return $this->success(['message' => trans('finance.fee_paid')]);
	}

    /**
     * Process paypal payment
     * @post ("/api/student/{uuid}/payment/{record_id}/paypal")
     * @param ({
     *      @Parameter("uuid", type="string", required="required", description="Unique Id of Student"),
     *      @Parameter("record_id", type="integer", required="required", description="Student Record Id")
     * })
     * @return Response
     */
    public function paypalPayment($uuid, $record_id)
    {
        $this->authorize('makePaymentAsParent', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $this->repo->validatePaypalPayment($student_record, $this->request->all());

        $payer = new Payer();
        $payer->setPaymentMethod("paypal");

        $amount = request('amount');
        $currency = getDefaultCurrency()['name'];
        $description = $student_record->Student->name.' '.trans('finance.fee');

        $item_1 = new Item();
        $item_1->setName($description)
        ->setCurrency($currency)
        ->setQuantity(1)
        ->setPrice($amount);

        $total = $amount;

        $item_list = new ItemList();
        $item_list->setItems(array($item_1));

        $amount = new Amount();
        $amount->setCurrency($currency)
        ->setTotal($total);

        $paypal_transaction = new Transaction();
        $paypal_transaction->setAmount($amount)
        ->setItemList($item_list)
        ->setDescription($description);

        $redirect_urls = new RedirectUrls();
        $redirect_urls->setReturnUrl(url('paypal/status'))
        ->setCancelUrl(url('paypal/status'));

        $payment = new Payment();
        $payment->setIntent('Sale')
        ->setPayer($payer)
        ->setRedirectUrls($redirect_urls)
        ->setTransactions(array($paypal_transaction));

        try {
            $payment->create($this->_api_context);
        } catch (\PayPal\Exception\PPConnectionException $ex) {
            if (\config('app.debug')) {
                echo "Exception: " . $ex->getMessage() . PHP_EOL;
                $err_data = json_decode($ex->getData(), true);
                exit;
            } else {
                return redirect('/paypal/status')->withErrors(trans('general.something_wrong'));
            }
        }

        foreach ($payment->getLinks() as $link) {
            if ($link->getRel() === 'approval_url') {
                $redirect_url = $link->getHref();
                break;
            }
        }

        $params = $this->request->all();
        $params['user_id'] = \Auth::user()->id;

        \Cache::put('paypal_payment_id', $payment->getId(), 60);
        \Cache::put('uuid', $uuid, 60);
        \Cache::put('record_id', $record_id, 60);
        \Cache::put('params', $params, 60);

        $redirect_url = isset($redirect_url) ? $redirect_url : '/paypal/status';

        return $redirect_url;
    }

    /**
     * Fetch paypal payment status
     * @post ("/paypal/status")
     * @param ({
     *      @Parameter("PayerID", type="string", required="required", description="PayerID from Paypal")
     *      @Parameter("token", type="string", required="required", description="Token from Paypal")
     * })
     * @return Response
     */
    public function paypalStatus()
    {
		$payment_id = \Cache::get('paypal_payment_id');
		$params     = \Cache::get('params');
		$uuid       = \Cache::get('uuid');
		$record_id  = \Cache::get('record_id');
		$url        = '/student/'.$uuid.'/fee/'.$record_id;

        \Cache::forget('paypal_payment_id');
        \Cache::forget('params');
        \Cache::forget('uuid');
        \Cache::forget('record_id');

        if (empty(request('PayerID')) || empty(request('token'))) {
            return redirect($url)->withErrors(trans('finance.payment_failed'));
        }

        $payment = Payment::get($payment_id, $this->_api_context);

        $execution = new PaymentExecution();
        $execution->setPayerId(request('PayerID'));

        $result = $payment->execute($execution, $this->_api_context);

        if ($result->getState() != 'approved') {
            return redirect($url)->withErrors(trans('finance.payment_failed'));
        } 

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $params['gateway_token'] = $payment_id;
        $this->repo->paypalPayment($student_record, $params);

        return redirect($url);
    }
}