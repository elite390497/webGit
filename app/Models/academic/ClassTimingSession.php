<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class ClassTimingSession extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'class_timing_id',
                            'name',
                            'start',
                            'end',
                            'is_a_break',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'class_timing_sessions';
    protected static $logName = 'class_timing_session';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function classTiming()
    {
        return $this->belongsTo('App\Models\Academic\ClassTiming');
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

    public function scopeFilterByClassTiming($q, $class_timing)
    {
        if (! $class_timing) {
            return $q;
        }

        return $q->where('class_timing', '=', $class_timing);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
