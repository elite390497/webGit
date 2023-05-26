<?php

namespace App\Models\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VehiclePerformanceCriteria extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'vehicle_id',
                            'min_mileage',
                            'max_mileage',
                            'min_service_charge',
                            'max_service_charge',
                            'min_run',
                            'max_run',
                            'date_effective',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_effective' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'vehicle_performance_criterias';
    protected static $logName = 'vehicle_performance_criteria';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function vehicle()
    {
        return $this->belongsTo('App\Models\Transport\Vehicle\Vehicle');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('vehicle');
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
    
    public function scopeFilterByDateEffective($q, $date_effective)
    {
        if (! $date_effective) {
            return $q;
        }

        return $q->where('date_effective', '=', $date_effective);
    }
}
