<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Salary extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_id',
                            'payroll_template_id',
                            'date_effective',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_effective' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'employee_salaries';
    protected static $logName = 'employee_salary';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function salaryDetails()
    {
        return $this->hasMany('App\Models\Employee\SalaryDetail','employee_salary_id');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function payrollTemplate()
    {
        return $this->belongsTo('App\Models\Employee\PayrollTemplate');
    }

    public function payrolls()
    {
        return $this->hasMany('App\Models\Employee\Payroll','employee_salary_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with(['employee:id,code,prefix,first_name,middle_name,last_name',
            'employee.employeeDesignations:id,employee_id,designation_id,department_id,date_effective,date_end',
            'employee.employeeDesignations.designation:id,name,employee_category_id',
            'employee.employeeDesignations.designation.employeeCategory:id,name',
            'employee.employeeDesignations.department:id,name',
            'payrollTemplate:id,name',
            'payrollTemplate.payrollTemplateDetails:id,payroll_template_id,employee_attendance_type_id,pay_head_id,computation,category,position',
            'payrollTemplate.payrollTemplateDetails.payHead:id,name,alias,type',
            'payrollTemplate.payrollTemplateDetails.attendanceType:id,name,unit',
            'salaryDetails:id,employee_salary_id,payroll_template_detail_id,amount'
        ])->withCount('payrolls');
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

    public function scopeFilterByPayrollTemplateId($q, $payroll_template_id)
    {
        if (! $payroll_template_id) {
            return $q;
        }

        return $q->where('payroll_template_id', '=', $payroll_template_id);
    }

    public function scopeFilterByDateEffective($q, $employee_id)
    {
        if (! $employee_id) {
            return $q;
        }

        return $q->where('employee_id', '=', $employee_id);
    }
}
