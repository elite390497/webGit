<?php

namespace App\Models\Configuration\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class LeaveType extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'alias',
                            'is_active',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'employee_leave_types';
    protected static $logName = 'employee_leave_type';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function leaveRequests()
    {
        return $this->hasMany('App\Models\Employee\LeaveRequest', 'employee_leave_type_id');
    }

    public function leaveAllocationDetails()
    {
        return $this->hasMany('App\Models\Employee\LeaveAllocationDetail', 'employee_leave_type_id');
    }

    public function getNameWithAlias()
    {
        return $this->name.' ('.$this->alias.')';
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

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByAlias($q, $alias, $s = 0)
    {
        if (! $alias) {
            return $q;
        }

        return $s ? $q->where('alias', '=', $alias) : $q->where('alias', 'like', '%'.$alias.'%');
    }

    public function scopeFilterByStatus($q, $status)
    {
        return $q->where('is_active', $status);
    }
}
