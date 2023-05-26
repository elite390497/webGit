<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Course extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'course_group_id',
                            'position',
                            'name',
                            'description',
                            'options',
                            'academic_session_id'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'courses';
    protected static $logName = 'course';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function courseGroup()
    {
        return $this->belongsTo('App\Models\Configuration\Academic\CourseGroup');
    }

    public function academicSession()
    {
        return $this->belongsTo('App\Models\Academic\AcademicSession');
    }

    public function batches()
    {
        return $this->hasMany('App\Models\Academic\Batch');
    }

    public function studentRecords()
    {
        return $this->hasManyThrough('App\Models\Student\StudentRecord', 'App\Models\Academic\Batch');
    }

    public function registrations()
    {
        return $this->hasMany('App\Models\Student\Registration');
    }

    public function feeAllocation()
    {
        return $this->hasOne('App\Models\Finance\Fee\FeeAllocation');
    }

    public function enquiryDetails()
    {
        return $this->hasMany('App\Models\Reception\EnquiryDetail');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getCourseWithGroupAttribute()
    {
        return $this->CourseGroup->name.' '.$this->name;
    }

    public function scopeInfo($q)
    {
        return $q->with(['courseGroup', 'batches' => function($q1) {
            $q1->orderBy('position','asc');
        } ]);
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
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
