<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentFeeRecord extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'student_record_id',
                            'fee_installment_id',
                            'transport_circle_id ',
                            'transport_fee',
                            'fee_concession_id',
                            'status',
                            'marked_as_paid_at',
                            'due_date',
                            'late_fee_frequency',
                            'late_fee',
                            'late_fee_charged',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'due_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'student_fee_records';
    protected static $logName = 'student_fee_record';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function studentRecord()
    {
        return $this->belongsTo('App\Models\Student\StudentRecord');
    }

    public function studentFeeRecordDetails()
    {
        return $this->hasMany('App\Models\Student\StudentFeeRecordDetail');
    }

    public function studentOptionalFeeRecords()
    {
        return $this->hasMany('App\Models\Student\StudentOptionalFeeRecord');
    }

    public function feeInstallment()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeInstallment');
    }

    public function transportCircle()
    {
        return $this->belongsTo('App\Models\Transport\TransportCircle');
    }

    public function feeConcession()
    {
        return $this->belongsTo('App\Models\Finance\Fee\FeeConcession');
    }

    public function transactions()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Transaction');
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

    public function scopeFilterByStatus($q, $status)
    {
        if (! $status) {
            return  $q;
        }

        return $q->where('status', '=', $status);
    }
    
    public function scopeFilterByStudentRecordId($q, $student_record_id)
    {
        if (! $student_record_id) {
            return $q;
        }

        return $q->where('student_record_id', '=', $student_record_id);
    }
    
    public function scopeFilterByFeeInstallmentId($q, $fee_installment_id)
    {
        if (! $fee_installment_id) {
            return $q;
        }

        return $q->where('fee_installment_id', '=', $fee_installment_id);
    }
}
