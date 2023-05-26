<?php

namespace App\Http\Controllers\Transport;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\TransportStoppage;
use App\Http\Requests\Transport\TransportStoppageRequest;
use App\Repositories\Transport\TransportStoppageRepository;

class TransportStoppageController extends Controller
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
        TransportStoppageRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Transport Stoppages
     * @get ("/api/transport/stoppage")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', TransportStoppage::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Transport Stoppages
     * @post ("/api/transport/stoppage/print")
     * @return Response
     */
    public function print()
    {
        $stoppages = $this->repo->print(request('filter'));

        return view('print.transport.stoppage', compact('stoppages'))->render();
    }

    /**
     * Used to generate pdf all Transport Stoppages
     * @post ("/api/transport/stoppage/pdf")
     * @return Response
     */
    public function pdf()
    {
        $stoppages = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.stoppage', compact('stoppages'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Transport Stoppage
     * @post ("/api/transport/stoppage")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Transport Stoppage"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Stoppage")
     * })
     * @return Response
     */
    public function store(TransportStoppageRequest $request)
    {
        $this->authorize('create', TransportStoppage::class);

        $transport_stoppage = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.stoppage_added')]);
    }

    /**
     * Used to get Transport Stoppage detail
     * @get ("/api/transport/stoppage/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Stoppage"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', TransportStoppage::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Transport Stoppage
     * @patch ("/api/transport/stoppage/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Stoppage"),
     *      @Parameter("name", type="string", required="true", description="Name of Transport Stoppage"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Stoppage")
     * })
     * @return Response
     */
    public function update($id, TransportStoppageRequest $request)
    {
        $this->authorize('update', TransportStoppage::class);

        $transport_stoppage = $this->repo->findOrFail($id);

        $transport_stoppage = $this->repo->update($transport_stoppage, $this->request->all());

        return $this->success(['message' => trans('transport.stoppage_updated')]);
    }

    /**
     * Used to delete Transport Stoppage
     * @delete ("/api/transport/stoppage/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Stoppage"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', TransportStoppage::class);

        $transport_stoppage = $this->repo->deletable($id);

        $this->repo->delete($transport_stoppage);

        return $this->success(['message' => trans('transport.stoppage_deleted')]);
    }
}
