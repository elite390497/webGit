<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class EmployeeTerm extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_id',
                            'date_of_joining',
                            'date_of_leaving',
                            'joining_remarks',
                            'leaving_remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'employee_terms';
    protected static $logName = 'employee_term';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function employeeDesignations()
    {
        return $this->hasMany('App\Models\Employee\EmployeeDesignation');
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
