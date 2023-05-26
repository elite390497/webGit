<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class ClassTiming extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'academic_session_id',
                            'name',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'class_timings';
    protected static $logName = 'class_timing';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function academicSession()
    {
        return $this->belongsTo('App\Models\Academic\AcademicSession');
    }

    public function classTimingSessions()
    {
        return $this->hasMany('App\Models\Academic\ClassTimingSession');
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
        return  $q->with('classTimingSessions', 'timetableAllocations')->withCount([
            'classTimingSessions as session' => function ($q) {
                $q->where('is_a_break', 0);
            },
            'classTimingSessions as break' => function ($q) {
                $q->where('is_a_break', 1);
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

    public function scopeFilterByUuid($q, $uuid)
    {
        if (! $uuid) {
            return $q;
        }

        return $q->where('uuid', '=', $uuid);
    }

    public function scopeFilterByAcademicSessionId($q, $academic_session_id)
    {
        if (! $academic_session_id) {
            return $q;
        }

        return $q->where('academic_session_id', '=', $academic_session_id);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('academic_session_id', '=', config('config.default_academic_session.id'));
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
