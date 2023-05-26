<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentOptionalFeeRecord extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'student_fee_record_id',
                            'fee_head_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'student_optional_fee_records';
    protected static $logName = 'student_optional_fee_record';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function studentFeeRecord()
    {
        return $this->belongsTo('App\Models\Student\StudentFeeRecord');
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
    
    public function scopeFilterByStudentFeeRecordId($q, $student_fee_record_id)
    {
        if (! $student_fee_record_id) {
            return $q;
        }

        return $q->where('student_fee_record_id', '=', $student_fee_record_id);
    }
    
    public function scopeFilterByFeeHeadId($q, $fee_head_id)
    {
        if (! $fee_head_id) {
            return $q;
        }

        return $q->where('fee_head_id', '=', $fee_head_id);
    }
}
