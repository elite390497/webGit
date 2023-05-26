<?php

namespace App\Http\Controllers\Transport;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\TransportFee;
use App\Http\Requests\Transport\TransportFeeRequest;
use App\Repositories\Transport\TransportFeeRepository;

class TransportFeeController extends Controller
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
        TransportFeeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/transport/fee/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', TransportFee::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Transport Fees
     * @get ("/api/transport/fee")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', TransportFee::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Transport Fees
     * @post ("/api/transport/fee/print")
     * @return Response
     */
    public function print()
    {
        $fees = $this->repo->print(request('filter'));

        return view('print.transport.fee', compact('fees'))->render();
    }

    /**
     * Used to generate pdf all Transport Fees
     * @post ("/api/transport/fee/pdf")
     * @return Response
     */
    public function pdf()
    {
        $fees = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.fee', compact('fees'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Transport Fee
     * @post ("/api/transport/fee")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Transport Fee"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Fee")
     * })
     * @return Response
     */
    public function store(TransportFeeRequest $request)
    {
        $this->authorize('create', TransportFee::class);

        $transport_fee = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.fee_added')]);
    }

    /**
     * Used to get Transport Fee detail
     * @get ("/api/transport/fee/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Fee"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', TransportFee::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Transport Fee
     * @patch ("/api/transport/fee/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Fee"),
     *      @Parameter("name", type="string", required="true", description="Name of Transport Fee"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Fee")
     * })
     * @return Response
     */
    public function update($id, TransportFeeRequest $request)
    {
        $this->authorize('update', TransportFee::class);

        $transport_fee = $this->repo->findOrFail($id);

        $transport_fee = $this->repo->update($transport_fee, $this->request->all());

        return $this->success(['message' => trans('transport.fee_updated')]);
    }

    /**
     * Used to delete Transport Fee
     * @delete ("/api/transport/fee/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Fee"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', TransportFee::class);

        $transport_fee = $this->repo->deletable($id);

        $this->repo->delete($transport_fee);

        return $this->success(['message' => trans('transport.fee_deleted')]);
    }
}
