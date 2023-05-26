<?php

namespace App\Http\Controllers\Transport;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\TransportCircle;
use App\Http\Requests\Transport\TransportCircleRequest;
use App\Repositories\Transport\TransportCircleRepository;

class TransportCircleController extends Controller
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
        TransportCircleRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Transport Circles
     * @get ("/api/transport/circle")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', TransportCircle::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Transport Circles
     * @post ("/api/transport/circle/print")
     * @return Response
     */
    public function print()
    {
        $circles = $this->repo->print(request('filter'));

        return view('print.transport.circle', compact('circles'))->render();
    }

    /**
     * Used to generate pdf all Transport Circles
     * @post ("/api/transport/circle/pdf")
     * @return Response
     */
    public function pdf()
    {
        $circles = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.circle', compact('circles'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Transport Circle
     * @post ("/api/transport/circle")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Transport Circle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Circle")
     * })
     * @return Response
     */
    public function store(TransportCircleRequest $request)
    {
        $this->authorize('create', TransportCircle::class);

        $transport_circle = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.circle_added')]);
    }

    /**
     * Used to get Transport Circle detail
     * @get ("/api/transport/circle/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Circle"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', TransportCircle::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Transport Circle
     * @patch ("/api/transport/circle/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Circle"),
     *      @Parameter("name", type="string", required="true", description="Name of Transport Circle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Circle")
     * })
     * @return Response
     */
    public function update($id, TransportCircleRequest $request)
    {
        $this->authorize('update', TransportCircle::class);

        $transport_circle = $this->repo->findOrFail($id);

        $transport_circle = $this->repo->update($transport_circle, $this->request->all());

        return $this->success(['message' => trans('transport.circle_updated')]);
    }

    /**
     * Used to delete Transport Circle
     * @delete ("/api/transport/circle/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Circle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', TransportCircle::class);

        $transport_circle = $this->repo->deletable($id);

        $this->repo->delete($transport_circle);

        return $this->success(['message' => trans('transport.circle_deleted')]);
    }
}
