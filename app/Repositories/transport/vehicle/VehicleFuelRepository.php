<?php
namespace App\Repositories\Transport\Vehicle;

use Illuminate\Support\Str;
use App\Models\Transport\Vehicle\VehicleFuel;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Transport\Vehicle\VehicleRepository;
use App\Repositories\Configuration\Transport\Vehicle\VehicleFuelTypeRepository;

class VehicleFuelRepository
{
    protected $vehicle_fuel;
    protected $vehicle_fuel_type;
    protected $upload;
    protected $vehicle;
    protected $module = 'vehicle_fuel';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleFuel $vehicle_fuel,
        VehicleFuelTypeRepository $vehicle_fuel_type,
        UploadRepository $upload,
        VehicleRepository $vehicle
    ) {
        $this->vehicle_fuel = $vehicle_fuel;
        $this->vehicle_fuel_type = $vehicle_fuel_type;
        $this->upload = $upload;
        $this->vehicle = $vehicle;
    }

    /**
     * Get vehicle fuel query
     *
     * @return VehicleFuel query
     */
    public function getQuery()
    {
        return $this->vehicle_fuel;
    }

    /**
     * Count vehicle fuel
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_fuel->count();
    }

    /**
     * Get all vehicle fuels
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_fuel->all();
    }

    /**
     * Find vehicle fuel with given id.
     *
     * @param integer $id
     * @return VehicleFuel
     */
    public function find($id)
    {
        return $this->vehicle_fuel->info()->find($id);
    }

    /**
     * Find vehicle fuel with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleFuel
     */
    public function findOrFail($id, $field = 'message')
    {
        $vehicle_fuel = $this->vehicle_fuel->info()->find($id);

        if (! $vehicle_fuel) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_vehicle_fuel')]);
        }

        return $vehicle_fuel;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehicleFuel
     */
    public function getData($params)
    {
        $sort_by                    = gv($params, 'sort_by', 'date_of_fueling');
        $order                      = gv($params, 'order', 'desc');
        $vehicle_id                 = gv($params, 'vehicle_id');
        $vehicle_fuel_type_id       = gv($params, 'vehicle_fuel_type_id');
        $date_of_fueling_start_date = gv($params, 'date_of_fueling_start_date');
        $date_of_fueling_end_date   = gv($params, 'date_of_fueling_end_date');

        $vehicle_id = is_array($vehicle_id) ? $vehicle_id : ($vehicle_id ? explode(',', $vehicle_id) : []);
        $vehicle_fuel_type_id = is_array($vehicle_fuel_type_id) ? $vehicle_fuel_type_id : ($vehicle_fuel_type_id ? explode(',', $vehicle_fuel_type_id) : []);

        $query = $this->vehicle_fuel->info()->dateOfFuelingBetween([
            'start_date' => $date_of_fueling_start_date,
            'end_date' => $date_of_fueling_end_date
        ]);

        if (count($vehicle_id)) {
            $query->whereIn('vehicle_id', $vehicle_id);
        }

        if (count($vehicle_fuel_type_id)) {
            $query->whereIn('vehicle_fuel_type_id', $vehicle_fuel_type_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle fuels using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        $total_price = $this->getData($params)->select(\DB::raw('sum(quantity * price_per_unit) as total_price'))->first()->total_price;

        $total_quantity = $this->getData($params)->sum('quantity');

        $average_price_per_unit = $this->getData($params)->avg('price_per_unit');

        $vehicle_fuels = $this->getData($params)->paginate($page_length);

        return compact('vehicle_fuels', 'total_quantity', 'average_price_per_unit', 'total_price');
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return VehicleFuel
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get vehicle fuel pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $vehicles = $this->vehicle->selectAllActive();

        return compact('vehicles');
    }

    /**
     * Create a new vehicle fuel.
     *
     * @param array $params
     * @return VehicleFuel
     */
    public function create($params)
    {
        $vehicle_fuel = $this->vehicle_fuel->forceCreate($this->formatParams($params));

        $this->processUpload($vehicle_fuel, $params);

        return $vehicle_fuel;
    }

    /**
     * Get vehicle fuel filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $vehicles = $this->vehicle->selectAll();

        $vehicle_fuel_types = $this->vehicle_fuel_type->selectAll();

        return compact('vehicles', 'vehicle_fuel_types');
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param VehicleFuel $vehicle_fuel
     * @return array
     */
    private function formatParams($params, $vehicle_fuel_id = null)
    {
        $vehicle_id  = gv($params, 'vehicle_id');

        $vehicle = $this->vehicle->findOrFail($vehicle_id);

        if (! $vehicle->is_active) {
            throw ValidationException::withMessages(['vehicle_id' => trans('transport.could_not_find_vehicle')]);
        }

        if (! $vehicle->vehicle_fuel_type_id) {
            throw ValidationException::withMessages(['vehicle_id' => trans('transport.could_not_find_vehicle_fuel_type')]);
        }

        $formatted = [
            'vehicle_id'           => gv($params, 'vehicle_id'),
            'date_of_fueling'      => toDate(gv($params, 'date_of_fueling')),
            'vehicle_fuel_type_id' => $vehicle->vehicle_fuel_type_id,
            'quantity'             => formatNumber(gv($params, 'quantity', 0), config('config.vehicle_fuel_quantity_decimal_place')),
            'price_per_unit'       => currency(gv($params, 'price_per_unit', 0)),
            'log'                  => gv($params, 'log'),
            'description'          => gv($params, 'description')
        ];

        if (! $vehicle_fuel_id) {
            $formatted['upload_token'] = Str::uuid();
        }

        $formatted['options'] = [];
        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param VehicleFuel $vehicle_fuel
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(VehicleFuel $vehicle_fuel, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $vehicle_fuel->id, $upload_token);
        } else {
            $this->upload->update($this->module, $vehicle_fuel->id, $upload_token);
        }
    }

    /**
     * Update given vehicle fuel.
     *
     * @param VehicleFuel $vehicle_fuel
     * @param array $params
     *
     * @return VehicleFuel
     */
    public function update(VehicleFuel $vehicle_fuel, $params)
    {
        $vehicle_fuel->forceFill($this->formatParams($params, $vehicle_fuel))->save();

        $this->processUpload($vehicle_fuel, $params, 'update');

        return $vehicle_fuel;
    }

    /**
     * Find whether vehicle fuel is deletable or not.
     *
     * @param integer $id
     * @return VehicleFuel $vehicle_fuel
     */
    public function deletable($id)
    {
        $vehicle_fuel = $this->findOrFail($id);

        if ($this->vehicle_fuel->filterByVehicleId($vehicle_fuel->vehicle_id)->where('date_of_fueling', '>', toDate($vehicle_fuel->date_of_fueling))->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.intermediate_fuel_log_cannot_be_deleted')]);
        }

        return $vehicle_fuel;
    }

    /**
     * Delete vehicle fuel.
     *
     * @param VehicleFuel $vehicle_fuel
     * @return bool|null
     */
    public function delete(VehicleFuel $vehicle_fuel)
    {
        return $vehicle_fuel->delete();
    }

    /**
     * Delete multiple vehicle fuels.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_fuel->whereIn('id', $ids)->delete();
    }
}
