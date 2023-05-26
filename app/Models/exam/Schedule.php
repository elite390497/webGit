<?php

namespace App\Models\Exam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Schedule extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'exam_id',
                            'batch_id',
                            'exam_grade_id',
                            'exam_assessment_id',
                            'observation_marks',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array','observation_marks' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'exam_schedules';
    protected static $logName = 'exam_schedule';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['schedule_date'];
    
    public function exam()
    {
        return $this->belongsTo('App\Models\Exam\Exam');
    }

    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch');
    }

    public function grade()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Grade', 'exam_grade_id');
    }

    public function assessment()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Assessment', 'exam_assessment_id');
    }

    public function records()
    {
        return $this->hasMany('App\Models\Exam\Record', 'exam_schedule_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getScheduleDateAttribute()
    {
        $exam_records = $this->records;

        $exam_records->sortBy('date');

        $start_date = optional($exam_records->firstWhere('date','!=',null))->date;
        $end_date = optional($exam_records->last())->date;

        return compact('start_date', 'end_date');
    }

    public function getEndDateAttribute()
    {

    }

    public function scopeInfo($q)
    {
        return $q->with([
            'batch',
            'batch.course',
            'grade',
            'assessment',
            'assessment.details',
            'exam',
            'exam.term',
            'exam.term.courseGroup',
            'records' => function($q1) {
                $q1->orderBy('date','asc');
            },
            'records.subject'
        ]);
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
        return $q->whereHas('exam', function ($q1) use ($session_id) {
            $q1->where('academic_session_id', '=', $session_id ? : config('config.default_academic_session.id'));
        });
    }

    public function scopeFilterByExamId($q, $exam_id)
    {
        if (! $exam_id) {
            return $q;
        }

        return $q->where('exam_id', '=', $exam_id);
    }

    public function scopeFilterByBatchId($q, $batch_id)
    {
        if (! $batch_id) {
            return $q;
        }

        return $q->where('batch_id', '=', $batch_id);
    }
}
