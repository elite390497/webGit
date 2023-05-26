<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class EmployeeDesignation extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_id',
                            'department_id',
                            'designation_id',
                            'employee_term_id',
                            'date_effective',
                            'date_end',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'employee_designations';
    protected static $logName = 'employee_designation';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function employeeTerm()
    {
        return $this->belongsTo('App\Models\Employee\EmployeeTerm');
    }

    public function designation()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\Designation');
    }

    public function department()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\Department');
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

    public function scopeFilterByEmployeeId($q, $employee_id)
    {
        if (! $employee_id) {
            return $q;
        }

        return $q->where('employee_id', '=', $employee_id);
    }
}
