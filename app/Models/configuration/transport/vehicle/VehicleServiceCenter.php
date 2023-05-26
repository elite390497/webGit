<?php

namespace App\Models\Configuration\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VehicleServiceCenter extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'phone',
                            'alternate_phone',
                            'email',
                            'contact_person',
                            'contact_person_phone',
                            'contact_person_email',
                            'address_line_1',
                            'address_line_2',
                            'city',
                            'state',
                            'zipcode',
                            'country',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'vehicle_service_centers';
    protected static $logName = 'vehicle_service_center';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function vehicleServiceRecords()
    {
        return $this->hasMany('App\Models\Transport\Vehicle\VehicleServiceRecord');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
