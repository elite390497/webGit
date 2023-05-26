<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentSibling extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'student_id',
                            'sibling_student_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'student_siblings';
    protected static $logName = 'student_sibling';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function student()
    {
        return $this->belongsTo('App\Models\Student\Student', 'student_id');
    }

    public function studentSibling()
    {
        return $this->belongsTo('App\Models\Student\Student', 'sibling_student_id');
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

    public function scopeFilterBySiblingStudentId($q, $sibling_student_id)
    {
        if (! $sibling_student_id) {
            return $q;
        }

        return $q->where('sibling_student_id', '=', $sibling_student_id);
    }
}
