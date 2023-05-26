<?php

namespace App\Http\Controllers\Configuration\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Transport\Vehicle\VehicleServiceCenterRequest;
use App\Repositories\Configuration\Transport\Vehicle\VehicleServiceCenterRepository;

class VehicleServiceCenterController extends Controller
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
        VehicleServiceCenterRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Vehicle Service Centers
     * @get ("/api/transport/vehicle/service/center")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Vehicle Service Centers
     * @post ("/api/transport/vehicle/service/center/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_service_centers = $this->repo->print(request('filter'));

        return view('print.configuration.transport.vehicle.service-center', compact('vehicle_service_centers'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Service Centers
     * @post ("/api/transport/vehicle/service/center/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_service_centers = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.transport.vehicle.service-center', compact('vehicle_service_centers'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Service Center
     * @post ("/api/transport/vehicle/service/center")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle Service Center"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Service Center")
     * })
     * @return Response
     */
    public function store(VehicleServiceCenterRequest $request)
    {
        $vehicle_service_center = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_service_center_added')]);
    }

    /**
     * Used to get Vehicle Service Center detail
     * @get ("/api/transport/vehicle/service/center/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Service Center"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Vehicle Service Center
     * @patch ("/api/transport/vehicle/service/center/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Service Center"),
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle Service Center"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Service Center")
     * })
     * @return Response
     */
    public function update($id, VehicleServiceCenterRequest $request)
    {
        $vehicle_service_center = $this->repo->findOrFail($id);

        $vehicle_service_center = $this->repo->update($vehicle_service_center, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_service_center_updated')]);
    }

    /**
     * Used to delete Vehicle Service Center
     * @delete ("/api/transport/vehicle/service/center/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Service Center"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $vehicle_service_center = $this->repo->deletable($id);

        $this->repo->delete($vehicle_service_center);

        return $this->success(['message' => trans('transport.vehicle_service_center_deleted')]);
    }
}
