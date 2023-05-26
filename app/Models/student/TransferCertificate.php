<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TransferCertificate extends Model
{
    use LogsActivity;

    protected $fillable = ['student_record_id'];
    protected $casts = ['options' => 'array', 'date_of_application' => 'date', 'date_of_issue' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'transfer_certificates';
    protected static $logName = 'transfer_certificate';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function record()
    {
        return $this->belongsTo('App\Models\Student\StudentRecord', 'student_record_id');
    }

    public function getTransferCertificateNumberAttribute()
    {
        return ($this->prefix).str_pad($this->number, config('config.transfer_certificate_digit'), '0', STR_PAD_LEFT);
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
    
    public function scopeFilterByUuid($q, $uuid)
    {
        if (! $uuid) {
            return $q;
        }

        return $q->where('uuid', '=', $uuid);
    }
    
    public function scopeFilterByPrefix($q, $prefix)
    {
        if (! $prefix) {
            return $q;
        }

        return $q->where('prefix', '=', $prefix);
    }
    
    public function scopeFilterByNumber($q, $number)
    {
        if (! $number) {
            return $q;
        }

        return $q->where('number', '=', $number);
    }
    
    public function scopeFilterByStudentRecordId($q, $student_record_id)
    {
        if (! $student_record_id) {
            return $q;
        }

        return $q->where('student_record_id', '=', $student_record_id);
    }
}
