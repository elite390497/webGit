<?php
namespace App\Repositories\Transport\Vehicle;

use Carbon\Carbon;
use App\Traits\CollectionPaginator;
use App\Models\Transport\Vehicle\Vehicle;
use App\Models\Transport\Vehicle\VehicleLog;
use App\Models\Transport\Vehicle\VehicleFuel;
use Illuminate\Validation\ValidationException;
use App\Models\Transport\Vehicle\VehicleServiceRecord;
use App\Models\Transport\Vehicle\VehiclePerformanceCriteria;

class ReportRepository
{
    protected $vehicle;
    protected $vehicle_fuel;
    protected $vehicle_log;
    protected $vehicle_service_record;
    protected $vehicle_performance_criteria;

    use CollectionPaginator;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
	public function __construct(
        Vehicle $vehicle,
        VehicleFuel $vehicle_fuel,
        VehicleLog $vehicle_log,
        VehicleServiceRecord $vehicle_service_record,
        VehiclePerformanceCriteria $vehicle_performance_criteria
	) {
        $this->vehicle = $vehicle;
        $this->vehicle_fuel = $vehicle_fuel;
        $this->vehicle_log = $vehicle_log;
        $this->vehicle_service_record = $vehicle_service_record;
        $this->vehicle_performance_criteria = $vehicle_performance_criteria;
	}

