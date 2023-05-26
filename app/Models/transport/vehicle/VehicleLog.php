<?php

namespace App\Models\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VehicleLog extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'vehicle_id',
                            'log',
                            'date_of_log',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_log' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'vehicle_logs';
    protected static $logName = 'vehicle_log';
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
    
    public function scopeFilterByDateOfLog($q, $date_of_log)
    {
        if (! $date_of_log) {
            return $q;
        }

        return $q->where('date_of_log', '=', $date_of_log);
    }

    public function scopeDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_log', '>=', getStartOfDate($dates['start_date']))->where('date_of_log', '<=', getEndOfDate($dates['end_date']));
    }
}
