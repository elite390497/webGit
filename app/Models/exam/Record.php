<?php

namespace App\Models\Exam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Record extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'exam_schedule_id',
                            'subject_id',
                            'date',
                            'start',
                            'end',
                            'marks',
                            'options'
                        ];
    protected $casts = ['options' => 'array','marks' => 'array', 'date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'exam_records';
    protected static $logName = 'exam_record';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function schedule()
    {
        return $this->belongsTo('App\Models\Exam\Schedule', 'exam_schedule_id');
    }

    public function subject()
    {
        return $this->belongsTo('App\Models\Academic\Subject');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with([]);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByExamScheduleId($q, $exam_schedule_id)
    {
        if (! $exam_schedule_id) {
            return $q;
        }

        return $q->where('exam_schedule_id', '=', $exam_schedule_id);
    }

    public function scopeFilterBySubjectId($q, $subject_id)
    {
        if (! $subject_id) {
            return $q;
        }

        return $q->where('subject_id', '=', $subject_id);
    }
}
