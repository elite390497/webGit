<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Payroll extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'employee_id',
                            'employee_salary_id',
                            'period',
                            'period_detail',
                            'start_date',
                            'end_date',
                            'per_day_calculation_basis',
                            'payment_status',
                            'total',
                            'paid',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'start_date' => 'date', 'end_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'payrolls';
    protected static $logName = 'payroll';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['balance','number'];
    
    public function payrollDetails()
    {
        return $this->hasMany('App\Models\Employee\PayrollDetail','payroll_id');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function salary()
    {
        return $this->belongsTo('App\Models\Employee\Salary', 'employee_salary_id');
    }

    public function transactions()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Transaction');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getBalanceAttribute()
    {
        return $this->total - $this->paid;
    }

    public function getNumberAttribute()
    {
        return $this->prefix.str_pad($this->id, 3, '0', STR_PAD_LEFT);
    }

    public function scopeInfo($q)
    {
        return $q->with([
            'employee:id,code,prefix,first_name,middle_name,last_name,contact_number',
            'employee.employeeDesignations:id,employee_id,designation_id,department_id,date_effective,date_end',
            'employee.employeeDesignations.designation:id,name,employee_category_id',
            'employee.employeeDesignations.designation.employeeCategory:id,name',
            'employee.employeeDesignations.department:id,name',
            'payrollDetails:id,payroll_id,pay_head_id,amount',
            'payrollDetails.payHead:id,name,alias,type',
            'transactions' => function($q1) {
                $q1->select('id','payroll_id','prefix','number','account_id','payment_method_id','amount','date','instrument_number','instrument_bank_detail','reference_number','instrument_date','instrument_clearing_date')->where('is_cancelled','=',0);
            },
            'transactions.account:id,name',
            'transactions.paymentMethod:id,name,options'
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
}
