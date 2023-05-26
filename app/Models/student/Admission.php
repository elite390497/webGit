<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Admission extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'prefix',
                            'number',
                            'academic_session_id',
                            'registration_id',
                            'batch_id',
                            'date_of_admission',
                            'admission_remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_admission' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'admissions';
    protected static $logName = 'admission';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['admission_number'];
    
    public function academicSession()
    {
        return $this->belongsTo('App\Models\Academic\AcademicSession');
    }

    public function registration()
    {
        return $this->belongsTo('App\Models\Student\Registration');
    }

    public function batch()
    {
        return $this->belongsTo('App\Models\Academic\Batch');
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

    public function getAdmissionNumberAttribute()
    {
        return ($this->prefix).str_pad($this->number, config('config.admission_number_digit'), '0', STR_PAD_LEFT);
    }
    
    public function scopeFilterByNumber($q, $number)
    {
        if (! $number) {
            return $q;
        }

        return $q->where('number', '=', $number);
    }
    
    public function scopeFilterByPrefix($q, $prefix)
    {
        if (! $prefix) {
            return $q;
        }

        return $q->where('prefix', '=', $prefix);
    }
}
