<?php

namespace App\Models\Finance\Transaction;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class AccountTransfer extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'from_account_id',
                            'to_account_id',
                            'user_id',
                            'date_of_account_transfer',
                            'amount',
                            'description',
                            'is_cancelled',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_account_transfer' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'account_transfers';
    protected static $logName = 'account_transfer';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function fromAccount()
    {
        return $this->belongsTo('App\Models\Finance\Account', 'from_account_id');
    }

    public function toAccount()
    {
        return $this->belongsTo('App\Models\Finance\Account', 'to_account_id');
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
        return $q->with('fromAccount', 'toAccount', 'transaction', 'transaction', 'transaction.paymentMethod', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory');
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

    public function scopeFilterBySession($q)
    {
        return $q->where('date_of_account_transfer', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('date_of_account_transfer', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }

    public function scopeDateOfAccountTransferBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_account_transfer', '>=', getStartOfDate($dates['start_date']))->where('date_of_account_transfer', '<=', getEndOfDate($dates['end_date']));
    }
}
