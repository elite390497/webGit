<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class LeaveRequest extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_id',
                            'employee_leave_type_id',
                            'start_date',
                            'end_date',
                            'description',
                            'status',
                            'requester_user_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'start_date' => 'date', 'end_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'employee_leave_requests';
    protected static $logName = 'employee_leave_request';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function leaveType()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\LeaveType','employee_leave_type_id');
    }

    public function requesterUser()
    {
        return $this->belongsTo('App\User','requester_user_id');
    }

    public function leaveRequestDetails()
    {
        return $this->hasMany('App\Models\Employee\LeaveRequestDetail','employee_leave_request_id');
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
            'leaveType:id,name',
            'requesterUser:id',
            'requesterUser.employee:id,user_id,code,prefix,first_name,middle_name,last_name',
            'leaveRequestDetails:id,employee_leave_request_id,status,comment,approver_user_id,updated_at',
            'leaveRequestDetails.approverUser:id',
            'leaveRequestDetails.approverUser.employee:id,user_id,code,prefix,first_name,middle_name,last_name',
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

    public function scopeFilterByEmployeeLeaveTypeId($q, $employee_leave_type_id)
    {
        if (! $employee_leave_type_id) {
            return $q;
        }

        return $q->where('employee_leave_type_id', '=', $employee_leave_type_id);
    }

    public function scopeFilterByStatus($q, $status)
    {
        return $q->where('status', $status);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('start_date', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('end_date', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }
}
