<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StockTransferReturn extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'stock_transfer_id',
                            'stock_item_id',
                            'type',
                            'quantity',
                            'description',
                            'user_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'stock_transfer_returns';
    protected static $logName = 'stock_purhcase_return';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function transfer()
    {
        return $this->belongsTo('App\Models\Inventory\StockTransfer', 'stock_transfer_id');
    }

    public function item()
    {
        return $this->belongsTo('App\Models\Inventory\StockItem', 'stock_item_id');
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
        return $q->with('items');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
}