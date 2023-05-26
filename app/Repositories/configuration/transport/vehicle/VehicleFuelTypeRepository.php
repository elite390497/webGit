<?php
namespace App\Repositories\Configuration\Transport\Vehicle;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Transport\Vehicle\VehicleFuelType;

class VehicleFuelTypeRepository
{
    protected $vehicle_fuel_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleFuelType $vehicle_fuel_type
    ) {
        $this->vehicle_fuel_type = $vehicle_fuel_type;
    }

    /**
     * Get vehicle fuel type query
     *
     * @return VehicleFuelType query
     */
    public function getQuery()
    {
        return $this->vehicle_fuel_type;
    }

    /**
     * Count vehicle fuel type
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_fuel_type->count();
    }

    /**
     * List all vehicle fuel types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->vehicle_fuel_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all vehicle fuel types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->vehicle_fuel_type->all(['name', 'id']);
    }

    /**
     * List all vehicle fuel types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->vehicle_fuel_type->all()->pluck('id')->all();
    }

    /**
     * Get all vehicle fuel types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_fuel_type->all();
    }

    /**
     * Find vehicle fuel type with given id.
     *
     * @param integer $id
     * @return VehicleFuelType
     */
    public function find($id)
    {
        return $this->vehicle_fuel_type->find($id);
    }

    /**
     * Find vehicle fuel type with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleFuelType
     */
    public function findOrFail($id)
    {
        $vehicle_fuel_type = $this->vehicle_fuel_type->find($id);

        if (! $vehicle_fuel_type) {
            throw ValidationException::withMessages(['message' => trans('transport.could_not_find_vehicle_fuel_type')]);
        }

        return $vehicle_fuel_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehicleFuelType
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->vehicle_fuel_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle fuel type using given params.
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
     * @return VehicleFuelType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new vehicle fuel type.
     *
     * @param array $params
     * @return VehicleFuelType
     */
    public function create($params)
    {
        return $this->vehicle_fuel_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $vehicle_fuel_type_id
     * @return array
     */
    private function formatParams($params, $vehicle_fuel_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given vehicle fuel type.
     *
     * @param VehicleFuelType $vehicle_fuel_type
     * @param array $params
     *
     * @return VehicleFuelType
     */
    public function update(VehicleFuelType $vehicle_fuel_type, $params)
    {
        return $vehicle_fuel_type->forceFill($this->formatParams($params, $vehicle_fuel_type->id))->save();
    }

    /**
     * Find vehicle fuel type & check it can be deleted or not.
     *
     * @param integer $id
     * @return VehicleFuelType
     */
    public function deletable($id)
    {
        $vehicle_fuel_type = $this->findOrFail($id);

        if ($vehicle_fuel_type->vehicleFuels()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.vehicle_fuel_type_associated_with_vehicle_fuel')]);
        }

        return $vehicle_fuel_type;
    }

    /**
     * Delete vehicle fuel type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(VehicleFuelType $vehicle_fuel_type)
    {
        return $vehicle_fuel_type->delete();
    }

    /**
     * Delete multiple vehicle fuel types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_fuel_type->whereIn('id', $ids)->delete();
    }
}
