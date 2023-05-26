<?php

namespace App\Models\Finance\Fee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class FeeAllocationGroup extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'fee_allocation_id',
                            'fee_group_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'fee_allocation_groups';
    protected static $logName = 'fee_allocation_group';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function feeAllocation()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeAllocation');
    }

    public function feeGroup()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeGroup');
    }

    public function feeInstallments()
    {
        return $this->hasMany('App\Models\Finance\Fee\FeeInstallment');
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
    
    public function scopeFilterByFeeAllocationId($q, $fee_allocation_id)
    {
        if (! $fee_allocation_id) {
            return $q;
        }

        return $q->where('fee_allocation_id', '=', $fee_allocation_id);
    }
}
