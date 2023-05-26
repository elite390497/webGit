<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\Vehicle\Vehicle;
use App\Http\Requests\Transport\Vehicle\VehicleRequest;
use App\Repositories\Transport\Vehicle\VehicleRepository;

class VehicleController extends Controller
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
        VehicleRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/vehicle/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Vehicle::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Vehicles
     * @get ("/api/vehicle")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Vehicle::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Vehicles
     * @post ("/api/vehicle/print")
     * @return Response
     */
    public function print()
    {
        $vehicles = $this->repo->print(request('filter'));

        return view('print.transport.vehicle.index', compact('vehicles'))->render();
    }

    /**
     * Used to generate pdf all Vehicles
     * @post ("/api/vehicle/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicles = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle.index', compact('vehicles'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle
     * @post ("/api/vehicle")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle"),
     *      @Parameter("registration_number", type="string", required="true", description="Registration Number of Vehicle"),
     *      @Parameter("make", type="month-year", required="optional", description="Make of Vehicle"),
     *      @Parameter("model", type="string", required="optional", description="Model of Vehicle"),
     *      @Parameter("max_seating_capacity", type="integer", required="true", description="Max Seating Capacity of Vehicle"),
     *      @Parameter("is_owned", type="boolean", required="optional", description="Is vehicle owned by school?"),
     *      @Parameter("owner_name", type="string", required="conditional", description="Owner name of Vehicle"),
     *      @Parameter("company_name", type="string", required="conditional", description="Company name of Vehicle Owner"),
     *      @Parameter("owner_phone", type="string", required="conditional", description="Phone Number of Vehicle Owner"),
     *      @Parameter("owner_email", type="string", required="conditional", description="Email of Vehicle Owner"),
     *      @Parameter("vehicle_fuel_type_id", type="integer", required="true", description="Vehicle Fuel Type"),
     *      @Parameter("max_fuel_capacity", type="decimal", required="true", description="Max Fuel Capacity")
     * })
     * @return Response
     */
    public function store(VehicleRequest $request)
    {
        $this->authorize('create', Vehicle::class);

        $vehicle = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_added')]);
    }

    /**
     * Used to get Vehicle detail
     * @get ("/api/vehicle/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Vehicle::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Vehicle
     * @patch ("/api/vehicle/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle"),
     *      @Parameter("registration_number", type="string", required="true", description="Registration Number of Vehicle"),
     *      @Parameter("make", type="month-year", required="optional", description="Make of Vehicle"),
     *      @Parameter("model", type="string", required="optional", description="Model of Vehicle"),
     *      @Parameter("max_seating_capacity", type="integer", required="true", description="Max Seating Capacity of Vehicle"),
     *      @Parameter("is_owned", type="boolean", required="optional", description="Is vehicle owned by school?"),
     *      @Parameter("owner_name", type="string", required="conditional", description="Owner name of Vehicle"),
     *      @Parameter("company_name", type="string", required="conditional", description="Company name of Vehicle Owner"),
     *      @Parameter("owner_phone", type="string", required="conditional", description="Phone Number of Vehicle Owner"),
     *      @Parameter("owner_email", type="string", required="conditional", description="Email of Vehicle Owner"),
     *      @Parameter("vehicle_fuel_type_id", type="integer", required="true", description="Vehicle Fuel Type"),
     *      @Parameter("max_fuel_capacity", type="decimal", required="true", description="Max Fuel Capacity")
     * })
     * @return Response
     */
    public function update($id, VehicleRequest $request)
    {
        $this->authorize('update', Vehicle::class);

        $vehicle = $this->repo->findOrFail($id);

        $vehicle = $this->repo->update($vehicle, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_updated')]);
    }

    /**
     * Used to delete Vehicle
     * @delete ("/api/vehicle/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Vehicle::class);

        $vehicle = $this->repo->deletable($id);

        $this->repo->delete($vehicle);

        return $this->success(['message' => trans('transport.vehicle_deleted')]);
    }
}
