<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Attendance extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_id',
                            'employee_attendance_type_id',
                            'date_of_attendance',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_attendance' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'employee_attendances';
    protected static $logName = 'employee_attendance';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function attendanceType()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\AttendanceType','employee_attendance_type_id');
    }

    public function attendanceDetails()
    {
        return  $this->hasMany('App\Models\Employee\AttendanceDetail','employee_attendance_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'employee:id,code,prefix,first_name,middle_name,last_name',
            'employee.employeeDesignations:id,employee_id,designation_id,department_id,date_effective,date_end',
            'employee.employeeDesignations.designation:id,name,employee_category_id',
            'employee.employeeDesignations.designation.employeeCategory:id,name',
            'employee.employeeDesignations.department:id,name',
            'attendanceType:id,name,type,alias',
            'attendanceDetails:id,employee_attendance_id,employee_attendance_type_id,value,remarks',
            'attendanceDetails.attendanceType:id,name,type,alias,unit'
        ]);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByEmployeeId($q, $employee_id)
    {
        if (! $employee_id) {
            return $q;
        }

        return $q->where('employee_id', '=', $employee_id);
    }

    public function scopeFilterByDateOfAttendance($q, $date_of_attendance)
    {
        if (! $date_of_attendance) {
            return $q;
        }

        return $q->where('date_of_attendance', '=', $date_of_attendance);
    }

    public function scopeFilterByEmployeeAttendanceTypeId($q, $employee_attendance_type_id)
    {
        if (! $employee_attendance_type_id) {
            return $q;
        }

        return $q->where('employee_attendance_type_id', '=', $employee_attendance_type_id);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('date', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }
}
