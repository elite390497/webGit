<?php

namespace App\Http\Controllers\Finance\Fee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Finance\Fee\FeeAllocation;
use App\Http\Requests\Finance\Fee\FeeAllocationRequest;
use App\Repositories\Finance\Fee\FeeAllocationRepository;

class FeeAllocationController extends Controller
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
        FeeAllocationRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/fee/allocation/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', FeeAllocation::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Fee Allocations
     * @get ("/api/fee-allocation")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', FeeAllocation::class);

        $fee_allocations = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('fee_allocations', 'filters'));
    }

    /**
     * Used to print all Fee Allocations
     * @post ("/api/fee/allocation/print")
     * @return Response
     */
    public function print()
    {
        $fee_allocations = $this->repo->print(request('filter'));

        return view('print.finance.fee.allocation', compact('fee_allocations'))->render();
    }

    /**
     * Used to print Fee Allocation details
     * @post ("/api/fee/allocation/{uuid}/print")
     * @return Response
     */
    public function printDetail($uuid)
    {
        $fee_allocation = $this->repo->findByUuidOrFail($uuid);

        $fee = request('fee');

        return view('print.finance.fee.allocation-detail', compact('fee_allocation', 'fee'))->render();
    }

    /**
     * Used to generate pdf all Fee Allocations
     * @post ("/api/fee/allocation/pdf")
     * @return Response
     */
    public function pdf()
    {
        $fee_allocations = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.allocation', compact('fee_allocations'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to generate pdf Fee Allocation details
     * @post ("/api/fee/allocation/{uuid}/pdf")
     * @return Response
     */
    public function pdfDetail($uuid)
    {
        $fee_allocation = $this->repo->findByUuidOrFail($uuid);

        $fee = request('fee');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.allocation-detail', compact('fee_allocation', 'fee'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Fee Allocation
     * @post ("/api/fee-allocation")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch"),
     *      @Parameter("fee_groups", type="array", required="true", description="Array of Fee Group")
     * })
     * @return Response
     */
    public function store(FeeAllocationRequest $request)
    {
        $this->authorize('create', FeeAllocation::class);

        $fee_allocation = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.fee_allocation_added')]);
    }

    /**
     * Copy Fee Allocation to all other batches of this coursee
     * @post ("/api/fee/allocation/{uuid}/copy")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Fee Allocation")
     * })
     * @return Response
     */
    public function copy($uuid)
    {
        $fee_allocation = $this->repo->findByUuidOrFail($uuid);

        $this->repo->copyBatchFee($fee_allocation, ['copy_batch_fee' => true]);

        return $this->success(['message' => trans('finance.fee_allocation_added')]);
    }

    /**
     * Used to get Fee Allocation detail
     * @get ("/api/fee/allocation/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Fee Allocation"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', FeeAllocation::class);

        return $this->ok($this->repo->findByUuidOrFail($uuid));
    }

    /**
     * Used to update Fee Allocation
     * @patch ("/api/fee/allocation/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Fee Allocation"),
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch"),
     *      @Parameter("fee_groups", type="array", required="true", description="Array of Fee Group")
     * })
     * @return Response
     */
    public function update(FeeAllocationRequest $request, $uuid)
    {
        $fee_allocation = $this->repo->findByUuidOrFail($uuid);

        $fee_allocation = $this->repo->update($fee_allocation, $this->request->all());

        return $this->success(['message' => trans('finance.fee_allocation_updated')]);
    }

    /**
     * Used to delete Fee Allocation
     * @delete ("/api/fee/allocation/{uuid}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Unique Id of Fee Allocation"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $fee_allocation = $this->repo->deletable($uuid);

        $this->repo->delete($fee_allocation);

        return $this->success(['message' => trans('finance.fee_allocation_deleted')]);
    }

    /**
     * Used to get show fee pre requisites
     * @get ("/api/fee/allocation/show/pre-requisite")
     * @return Response
     */
    public function showPreRequisite()
    {
        $this->authorize('list', FeeAllocation::class);

        return $this->success($this->repo->getShowPreRequisite());
    }
}
