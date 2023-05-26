<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class PayrollTemplateDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'payroll_template_id',
                            'pay_head_id',
                            'employee_attendance_type_id',
                            'position',
                            'category',
                            'computation',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'payroll_template_details';
    protected static $logName = 'payroll_template_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function payHead()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\PayHead');
    }

    public function payrollTemplate()
    {
        return $this->belongsTo('App\Models\Employee\PayrollTemplate');
    }

    public function attendanceType()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\AttendanceType','employee_attendance_type_id');
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
}
