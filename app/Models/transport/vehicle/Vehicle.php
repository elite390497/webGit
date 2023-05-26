<?php

namespace App\Models\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Vehicle extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'registration_number',
                            'make',
                            'model',
                            'max_seating_capacity',
                            'is_owned',
                            'owner_name',
                            'owner_company_name',
                            'owner_phone',
                            'owner_email',
                            'vehicle_fuel_type_id',
                            'max_fuel_capacity',
                            'is_active',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'vehicles';
    protected static $logName = 'vehicle';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function vehicleDocuments()
    {
        return $this->hasMany('App\Models\Transport\Vehicle\VehicleDocument');
    }

    public function vehicleIncharges()
    {
        return $this->hasMany('App\Models\Transport\Vehicle\VehicleIncharge');
    }

    public function vehicleLogs()
    {
        return $this->hasMany('App\Models\Transport\Vehicle\VehicleLog');
    }

    public function vehicleFuels()
    {
        return $this->hasMany('App\Models\Transport\Vehicle\VehicleFuel');
    }

    public function vehicleServiceRecords()
    {
        return $this->hasMany('App\Models\Transport\Vehicle\VehicleServiceRecord');
    }

    public function vehicleFuelType()
    {
        return $this->belongsTo('App\Models\Configuration\Transport\Vehicle\VehicleFuelType');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getDetailAttribute()
    {
        return $this->name.' ('.$this->registration_number.')';
    }

    public function scopeInfo($q)
    {
        return $q->with('vehicleFuelType:id,name');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
    
    public function scopeFilterByVehicleFuelTypeId($q, $vehicle_fuel_type_id)
    {
        if (! $vehicle_fuel_type_id) {
            return $q;
        }

        return $q->where('vehicle_fuel_type_id', '=', $vehicle_fuel_type_id);
    }

    public function scopeFilterByIsActive($q, $is_active)
    {
        return $q->where('is_active', '=', $is_active);
    }

    public function scopeFilterByType($q, $is_owned)
    {
        return $q->where('is_owned', '=', $is_owned);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByRegistrationNumber($q, $registration_number, $s = 0)
    {
        if (! $registration_number) {
            return $q;
        }

        return $s ? $q->where('registration_number', '=', $registration_number) : $q->where('registration_number', 'like', '%'.$registration_number.'%');
    }
}
