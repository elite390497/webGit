<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StockItem extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'code',
                            'opening_quantity',
                            'quantity',
                            'stock_category_id',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'stock_items';
    protected static $logName = 'stock_item';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['net_quantity'];

    public function category()
    {
        return $this->belongsTo('App\Models\Inventory\StockCategory', 'stock_category_id');
    }

    public function getNetQuantityAttribute()
    {
        return $this->opening_quantity + $this->quantity;
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('category');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByCode($q, $code, $s = 0)
    {
        if (! $code) {
            return $q;
        }

        return ($s) ? $q->where('code', '=', $code) : $q->where('code', 'like', '%'.$code.'%');
    }
}
