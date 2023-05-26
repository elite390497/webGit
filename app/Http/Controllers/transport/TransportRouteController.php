<?php

namespace App\Http\Controllers\Transport;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\TransportRoute;
use App\Http\Requests\Transport\TransportRouteRequest;
use App\Repositories\Transport\TransportRouteRepository;

class TransportRouteController extends Controller
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
        TransportRouteRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/transport/route/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', TransportRoute::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Transport Routes
     * @get ("/api/transport/route")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', TransportRoute::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Transport Routes
     * @post ("/api/transport/route/print")
     * @return Response
     */
    public function print()
    {
        $routes = $this->repo->print(request('filter'));

        return view('print.transport.route', compact('routes'))->render();
    }

    /**
     * Used to generate pdf all Transport Routes
     * @post ("/api/transport/route/pdf")
     * @return Response
     */
    public function pdf()
    {
        $routes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.route', compact('routes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Transport Route
     * @post ("/api/transport/route")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Transport Route"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Route")
     * })
     * @return Response
     */
    public function store(TransportRouteRequest $request)
    {
        $this->authorize('create', TransportRoute::class);

        $transport_route = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.route_added')]);
    }

    /**
     * Used to get Transport Route detail
     * @get ("/api/transport/route/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Route"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', TransportRoute::class);

        $transport_route = $this->repo->findOrFail($id);

        $selected_transport_stoppages = $this->repo->getSelectedTransportStoppages($transport_route);

        return $this->success(compact('transport_route', 'selected_transport_stoppages'));
    }
 
     /**
     * Used to reorder all stoppages of route
     * @frontend ("/api/transport/route/{id}/stoppage/reorder")
     * @return Response
     */
    public function stoppageReorder($id)
    {
        $this->authorize('update', TransportRoute::class);

        $transport_route = $this->repo->findOrFail($id);

        $this->repo->stoppageReorder($transport_route, $this->request->all());
    
        return $this->success(['message' => trans('transport.route_updated')]);
    }

    /**
     * Used to update Transport Route
     * @patch ("/api/transport/route/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Route"),
     *      @Parameter("name", type="string", required="true", description="Name of Transport Route"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transport Route")
     * })
     * @return Response
     */
    public function update($id, TransportRouteRequest $request)
    {
        $this->authorize('update', TransportRoute::class);

        $transport_route = $this->repo->findOrFail($id);

        $transport_route = $this->repo->update($transport_route, $this->request->all());

        return $this->success(['message' => trans('transport.route_updated')]);
    }

    /**
     * Used to delete Transport Route
     * @delete ("/api/transport/route/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transport Route"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', TransportRoute::class);

        $transport_route = $this->repo->deletable($id);

        $this->repo->delete($transport_route);

        return $this->success(['message' => trans('transport.route_deleted')]);
    }
}
