<?php

namespace App\Models\Finance\Fee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class FeeConcessionDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'fee_concession_id',
                            'fee_head_id',
                            'amount',
                            'type',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'fee_concession_details';
    protected static $logName = 'fee_concession';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function feeConcession()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeConcession');
    }

    public function feeHead()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeHead');
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
    
    public function scopeFilterByFeeConcessionId($q, $fee_concession_id)
    {
        if (! $fee_concession_id) {
            return $q;
        }

        return $q->where('fee_concession_id', '=', $fee_concession_id);
    }

    public function scopeFilterByFeeHeadId($q, $fee_head_id)
    {
        if (! $fee_head_id) {
            return $q;
        }

        return $q->where('fee_head_id', '=', $fee_head_id);
    }
}
