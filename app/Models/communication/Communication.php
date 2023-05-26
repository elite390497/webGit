<?php

namespace App\Models\Communication;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Communication extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'type',
                            'subject',
                            'body',
                            'recipient_numbers',
                            'recipient_emails',
                            'recipient_count',
                            'included_numbers',
                            'included_emails',
                            'exclude_numbers',
                            'exclude_emails',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'communications';
    protected static $logName = 'communication';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function courses()
    {
        return $this->belongsToMany('App\Models\Academic\Course', 'communication_course', 'communication_id', 'course_id');
    }

    public function batches()
    {
        return $this->belongsToMany('App\Models\Academic\Batch', 'communication_batch', 'communication_id', 'batch_id');
    }

    public function employeeCategories()
    {
        return $this->belongsToMany('App\Models\Configuration\Employee\EmployeeCategory', 'communication_employee_category', 'communication_id', 'employee_category_id');
    }

    public function departments()
    {
        return $this->belongsToMany('App\Models\Configuration\Employee\Department', 'communication_department', 'communication_id', 'department_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
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

    public function scopeFilterByType($q, $type)
    {
        if (! $type) {
            return $q;
        }

        return $q->where('type', '=', $type);
    }

    public function scopeFilterBySubject($q, $subject, $s = 0)
    {
        if (! $subject) {
            return $q;
        }

        return ($s) ? $q->where('subject', '=', $subject) : $q->where('subject', 'like', '%'.$subject.'%');
    }

    public function scopeFilterByAudience($q, $audience)
    {
        if (! $audience) {
            return $q;
        }

        return $q->where('audience', '=', $audience);
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

        return $q->where('created_at', '>=', getStartOfDate($dates['start_date']))->where('created_at', '<=', getEndOfDate($dates['end_date']));
    }
}