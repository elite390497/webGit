<?php
namespace App\Repositories\Configuration\Transport\Vehicle;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Transport\Vehicle\VehicleServiceCenter;

class VehicleServiceCenterRepository
{
    protected $vehicle_service_center;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleServiceCenter $vehicle_service_center
    ) {
        $this->vehicle_service_center = $vehicle_service_center;
    }

    /**
     * Get vehicle service center query
     *
     * @return VehicleServiceCenter query
     */
    public function getQuery()
    {
        return $this->vehicle_service_center;
    }

    /**
     * Count vehicle service center
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_service_center->count();
    }

    /**
     * List all vehicle service centers by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->vehicle_service_center->all()->pluck('name', 'id')->all();
    }

    /**
     * List all vehicle service centers by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->vehicle_service_center->all(['name', 'id']);
    }

    /**
     * List all vehicle service centers by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->vehicle_service_center->all()->pluck('id')->all();
    }

    /**
     * Get all vehicle service centers
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_service_center->all();
    }

    /**
     * Find vehicle service center with given id.
     *
     * @param integer $id
     * @return VehicleServiceCenter
     */
    public function find($id)
    {
        return $this->vehicle_service_center->find($id);
    }

    /**
     * Find vehicle service center with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleServiceCenter
     */
    public function findOrFail($id)
    {
        $vehicle_service_center = $this->vehicle_service_center->find($id);

        if (! $vehicle_service_center) {
            throw ValidationException::withMessages(['message' => trans('transport.could_not_find_vehicle_service_center')]);
        }

        return $vehicle_service_center;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehicleServiceCenter
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->vehicle_service_center->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle service center using given params.
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
     * @return VehicleServiceCenter
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new vehicle service center.
     *
     * @param array $params
     * @return VehicleServiceCenter
     */
    public function create($params)
    {
        return $this->vehicle_service_center->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $vehicle_service_center_id
     * @return array
     */
    private function formatParams($params, $vehicle_service_center_id = null)
    {
        $formatted = [
            'name'                 => gv($params, 'name'),
            'phone'                => gv($params, 'phone'),
            'email'                => gv($params, 'email'),
            'contact_person'       => gv($params, 'contact_person'),
            'contact_person_phone' => gv($params, 'contact_person_phone'),
            'contact_person_email' => gv($params, 'contact_person_email'),
            'address_line_1'       => gv($params, 'address_line_1'),
            'address_line_2'       => gv($params, 'address_line_2'),
            'city'                 => gv($params, 'city'),
            'state'                => gv($params, 'state'),
            'zipcode'              => gv($params, 'zipcode'),
            'country'              => gv($params, 'country')
        ];

        return $formatted;
    }

    /**
     * Update given vehicle service center.
     *
     * @param VehicleServiceCenter $vehicle_service_center
     * @param array $params
     *
     * @return VehicleServiceCenter
     */
    public function update(VehicleServiceCenter $vehicle_service_center, $params)
    {
        return $vehicle_service_center->forceFill($this->formatParams($params, $vehicle_service_center->id))->save();
    }

    /**
     * Find vehicle service center & check it can be deleted or not.
     *
     * @param integer $id
     * @return VehicleServiceCenter
     */
    public function deletable($id)
    {
        $vehicle_service_center = $this->findOrFail($id);

        if ($vehicle_service_center->vehicleServiceRecords()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.vehicle_service_center_associated_with_vehicle_service_record')]);
        }

        return $vehicle_service_center;
    }

    /**
     * Delete vehicle service center.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(VehicleServiceCenter $vehicle_service_center)
    {
        return $vehicle_service_center->delete();
    }

    /**
     * Delete multiple vehicle service centers.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_service_center->whereIn('id', $ids)->delete();
    }
}
