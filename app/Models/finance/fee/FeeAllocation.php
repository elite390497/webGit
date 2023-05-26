<?php

namespace App\Models\Finance\Fee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class FeeAllocation extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'batch_id',
                            'course_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'fee_allocations';
    protected static $logName = 'fee_allocation';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch');
    }

    public function course()
    {
        return $this->belongsTo('App\Models\Academic\Course');
    }

    public function feeAllocationGroups()
    {
        return $this->hasMany('App\Models\Finance\Fee\FeeAllocationGroup');
    }

    public function studentRecords()
    {
        return $this->hasMany('App\Models\Student\StudentRecord');
    }

    public function studentFeeRecords()
    {
        return $this->hasManyThrough('App\Models\Student\StudentFeeRecord','App\Models\Student\StudentRecord');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        // return $q->with('course', 'batch', 'batch.course', 'feeAllocationGroups', 'feeAllocationGroups.feeGroup', 'feeAllocationGroups.feeGroup.feeHeads', 'feeAllocationGroups.feeInstallments', 'feeAllocationGroups.feeInstallments.feeInstallmentDetails', 'feeAllocationGroups.feeInstallments.feeInstallmentDetails.feeHead', 'feeAllocationGroups.feeInstallments.transportFee')->withCount(['studentFeeRecords as paid_count' => function($q) {
        //         $q->whereIn('status',['paid','partially_paid']);
        //     }
        // ]);

        return $q->with('course', 'batch', 'batch.course', 'feeAllocationGroups', 'feeAllocationGroups.feeGroup', 'feeAllocationGroups.feeGroup.feeHeads', 'feeAllocationGroups.feeInstallments', 'feeAllocationGroups.feeInstallments.feeInstallmentDetails', 'feeAllocationGroups.feeInstallments.feeInstallmentDetails.feeHead', 'feeAllocationGroups.feeInstallments.transportFee')->withCount(['studentFeeRecords as paid_count']);
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
    
    public function scopeFilterByBatchId($q, $batch_id)
    {
        if (! $batch_id) {
            return $q;
        }

        return $q->where('batch_id', '=', $batch_id);
    }
    
    public function scopeFilterByCourseId($q, $course_id)
    {
        if (! $course_id) {
            return $q;
        }

        return $q->where('course_id', '=', $course_id);
    }

    public function scopeFilterBySession($q)
    {
        return $q->whereHas('batch', function ($q1) {
            $q1->whereHas('course', function ($q2) {
                $q2->where('academic_session_id', '=', config('config.default_academic_session.id'));
            });
        });
    }
}
