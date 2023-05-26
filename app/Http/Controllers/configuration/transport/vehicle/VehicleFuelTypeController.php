<?php

namespace App\Http\Controllers\Configuration\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Transport\Vehicle\VehicleFuelTypeRequest;
use App\Repositories\Configuration\Transport\Vehicle\VehicleFuelTypeRepository;

class VehicleFuelTypeController extends Controller
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
        VehicleFuelTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Vehicle Fuel Types
     * @get ("/api/transport/vehicle/fuel/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Vehicle Fuel Types
     * @post ("/api/transport/vehicle/fuel/type/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_fuel_types = $this->repo->print(request('filter'));

        return view('print.configuration.transport.vehicle.fuel-type', compact('vehicle_fuel_types'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Fuel Types
     * @post ("/api/transport/vehicle/fuel/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_fuel_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.transport.vehicle.fuel-type', compact('vehicle_fuel_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Fuel Type
     * @post ("/api/transport/vehicle/fuel/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle Fuel Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Fuel Type")
     * })
     * @return Response
     */
    public function store(VehicleFuelTypeRequest $request)
    {
        $vehicle_fuel_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_fuel_type_added')]);
    }

    /**
     * Used to get Vehicle Fuel Type detail
     * @get ("/api/transport/vehicle/fuel/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Fuel Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Vehicle Fuel Type
     * @patch ("/api/transport/vehicle/fuel/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Fuel Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle Fuel Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Fuel Type")
     * })
     * @return Response
     */
    public function update($id, VehicleFuelTypeRequest $request)
    {
        $vehicle_fuel_type = $this->repo->findOrFail($id);

        $vehicle_fuel_type = $this->repo->update($vehicle_fuel_type, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_fuel_type_updated')]);
    }

    /**
     * Used to delete Vehicle Fuel Type
     * @delete ("/api/transport/vehicle/fuel/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Fuel Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $vehicle_fuel_type = $this->repo->deletable($id);

        $this->repo->delete($vehicle_fuel_type);

        return $this->success(['message' => trans('transport.vehicle_fuel_type_deleted')]);
    }
}
