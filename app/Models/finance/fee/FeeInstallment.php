<?php

namespace App\Models\Finance\Fee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class FeeInstallment extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'fee_allocation_group_id',
                            'transport_fee_id',
                            'title',
                            'due_date',
                            'late_fee_applicable',
                            'late_fee_frequency',
                            'late_fee',
                            'uuid',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'due_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'fee_installments';
    protected static $logName = 'fee_installment';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function feeAllocationGroup()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeAllocationGroup');
    }

    public function transportFee()
    {
        return $this->belongsTo('App\Models\Transport\TransportFee');
    }

    public function feeInstallmentDetails()
    {
        return $this->hasMany('App\Models\Finance\Fee\FeeInstallmentDetail');
    }

    public function studentFeeRecords()
    {
        return $this->hasMany('App\Models\Student\StudentFeeRecord');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }
    
    public function scopeFilterByUuid($q, $uuid)
    {
        if (! $uuid) {
            return $q;
        }

        return $q->where('uuid', '=', $uuid);
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
}
