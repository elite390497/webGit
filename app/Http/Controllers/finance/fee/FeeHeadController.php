<?php

namespace App\Http\Controllers\Finance\Fee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Finance\Fee\FeeHead;
use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\Fee\FeeHeadRequest;
use App\Repositories\Finance\Fee\FeeHeadRepository;

class FeeHeadController extends Controller
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
        FeeHeadRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/fee/head/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', FeeHead::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Fee Heads
     * @get ("/api/fee/head")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', FeeHead::class);

        $fee_heads = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('fee_heads', 'filters'));
    }

    /**
     * Used to print all Fee Heads
     * @post ("/api/fee/head/print")
     * @return Response
     */
    public function print()
    {
        $fee_heads = $this->repo->print(request('filter'));

        return view('print.finance.fee.head', compact('fee_heads'))->render();
    }

    /**
     * Used to generate pdf all Fee Heads
     * @post ("/api/fee/head/pdf")
     * @return Response
     */
    public function pdf()
    {
        $fee_heads = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.head', compact('fee_heads'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Fee Head
     * @post ("/api/fee/head")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Fee Head"),
     *      @Parameter("fee_group_id", type="integer", required="true", description="Id of Fee Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Fee Head")
     * })
     * @return Response
     */
    public function store(FeeHeadRequest $request)
    {
        $this->authorize('create', FeeHead::class);

        $fee_head = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.fee_head_added')]);
    }

    /**
     * Used to get Fee Head detail
     * @get ("/api/fee/head/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Head"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', FeeHead::class);

        $fee_head = $this->repo->findOrFail($id);

        $selected_fee_group = ($fee_head->fee_group_id) ? ['id' => $fee_head->fee_group_id,'name' => $fee_head->FeeGroup->name] : [];

        return $this->success(compact('fee_head', 'selected_fee_group'));
    }

    /**
     * Used to update Fee Head
     * @patch ("/api/fee/head/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Head"),
     *      @Parameter("name", type="string", required="true", description="Name of Fee Head"),
     *      @Parameter("fee_group_id", type="integer", required="true", description="Id of Fee Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Fee Head")
     * })
     * @return Response
     */
    public function update($id, FeeHeadRequest $request)
    {
        $this->authorize('update', FeeHead::class);

        $fee_head = $this->repo->findOrFail($id);

        $fee_head = $this->repo->update($fee_head, $this->request->all());

        return $this->success(['message' => trans('finance.fee_head_updated')]);
    }

    /**
     * Used to delete Fee Head
     * @delete ("/api/fee/head/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Head"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', FeeHead::class);

        $fee_head = $this->repo->deletable($id);

        $this->repo->delete($fee_head);

        return $this->success(['message' => trans('finance.fee_head_deleted')]);
    }
}
