<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Certificate extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'certificate_type_id',
                            'studdent_record_id',
                            'employee_id',
                            'date_of_certificate',
                            'body',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_certificate' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'certificates';
    protected static $logName = 'certificate';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function certificateTemplate()
    {
        return $this->belongsTo('App\Models\Configuration\Academic\CertificateTemplate');
    }

    public function studentRecord()
    {
        return $this->belongsTo('App\Models\Student\StudentRecord');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with(['certificateTemplate','studentRecord','studentRecord.batch','studentRecord.batch.course','studentRecord.student','studentRecord.student.parent','studentRecord.admission','employee','employee.employeeDesignations','employee.employeeDesignations.designation','employee.employeeDesignations.designation.employeeCategory','employee.employeeTerms']);
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

    public function scopeFilterByCertificateTypeId($q, $certificate_type_id)
    {
        if (! $certificate_type_id) {
            return $q;
        }

        return $q->where('certificate_type_id', '=', $certificate_type_id);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date_of_certificate', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('date_of_certificate', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }

    public function scopeDateOfCertificateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_certificate', '>=', getStartOfDate($dates['start_date']))->where('date_of_certificate', '<=', getEndOfDate($dates['end_date']));
    }
}
