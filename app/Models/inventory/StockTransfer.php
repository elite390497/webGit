<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StockTransfer extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'room_id',
                            'student_record_id',
                            'employee_id',
                            'date',
                            'return_due_date',
                            'return_date',
                            'return_status',
                            'description',
                            'return_description',
                            'user_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date' => 'date', 'return_due_date' => 'date', 'return_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'stock_transfers';
    protected static $logName = 'stock_transfer';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function details()
    {
        return $this->hasMany('App\Models\Inventory\StockTransferDetail', 'stock_transfer_id');
    }

    public function returnDetails()
    {
        return $this->hasMany('App\Models\Inventory\StockTransferReturn', 'stock_transfer_id');
    }

    public function room()
    {
        return $this->belongsTo('App\Models\Configuration\Asset\Room');
    }

    public function student()
    {
        return $this->belongsTo('App\Models\Student\Student');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('room','student','student.parent','details','details.item','returnDetails','returnDetails.item','user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory','employee', 'employee.employeeDesignations', 'employee.employeeDesignations.designation', 'employee.employeeDesignations.designation.employeeCategory');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date', '>=', config('config.default_academic_session.start_date'))->where('date', '<=', config('config.default_academic_session.end_date'));
    }

    public function scopeDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date', '>=', getStartOfDate($dates['start_date']))->where('date', '<=', getEndOfDate($dates['end_date']));
    }
}