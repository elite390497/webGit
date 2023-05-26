<?php

namespace App\Models\Resource;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class LessonPlanDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'lesson_plan_id',
                            'title',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'lesson_plan_details';
    protected static $logName = 'lesson_plan_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function lessonPlan()
    {
        return $this->belongsTo('App\Models\Resource\LessonPlan');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('lessonPlan');
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByLessonPlanId($q, $lesson_plan_id)
    {
        if (! $lesson_plan_id) {
            return $q;
        }

        return $q->where('lesson_plan_id', '=', $lesson_plan_id);
    }

    public function scopeFilterByTitle($q, $topic, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return ($s) ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }
}
