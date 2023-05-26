<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Registration extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'student_id',
                            'date_of_registration',
                            'registration_remarks',
                            'course_id',
                            'registration_fee_status',
                            'status',
                            'review_remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_registration' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'registrations';
    protected static $logName = 'registration';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function student()
    {
        return $this->belongsTo('App\Models\Student\Student');
    }

    public function course()
    {
        return $this->belongsTo('App\Models\Academic\Course');
    }

    public function transactions()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Transaction');
    }

    public function admission()
    {
        return $this->hasOne('App\Models\Student\Admission');
    }

    public function previousInstitute()
    {
        return $this->belongsTo('App\Models\Configuration\Academic\Institute', 'previous_institute_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeFilterBySession($q)
    {
        return $q->whereHas('course', function ($q1) {
            $q1->where('academic_session_id', '=', config('config.default_academic_session.id'));
        });
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByCourseId($q, $course_id)
    {
        if (! $course_id) {
            return $q;
        }

        return $q->where('course_id', '=', $course_id);
    }

    public function scopeFilterByStudentId($q, $student_id)
    {
        if (! $student_id) {
            return $q;
        }

        return $q->where('student_id', '=', $student_id);
    }

    public function scopeFilterByRegistrationStatus($q, $status)
    {
        if (! $status) {
            return $q;
        }

        return $q->where('status', '=', $status);
    }

    public function scopeDateOfRegistrationBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_registration', '>=', getStartOfDate($dates['start_date']))->where('date_of_registration', '<=', getEndOfDate($dates['end_date']));
    }
}
