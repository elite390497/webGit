<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class LeaveAllocation extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_id',
                            'start_date',
                            'end_date',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array','start_date' => 'date', 'end_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'employee_leave_allocations';
    protected static $logName = 'employee_leave_allocation';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function leaveAllocationDetails()
    {
        return $this->hasMany('App\Models\Employee\LeaveAllocationDetail','employee_leave_allocation_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with(['employee:id,code,prefix,first_name,middle_name,last_name','employee.employeeDesignations:id,employee_id,designation_id,department_id,date_effective,date_end','employee.employeeDesignations.designation:id,name,employee_category_id','employee.employeeDesignations.designation.employeeCategory:id,name','employee.employeeDesignations.department:id,name','leaveAllocationDetails:id,employee_leave_allocation_id,employee_leave_type_id,allotted,used','leaveAllocationDetails.leaveType:id,name']);
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

    public function scopeFilterBySession($q)
    {
        return $q->where('start_date', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('end_date', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }
}
