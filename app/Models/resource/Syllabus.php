<?php

namespace App\Models\Resource;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Syllabus extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'description',
                            'start_date',
                            'end_date',
                            'subject_id',
                            'employee_id',
                            'status',
                            'is_locked',
                            'upload_token',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'start_date' => 'date', 'end_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'syllabuses';
    protected static $logName = 'syllabus';
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

    public function syllabusDetails()
    {
        return $this->hasMany('App\Models\Resource\SyllabusDetail');
    }

    public function syllabusTopics()
    {
        return $this->hasMany('App\Models\Resource\SyllabusTopic');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('syllabusDetails:id,syllabus_id,title,description','syllabusTopics:id,syllabus_id,title,start_date,end_date,description,options','subject:id,name,code,batch_id', 'subject.batch:id,name,course_id', 'subject.batch.course:id,name', 'employee', 'employee.employeeDesignations', 'employee.employeeDesignations.designation', 'employee.employeeDesignations.designation.employeeCategory');
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

    public function scopeFilterByTitle($q, $title, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return ($s) ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }

    public function scopeFilterBySession($q)
    {
        return $q->whereHas('subject',function($q1) {
            $q1->whereHas('batch',function($q2) {
                $q2->whereHas('course',function($q3){
                    $q3->where('academic_session_id', config('config.default_academic_session.id'));
                });
            });
        });
    }
}
