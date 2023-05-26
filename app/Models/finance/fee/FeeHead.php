<?php

namespace App\Models\Finance\Fee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class FeeHead extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'description',
                            'fee_group_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'fee_heads';
    protected static $logName = 'fee_head';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function feeGroup()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeGroup');
    }

    public function feeInstallmentDetails()
    {
        return $this->hasMany('App\Models\Finance\Fee\FeeInstallmentDetail');
    }

    public function feeConcessionDetails()
    {
        return $this->hasMany('App\Models\Finance\Fee\FeeConcessionDetail');
    }

    public function studentFeeRecordDetails()
    {
        return $this->hasMany('App\Models\Student\StudentFeeRecordDetail');
    }

    public function studentOptionalFeeRecords()
    {
        return $this->hasMany('App\Models\Student\StudentOptionalFeeRecord');
    }

    public function getHeadWithGroupAttribute()
    {
        return $this->name.' ('.$this->FeeGroup->name.')';
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

    public function scopeFilterBySession($q, $session_id = null)
    {
        return $q->whereHas('feeGroup', function ($q1) use($session_id) {
            $q1->where('academic_session_id', '=', $session_id ? : config('config.default_academic_session.id'));
        });
    }

    public function scopeFilterByFeeGroupId($q, $fee_group_id)
    {
        if (! $fee_group_id) {
            return $q;
        }

        return $q->where('fee_group_id', '=', $fee_group_id);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
