<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StockPurchase extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'number',
                            'vendor_id',
                            'date',
                            'description',
                            'user_id',
                            'upload_token',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'stock_purchases';
    protected static $logName = 'stock_purchase';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['total'];

    public function details()
    {
        return $this->hasMany('App\Models\Inventory\StockPurchaseDetail', 'stock_purchase_id');
    }

    public function vendor()
    {
        return $this->belongsTo('App\Models\Inventory\Vendor');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getTotalAttribute()
    {
        return $this->details->sum(function($item) {
            return $item->quantity * $item->unit_price;
        });
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('vendor','details','details.item','user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByNumber($q, $number, $s = 0)
    {
        if (! $number) {
            return $q;
        }

        return ($s) ? $q->where('number', '=', $number) : $q->where('number', 'like', '%'.$number.'%');
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