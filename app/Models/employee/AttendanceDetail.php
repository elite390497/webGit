<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class AttendanceDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_attendance_id',
                            'employee_attendance_type_id',
                            'value',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'employee_attendance_details';
    protected static $logName = 'employee_attendance_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function attendance()
    {
        return $this->belongsTo('App\Models\Employee\Attendance','employee_attendance_id');
    }

    public function attendanceType()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\AttendanceType','employee_attendance_type_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'employeeAttendance:id,date',
            'attendanceType:id,name,type,alias'
        ]);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByEmployeeAttendanceId($q, $employee_attendance_id)
    {
        if (! $employee_attendance_id) {
            return $q;
        }

        return $q->where('employee_attendance_id', '=', $employee_attendance_id);
    }

    public function scopeFilterByEmployeeAttendanceTypeId($q, $employee_attendance_type_id)
    {
        if (! $employee_attendance_type_id) {
            return $q;
        }

        return $q->where('employee_attendance_type_id', '=', $employee_attendance_type_id);
    }
}
