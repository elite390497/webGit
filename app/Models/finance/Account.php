<?php

namespace App\Models\Finance;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Account extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'is_active',
                            'is_default',
                            'prefix',
                            'type',
                            'opening_balance',
                            'bank_name',
                            'branch_name',
                            'bank_identification_code',
                            'account_number',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'accounts';
    protected static $logName = 'account';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function transactions()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Transaction');
    }

    public function toAccountTransfers()
    {
        return $this->hasMany('App\Models\Finance\Transaction\AccountTransfer', 'to_account_id');
    }

    public function fromAccountTransfers()
    {
        return $this->hasMany('App\Models\Finance\Transaction\AccountTransfer', 'from_account_id');
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

    public function scopeFilterByIsActive($q, $is_active)
    {
        return $q->where('is_active', '=', $is_active);
    }

    public function scopeFilterByName($q, $name, $strict = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($strict) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
