<?php

namespace App\Models\Transport\Vehicle;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VehicleDocument extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'vehicle_id',
                            'title',
                            'vehicle_document_type_id',
                            'date_of_expiry',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_expiry' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'vehicle_documents';
    protected static $logName = 'vehicle_document';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function vehicle()
    {
        return $this->belongsTo('App\Models\Transport\Vehicle\Vehicle');
    }

    public function vehicleDocumentType()
    {
        return $this->belongsTo('App\Models\Configuration\Transport\Vehicle\VehicleDocumentType');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('vehicle', 'vehicleDocumentType');
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
    
    public function scopeFilterByVehicleDocumentTypeId($q, $vehicle_document_type_id)
    {
        if (! $vehicle_document_type_id) {
            return $q;
        }

        return $q->where('vehicle_document_type_id', '=', $vehicle_document_type_id);
    }

    public function scopeFilterByTitle($q, $title, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return $s ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }
}
