<?php

namespace App\Models\Finance\Transaction;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Income extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'transaction_category_id',
                            'student_record_id',
                            'employee_id',
                            'user_id',
                            'date_of_income',
                            'amount',
                            'description',
                            'is_cancelled',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_income' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'incomes';
    protected static $logName = 'income';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function transactionCategory()
    {
        return $this->belongsTo('App\Models\Configuration\Finance\Transaction\TransactionCategory');
    }

    public function studentRecord()
    {
        return $this->belongsTo('App\Models\Student\StudentRecord');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function transaction()
    {
        return $this->hasOne('App\Models\Finance\Transaction\Transaction');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('transaction', 'transaction.account', 'transaction.paymentMethod', 'transactionCategory', 'studentRecord', 'studentRecord.batch', 'studentRecord.batch.course', 'employee', 'employee.employeeDesignations', 'employee.employeeDesignations.designation', 'employee.employeeDesignations.designation.employeeCategory', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
    
    public function scopeFilterByUuid($q, $uuid)
    {
        if (! $uuid) {
            return $q;
        }

        return $q->where('uuid', '=', $uuid);
    }

    public function scopeFilterByCancelled($q, $is_cancelled = 0)
    {
        return $q->whereIsCancelled($is_cancelled);
    }
    
    public function scopeFilterByTransactionCategoryId($q, $transaction_category_id)
    {
        if (! $transaction_category_id) {
            return $q;
        }

        return $q->where('transaction_category_id', '=', $transaction_category_id);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date_of_income', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('date_of_income', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }

    public function scopeDateOfIncomeBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_income', '>=', getStartOfDate($dates['start_date']))->where('date_of_income', '<=', getEndOfDate($dates['end_date']));
    }
}
