<?php

namespace App\Http\Controllers\Transport;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\TransportRoute;
use App\Repositories\Transport\TransportRouteAssignRepository;

class TransportRouteAssignController extends Controller
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
        TransportRouteAssignRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get transport route assign pre requisite
     * @get ("/api/transport/route/assign/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('assign', TransportRoute::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to fetch students
     * @post ("/api/transport/route/assign/fetch")
     * @return Response
     */
    public function fetchStudent()
    {
        $this->authorize('assign', TransportRoute::class);

        return $this->success($this->repo->fetchStudent($this->request->all()));
    }

    /**
     * Used to store transport route
     * @post ("/api/transport/route/assign")
     * @return Response
     */
    public function store()
    {
        $this->authorize('assign', TransportRoute::class);
        
        $this->repo->store($this->request->all());

        return $this->success(['message' => trans('transport.route_assigned')]);
    }
}