<?php

namespace App\Models\Communication;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Meeting extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'description',
                            'date',
                            'start_time',
                            'end_time',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'meetings';
    protected $appends = ['is_live', 'is_expired', 'owner_video_preference', 'audience_video_preference'];
    protected $hidden = ['code'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('meeting')
            ->logAll()
            ->logExcept(['updated_at'])
            ->logOnlyDirty();
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function courses()
    {
        return $this->belongsToMany('App\Models\Academic\Course', 'meeting_course', 'meeting_id', 'course_id');
    }

    public function batches()
    {
        return $this->belongsToMany('App\Models\Academic\Batch', 'meeting_batch', 'meeting_id', 'batch_id');
    }

    public function studentRecords()
    {
        return $this->belongsToMany('App\Models\Student\StudentRecord', 'meeting_student_record', 'meeting_id', 'student_record_id');
    }

    public function employeeCategories()
    {
        return $this->belongsToMany('App\Models\Configuration\Employee\EmployeeCategory', 'meeting_employee_category', 'meeting_id', 'employee_category_id');
    }

    public function departments()
    {
        return $this->belongsToMany('App\Models\Configuration\Employee\Department', 'meeting_department', 'meeting_id', 'department_id');
    }

    public function employees()
    {
        return $this->belongsToMany('App\Models\Employee\Employee', 'meeting_employee', 'meeting_id', 'employee_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getIsLiveAttribute()
    {
        if (Carbon::parse($this->date.' '.$this->start_time) <= Carbon::now() && Carbon::parse($this->date.' '.$this->end_time) >= Carbon::now()) {
            return true;
        }

        return false;
    }

    public function getIsExpiredAttribute()
    {
        if (Carbon::parse($this->date.' '.$this->end_time) <= Carbon::now()) {
            return true;
        }

        return false;
    }

    public function getOwnerVideoPreferenceAttribute()
    {
        return $this->getOption('owner_video_preference') ? 1 : 0;
    }

    public function getAudienceVideoPreferenceAttribute()
    {
        return $this->getOption('audience_video_preference') ? 1 : 0;
    }

    public function scopeInfo($q)
    {
        return $q->with('user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory', 'courses', 'courses.courseGroup', 'batches', 'batches.course', 'employeeCategories', 'departments');
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

    public function scopeFilterByKeyword($q, $keyword)
    {
        if (! $keyword) {
            return $q;
        }

        return $q->where(function ($q1) use ($keyword) {
            $q1->where('title', 'like', '%'.$keyword.'%')->where('description', 'like', '%'.$keyword.'%');
        });
    }

    public function scopeFilterBySession($q)
    {
        return $q->whereBetween('created_at', [getStartOfDate(config('config.default_academic_session.start_date')), getEndOfDate(config('config.default_academic_session.end_date'))]);
    }

    public function scopeDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date', '>=', getStartOfDate($dates['start_date']))->where('created_at', '<=', getEndOfDate($dates['end_date']));
    }
}