<?php

namespace App\Models\Configuration\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Institute extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'contact_number',
                            'alternate_contact_number',
                            'principal_name',
                            'website',
                            'address',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'institutes';
    protected static $logName = 'institute';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function registrations()
    {
        return $this->hasMany('App\Models\Student\Registration', 'previous_institute_id');
    }

    public function enquiryDetails()
    {
        return $this->hasMany('App\Models\Reception\EnquiryDetail');
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

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
