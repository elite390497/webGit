<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Subject extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'batch_id',
                            'name',
                            'code',
                            'shortcode',
                            'is_elective',
                            'has_no_exam',
                            'max_class_per_week',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'subjects';
    protected static $logName = 'subject';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch');
    }

    public function subjectTeachers()
    {
        return $this->hasMany('App\Models\Academic\SubjectTeacher');
    }

    public function timetableAllocationDetails()
    {
        return $this->hasMany('App\Models\Academic\TimetableAllocationDetail');
    }

    public function getNameWithCodeAttribute()
    {
        return $this->name.' ('.$this->code.')';
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeFilterBySession($q)
    {
        return $q->whereHas('batch', function ($q1) {
            $q1->whereHas('course', function ($q2) {
                $q2->where('academic_session_id', '=', config('config.default_academic_session.id'));
            });
        });
    }

    public function scopeInfo($q)
    {
        return $q->with('batch', 'batch.course');
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

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByCode($q, $code, $s = 0)
    {
        if (! $code) {
            return $q;
        }

        return ($s) ? $q->where('code', '=', $code) : $q->where('code', 'like', '%'.$code.'%');
    }

    public function scopeFilterByShortcode($q, $shortcode, $s = 0)
    {
        if (! $shortcode) {
            return $q;
        }

        return ($s) ? $q->where('shortcode', '=', $shortcode) : $q->where('shortcode', 'like', '%'.$shortcode.'%');
    }

    public function scopeFilterByIsElective($q, $is_elective)
    {
        return $q->whereIsElective($is_elective);
    }

    public function scopeFilterByHasNoExam($q, $has_no_exam)
    {
        return $q->whereHasNoExam($has_no_exam);
    }
}
