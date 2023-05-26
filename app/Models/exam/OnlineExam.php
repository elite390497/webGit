<?php

namespace App\Models\Exam;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class OnlineExam extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'academic_session_id',
                            'name',
                            'max_mark',
                            'description',
                            'options'
                        ];
    protected $casts = [
                            'passing_mark' => 'array',
                            'negative_mark' => 'array',
                            'options' => 'array',
                            'date' => 'date'
                        ];
    protected $primaryKey = 'id';
    protected $table = 'online_exams';
    protected static $logName = 'online_exam';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['is_editable','status','status_detail'];
    
    public function academicSession()
    {
        return $this->belongsTo('App\Models\Academic\AcademicSession');
    }

    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch','batch_id');
    }

    public function subject()
    {
        return $this->belongsTo('App\Models\Academic\Subject','subject_id');
    }

    public function questions()
    {
        return $this->hasMany('App\Models\Exam\OnlineExamQuestion', 'online_exam_id');
    }

    public function records()
    {
        return $this->hasMany('App\Models\Exam\OnlineExamRecord', 'online_exam_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getIsEditableAttribute()
    {
        if ($this->is_published || $this->status == 'running') {
            return false;
        }

        if ($this->records->count()) {
            return false;
        }

        return true;
    }

    public function getStatusAttribute()
    {
        $start_time = Carbon::parse(toDate($this->date).' '.$this->start_time);
        $end_time = Carbon::parse(toDate($this->date).' '.$this->end_time);

        if ($start_time > Carbon::now()) {
            return 'upcoming';
        } else if ($end_time < Carbon::now()) {
            return 'expired';
        } else if ($start_time < Carbon::now() && $end_time > Carbon::now()) {
            return 'running';
        } else {
            return;
        }
    }

    public function getStatusDetailAttribute()
    {
        if ($this->status == 'upcoming') {
            return array('text' => trans('exam.online_exam_status_upcoming'), 'type' => 'info');
        } else if ($this->status == 'expired') {
            return array('text' => trans('exam.online_exam_status_expired'), 'type' => 'danger');
        } else if ($this->status == 'running') {
            return array('text' => trans('exam.online_exam_status_running'), 'type' => 'success');
        } else {
            return array('text' => '', 'type' => '');
        }
    }

    public function getMaxMarkAttribute($value)
    {
        return round($value,2);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'batch',
            'batch.course',
            'subject',
            'questions' => function($q1) {
                return $q1->orderBy('position','asc');
            },
            'records' => function($q1) {
                return $q1->orderBy('created_at','asc');
            },
            'records.studentRecord',
            'records.studentRecord.student',
            'records.studentRecord.student.parent',
        ]);
    }

    public function scopeSummary($q)
    {
        return $q->with([
            'batch',
            'batch.course',
            'subject'
        ])->withCount('questions');
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

    public function scopeFilterBySession($q, $session_id = null)
    {
        return $q->where('academic_session_id', '=', $session_id ? : config('config.default_academic_session.id'));
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}