<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TimetableAllocationDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'timetable_allocation_id',
                            'class_timing_session_id',
                            'subject_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'timetable_allocation_details';
    protected static $logName = 'timetable_allocation_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function timetableAllocation()
    {
        return $this->belongsTo('App\Models\Academic\TimetableAllocation');
    }

    public function classTimingSession()
    {
        return $this->belongsTo('App\Models\Academic\ClassTimingSession');
    }

    public function subject()
    {
        return $this->belongsTo('App\Models\Academic\Subject');
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
}
