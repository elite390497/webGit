<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentDocument extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'description',
                            'student_id',
                            'student_document_type_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'student_documents';
    protected static $logName = 'student';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function studentDocumentType()
    {
        return $this->belongsTo('App\Models\Configuration\Student\StudentDocumentType');
    }

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

    public function scopeFilterByStudentDocumentTypeId($q, $student_document_type_id)
    {
        if (! $student_document_type_id) {
            return $q;
        }

        return $q->where('student_document_type_id', '=', $student_document_type_id);
    }

    public function scopeFilterByTitle($q, $title, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return $s ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }
}
