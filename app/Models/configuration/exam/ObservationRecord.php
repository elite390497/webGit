<?php

namespace App\Models\Configuration\Exam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class ObservationRecord extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'batch_id',
                            'exam_grade_id',
                            'exam_observation_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'exam_observation_records';
    protected static $logName = 'exam_observation_record';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch');
    }

    public function grade()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Grade', 'exam_grade_id');
    }

    public function observation()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Observation', 'exam_observation_id');
    }
    
    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'details' => function($q1) {
                $q1->orderBy('position','asc');
            }
        ]);
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

    public function scopeFilterByExamGradeId($q, $exam_grade_id)
    {
        if (! $exam_grade_id) {
            return $q;
        }

        return $q->where('exam_grade_id', '=', $exam_grade_id);
    }

    public function scopeFilterByExamObservationId($q, $exam_observation_id)
    {
        if (! $exam_observation_id) {
            return $q;
        }

        return $q->where('exam_observation_id', '=', $exam_observation_id);
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
