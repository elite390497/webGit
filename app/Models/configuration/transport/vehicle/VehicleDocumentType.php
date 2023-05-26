<?php

namespace App\Models\Configuration\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VehicleDocumentType extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'description',
                            'has_expiry_date',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'vehicle_document_types';
    protected static $logName = 'vehicle_document_type';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function vehicleDocuments()
    {
        return $this->hasMany('App\Models\Transport\Vehicle\VehicleDocument');
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
