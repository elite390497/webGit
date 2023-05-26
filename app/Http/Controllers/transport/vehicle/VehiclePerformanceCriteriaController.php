<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Transport\Vehicle\Vehicle;
use App\Models\Transport\Vehicle\VehiclePerformanceCriteria;
use App\Http\Requests\Transport\Vehicle\VehiclePerformanceCriteriaRequest;
use App\Repositories\Transport\Vehicle\VehiclePerformanceCriteriaRepository;

class VehiclePerformanceCriteriaController extends Controller
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
        VehiclePerformanceCriteriaRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/vehicle/performance/criteria/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Vehicle::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Vehicle Performance Criterias
     * @get ("/api/vehicle/performance/criteria")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Vehicle::class);

        $vehicle_performance_criterias = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('vehicle_performance_criterias', 'filters'));
    }

    /**
     * Used to print all Vehicle Performance Criterias
     * @post ("/api/vehicle/performance/criteria/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_performance_criterias = $this->repo->print(request('filter'));

        return view('print.transport.vehicle-log', compact('vehicle_performance_criterias'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Performance Criterias
     * @post ("/api/vehicle/performance/criteria/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_performance_criterias = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle-log', compact('vehicle_performance_criterias'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Performance Criteria
     * @post ("/api/vehicle/performance/criteria")
     * @param ({
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("log", type="integer", required="true", description="Log of Vehicle"),
     *      @Parameter("date_of_log", type="date", required="true", description="Date of Log of Vehicle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Performance Criteria")
     * })
     * @return Response
     */
    public function store(VehiclePerformanceCriteriaRequest $request)
    {
        $this->authorize('create', Vehicle::class);

        $vehicle_performance_criteria = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_performance_criteria_added')]);
    }

    /**
     * Used to get Vehicle Performance Criteria detail
     * @get ("/api/vehicle/performance/criteria/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Performance Criteria"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Vehicle::class);

        $vehicle_performance_criteria = $this->repo->findOrFail($id);

        $selected_vehicle = ['id' => $vehicle_performance_criteria->id, 'name' => $vehicle_performance_criteria->vehicle->detail];

        return $this->success(compact('vehicle_performance_criteria', 'selected_vehicle'));
    }

    /**
     * Used to update Vehicle Performance Criteria
     * @patch ("/api/vehicle/performance/criteria/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Performance Criteria"),
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("log", type="integer", required="true", description="Log of Vehicle"),
     *      @Parameter("date_of_log", type="date", required="true", description="Date of Log of Vehicle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Performance Criteria")
     * })
     * @return Response
     */
    public function update($id, VehiclePerformanceCriteriaRequest $request)
    {
        $this->authorize('update', Vehicle::class);

        $vehicle_performance_criteria = $this->repo->deletable($id);
        
        $vehicle_performance_criteria = $this->repo->update($vehicle_performance_criteria, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_performance_criteria_updated')]);
    }

    /**
     * Used to delete Vehicle Performance Criteria
     * @delete ("/api/vehicle/performance/criteria/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Vehicle::class);

        $vehicle_performance_criteria = $this->repo->deletable($id);

        $this->repo->delete($vehicle_performance_criteria);

        return $this->success(['message' => trans('transport.vehicle_performance_criteria_deleted')]);
    }
}
