<?php
namespace App\Repositories\Transport\Vehicle;

use Illuminate\Support\Str;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Transport\Vehicle\VehicleServiceRecord;
use App\Repositories\Transport\Vehicle\VehicleRepository;
use App\Repositories\Configuration\Transport\Vehicle\VehicleServiceCenterRepository;

class VehicleServiceRecordRepository
{
    protected $vehicle_service_record;
    protected $upload;
    protected $vehicle;
    protected $vehicle_service_center;
    protected $module = 'vehicle_service_record';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleServiceRecord $vehicle_service_record,
        UploadRepository $upload,
        VehicleRepository $vehicle,
        VehicleServiceCenterRepository $vehicle_service_center
    ) {
        $this->vehicle_service_record = $vehicle_service_record;
        $this->upload = $upload;
        $this->vehicle = $vehicle;
        $this->vehicle_service_center = $vehicle_service_center;
    }

    /**
     * Get vehicle service record query
     *
     * @return VehicleServiceRecord query
     */
    public function getQuery()
    {
        return $this->vehicle_service_record;
    }

    /**
     * Count vehicle service record
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_service_record->count();
    }

    /**
     * Get all vehicle service records
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_service_record->all();
    }

    /**
     * Find vehicle service record with given id.
     *
     * @param integer $id
     * @return VehicleServiceRecord
     */
    public function find($id)
    {
        return $this->vehicle_service_record->info()->find($id);
    }

    /**
     * Find vehicle service record with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleServiceRecord
     */
    public function findOrFail($id, $field = 'message')
    {
        $vehicle_service_record = $this->vehicle_service_record->info()->find($id);

        if (! $vehicle_service_record) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_vehicle_service_record')]);
        }

        return $vehicle_service_record;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehicleServiceRecord
     */
    public function getData($params)
    {
        $sort_by                    = gv($params, 'sort_by', 'date_of_service');
        $order                      = gv($params, 'order', 'desc');
        $vehicle_id                 = gv($params, 'vehicle_id');
        $vehicle_service_center_id  = gv($params, 'vehicle_service_center_id');
        $date_of_service_start_date = gv($params, 'date_of_service_start_date');
        $date_of_service_end_date   = gv($params, 'date_of_service_end_date');

        $vehicle_id = is_array($vehicle_id) ? $vehicle_id : ($vehicle_id ? explode(',', $vehicle_id) : []);
        $vehicle_service_center_id = is_array($vehicle_service_center_id) ? $vehicle_service_center_id : ($vehicle_service_center_id ? explode(',', $vehicle_service_center_id) : []);

        $query = $this->vehicle_service_record->info()->dateOfServiceBetween([
            'start_date' => $date_of_service_start_date,
            'end_date' => $date_of_service_end_date
        ]);

        if (count($vehicle_id)) {
            $query->whereIn('vehicle_id', $vehicle_id);
        }

        if (count($vehicle_service_center_id)) {
            $query->whereIn('vehicle_service_center_id', $vehicle_service_center_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle service records using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        $total_amount = $this->getData($params)->sum('amount');

        $vehicle_service_records = $this->getData($params)->paginate($page_length);

        return compact('vehicle_service_records', 'total_amount');
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return VehicleServiceRecord
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get vehicle service record pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $vehicles = $this->vehicle->selectAllActive();
        $vehicle_service_centers = $this->vehicle_service_center->selectAll();

        return compact('vehicles','vehicle_service_centers');
    }

    /**
     * Create a new vehicle service record.
     *
     * @param array $params
     * @return VehicleServiceRecord
     */
    public function create($params)
    {
        $vehicle_service_record = $this->vehicle_service_record->forceCreate($this->formatParams($params));

        $this->processUpload($vehicle_service_record, $params);

        return $vehicle_service_record;
    }

    /**
     * Get vehicle service record filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $vehicles = $this->vehicle->selectAll();
        $vehicle_service_centers = $this->vehicle_service_center->selectAll();

        return compact('vehicles','vehicle_service_centers');
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param VehicleServiceRecord $vehicle_service_record
     * @return array
     */
    private function formatParams($params, $vehicle_service_record_id = null)
    {
        $vehicle_id  = gv($params, 'vehicle_id');

        if (! $this->vehicle->findActive($vehicle_id)) {
            throw ValidationException::withMessages(['vehicle_id' => trans('transport.could_not_find_vehicle')]);
        }

        $vehicle_service_center_id  = gv($params, 'vehicle_service_center_id');

        if ($vehicle_service_center_id) {
            $vehicle_service_center = $this->vehicle_service_center->findOrFail($vehicle_service_center_id);
        }

        $formatted = [
            'vehicle_id'                => gv($params, 'vehicle_id'),
            'vehicle_service_center_id' => gv($params, 'vehicle_service_center_id'),
            'date_of_service'           => toDate(gv($params, 'date_of_service')),
            'amount'                    => currency(gv($params, 'amount', 0)),
            'log'                       => currency(gv($params, 'log', 0)),
            'next_due_date'             => toDate(gv($params, 'next_due_date')),
            'next_due_log'              => null,
            'employee_id'               => null,
            'description'               => gv($params, 'description')
        ];

        if (! $vehicle_service_record_id) {
            $formatted['upload_token'] = Str::uuid();
        }

        $formatted['options'] = [];
        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param VehicleServiceRecord $vehicle_service_record
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(VehicleServiceRecord $vehicle_service_record, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $vehicle_service_record->id, $upload_token);
        } else {
            $this->upload->update($this->module, $vehicle_service_record->id, $upload_token);
        }
    }

    /**
     * Update given vehicle service record.
     *
     * @param VehicleServiceRecord $vehicle_service_record
     * @param array $params
     *
     * @return VehicleServiceRecord
     */
    public function update(VehicleServiceRecord $vehicle_service_record, $params)
    {
        $vehicle_service_record->forceFill($this->formatParams($params, $vehicle_service_record))->save();

        $this->processUpload($vehicle_service_record, $params, 'update');

        return $vehicle_service_record;
    }

    /**
     * Find whether vehicle service record is deletable or not.
     *
     * @param integer $id
     * @return VehicleServiceRecord $vehicle_service_record
     */
    public function deletable($id)
    {
        $vehicle_service_record = $this->findOrFail($id);

        if ($this->vehicle_service_record->filterByVehicleId($vehicle_service_record->vehicle_id)->where('date_of_service', '>', toDate($vehicle_service_record->date_of_service))->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.intermediate_service_record_cannot_be_deleted')]);
        }

        return $vehicle_service_record;
    }

    /**
     * Delete vehicle service record.
     *
     * @param VehicleServiceRecord $vehicle_service_record
     * @return bool|null
     */
    public function delete(VehicleServiceRecord $vehicle_service_record)
    {
        return $vehicle_service_record->delete();
    }

    /**
     * Delete multiple vehicle service records.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_service_record->whereIn('id', $ids)->delete();
    }
}