    /**
     * Get filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $vehicles = generateSelectOption($this->vehicle->filterByIsActive(1)->get()->pluck('detail', 'id')->all());
        return compact('vehicles');
    }

    public function getMileageRating($percent)
    {
        if ($percent > 0)
            return 5;
        else if ($percent > -30)
            return formatNumber(5 - (abs($percent) / 15));
        else if ($percent > -100)
            return formatNumber(5 - (abs($percent) / 23.33));
        else 0;
    }

    public function getServiceChargeRating($percent)
    {
        if ($percent < 0)
            return 5;
        else if ($percent < 30)
            return formatNumber(5 - ($percent / 15));
        else if ($percent < 100)
            return formatNumber(5 - ($percent / 23.33));
        else 0;
    }

    /**
     * Get summary data.
     *
     * @param array $params
     * @return Array
     */
    public function getSummaryReportData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'name');
        $order       = gv($params, 'order', 'asc');
        $vehicle_id  = gv($params, 'vehicle_id', []);
        $start_date  = gv($params, 'start_date');
        $end_date    = gv($params, 'end_date');
        $min_rating  = gv($params, 'min_rating', 0);
        $max_rating  = gv($params, 'max_rating', 0);
        $base_metric = gv($params, 'base_metric', 'max');

        $vehicle_id = is_array($vehicle_id) ? $vehicle_id : ($vehicle_id ? explode(',', $vehicle_id) : []);

        if (Carbon::parse($end_date)->diffInYears(Carbon::parse($start_date))) {
            throw ValidationException::withMessages(['message' => trans('transport.max_repot_period_one_year')]);
        }

        $date = $start_date;
        $month = 0;
        while ($date <= $end_date) {
            $month = (Carbon::parse($end_date)->diffInDays(Carbon::parse($date)) > 15) ? $month + 1 : $month;
            $date = Carbon::parse($date)->addMonth(1);
        }

        $days = Carbon::parse($end_date)->diffInDays(Carbon::parse($start_date));

        $query = $this->vehicle->filterByIsActive(1);

        if ($vehicle_id) {
            $query->whereIn('id', $vehicle_id);
        }

        $vehicles = $query->get();
        $vehicle_ids = $vehicles->pluck('id')->all();

        $vehicle_fuels = $this->vehicle_fuel->whereIn('vehicle_id',$vehicle_ids)->dateOfFuelingBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->get();

        $service_records = $this->vehicle_service_record->whereIn('vehicle_id',$vehicle_ids)->dateOfServiceBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->get();

        $vehicle_logs = $this->vehicle_log->whereIn('vehicle_id',$vehicle_ids)->get();

        $performance_criterias = $this->vehicle_performance_criteria->where('date_effective','<=',$end_date)->get();

        $summary = array();
        $grand_total_fuel = 0;
        $grand_total_fuel_cost = 0;
        $grand_total_service_charge = 0;
        $grand_total_run = 0;
        foreach ($vehicles as $vehicle) {
            $total_fuel = 0;
            $total_fuel_cost = 0;
            $fuels = $vehicle_fuels->where('vehicle_id', $vehicle->id)->all();
            foreach ($fuels as $fuel) {
                $total_fuel += $fuel->quantity;
                $total_fuel_cost += ($fuel->quantity * $fuel->price_per_unit);
            }
            $total_fuel = formatNumber($total_fuel);
            $total_fuel_cost = currency($total_fuel_cost);

            $total_service_charge = currency($service_records->where('vehicle_id', $vehicle->id)->sum('amount'));
            $total_logs = 0;

            $start_log = optional($vehicle_logs->where('vehicle_id', $vehicle->id)->where('date_of_log','<=',$start_date)->sortByDesc('date_of_log')->first())->log;

            if (! $start_log) {
                $start_log = optional($vehicle_logs->where('vehicle_id', $vehicle->id)->where('date_of_log','>=',$start_date)->sortBy('date_of_log')->first())->log;
            }

            $end_log = optional($vehicle_logs->where('vehicle_id', $vehicle->id)->where('date_of_log','>=',$end_date)->sortBy('date_of_log')->first())->log;

            if (! $end_log) {
                $end_log = optional($vehicle_logs->where('vehicle_id', $vehicle->id)->where('date_of_log','<=',$end_date)->sortByDesc('date_of_log')->first())->log;
            }

            $performance_criteria = $performance_criterias->where('vehicle_id', $vehicle->id)->sortByDesc('date_effective')->first();

            $total_run = ($start_log && $end_log) ? ($end_log - $start_log) : 0;

            $mileage = ($total_fuel) ? formatNumber($total_run / $total_fuel) : 0;

            $total_rating = 0;
            $mileage_diff = 0;
            $mileage_rating = 0;
            $service_charge_diff= 0;
            $service_charge_rating = 0;
            $rating = 0;

            if ($performance_criteria) { 
                $proposed_mileage_range = formatNumber($performance_criteria->min_mileage).' '.trans('general.to').' '.formatNumber($performance_criteria->max_mileage);
                $proposed_service_charge_range = formatNumber($performance_criteria->min_service_charge).' '.trans('general.to').' '.formatNumber($performance_criteria->max_service_charge);
                if ($base_metric == 'max') {
                    $proposed_mileage = $performance_criteria->max_mileage;
                    $proposed_service_charge = $performance_criteria->max_service_charge;
                } else if ($base_metric == 'min') {
                    $proposed_mileage = $performance_criteria->min_mileage;
                    $proposed_service_charge = $performance_criteria->min_service_charge;
                } else {
                    $proposed_mileage = ($performance_criteria->max_mileage + $performance_criteria->min_mileage) / 2;
                    $proposed_service_charge = ($performance_criteria->max_service_charge + $performance_criteria->min_service_charge) / 2;
                }

                $mileage_diff = formatNumber(($mileage && $proposed_mileage) ? (($mileage - $proposed_mileage) / $proposed_mileage ) * 100 : 0);
                $service_charge_diff = formatNumber(($proposed_service_charge) ? (($total_service_charge - ($proposed_service_charge * $month)) / $proposed_service_charge ) * 100 : 0);

                $total_rating          = ($mileage) ? 10 : 5;
                $mileage_rating        = ($mileage) ? $this->getMileageRating($mileage_diff) : 0;
                $service_charge_rating = $this->getServiceChargeRating($service_charge_diff);
                $rating                = formatNumber($mileage_rating + $service_charge_rating);
            } else {
                $proposed_mileage_range = '-';
                $proposed_service_charge_range = '-';
                $proposed_mileage = 0;
                $proposed_service_charge = 0;
            }

            $list[] = array(
                'vehicle'                       => $vehicle->detail,
                'age'                           => ($vehicle->make) ? Carbon::parse($vehicle->make.'-01')->diff(Carbon::now())->format('%y years, %m months') : '-',
                'age_integer'                   => ($vehicle->make) ? Carbon::parse($vehicle->make.'-01')->diffInDays() : '-',
                'total_fuel'                    => $total_fuel,
                'total_fuel_cost'               => $total_fuel_cost,
                'total_run'                     => $total_run,
                'total_service_charge'          => $total_service_charge,
                'mileage'                       => $mileage,
                'proposed_mileage_range'        => $proposed_mileage_range,
                'proposed_service_charge_range' => $proposed_service_charge_range,
                'mileage_diff'                  => $mileage_diff,
                'proposed_service_charge'       => formatNumber($proposed_service_charge * $month),
                'service_charge_diff'           => $service_charge_diff,
                'mileage_rating'                => $mileage_rating,
                'service_charge_rating'         => $service_charge_rating,
                'rating'                        => $rating,
                'total_rating'                  => $total_rating
            );

            $grand_total_fuel           += $total_fuel;
            $grand_total_fuel_cost      += $total_fuel_cost;
            $grand_total_run            += $total_run;
            $grand_total_service_charge += $total_service_charge;
        }

        $footer = array(
            'grand_total_fuel'           => $grand_total_fuel,
            'grand_total_fuel_cost'      => $grand_total_fuel_cost,
            'grand_total_run'            => $grand_total_run,
            'grand_total_service_charge' => $grand_total_service_charge
        );

        if ($min_rating) {
            $list = array_filter($list, function($element) use($min_rating) {
                return $element['rating'] >= $min_rating;
            });
        }

        if ($max_rating) {
            $list = array_filter($list, function($element) use($max_rating) {
                return $element['rating'] <= $max_rating;
            });
        }

        array_multisort(array_map(function($element) use($sort_by) {
              return $element[$sort_by];
        }, $list), $order == 'asc' ? SORT_ASC : SORT_DESC, $list);

        $footer = array();

        return compact('list','footer');
    }

    /**
     * Get summary of all vehicles
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateSummaryReport($params)
    {
        $page = gv($params, 'page', 1);
        $page_length = gv($params, 'page_length', config('config.page_length'));

        $data = $this->getSummaryReportData($params);

        $list = $data['list'];
        $footer = $data['footer'];

        $list = $this->collectionPaginate($list, $page_length, $page);

        return compact('list','footer');
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Array
     */
    public function printSummaryReport($params)
    {
        $data = $this->getSummaryReportData($params);
        
        $list = $data['list'];
        $footer = $data['footer'];

        return compact('list','footer');
    }
}