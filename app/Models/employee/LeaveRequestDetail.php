<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class LeaveRequestDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_leave_request_id',
                            'designation_id',
                            'date_of_action',
                            'status',
                            'comment',
                            'approver_user_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_action' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'employee_leave_request_details';
    protected static $logName = 'employee_leave_request_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function leaveRequest()
    {
        return $this->belongsTo('App\Models\Employee\LeaveRequest');
    }

    public function designation()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\Designation');
    }

    public function approverUser()
    {
        return $this->belongsTo('App\User','approver_user_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByEmployeeLeaveRequestId($q, $employee_leave_request_id)
    {
        if (! $employee_leave_request_id) {
            return $q;
        }

        return $q->where('employee_leave_request_id', '=', $employee_leave_request_id);
    }
}
