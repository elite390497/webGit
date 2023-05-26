<?php

namespace App\Models\Exam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class OnlineExamRecord extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'online_exam_id',
                            'student_record_id',
                            'start',
                            'end',
                            'answers',
                            'obtained_mark',
                            'options'
                        ];
    protected $casts = [
                            'answers' => 'array',
                            'options' => 'array'
                        ];
    protected $primaryKey = 'id';
    protected $table = 'online_exam_records';
    protected static $logName = 'online_exam_record';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function onlineExam()
    {
        return $this->belongsTo('App\Models\Exam\OnlineExam');
    }

    public function studentRecord()
    {
        return $this->belongsTo('App\Models\Student\StudentRecord');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getObtainedMarkAttribute($value)
    {
        return round($value,2);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'onlineExam'
        ]);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByOnlineExaxmId($q, $online_exam_id)
    {
        if (! $online_exam_id) {
            return $q;
        }

        return $q->where('online_exam_id', '=', $online_exam_id);
    }
}