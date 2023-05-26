<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class LeaveAllocationDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_leave_allocation_id',
                            'employee_leave_type_id',
                            'allotted',
                            'used',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'employee_leave_allocation_details';
    protected static $logName = 'employee_leave_allocation_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function leaveAllocation()
    {
        return $this->belongsTo('App\Models\Employee\LeaveAllocation');
    }

    public function leaveType()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\LeaveType','employee_leave_type_id');
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

    public function scopeFilterByEmployeeLeaveTypeId($q, $employee_leave_type_id)
    {
        if (! $employee_leave_type_id) {
            return $q;
        }

        return $q->where('employee_leave_type_id', '=', $employee_leave_type_id);
    }
}
