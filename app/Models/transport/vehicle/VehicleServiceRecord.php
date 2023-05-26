<?php

namespace App\Models\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VehicleServiceRecord extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'vehicle_id',
                            'vehicle_service_center_id',
                            'log',
                            'amount',
                            'date_of_service',
                            'next_due_date',
                            'next_due_log',
                            'employee_id',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_service' => 'date', 'next_due_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'vehicle_service_records';
    protected static $logName = 'vehicle_service_record';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function vehicle()
    {
        return $this->belongsTo('App\Models\Transport\Vehicle\Vehicle');
    }

    public function vehicleServiceCenter()
    {
        return $this->belongsTo('App\Models\Configuration\Transport\Vehicle\VehicleServiceCenter');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('vehicle', 'vehicleServiceCenter', 'employee');
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
    
    public function scopeFilterByVehicleServiceCenterId($q, $vehicle_service_center_id)
    {
        if (! $vehicle_service_center_id) {
            return $q;
        }

        return $q->where('vehicle_service_center_id', '=', $vehicle_service_center_id);
    }

    public function scopeDateOfServiceBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_service', '>=', getStartOfDate($dates['start_date']))->where('date_of_service', '<=', getEndOfDate($dates['end_date']));
    }
}
