<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\Vehicle\VehicleFuel;
use App\Repositories\Upload\UploadRepository;
use App\Http\Requests\Transport\Vehicle\VehicleFuelRequest;
use App\Repositories\Transport\Vehicle\VehicleFuelRepository;

class VehicleFuelController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'vehicle_fuel';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        VehicleFuelRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/vehicle/fuel/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', VehicleFuel::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Vehicle Fuels
     * @get ("/api/vehicle/fuel")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', VehicleFuel::class);

        $records = $this->repo->paginate($this->request->all());

        $vehicle_fuels = gv($records, 'vehicle_fuels');
        $total_price = gv($records, 'total_price');
        $total_quantity = gv($records, 'total_quantity');
        $average_price_per_unit = gv($records, 'average_price_per_unit');

        $filters = $this->repo->getFilters();

        return $this->success(compact('vehicle_fuels', 'filters', 'total_quantity', 'average_price_per_unit', 'total_price'));
    }

    /**
     * Used to print all Vehicle Fuels
     * @post ("/api/vehicle/fuel/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_fuels = $this->repo->print(request('filter'));

        $total_price = 0;
        $total_price_per_unit = 0;
        $total_quantity = 0;

        return view('print.transport.vehicle.fuel', compact('vehicle_fuels', 'total_price', 'total_price_per_unit', 'total_quantity'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Fuels
     * @post ("/api/vehicle/fuel/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_fuels = $this->repo->print(request('filter'));

        $total_price = 0;
        $total_price_per_unit = 0;
        $total_quantity = 0;
        
        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle.fuel', compact('vehicle_fuels', 'total_price', 'total_price_per_unit', 'total_quantity'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Fuel
     * @post ("/api/vehicle/fuel")
     * @param ({
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("quantity", type="decimal", required="true", description="Quantity of Vehicle Fuel"),
     *      @Parameter("price_per_unit", type="decimal", required="true", description="Price Per Unit of Fuel"),
     *      @Parameter("vehicle_fuel_type_id", type="integer", required="true", description="Type of Fuel Id"),
     *      @Parameter("date_of_fueling", type="date", required="true", description="Date of Fueling"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Fuel")
     * })
     * @return Response
     */
    public function store(VehicleFuelRequest $request)
    {
        $this->authorize('create', VehicleFuel::class);

        $vehicle_fuel = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_fuel_added')]);
    }

    /**
     * Used to get Vehicle Fuel detail
     * @get ("/api/vehicle/fuel/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Fuel"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', VehicleFuel::class);

        $vehicle_fuel = $this->repo->findOrFail($id);

        $attachments = $this->upload->getAttachment($this->module, $vehicle_fuel->id);

        return $this->success(compact('vehicle_fuel', 'attachments'));
    }

    /**
     * Used to update Vehicle Fuel
     * @patch ("/api/vehicle/fuel/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Fuel"),
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("quantity", type="decimal", required="true", description="Quantity of Vehicle Fuel"),
     *      @Parameter("price_per_unit", type="decimal", required="true", description="Price Per Unit of Fuel"),
     *      @Parameter("vehicle_fuel_type_id", type="integer", required="true", description="Type of Fuel Id"),
     *      @Parameter("date_of_fueling", type="date", required="true", description="Date of Fueling"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Fuel")
     * })
     * @return Response
     */
    public function update($id, VehicleFuelRequest $request)
    {
        $this->authorize('update', VehicleFuel::class);

        $vehicle_fuel = $this->repo->findOrFail($id);

        $vehicle_fuel = $this->repo->update($vehicle_fuel, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_fuel_updated')]);
    }

    /**
     * Used to delete Vehicle Fuel
     * @delete ("/api/vehicle/fuel/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', VehicleFuel::class);

        $vehicle_fuel = $this->repo->deletable($id);

        $this->upload->delete($this->module, $vehicle_fuel->id);

        $this->repo->delete($vehicle_fuel);

        return $this->success(['message' => trans('transport.vehicle_fuel_deleted')]);
    }

    /**
     * Used to download Vehicle Fuel
     * @get ("/transport/vehicle/fuel/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Fuel"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($id, $attachment_uuid)
    {
        $this->authorize('list', VehicleFuel::class);

        $vehicle_fuel = $this->repo->findOrFail($id);

        $attachment = $this->upload->getAttachment($this->module, $vehicle_fuel->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
