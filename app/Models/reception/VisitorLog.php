<?php

namespace App\Models\Reception;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VisitorLog extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'visiting_purpose_id',
                            'type',
                            'name',
                            'relation_with_student',
                            'company_name',
                            'contact_number',
                            'address',
                            'date_of_visit',
                            'entry_time',
                            'exit_time',
                            'student_id',
                            'employee_id',
                            'remarks',
                            'upload_token',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_visit' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'visitor_logs';
    protected static $logName = 'visitor_log';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function visitingPurpose()
    {
        return $this->belongsTo('App\Models\Configuration\Reception\VisitingPurpose');
    }

    public function student()
    {
        return $this->belongsTo('App\Models\Student\Student');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('employee','employee.employeeDesignations','employee.employeeDesignations.designation','employee.employeeDesignations.designation.employeeCategory','visitingPurpose', 'student', 'student.parent');
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

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByCompanyName($q, $company_name, $s = 0)
    {
        if (! $company_name) {
            return $q;
        }

        return ($s) ? $q->where('company_name', '=', $company_name) : $q->where('company_name', 'like', '%'.$company_name.'%');
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date_of_visit', '>=', config('config.default_academic_session.start_date'))->where('date_of_visit', '<=', config('config.default_academic_session.end_date'));
    }

    public function scopeDateOfVisitBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_visit', '>=', getStartOfDate($dates['start_date']))->where('date_of_visit', '<=', getEndOfDate($dates['end_date']));
    }
}
