<?php
namespace App\Repositories\Student;

use Razorpay\Api\Api as RazorpayApi;
use Stripe\Error\Api as StripeApi;
use Stripe\Error\Card;
use Stripe\Error\RateLimit;
use Stripe\Error\ApiConnection;
use Stripe\Error\Authentication;
use Stripe\Error\InvalidRequest;
use App\Models\Student\StudentRecord;
use App\Models\Student\StudentFeeRecord;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRecordRepository;

class StudentFeePaymentRepository
{
	protected $student_record;
	protected $student_record_repo;
	protected $student_fee_record;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
	public function __construct(
		StudentRecord $student_record,
		StudentRecordRepository $student_record_repo,
		StudentFeeRecord $student_fee_record
	) {
		$this->student_record = $student_record;
		$this->student_record_repo = $student_record_repo;
		$this->student_fee_record = $student_fee_record;
	}

    /**
     * Complete Razorpay payment
     *
     * @param array $params
     * @return null
     */
    public function razorpayPayment(StudentRecord $student_record, $params)
    {
        $transaction_id     = gv($params, 'transaction_id');
        $installments       = gv($params, 'installments',[]);
        $fee_installment_id = gv($params, 'fee_installment_id');

        $api = new RazorpayApi(config('config.razorpay_key'), config('config.razorpay_secret'));
        $payment = $api->payment->fetch($transaction_id);
        $payment = $payment->toArray();

        $notes = gv($payment, 'notes', []);

        if (! $payment) {
        	throw ValidationException::withMessages(['message' => trans('general.missing_parameter')]);
        }

        $student_record_id  = gv($notes, 'student_record_id');
        $fee                = gv($notes, 'fee');
        $handling_fee       = gv($notes, 'handling_fee', 0);

        if ($student_record->id != $student_record_id) {
        	throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $amount = gv($payment, 'amount', 0);
        $amount = $amount / 100;

        if ($fee + $handling_fee != $amount) {
            throw ValidationException::withMessages(['message' => trans('finance.total_mismatch')]);
        }

        $calculated_handling_fee = getPaymentGatewayHandlingFee('razorpay', $fee);

        if ($calculated_handling_fee != $handling_fee) {
            throw ValidationException::withMessages(['message' => trans('finance.handling_fee_mismatch')]);
        }

        $params['date'] = date('Y-m-d');
        $params['amount'] = $amount - $handling_fee;
        $params['handling_fee'] = $handling_fee;
        $params['is_online_payment'] = 1;
        $params['gateway'] = 'razorpay';
        $params['source'] = 'Razorpay';
        $params['gateway_token'] = $transaction_id;
        $params['reference_number'] = strtoupper(randomString(20));
        $params['installment_id'] = $fee_installment_id;
        $params['installments'] = $installments;

        $this->student_record_repo->makePayment($student_record, $params);
    }

    /**
     * Complete Stripe payment
     *
     * @param array $params
     * @return null
     */
    public function stripePayment(StudentRecord $student_record, $params)
    {
        $stripeToken        = gv($params, 'stripeToken');
        $fee_installment_id = gv($params, 'fee_installment_id');
        $installments       = gv($params, 'installments',[]);
        $amount             = gv($params, 'amount', 0);
        $fee                = gv($params, 'fee');
        $handling_fee       = gv($params, 'handling_fee', 0);
        $currency           = getDefaultCurrency()['name'];

        if (! $amount) {
            throw ValidationException::withMessages(['message' => trans('finance.cannot_process_if_amount_is_zero')]);
        }

        if ($fee + $handling_fee != ($amount / 100)) {
            throw ValidationException::withMessages(['message' => trans('finance.total_mismatch')]);
        }

        $calculated_handling_fee = getPaymentGatewayHandlingFee('stripe', $fee);

        if ($calculated_handling_fee != $handling_fee) {
            throw ValidationException::withMessages(['message' => trans('finance.handling_fee_mismatch')]);
        }

        \Stripe\Stripe::setApiKey(config('config.stripe_private_key'));
        try {
            $charge = \Stripe\Charge::create([
                'amount'   => $amount,
                'currency' => $currency,
                'source'   => $stripeToken
            ]);
        } catch (Card $e) {
            throw ValidationException::withMessages(['message' => $e->getMessage()]);
        }
        catch (StripeApi $e) {
            throw ValidationException::withMessages(['message' => $e->getMessage()]);
        }
        catch (InvalidRequest $e) {
            throw ValidationException::withMessages(['message' => $e->getMessage()]);
        }
        catch (RateLimit $e) {
            throw ValidationException::withMessages(['message' => $e->getMessage()]);
        }
        catch (ApiConnection $e) {
            throw ValidationException::withMessages(['message' => $e->getMessage()]);
        }
        catch (Authentication $e) {
            throw ValidationException::withMessages(['message' => $e->getMessage()]);
        }

        $amount = $amount / 100;

        $params['date'] = date('Y-m-d');
        $params['amount'] = $amount - $handling_fee;
        $params['handling_fee'] = $handling_fee;
        $params['is_online_payment'] = 1;
        $params['gateway'] = 'stripe';
        $params['source'] = 'Stripe';
        $params['gateway_token'] = $charge->id;
        $params['reference_number'] = strtoupper(randomString(20));
        $params['installment_id'] = $fee_installment_id;
        $params['installments'] = $installments;

        $this->student_record_repo->makePayment($student_record, $params);
    }

    /**
     * Validate Paypal payment
     *
     * @param array $params
     * @return null
     */
    public function validatePaypalPayment(StudentRecord $student_record, $params)
    {
        $amount             = gv($params, 'amount', 0);
        $fee                = gv($params, 'fee');
        $handling_fee       = gv($params, 'handling_fee', 0);

        if ($fee + $handling_fee != $amount) {
            throw ValidationException::withMessages(['message' => trans('finance.total_mismatch')]);
        }

        if (! $amount) {
            throw ValidationException::withMessages(['message' => trans('finance.cannot_process_if_amount_is_zero')]);
        }

        $calculated_handling_fee = getPaymentGatewayHandlingFee('paypal', $fee);

        if ($calculated_handling_fee != $handling_fee) {
            throw ValidationException::withMessages(['message' => trans('finance.handling_fee_mismatch')]);
        }
    }

    /**
     * Complete Paypal payment
     *
     * @param array $params
     * @return null
     */
    public function paypalPayment(StudentRecord $student_record, $params)
    {
        $fee_installment_id = gv($params, 'fee_installment_id');
        $installments       = gv($params, 'installments', []);
        $amount             = gv($params, 'amount', 0);
        $fee                = gv($params, 'fee');
        $handling_fee       = gv($params, 'handling_fee', 0);
        $currency           = getDefaultCurrency()['name'];

        $params['date'] = date('Y-m-d');
        $params['amount'] = $amount - $handling_fee;
        $params['handling_fee'] = $handling_fee;
        $params['is_online_payment'] = 1;
        $params['gateway'] = 'paypal';
        $params['source'] = 'Paypal';
        $params['reference_number'] = strtoupper(randomString(20));
        $params['installment_id'] = $fee_installment_id;
        $params['installments'] = $installments;

        $this->student_record_repo->makePayment($student_record, $params);
    }
}