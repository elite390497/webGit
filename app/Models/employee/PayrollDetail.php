<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class PayrollDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'payroll_id',
                            'pay_head_id',
                            'is_custom',
                            'amount',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'payroll_details';
    protected static $logName = 'payroll_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function payHead()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\PayHead');
    }

    public function payroll()
    {
        return $this->belongsTo('App\Models\Employee\Payroll');
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
