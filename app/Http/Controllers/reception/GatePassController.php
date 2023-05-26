<?php

namespace App\Http\Controllers\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Reception\GatePass;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reception\GatePassRequest;
use App\Repositories\Reception\GatePassRepository;

class GatePassController extends Controller
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
        GatePassRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/gate/pass/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', GatePass::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Gate Passes
     * @get ("/api/gate/pass")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', GatePass::class);

        $gate_passes = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('gate_passes', 'filters'));
    }

    /**
     * Used to print all Gate Passes
     * @post ("/api/gate/pass/print")
     * @return Response
     */
    public function print()
    {
        $gate_passes = $this->repo->print(request('filter'));

        return view('print.reception.gate-pass', compact('gate_passes'))->render();
    }

    /**
     * Used to generate pdf all Gate Passes
     * @post ("/api/gate/pass/pdf")
     * @return Response
     */
    public function pdf()
    {
        $gate_passes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.reception.gate-pass', compact('gate_passes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to print Gate Pass
     * @post ("/reception/gate/pass/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Gate Pass"),
     * })
     * @return Response
     */
    public function printDetail($uuid)
    {
        $this->authorize('list', GatePass::class);

        $gate_pass = $this->repo->findByUuidOrFail($uuid);

        return view()->first(['custom-print.reception.gate-pass-detail', 'print.reception.gate-pass-detail'], compact('gate_pass'));
    }

    /**
     * Used to store Gate Pass
     * @post ("/api/gate/pass")
     * @param ({
     *      @Parameter("description", type="text", required="optional", description="Description of Gate Pass")
     * })
     * @return Response
     */
    public function store(GatePassRequest $request)
    {
        $this->authorize('create', GatePass::class);

        $gate_pass = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.gate_pass_added')]);
    }

    /**
     * Used to get Gate Pass detail
     * @get ("/api/gate/pass/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Gate Pass"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', GatePass::class);

        $gate_pass = $this->repo->findByUuidOrFail($uuid);

        $selected_student = ($gate_pass->student_id) ? ['id' => $gate_pass->student_id, 'name' => $gate_pass->Student->name.' ('.$gate_pass->Student->Parent->first_guardian_name.' '.$gate_pass->Student->contact_number.')'] : [];

        $selected_employee = ($gate_pass->employee_id) ? ['id' => $gate_pass->employee_id, 'name' => $gate_pass->Employee->name.' ('.$gate_pass->Employee->contact_number.')'] : [];

        $time = [
                'hour' => date('h', strtotime($gate_pass->time)),
                'minute' => date('i', strtotime($gate_pass->time)),
                'meridiem' => date('a', strtotime($gate_pass->time))
            ];

        return $this->success(compact('gate_pass', 'selected_student', 'selected_employee', 'time'));
    }

    /**
     * Used to update Gate Pass
     * @patch ("/api/gate/pass/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Gate Pass"),
     *      @Parameter("dates", type="array", required="true", description="Array of Dates"),
     *      @Parameter("description", type="text", required="optional", description="Description of Gate Pass")
     * })
     * @return Response
     */
    public function update($uuid, GatePassRequest $request)
    {
        $this->authorize('update', GatePass::class);

        $gate_pass = $this->repo->findByUuidOrFail($uuid);

        $gate_pass = $this->repo->update($gate_pass, $this->request->all());

        return $this->success(['message' => trans('reception.gate_pass_updated')]);
    }

    /**
     * Used to delete Gate Pass
     * @delete ("/api/gate/pass/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Gate Pass"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', GatePass::class);

        $gate_pass = $this->repo->findByUuidOrFail($uuid);

        $this->repo->delete($gate_pass);

        return $this->success(['message' => trans('reception.gate_pass_deleted')]);
    }
}