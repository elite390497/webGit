<?php

namespace App\Http\Controllers\Finance\Fee;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Finance\Fee\FeeAllocation;
use App\Http\Requests\Finance\Fee\FeeInstallmentRequest;
use App\Repositories\Finance\Fee\FeeInstallmentRepository;

class FeeInstallmentController extends Controller
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
        FeeInstallmentRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/fee/installment/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', FeeAllocation::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get Fee Installment detail
     * @get ("/api/fee/installment/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Fee Installment"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', FeeAllocation::class);

        return $this->ok($this->repo->findByUuidOrFail($uuid));
    }

    /**
     * Used to update Fee Installment
     * @patch ("/api/fee/installment/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Fee Installment")
     * })
     * @return Response
     */
    public function update(FeeInstallmentRequest $request, $uuid)
    {
        $fee_installment = $this->repo->findByUuidOrFail($uuid);

        $fee_installment = $this->repo->update($fee_installment, $this->request->all());

        return $this->success(['message' => trans('finance.fee_installment_updated')]);
    }
}
