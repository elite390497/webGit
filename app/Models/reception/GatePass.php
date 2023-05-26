<?php

namespace App\Models\Reception;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class GatePass extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'type',
                            'student_id',
                            'employee_id',
                            'reason',
                            'date',
                            'time',
                            'user_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'gate_passes';
    protected static $logName = 'gate_pass';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function student()
    {
        return $this->belongsTo('App\Models\Student\Student');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory','employee','employee.employeeDesignations','employee.employeeDesignations.designation','employee.employeeDesignations.designation.employeeCategory', 'student', 'student.parent');
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

    public function scopeFilterByEmployeeId($q, $employee_id, $s = 0)
    {
        if (! $employee_id) {
            return $q;
        }

        return $q->whereEmployeeId($employee_id);
    }

    public function scopeFilterByStudentId($q, $student_id, $s = 0)
    {
        if (! $student_id) {
            return $q;
        }

        return $q->whereStudentId($student_id);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date', '>=', config('config.default_academic_session.start_date'))->where('date', '<=', config('config.default_academic_session.end_date'));
    }

    public function scopeDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date', '>=', getStartOfDate($dates['start_date']))->where('date', '<=', getEndOfDate($dates['end_date']));
    }
}