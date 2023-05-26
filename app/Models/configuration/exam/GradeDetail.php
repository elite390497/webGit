<?php

namespace App\Models\Configuration\Exam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class GradeDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'exam_grade_id',
                            'name',
                            'min_percentage',
                            'max_percentage',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'exam_grade_details';
    protected static $logName = 'exam_grade_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function examGrade()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Grade', 'exam_grade_id');
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
    
    public function scopeFilterByExamGradeId($q, $exam_grade_id)
    {
        if (! $exam_grade_id) {
            return $q;
        }

        return $q->where('exam_grade_id', '=', $exam_grade_id);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
