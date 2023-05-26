<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Timetable extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'batch_id',
                            'date_effective',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_effective' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'timetables';
    protected static $logName = 'timetable';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch');
    }

    public function timetableAllocations()
    {
        return $this->hasMany('App\Models\Academic\TimetableAllocation');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('batch', 'batch.course', 'batch.course.courseGroup', 'batch.subjects', 'batch.subjects.subjectTeachers', 'batch.subjects.subjectTeachers.employee', 'timetableAllocations', 'timetableAllocations.timetableAllocationDetails', 'timetableAllocations.classTiming', 'timetableAllocations.classTiming.classTimingSessions', 'timetableAllocations.timetableAllocationDetails.subject', 'timetableAllocations.timetableAllocationDetails.subject.subjectTeachers', 'timetableAllocations.timetableAllocationDetails.subject.subjectTeachers.employee', 'timetableAllocations.timetableAllocationDetails.classTimingSession');
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByUuid($q, $uuid)
    {
        if (! $uuid) {
            return $q;
        }

        return $q->where('uuid', '=', $uuid);
    }

    public function scopeFilterByBatchId($q, $batch_id)
    {
        if (! $batch_id) {
            return $q;
        }

        return $q->where('batch_id', '=', $batch_id);
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
