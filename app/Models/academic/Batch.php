<?php

namespace App\Models\Academic;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Batch extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'position',
                            'description',
                            'course_id',
                            'exam_grade_id',
                            'exam_observation_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'batches';
    protected static $logName = 'batch';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['holidays_except'];
    
    public function course()
    {
        return $this->belongsTo('App\Models\Academic\Course');
    }

    public function classTeachers()
    {
        return $this->hasMany('App\Models\Academic\ClassTeacher');
    }

    public function subjects()
    {
        return $this->hasMany('App\Models\Academic\Subject');
    }

    public function studentRecords()
    {
        return $this->hasMany('App\Models\Student\StudentRecord');
    }

    public function timetables()
    {
        return $this->hasMany('App\Models\Academic\Timetable');
    }

    public function feeAllocation()
    {
        return $this->hasOne('App\Models\Finance\Fee\FeeAllocation');
    }

    public function admissions()
    {
        return $this->hasMany('App\Models\Student\Admission');
    }

    public function studentAttendances()
    {
        return $this->hasMany('App\Models\Student\StudentAttendance');
    }

    public function schedules()
    {
        return $this->hasMany('App\Models\Exam\Schedule', 'batch_id');
    }

    public function grade()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Grade', 'exam_grade_id');
    }

    public function observation()
    {
        return $this->belongsTo('App\Models\Configuration\Exam\Observation', 'exam_observation_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getHolidaysExceptAttribute()
    {
        $dates = $this->getOption('holidays_except') ? : [];

        $holidays_except = array();
        foreach ($dates as $date) {
            $holidays_except[] = Carbon::parse($date);
        }

        return $holidays_except;
    }

    public function getBatchWithCourseAttribute()
    {
        return $this->Course->name.' '.$this->name;
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByCourseId($q, $course_id)
    {
        if (! $course_id) {
            return $q;
        }

        return $q->where('course_id', '=', $course_id);
    }

    public function scopeFilterBySession($q, $session_id = null)
    {
        return $q->whereHas('course', function ($q1) use ($session_id) {
            $q1->where('academic_session_id', '=', $session_id ? : config('config.default_academic_session.id'));
        });
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
