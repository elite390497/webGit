<?php
namespace App\Repositories\Transport\Vehicle;

use App\Models\Transport\Vehicle\VehiclePerformanceCriteria;
use Illuminate\Validation\ValidationException;
use App\Repositories\Transport\Vehicle\VehicleRepository;

class VehiclePerformanceCriteriaRepository
{
    protected $vehicle_performance_criteria;
    protected $vehicle;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehiclePerformanceCriteria $vehicle_performance_criteria,
        VehicleRepository $vehicle
    ) {
        $this->vehicle_performance_criteria = $vehicle_performance_criteria;
        $this->vehicle = $vehicle;
    }

    /**
     * Get vehicle performance criteria query
     *
     * @return VehiclePerformanceCriteria query
     */
    public function getQuery()
    {
        return $this->vehicle_performance_criteria;
    }

    /**
     * Count vehicle performance criteria
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_performance_criteria->count();
    }

    /**
     * Get all vehicle performance criterias
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_performance_criteria->all();
    }

    /**
     * Find vehicle performance criteria with given id.
     *
     * @param integer $id
     * @return VehiclePerformanceCriteria
     */
    public function find($id)
    {
        return $this->vehicle_performance_criteria->info()->find($id);
    }

    /**
     * Find vehicle performance criteria with given id or throw an error.
     *
     * @param integer $id
     * @return VehiclePerformanceCriteria
     */
    public function findOrFail($id, $field = 'message')
    {
        $vehicle_performance_criteria = $this->vehicle_performance_criteria->info()->find($id);

        if (! $vehicle_performance_criteria) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_vehicle_performance_criteria')]);
        }

        return $vehicle_performance_criteria;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehiclePerformanceCriteria
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'date_effective');
        $order       = gv($params, 'order', 'desc');
        $vehicle_id  = gv($params, 'vehicle_id');

        $vehicle_id = is_array($vehicle_id) ? $vehicle_id : ($vehicle_id ? explode(',', $vehicle_id) : []);

        $query = $this->vehicle_performance_criteria->info();

        if (count($vehicle_id)) {
            $query->whereIn('vehicle_id', $vehicle_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle performance criterias using given params.
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
     * @return VehiclePerformanceCriteria
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get vehicle performance criteria pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->vehicle->selectAllActive();
    }

    /**
     * Get vehicle filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $vehicles = $this->vehicle->selectAll();
        return compact('vehicles');
    }

    /**
     * Create a new vehicle performance criteria.
     *
     * @param array $params
     * @return VehiclePerformanceCriteria
     */
    public function create($params)
    {
        return $this->vehicle_performance_criteria->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $vehicle_performance_criteria_id
     * @return array
     */
    private function formatParams($params, $vehicle_performance_criteria_id = null)
    {
        $vehicle_id     = gv($params, 'vehicle_id');
        $date_effective = toDate(gv($params, 'date_effective'));

        $vehicle = $this->vehicle->findOrFail($vehicle_id);

        $formatted = [
            'vehicle_id'         => gv($params, 'vehicle_id'),
            'date_effective'     => toDate(gv($params, 'date_effective')),
            'min_service_charge' => gv($params, 'min_service_charge', 0),
            'max_service_charge' => gv($params, 'max_service_charge', 0),
            'min_run'            => gv($params, 'min_run', 0),
            'max_run'            => gv($params, 'max_run', 0),
            'min_mileage'        => gv($params, 'min_mileage', 0),
            'max_mileage'        => gv($params, 'max_mileage', 0),
            'description'        => gv($params, 'description')
        ];

        $formatted['options'] = [];
        return $formatted;
    }

    /**
     * Update given vehicle performance criteria.
     *
     * @param VehiclePerformanceCriteria $vehicle_performance_criteria
     * @param array $params
     *
     * @return VehiclePerformanceCriteria
     */
    public function update(VehiclePerformanceCriteria $vehicle_performance_criteria, $params)
    {
        return $vehicle_performance_criteria->forceFill($this->formatParams($params, $vehicle_performance_criteria->id))->save();
    }

    /**
     * Find whether vehicle performance criteria is deletable or not.
     *
     * @param integer $id
     * @return VehiclePerformanceCriteria $vehicle_performance_criteria
     */
    public function deletable($id)
    {
        $vehicle_performance_criteria = $this->findOrFail($id);

        return $vehicle_performance_criteria;
    }

    /**
     * Delete vehicle performance criteria.
     *
     * @param VehiclePerformanceCriteria $vehicle_performance_criteria
     * @return bool|null
     */
    public function delete(VehiclePerformanceCriteria $vehicle_performance_criteria)
    {
        return $vehicle_performance_criteria->delete();
    }

    /**
     * Delete multiple vehicle performance criterias.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_performance_criteria->whereIn('id', $ids)->delete();
    }
}
