<?php

namespace App\Models\Resource;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class SyllabusTopic extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'syllabus_id',
                            'title',
                            'start_date',
                            'end_date',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'start_date' => 'date', 'end_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'syllabus_topics';
    protected static $logName = 'syllabus_topic';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function syllabus()
    {
        return $this->belongsTo('App\Models\Resource\Syllabus');
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

    public function scopeFilterBySyllabusId($q, $syllabus_id)
    {
        if (! $syllabus_id) {
            return $q;
        }

        return $q->where('syllabus_id', '=', $syllabus_id);
    }

    public function scopeFilterByTitle($q, $topic, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return ($s) ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }
}
