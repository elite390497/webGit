<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Models\Transport\Vehicle\VehicleServiceRecord;
use App\Http\Requests\Transport\Vehicle\VehicleServiceRecordRequest;
use App\Repositories\Transport\Vehicle\VehicleServiceRecordRepository;

class VehicleServiceRecordController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'vehicle_service_record';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        VehicleServiceRecordRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/vehicle/service/record/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', VehicleServiceRecord::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Vehicle Service Records
     * @get ("/api/vehicle/service/record")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', VehicleServiceRecord::class);

        $records = $this->repo->paginate($this->request->all());
        $vehicle_service_records = gv($records, 'vehicle_service_records');
        $total_amount = gv($records, 'total_amount');

        $filters = $this->repo->getFilters();

        return $this->success(compact('vehicle_service_records', 'total_amount', 'filters'));
    }

    /**
     * Used to print all Vehicle Records
     * @post ("/api/vehicle/service/record/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_service_records = $this->repo->print(request('filter'));

        $total_amount = 0;

        return view('print.transport.vehicle.service-record', compact('vehicle_service_records', 'total_amount'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Records
     * @post ("/api/vehicle/service/record/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_service_records = $this->repo->print(request('filter'));

        $total_amount = 0;
        
        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle.service-record', compact('vehicle_service_records', 'total_amount'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Service Record
     * @post ("/api/vehicle/service/record")
     * @param ({
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Vehicle Service"),
     *      @Parameter("date_of_service", type="date", required="true", description="Date of Vehicle Service"),
     *      @Parameter("record", type="integer", required="true", description="Record of Vehicle"),
     *      @Parameter("next_due_date", type="date", required="optional", description="Next Serivce Due Date of Vehicle"),
     *      @Parameter("next_due_record", type="integer", required="optional", description="Next Service Record of Vehicle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Service Record"),
     *      @Parameter("employee_id", type="integer", required="true", description="Employee Id as Incharge")
     * })
     * @return Response
     */
    public function store(VehicleServiceRecordRequest $request)
    {
        $this->authorize('create', VehicleServiceRecord::class);

        $vehicle_service_record = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_service_record_added')]);
    }

    /**
     * Used to get Vehicle Service Record detail
     * @get ("/api/vehicle/service/record/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Service Record"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', VehicleServiceRecord::class);

        $vehicle_service_record = $this->repo->findOrFail($id);

        $attachments = $this->upload->getAttachment($this->module, $vehicle_service_record->id);

        return $this->success(compact('vehicle_service_record', 'attachments'));
    }

    /**
     * Used to update Vehicle Service Record
     * @patch ("/api/vehicle/service/record/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Service Record"),
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("amount", type="numeric", required="true", description="Amount of Vehicle Service"),
     *      @Parameter("date_of_service", type="date", required="true", description="Date of Vehicle Service"),
     *      @Parameter("record", type="integer", required="true", description="Record of Vehicle"),
     *      @Parameter("next_due_date", type="date", required="optional", description="Next Serivce Due Date of Vehicle"),
     *      @Parameter("next_due_record", type="integer", required="optional", description="Next Service Record of Vehicle"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Service Record"),
     *      @Parameter("employee_id", type="integer", required="true", description="Employee Id as Incharge")
     * })
     * @return Response
     */
    public function update($id, VehicleServiceRecordRequest $request)
    {
        $this->authorize('update', VehicleServiceRecord::class);

        $vehicle_service_record = $this->repo->findOrFail($id);

        $vehicle_service_record = $this->repo->update($vehicle_service_record, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_service_record_updated')]);
    }

    /**
     * Used to delete Vehicle Service Record
     * @delete ("/api/vehicle/service/record/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', VehicleServiceRecord::class);

        $vehicle_service_record = $this->repo->deletable($id);

        $this->upload->delete($this->module, $vehicle_service_record->id);

        $this->repo->delete($vehicle_service_record);

        return $this->success(['message' => trans('transport.vehicle_service_record_deleted')]);
    }

    /**
     * Used to download Vehicle Service Record Attachment
     * @get ("/finance/transport/vehicle/service/record/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Service Record"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($id, $attachment_uuid)
    {
        $this->authorize('list', VehicleServiceRecord::class);

        $vehicle_service_record = $this->repo->findOrFail($id);

        $attachment = $this->upload->getAttachment($this->module, $vehicle_service_record->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
