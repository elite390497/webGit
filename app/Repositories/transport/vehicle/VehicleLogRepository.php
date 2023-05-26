<?php
namespace App\Repositories\Transport\Vehicle;

use App\Models\Transport\Vehicle\VehicleLog;
use Illuminate\Validation\ValidationException;
use App\Repositories\Transport\Vehicle\VehicleRepository;

class VehicleLogRepository
{
    protected $vehicle_log;
    protected $vehicle;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleLog $vehicle_log,
        VehicleRepository $vehicle
    ) {
        $this->vehicle_log = $vehicle_log;
        $this->vehicle = $vehicle;
    }

    /**
     * Get vehicle log query
     *
     * @return VehicleLog query
     */
    public function getQuery()
    {
        return $this->vehicle_log;
    }

    /**
     * Count vehicle log
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_log->count();
    }

    /**
     * Get all vehicle logs
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_log->all();
    }

    /**
     * Find vehicle log with given id.
     *
     * @param integer $id
     * @return VehicleLog
     */
    public function find($id)
    {
        return $this->vehicle_log->info()->find($id);
    }

    /**
     * Find vehicle log with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleLog
     */
    public function findOrFail($id, $field = 'message')
    {
        $vehicle_log = $this->vehicle_log->info()->find($id);

        if (! $vehicle_log) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_vehicle_log')]);
        }

        return $vehicle_log;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehicleLog
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'date_of_log');
        $order       = gv($params, 'order', 'desc');
        $vehicle_id  = gv($params, 'vehicle_id');
        $start_date  = gv($params, 'start_date');
        $end_date    = gv($params, 'end_date');

        $vehicle_id = is_array($vehicle_id) ? $vehicle_id : ($vehicle_id ? explode(',', $vehicle_id) : []);

        $query = $this->vehicle_log->info()->dateBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ]);

        if (count($vehicle_id)) {
            $query->whereIn('vehicle_id', $vehicle_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle logs using given params.
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
     * @return VehicleLog
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get vehicle log pre requisite.
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
     * Create a new vehicle log.
     *
     * @param array $params
     * @return VehicleLog
     */
    public function create($params)
    {
        return $this->vehicle_log->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $vehicle_log_id
     * @return array
     */
    private function formatParams($params, $vehicle_log_id = null)
    {
        $vehicle_id  = gv($params, 'vehicle_id');
        $date_of_log = toDate(gv($params, 'date_of_log'));
        $log         = gv($params, 'log');

        if (! $this->vehicle->findActive($vehicle_id)) {
            throw ValidationException::withMessages(['vehicle_id' => trans('transport.could_not_find_vehicle')]);
        }

        $query = ($vehicle_log_id) ? $this->vehicle_log->where('id', '!=', $vehicle_log_id) : $this->vehicle_log;

        $vehicle_logs = $query->filterByVehicleId($vehicle_id)->get();

        if (
            $vehicle_logs->filter(function ($log, $key) use ($date_of_log) {
                return toDate($log->date_of_log) == $date_of_log;
            })->count()
        ) {
            throw ValidationException::withMessages(['date_of_log' => trans('transport.vehicle_log_exists_for_same_date')]);
        }

        $min_log = $vehicle_logs->filter(function ($log, $key) use ($date_of_log) {
            return toDate($log->date_of_log) < $date_of_log;
        })->sortBy('date_of_log')->first();

        $max_log = $vehicle_logs->filter(function ($log, $key) use ($date_of_log) {
            return toDate($log->date_of_log) > $date_of_log;
        })->sortByDesc('date_of_log')->first();

        $last_log = $vehicle_logs->filter(function ($log, $key) use ($date_of_log) {
            return toDate($log->date_of_log) < $date_of_log;
        })->sortByDesc('date_of_log')->first();

        if ($min_log && $log < $min_log->log) {
            throw ValidationException::withMessages(['log' => trans('transport.vehicle_log_less_than_min_log', ['attribute' => $min_log->log])]);
        }

        if ($max_log && $log > $max_log->log) {
            throw ValidationException::withMessages(['log' => trans('transport.vehicle_log_greater_than_max_log', ['attribute' => $max_log->log])]);
        }

        if ($last_log && $log < $last_log->log) {
            throw ValidationException::withMessages(['log' => trans('transport.vehicle_log_less_than_last_log', ['attribute' => $last_log->log])]);
        }

        $formatted = [
            'vehicle_id'  => gv($params, 'vehicle_id'),
            'date_of_log' => toDate(gv($params, 'date_of_log')),
            'log'         => gv($params, 'log', 0),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];
        return $formatted;
    }

    /**
     * Update given vehicle log.
     *
     * @param VehicleLog $vehicle_log
     * @param array $params
     *
     * @return VehicleLog
     */
    public function update(VehicleLog $vehicle_log, $params)
    {
        return $vehicle_log->forceFill($this->formatParams($params, $vehicle_log->id))->save();
    }

    /**
     * Find whether vehicle log is deletable or not.
     *
     * @param integer $id
     * @return VehicleLog $vehicle_log
     */
    public function deletable($id)
    {
        $vehicle_log = $this->findOrFail($id);

        if ($this->vehicle_log->filterByVehicleId($vehicle_log->vehicle_id)->where('date_of_log', '>', toDate($vehicle_log->date_of_log))->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.intermediate_vehicle_log_cannot_be_deleted')]);
        }

        return $vehicle_log;
    }

    /**
     * Delete vehicle log.
     *
     * @param VehicleLog $vehicle_log
     * @return bool|null
     */
    public function delete(VehicleLog $vehicle_log)
    {
        return $vehicle_log->delete();
    }

    /**
     * Delete multiple vehicle logss.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_log->whereIn('id', $ids)->delete();
    }
}
