<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\Vehicle\VehicleLog;
use App\Http\Requests\Transport\Vehicle\VehicleLogRequest;
use App\Repositories\Transport\Vehicle\VehicleLogRepository;

class VehicleLogController extends Controller
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
        VehicleLogRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/vehicle/log/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', VehicleLog::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Vehicle Logs
     * @get ("/api/vehicle/log")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', VehicleLog::class);

        $vehicle_logs = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('vehicle_logs', 'filters'));
    }

    /**
     * Used to print all Vehicle Logs
     * @post ("/api/vehicle/log/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_logs = $this->repo->print(request('filter'));

        return view('print.transport.vehicle.log', compact('vehicle_logs'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Logs
     * @post ("/api/vehicle/log/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_logs = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle.log', compact('vehicle_logs'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Log
     * @post ("/api/vehicle/log")
     * @param ({
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("log", type="integer", required="true", description="Log of Vehicle"),
     *      @Parameter("date_of_log", type="date", required="true", description="Date of Log of Vehicle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Log")
     * })
     * @return Response
     */
    public function store(VehicleLogRequest $request)
    {
        $this->authorize('create', VehicleLog::class);

        $vehicle_log = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_log_added')]);
    }

    /**
     * Used to get Vehicle Log detail
     * @get ("/api/vehicle/log/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Log"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', VehicleLog::class);

        $vehicle_log = $this->repo->findOrFail($id);

        $selected_vehicle = ['id' => $vehicle_log->id, 'name' => $vehicle_log->vehicle->detail];

        return $this->success(compact('vehicle_log', 'selected_vehicle'));
    }

    /**
     * Used to update Vehicle Log
     * @patch ("/api/vehicle/log/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Log"),
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("log", type="integer", required="true", description="Log of Vehicle"),
     *      @Parameter("date_of_log", type="date", required="true", description="Date of Log of Vehicle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Log")
     * })
     * @return Response
     */
    public function update($id, VehicleLogRequest $request)
    {
        $this->authorize('update', VehicleLog::class);

        $vehicle_log = $this->repo->deletable($id);
        
        $vehicle_log = $this->repo->update($vehicle_log, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_log_updated')]);
    }

    /**
     * Used to delete Vehicle Log
     * @delete ("/api/vehicle/log/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', VehicleLog::class);

        $vehicle_log = $this->repo->deletable($id);

        $this->repo->delete($vehicle_log);

        return $this->success(['message' => trans('transport.vehicle_log_deleted')]);
    }
}
