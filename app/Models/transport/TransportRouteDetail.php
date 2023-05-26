<?php

namespace App\Models\Transport;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TransportRouteDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'transport_route_id',
                            'transport_stoppage_id',
                            'position',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'transport_route_details';
    protected static $logName = 'transport_route';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function transportRoute()
    {
        return $this->belongsTo('App\Models\Transport\TransportRoute');
    }

    public function transportStoppage()
    {
        return $this->belongsTo('App\Models\Transport\TransportStoppage');
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
    
    public function scopeFilterByTransportRouteId($q, $transport_route_id)
    {
        if (! $transport_route_id) {
            return $q;
        }

        return $q->where('transport_route_id', '=', $transport_route_id);
    }

    public function scopeFilterByTransportStoppageId($q, $transport_stoppage_id)
    {
        if (! $transport_stoppage_id) {
            return $q;
        }

        return $q->where('transport_stoppage_id', '=', $transport_stoppage_id);
    }
}
