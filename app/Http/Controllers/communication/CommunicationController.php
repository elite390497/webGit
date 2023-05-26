<?php

namespace App\Http\Controllers\Communication;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Communication\CommunicationRepository;

class CommunicationController extends Controller
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
        CommunicationRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->middleware('permission:send-sms|send-email');
        $this->middleware('permission:delete-communication-history')->only(['destroy']);
    }

    /**
     * Used to get pre requisite
     * @get ("/api/communication/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Communications
     * @get ("/api/communication")
     * @return Response
     */
    public function index()
    {
        $communications = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('communications', 'filters'));
    }

    /**
     * Used to print all Communications
     * @post ("/api/communication/print")
     * @return Response
     */
    public function print()
    {
        $communications = $this->repo->print(request('filter'));

        return view('print.communication.communication', compact('communications'))->render();
    }

    /**
     * Used to generate pdf all Communications
     * @post ("/api/communication/pdf")
     * @return Response
     */
    public function pdf()
    {
        $communications = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.communication.communication', compact('communications'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get Communication detail
     * @get ("/api/communication/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Communication"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $communication = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($communication);

        return $this->success(compact('communication'));
    }

    /**
     * Used to delete Communication
     * @delete ("/api/communication/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Communication"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $communication = $this->repo->findByUuidOrFail($uuid);

        $this->repo->delete($communication);

        return $this->success(['message' => trans('communication.communication_deleted')]);
    }
}