<?php

namespace App\Models\Configuration\Finance\Transaction;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TransactionCategory extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'type',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'transaction_categories';
    protected static $logName = 'transaction_category';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function incomes()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Income');
    }

    public function expenses()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Expense');
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

    public function scopeFilterByType($q, $type)
    {
        if (! $type) {
            return $q;
        }
        
        return $q->where('type', '=', $type);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
