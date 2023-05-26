<?php

namespace App\Http\Controllers\Configuration\Finance\Transaction;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Finance\Transaction\PaymentMethodRequest;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;

class PaymentMethodController extends Controller
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
        PaymentMethodRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Payment Types
     * @get ("/api/finance/payment/method")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Payment Methods
     * @post ("/api/finance/payment/method/print")
     * @return Response
     */
    public function print()
    {
        $payment_methods = $this->repo->print(request('filter'));

        return view('print.configuration.finance.transaction.payment-method', compact('payment_methods'))->render();
    }

    /**
     * Used to generate pdf all Payment Methods
     * @post ("/api/finance/payment/method/pdf")
     * @return Response
     */
    public function pdf()
    {
        $payment_methods = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.finance.transaction.payment-method', compact('payment_methods'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Payment Method
     * @post ("/api/finance/payment/method")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Payment Method"),
     *      @Parameter("description", type="text", required="optional", description="Description of Payment Method")
     * })
     * @return Response
     */
    public function store(PaymentMethodRequest $request)
    {
        $payment_method = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.payment_method_added')]);
    }

    /**
     * Used to get Payment Method detail
     * @get ("/api/finance/payment/method/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Payment Method"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Payment Method
     * @patch ("/api/finance/payment/method/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Payment Method"),
     *      @Parameter("name", type="string", required="true", description="Name of Payment Method"),
     *      @Parameter("description", type="text", required="optional", description="Description of Payment Method")
     * })
     * @return Response
     */
    public function update($id, PaymentMethodRequest $request)
    {
        $payment_method = $this->repo->findOrFail($id);

        $payment_method = $this->repo->update($payment_method, $this->request->all());

        return $this->success(['message' => trans('finance.payment_method_updated')]);
    }

    /**
     * Used to delete Payment Method
     * @delete ("/api/finance/payment/method/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Payment Method"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $payment_method = $this->repo->deletable($id);

        $this->repo->delete($payment_method);

        return $this->success(['message' => trans('finance.payment_method_deleted')]);
    }
}
