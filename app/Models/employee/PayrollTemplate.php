<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class PayrollTemplate extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'is_active',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'payroll_templates';
    protected static $logName = 'payroll_template';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function payrollTemplateDetails()
    {
        return $this->hasMany('App\Models\Employee\PayrollTemplateDetail','payroll_template_id');
    }

    public function salaries()
    {
        return $this->hasMany('App\Models\Employee\Salary','payroll_template_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'payrollTemplateDetails' => function($q1) {
                $q1->orderBy('position','asc');
            },
            'payrollTemplateDetails.payHead:id,name,alias,type,options',
            'payrollTemplateDetails.attendanceType:id,name,unit',
            'salaries:id,payroll_template_id,employee_id,date_effective'
        ]);
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
}
