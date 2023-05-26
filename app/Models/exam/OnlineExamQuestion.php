<?php

namespace App\Models\Exam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class OnlineExamQuestion extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'online_exam_id',
                            'question',
                            'question_type',
                            'answers',
                            'options'
                        ];
    protected $casts = [
                            'answers' => 'array',
                            'options' => 'array'
                        ];
    protected $primaryKey = 'id';
    protected $table = 'online_exam_questions';
    protected static $logName = 'online_exam_question';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['values'];
    
    public function onlineExam()
    {
        return $this->belongsTo('App\Models\Exam\OnlineExam');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getValuesAttribute()
    {
        $answers = $this->answers;

        $values = array();
        foreach ($answers as $answer) {
            $values[] = array(
                'title' => gv($answer, 'title'),
                'image' => gv($answer, 'image')
            );
        }

        return $values;
    }

    public function getMarkAttribute($value)
    {
        return round($value,2);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'onlineExam'
        ]);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByOnlineExaxmId($q, $online_exam_id)
    {
        if (! $online_exam_id) {
            return $q;
        }

        return $q->where('online_exam_id', '=', $online_exam_id);
    }
}