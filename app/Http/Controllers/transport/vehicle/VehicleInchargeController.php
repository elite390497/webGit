<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\Vehicle\VehicleIncharge;
use App\Repositories\Transport\Vehicle\VehicleInchargeRepository;

class VehicleInchargeController extends Controller
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
        VehicleInchargeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get lists
     * @get ("/api/vehicle/incharge")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', VehicleIncharge::class);

        return $this->success($this->repo->getList($this->request->all()));
    }

    /**
     * Used to print all Vehicle Incharges
     * @post ("/api/vehicle/incharge/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', VehicleIncharge::class);

        $data = $this->repo->getList(request('filter'));

        $data['filter'] = request('filter');

        return view('print.transport.vehicle.incharge', $data)->render();
    }

    /**
     * Used to generate pdf all Vehicle Incharges
     * @post ("/api/vehicle/incharge/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', VehicleIncharge::class);
        
        $data = $this->repo->getList(request('filter'));

        $data['filter'] = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle.incharge', $data)->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Incharges
     * @post ("/api/vehicle/incharge")
     * @param ({
     *      @Parameter("vehicles", type="array", required="true", description="Array of Vehicles")
     * })
     * @return Response
     */
    public function store()
    {
        $this->authorize('store', VehicleIncharge::class);

        $this->repo->store($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_incharge_added')]);
    }

    /**
     * Used to delete Vehicle Incharge
     * @delete ("/api/vehicle/incharge/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Incharge"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', VehicleIncharge::class);

        $vehicle_incharge = $this->repo->deletable($id);

        $this->repo->delete($vehicle_incharge);

        return $this->success(['message' => trans('transport.vehicle_incharge_deleted')]);
    }
}
