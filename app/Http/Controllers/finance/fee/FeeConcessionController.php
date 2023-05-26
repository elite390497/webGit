<?php

namespace App\Http\Controllers\Finance\Fee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Finance\Fee\FeeConcession;
use App\Http\Requests\Finance\Fee\FeeConcessionRequest;
use App\Repositories\Finance\Fee\FeeConcessionRepository;

class FeeConcessionController extends Controller
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
        FeeConcessionRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/fee/concession/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', FeeConcession::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Fee Concessions
     * @get ("/api/fee/concession")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', FeeConcession::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Fee Concessions
     * @post ("/api/fee/concession/print")
     * @return Response
     */
    public function print()
    {
        $fee_concessions = $this->repo->print(request('filter'));

        return view('print.finance.fee.concession', compact('fee_concessions'))->render();
    }

    /**
     * Used to generate pdf all Fee Concessions
     * @post ("/api/fee/concession/pdf")
     * @return Response
     */
    public function pdf()
    {
        $fee_concessions = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.concession', compact('fee_concessions'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Fee Concession
     * @post ("/api/fee/concession")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Fee Concession"),
     *      @Parameter("description", type="text", required="optional", description="Description of Fee Concession")
     * })
     * @return Response
     */
    public function store(FeeConcessionRequest $request)
    {
        $this->authorize('create', FeeConcession::class);

        $fee_concession = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.fee_concession_added')]);
    }

    /**
     * Used to get Fee Concession detail
     * @get ("/api/fee/concession/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Concession"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', FeeConcession::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Fee Concession
     * @patch ("/api/fee/concession/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Concession"),
     *      @Parameter("name", type="string", required="true", description="Name of Fee Concession"),
     *      @Parameter("description", type="text", required="optional", description="Description of Fee Concession")
     * })
     * @return Response
     */
    public function update($id, FeeConcessionRequest $request)
    {
        $this->authorize('update', FeeConcession::class);

        $fee_concession = $this->repo->findOrFail($id);

        $fee_concession = $this->repo->update($fee_concession, $this->request->all());

        return $this->success(['message' => trans('finance.fee_concession_updated')]);
    }

    /**
     * Used to delete Fee Concession
     * @delete ("/api/fee/concession/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Concession"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', FeeConcession::class);

        $fee_concession = $this->repo->deletable($id);

        $this->repo->delete($fee_concession);

        return $this->success(['message' => trans('finance.fee_concession_deleted')]);
    }
}
