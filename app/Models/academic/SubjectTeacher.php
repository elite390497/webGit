<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class SubjectTeacher extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'subject_id',
                            'employee_id',
                            'date_effective',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_effective' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'subject_teachers';
    protected static $logName = 'subject_teacher';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function subject()
    {
        return $this->belongsTo('App\Models\Academic\Subject');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterBySubjectId($q, $subject_id)
    {
        if (! $subject_id) {
            return $q;
        }

        return $q->where('subject_id', '=', $subject_id);
    }

    public function scopeFilterByEmployeeId($q, $employee_id)
    {
        if (! $employee_id) {
            return $q;
        }

        return $q->where('employee_id', '=', $employee_id);
    }
}
