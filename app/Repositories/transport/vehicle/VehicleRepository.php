<?php
namespace App\Repositories\Transport\Vehicle;

use App\Models\Transport\Vehicle\Vehicle;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Transport\Vehicle\VehicleFuelTypeRepository;

class VehicleRepository
{
    protected $vehicle;
    protected $vehicle_fuel_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Vehicle $vehicle,
        VehicleFuelTypeRepository $vehicle_fuel_type
    ) {
        $this->vehicle = $vehicle;
        $this->vehicle_fuel_type = $vehicle_fuel_type;
    }

    /**
     * Get vehicle query
     *
     * @return Vehicle query
     */
    public function getQuery()
    {
        return $this->vehicle;
    }

    /**
     * Count vehicle
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle->count();
    }

    /**
     * List all active vehicles by detail & id
     *
     * @return array
     */
    public function listAllActive()
    {
        return $this->vehicle->filterByIsActive(1)->get()->pluck('detail', 'id')->all();
    }

    /**
     * List all vehicles by detail & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->vehicle->all()->pluck('detail', 'id')->all();
    }

    /**
     * List all active vehicles by detail & id for select option
     *
     * @return array
     */

    public function selectAllActive()
    {
        return generateSelectOption($this->vehicle->filterByIsActive(1)->get()->pluck('detail', 'id')->all());
    }

    /**
     * List all vehicles by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return generateSelectOption($this->vehicle->all()->pluck('detail', 'id')->all());
    }

    /**
     * List all active vehicles by id
     *
     * @return array
     */
    public function listActiveId()
    {
        return $this->vehicle->filterByIsActive(1)->get()->pluck('id')->all();
    }

    /**
     * List all vehicles by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->vehicle->all()->pluck('id')->all();
    }

    /**
     * List all active vehicles by id
     *
     * @return array
     */
    public function listIdActive()
    {
        return $this->vehicle->filterByIsActive(1)->get()->pluck('id')->all();
    }

    /**
     * Get all active vehicles
     *
     * @return array
     */
    public function getAllActive()
    {
        return $this->vehicle->filterByIsActive(1)->get();
    }

    /**
     * Get all vehicles
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle->all();
    }

    /**
     * Find vehicle with given id.
     *
     * @param integer $id
     * @return Vehicle
     */
    public function find($id)
    {
        return $this->vehicle->info()->find($id);
    }

    /**
     * Find active vehicle with given id.
     *
     * @param integer $id
     * @return Vehicle
     */
    public function findActive($id)
    {
        return $this->vehicle->info()->filterByIsActive(1)->filterById($id)->first();
    }

    /**
     * Find vehicle with given id or throw an error.
     *
     * @param integer $id
     * @return Vehicle
     */
    public function findOrFail($id, $field = 'message')
    {
        $vehicle = $this->vehicle->info()->find($id);

        if (! $vehicle) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_vehicle')]);
        }

        return $vehicle;
    }

    /**
     * Find active vehicle with given id or throw an error.
     *
     * @param integer $id
     * @return Vehicle
     */
    public function findActiveOrFail($id, $field = 'message')
    {
        $vehicle = $this->vehicle->info()->filterByIsActive(1)->filterById($id)->first();

        if (! $vehicle) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_vehicle')]);
        }

        return $vehicle;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Vehicle
     */
    public function getData($params)
    {
        $sort_by             = gv($params, 'sort_by', 'name');
        $order               = gv($params, 'order', 'asc');
        $name                = gv($params, 'name');
        $registration_number = gv($params, 'registration_number');
        $status              = gv($params, 'status');
        $type                = gv($params, 'type');

        $query = $this->vehicle->info()->whereNotNull('id');

        if ($name) {
            $query->filterByName($name);
        }

        if ($registration_number) {
            $query->filterByRegistrationNumber($registration_number);
        }

        if ($status) {
            $query->filterByIsActive($status == 'active' ? 1 : 0);
        }

        if ($type) {
            $query->filterByType($type == 'owned' ? 1 : 0);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Vehicle
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get vehicle pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $vehicle_fuel_types = $this->vehicle_fuel_type->selectAll();

        return compact('vehicle_fuel_types');
    }

    /**
     * Create a new vehicle.
     *
     * @param array $params
     * @return Vehicle
     */
    public function create($params)
    {
        return $this->vehicle->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param Vehicle $vehicle
     * @return array
     */
    private function formatParams($params, $vehicle = null)
    {
        $is_owned = gbv($params, 'is_owned');

        $vehicle_fuel_type_id = gv($params, 'vehicle_fuel_type_id');

        $vehicle_fuel_type = $this->vehicle_fuel_type->findOrFail($vehicle_fuel_type_id);

        $formatted = [
            'name'                 => gv($params, 'name'),
            'registration_number'  => gv($params, 'registration_number'),
            'make'                 => gv($params, 'make'),
            'model'                => gv($params, 'model'),
            'max_seating_capacity' => gv($params, 'max_seating_capacity', 0),
            'max_allowed'          => gv($params, 'max_allowed', 0),
            'is_owned'             => $is_owned,
            'owner_name'           => gv($params, 'owner_name'),
            'owner_company_name'   => gv($params, 'owner_company_name'),
            'owner_phone'          => gv($params, 'owner_phone'),
            'owner_email'          => gv($params, 'owner_email'),
            'is_active'            => gbv($params, 'is_active'),
            'vehicle_fuel_type_id' => $vehicle_fuel_type_id,
            'max_fuel_capacity'    => gv($params, 'max_fuel_capacity')
        ];

        $options['advance'] = array(
            'chasis_number'      => gv($params, 'chasis_number'),
            'engine_number'      => gv($params, 'engine_number'),
            'cubic_capacity'     => gv($params, 'cubic_capacity'),
            'class'              => gv($params, 'class'),
            'registration_date'  => toDate(gv($params, 'registration_date')),
            'registration_place' => gv($params, 'registration_place')
        );

        $options['disposal'] = array(
            'sale_date'            => toDate(gv($params, 'sale_date')),
            'selling_price'        => gv($params, 'selling_price'),
            'buyer_name'           => gv($params, 'buyer_name'),
            'buyer_contact_number' => gv($params, 'buyer_contact_number'),
            'buyer_address'        => gv($params, 'buyer_address')
        );

        $formatted['options'] = $options;
        return $formatted;
    }

    /**
     * Update given vehicle.
     *
     * @param Vehicle $vehicle
     * @param array $params
     *
     * @return Vehicle
     */
    public function update(Vehicle $vehicle, $params)
    {
        return $vehicle->forceFill($this->formatParams($params, $vehicle))->save();
    }

    /**
     * Find vehicle & check it can be deleted or not.
     *
     * @param integer $id
     * @return Vehicle
     */
    public function deletable($id)
    {
        $vehicle = $this->findOrFail($id);

        if ($vehicle->vehicleLogs()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.vehicle_associated_with_log') ]);
        }

        if ($vehicle->vehicleDocuments()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.vehicle_associated_with_document') ]);
        }

        if ($vehicle->vehicleFuels()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.vehicle_associated_with_fuel') ]);
        }

        if ($vehicle->vehicleServiceRecords()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.vehicle_associated_with_service_record') ]);
        }

        return $vehicle;
    }

    /**
     * Delete vehicle.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Vehicle $vehicle)
    {
        return $vehicle->delete();
    }

    /**
     * Delete multiple vehicles.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle->whereIn('id', $ids)->delete();
    }
}
