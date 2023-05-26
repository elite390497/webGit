<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Event extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'event_type_id',
                            'title',
                            'description',
                            'start_date',
                            'start_time',
                            'end_date',
                            'end_time',
                            'venue',
                            'audience',
                            'user_id',
                            'upload_token',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'start_date' => 'date', 'end_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'events';
    protected static $logName = 'event';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['excerpt'];

    public function eventType()
    {
        return $this->belongsTo('App\Models\Configuration\Calendar\EventType');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function courses()
    {
        return $this->belongsToMany('App\Models\Academic\Course', 'event_course', 'event_id', 'course_id');
    }

    public function batches()
    {
        return $this->belongsToMany('App\Models\Academic\Batch', 'event_batch', 'event_id', 'batch_id');
    }

    public function employeeCategories()
    {
        return $this->belongsToMany('App\Models\Configuration\Employee\EmployeeCategory', 'event_employee_category', 'event_id', 'employee_category_id');
    }

    public function departments()
    {
        return $this->belongsToMany('App\Models\Configuration\Employee\Department', 'event_department', 'event_id', 'department_id');
    }

    public function getExcerptAttribute()
    {
        return createExcerpt(isset($this->attributes['description']) ? $this->attributes['description'] : '', 70);
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('eventType', 'user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory', 'courses', 'courses.courseGroup', 'batches', 'batches.course', 'employeeCategories', 'departments');
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

    public function scopeFilterByEventTypeId($q, $event_type_id)
    {
        if (! $event_type_id) {
            return $q;
        }

        return $q->where('event_type_id', '=', $event_type_id);
    }

    public function scopeFilterByAudience($q, $audience)
    {
        if (! $audience) {
            return $q;
        }

        return $q->where('audience', '=', $audience);
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
        return $q->where('start_date', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('end_date', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }

    public function scopeUpcomingAndLive($q)
    {
        return $q->where(function($q1) {
            $q1->where('start_date','>=', date('Y-m-d'))->orWhere(function($q2) {
                $q2->where('start_date', '<', date('Y-m-d'))->where('end_date','>=', date('Y-m-d'));
            });
        });
    }
}
