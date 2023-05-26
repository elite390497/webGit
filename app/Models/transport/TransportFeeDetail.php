<?php

namespace App\Models\Transport;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TransportFeeDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'transport_fee_id',
                            'transport_circle_id',
                            'amount',
                            'type',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'transport_fee_details';
    protected static $logName = 'transport_fee';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function transportFee()
    {
        return $this->belongsTo('App\Models\Transport\TransportFee');
    }

    public function transportCircle()
    {
        return $this->belongsTo('App\Models\Transport\TransportCircle');
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
    
    public function scopeFilterByTransportFeeId($q, $transport_fee_id)
    {
        if (! $transport_fee_id) {
            return $q;
        }

        return $q->where('transport_fee_id', '=', $transport_fee_id);
    }

    public function scopeFilterByTransportCircleId($q, $transport_circle_id)
    {
        if (! $transport_circle_id) {
            return $q;
        }

        return $q->where('transport_circle_id', '=', $transport_circle_id);
    }
}
