<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Vendor extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'phone',
                            'alternate_phone',
                            'email',
                            'tax_id',
                            'contact_person',
                            'contact_person_phone',
                            'contact_person_email',
                            'address_line_1',
                            'address_line_2',
                            'city',
                            'state',
                            'zipcode',
                            'country',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'vendors';
    protected static $logName = 'vendor';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function expenses()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Expense');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q;
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

    public function scopeFilterByContactPerson($q, $contact_person, $s = 0)
    {
        if (! $contact_person) {
            return $q;
        }

        return ($s) ? $q->where('contact_person', '=', $contact_person) : $q->where('contact_person', 'like', '%'.$contact_person.'%');
    }
}
