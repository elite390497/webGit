<?php

namespace App\Models\Transport;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TransportCircle extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'academic_session_id',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'transport_circles';
    protected static $logName = 'transport_circle';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function academicSession()
    {
        return $this->belongsTo('App\Models\Academic\AcademicSession');
    }

    public function transportFeeDetails()
    {
        return $this->hasMany('App\Models\Transport\TransportFeeDetail');
    }

    public function studentFeeRecords()
    {
        return $this->hasMany('App\Models\Student\StudentFeeRecord');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeFilterBySession($q, $session_id = null)
    {
        return $q->where('academic_session_id', '=', $session_id ? : config('config.default_academic_session.id'));
    }
    
    public function scopeFilterByAcademicSessionId($q, $academic_session_id)
    {
        if (! $academic_session_id) {
            return $q;
        }

        return $q->where('academic_session_id', '=', $academic_session_id);
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

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
