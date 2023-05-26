<?php

namespace App\Http\Controllers\Finance\Fee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Finance\Fee\FeeGroup;
use App\Http\Requests\Finance\Fee\FeeGroupRequest;
use App\Repositories\Finance\Fee\FeeGroupRepository;

class FeeGroupController extends Controller
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
        FeeGroupRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Fee Groups
     * @get ("/api/fee/group")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', FeeGroup::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Fee Groups
     * @post ("/api/fee/group/print")
     * @return Response
     */
    public function print()
    {
        $fee_groups = $this->repo->print(request('filter'));

        return view('print.finance.fee.group', compact('fee_groups'))->render();
    }

    /**
     * Used to generate pdf all Fee Groups
     * @post ("/api/fee/group/pdf")
     * @return Response
     */
    public function pdf()
    {
        $fee_groups = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.fee.group', compact('fee_groups'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Fee Group
     * @post ("/api/fee/group")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Fee Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Fee Group")
     * })
     * @return Response
     */
    public function store(FeeGroupRequest $request)
    {
        $this->authorize('create', FeeGroup::class);

        $fee_group = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.fee_group_added')]);
    }

    /**
     * Used to get Fee Group detail
     * @get ("/api/fee/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Group"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', FeeGroup::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Fee Group
     * @patch ("/api/fee/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Group"),
     *      @Parameter("name", type="string", required="true", description="Name of Fee Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Fee Group")
     * })
     * @return Response
     */
    public function update($id, FeeGroupRequest $request)
    {
        $this->authorize('update', FeeGroup::class);

        $fee_group = $this->repo->findOrFail($id);

        $fee_group = $this->repo->update($fee_group, $this->request->all());

        return $this->success(['message' => trans('finance.fee_group_updated')]);
    }

    /**
     * Used to delete Fee Group
     * @delete ("/api/fee/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Fee Group"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', FeeGroup::class);

        $fee_group = $this->repo->deletable($id);

        $this->repo->delete($fee_group);

        return $this->success(['message' => trans('finance.fee_group_deleted')]);
    }
}
