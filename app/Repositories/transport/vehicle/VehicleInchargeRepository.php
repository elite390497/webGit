<?php
namespace App\Repositories\Transport\Vehicle;

use App\Models\Transport\Vehicle\Vehicle;
use App\Models\Employee\Employee;
use App\Models\Transport\Vehicle\VehicleIncharge;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\Designation;

class VehicleInchargeRepository
{
    protected $vehicle_incharge;
    protected $vehicle;
    protected $employee;
    protected $designation;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleIncharge $vehicle_incharge,
        Vehicle $vehicle,
        Employee $employee,
        Designation $designation
    ) {
        $this->vehicle_incharge = $vehicle_incharge;
        $this->vehicle = $vehicle;
        $this->employee = $employee;
        $this->designation = $designation;
    }

    /**
     * Find vehicle incharge with given id.
     *
     * @param integer $id
     * @return VehicleIncharge
     */
    public function find($id)
    {
        return $this->vehicle_incharge->find($id);
    }

    /**
     * Find vehicle incharge with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleIncharge
     */
    public function findOrFail($id)
    {
        $vehicle_incharge = $this->vehicle_incharge->find($id);

        if (! $vehicle_incharge) {
            throw ValidationException::withMessages(['message' => trans('transport.could_not_find_vehicle_incharge')]);
        }

        return $vehicle_incharge;
    }

    /**
     * Get vehicle incharge list.
     *
     * @return Array
     */
    public function getList($params = array())
    {
        $vehicle_id = gv($params, 'vehicle_id');

        $vehicle_id = is_array($vehicle_id) ? $vehicle_id : ($vehicle_id ? explode(',', $vehicle_id) : []);

        $query = $this->vehicle->with(['vehicleIncharges' => function ($q) {
            $q->orderBy('date_effective', 'desc');
        }, 'vehicleIncharges.employee','vehicleIncharges.employee.employeeDesignations','vehicleIncharges.employee.employeeDesignations.designation','vehicleIncharges.employee.employeeDesignations.designation.employeeCategory']);

        if (count($vehicle_id)) {
            $query->whereIn('id', $vehicle_id);
        }

        $vehicles = $query->orderBy('name', 'asc')->get();

        $employees = $this->getEmployeeQuery()->get()->pluck('name_with_code', 'id');

        $vehicle_incharges = generateSelectOption($employees);

        return compact('vehicles', 'vehicle_incharges');
    }

    /**
     * Get employee query
     *
     * @param integer $employee_id
     * @param date $date
     * @return Employee
     */
    private function getEmployeeQuery($employee_id = null, $date = null)
    {
        $date = ($date) ? toDate($date) : date('Y-m-d');

        $query = $employee_id ? $this->employee->whereId($employee_id) : $this->employee;

        return $query->whereHas('employeeTerms', function ($q) use ($date) {
            $q->where('date_of_joining', '<=', $date)->where(function ($q1) use ($date) {
                $q1->where('date_of_leaving', '=', null)->orWhere('date_of_leaving', '>=', $date);
            })->orderBy('date_of_joining', 'desc')->take(1);
        })->whereHas('employeeDesignations', function ($q) use ($date) {
            $q->where('date_effective', '<=', $date)->orderBy('date_effective', 'desc')->take(1);
        });
    }

    /**
     * Create a new vehicle incharge.
     *
     * @param array $params
     * @return void
     */
    public function store($params)
    {
        $this->validateInput($params);

        $vehicles = gv($params, 'vehicles', []);

        foreach ($vehicles as $index => $vehicle) {
            if (gbv($vehicle, 'change')) {
                $this->vehicle_incharge->forceCreate([
                    'vehicle_id' => gv($vehicle, 'vehicle_id'),
                    'employee_id' => gv($vehicle, 'employee_id'),
                    'date_effective' => toDate(gv($vehicle, 'date_effective')),
                    'description' => gv($vehicle, 'description'),
                    'options' => []
                ]);
            }
        }

        return true;
    }

    /**
     * Validate input
     *
     * @param array $params
     * @return void
     */
    public function validateInput($params)
    {
        $vehicles = gv($params, 'vehicles', []);

        if (! $vehicles) {
            return;
        }

        $vehicle_ids = $this->vehicle->get()->pluck('id')->all();
        $vehicle_incharges = $this->vehicle_incharge->whereIn('vehicle_id', $vehicle_ids)->get();

        foreach ($vehicles as $index => $vehicle) {
            $change = gbv($vehicle, 'change');

            if (! $change) {
                continue;
            }

            $vehicle_id = gv($vehicle, 'vehicle_id');

            if (! in_array($vehicle_id, $vehicle_ids)) {
                throw ValidationException::withMessages(['message' => trans('transport.could_not_find_vehicle')]);
            }

            $date_effective = toDate(gv($vehicle, 'date_effective'));

            if (! $date_effective) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('validation.required', ['attribute' => trans('transport.date_effective')])]);
            }

            if (! dateBetweenSession($date_effective)) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('academic.invalid_session_date_range')]);
            }

            $employee_id = gv($vehicle, 'employee_id');

            if (! $employee_id) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('validation.required', ['attribute' => trans('employee.employee')])]);
            }

            if (! $this->getEmployeeQuery($employee_id, $date_effective)->first()) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('employee.invalid_employee_for_selected_date')]);
            }

            if ($vehicle_incharges->filter(function ($vehicle_incharge, $key) use ($date_effective, $vehicle_id) {
                return $vehicle_incharge->vehicle_id == $vehicle_id && toDate($vehicle_incharge->date_effective) >= toDate($date_effective);
            })->count()) {
                throw ValidationException::withMessages([$index.'_date_effective' => trans('transport.vehicle_incharge_exists_after_given_date')]);
            }

            $last_vehicle_incharge = $vehicle_incharges->where('vehicle_id', $vehicle_id)->sortByDesc('date_effective')->filter(function ($vehicle_incharge, $key) use ($date_effective) {
                return toDate($vehicle_incharge->date_effective) <= toDate($date_effective);
            })->first();

            if ($employee_id == optional($last_vehicle_incharge)->employee_id) {
                throw ValidationException::withMessages([$index.'_employee_id' => trans('transport.same_as_previous_vehicle_incharge')]);
            }
        }
    }

    /**
     * Find vehicle incharge & check it can be deleted or not.
     *
     * @param integer $id
     * @return VehicleIncharge
     */
    public function deletable($id)
    {
        $vehicle_incharge = $this->findOrFail($id);

        if ($this->vehicle_incharge->filterByVehicleId($vehicle_incharge->vehicle_id)->where('date_effective', '>', toDate($vehicle_incharge->date_effective))->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.latest_vehicle_incharge_can_be_deleted')]);
        }

        return $vehicle_incharge;
    }

    /**
     * Delete vehicle incharge.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(VehicleIncharge $vehicle_incharge)
    {
        return $vehicle_incharge->delete();
    }

    /**
     * Delete multiple vehicle incharges.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_incharge->whereIn('id', $ids)->delete();
    }
}
