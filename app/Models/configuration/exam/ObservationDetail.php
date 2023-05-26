<?php

namespace App\Models\Configuration\Exam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class ObservationDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'exam_observation_id',
                            'name',
                            'max_mark',
                            'pass_percentage',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'exam_observation_details';
    protected static $logName = 'exam_observation_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function observation()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Observation', 'exam_observation_id');
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
    
    public function scopeFilterByExamObservationId($q, $exam_observation_id)
    {
        if (! $exam_observation_id) {
            return $q;
        }

        return $q->where('exam_observation_id', '=', $exam_observation_id);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
