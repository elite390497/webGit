<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentQualification extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'student_id',
                            'standard',
                            'institute_name',
                            'board_name',
                            'start_period',
                            'end_period',
                            'result',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'student_qualifications';
    protected static $logName = 'student_qualification';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function student()
    {
        return $this->belongsTo('App\Models\Student\Student');
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

    public function scopeFilterByStudentId($q, $student_id)
    {
        if (! $student_id) {
            return $q;
        }

        return $q->where('student_id', '=', $student_id);
    }

    public function scopeFilterByStandard($q, $standard)
    {
        if (! $standard) {
            return $q;
        }

        return $q->where('standard', '=', $standard);
    }
}
