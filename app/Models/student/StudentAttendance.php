<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentAttendance extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'batch_id',
                            'subject_id',
                            'session',
                            'date_of_attendance',
                            'attendance',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'attendance' => 'array', 'date_of_attendance' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'student_attendances';
    protected static $logName = 'student_attendance';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch');
    }

    public function subject()
    {
        return $this->belongsTo('App\Models\Academic\Subject');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getAttendance(string $option)
    {
        return array_get($this->attendance, $option);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByDateOfAttendance($q, $date_of_attendance)
    {
        if (! $date_of_attendance) {
            return $q;
        }

        return $q->where('date_of_attendance', '=', $date_of_attendance);
    }

    public function scopeFilterByBatchId($q, $batch_id)
    {
        if (! $batch_id) {
            return $q;
        }

        return $q->where('batch_id', '=', $batch_id);
    }

    public function scopeFilterBySubjectId($q, $subject_id)
    {
        if (! $subject_id) {
            return $q;
        }

        return $q->where('subject_id', '=', $subject_id);
    }

    public function scopeDateOfAttendanceBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_attendance', '>=', getStartOfDate($dates['start_date']))->where('date_of_attendance', '<=', getEndOfDate($dates['end_date']));
    }
}
