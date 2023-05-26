<?php

namespace App\Models\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VehicleFuel extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'vehicle_id',
                            'quantity',
                            'vehicle_fuel_type_id',
                            'date_of_fueling',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_fueling' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'vehicle_fuels';
    protected static $logName = 'vehicle_fuel';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function vehicle()
    {
        return $this->belongsTo('App\Models\Transport\Vehicle\Vehicle');
    }

    public function vehicleFuelType()
    {
        return $this->belongsTo('App\Models\Configuration\Transport\Vehicle\VehicleFuelType');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('vehicle', 'vehicleFuelType');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
    
    public function scopeFilterByVehicleId($q, $vehicle_id)
    {
        if (! $vehicle_id) {
            return $q;
        }

        return $q->where('vehicle_id', '=', $vehicle_id);
    }

    public function scopeFilterByVehicleFuelTypeId($q, $vehicle_fuel_type_id)
    {
        if (! $vehicle_fuel_type_id) {
            return $q;
        }

        return $q->where('vehicle_fuel_type_id', '=', $vehicle_fuel_type_id);
    }

    public function scopeDateOfFuelingBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_fueling', '>=', getStartOfDate($dates['start_date']))->where('date_of_fueling', '<=', getEndOfDate($dates['end_date']));
    }
}
