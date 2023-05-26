<?php

namespace App\Models\Reception;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Enquiry extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'first_guardian_name',
                            'first_guardian_relation',
                            'second_guardian_name',
                            'second_guardian_relation',
                            'third_guardian_name',
                            'third_guardian_relation',
                            'email',
                            'contact_number',
                            'alternate_contact_number',
                            'date_of_enquiry',
                            'enquiry_type_id',
                            'enquiry_source_id',
                            'user_id',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'enquiries';
    protected static $logName = 'enquiry';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function enquiryType()
    {
        return $this->belongsTo('App\Models\Configuration\Reception\EnquiryType');
    }

    public function enquirySource()
    {
        return $this->belongsTo('App\Models\Configuration\Reception\EnquirySource');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function enquiryDetails()
    {
        return $this->hasMany('App\Models\Reception\EnquiryDetail');
    }

    public function enquiryFollowUps()
    {
        return $this->hasMany('App\Models\Reception\EnquiryFollowUp');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('enquiryType', 'enquirySource', 'enquiryDetails', 'enquiryDetails.course', 'enquiryDetails.institute', 'user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory', 'enquiryFollowUps', 'enquiryFollowUps.user', 'enquiryFollowUps.user.employee', 'enquiryFollowUps.user.employee.employeeDesignations', 'enquiryFollowUps.user.employee.employeeDesignations.designation', 'enquiryFollowUps.user.employee.employeeDesignations.designation.employeeCategory');
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

    public function scopeFilterByFirstGuardianName($q, $first_guardian_name, $s = 0)
    {
        if (! $first_guardian_name) {
            return $q;
        }

        return ($s) ? $q->where('first_guardian_name', '=', $first_guardian_name) : $q->where('first_guardian_name', 'like', '%'.$first_guardian_name.'%');
    }

    public function scopeFilterBySecondGuardianName($q, $second_guardian_name, $s = 0)
    {
        if (! $second_guardian_name) {
            return $q;
        }

        return ($s) ? $q->where('second_guardian_name', '=', $second_guardian_name) : $q->where('second_guardian_name', 'like', '%'.$second_guardian_name.'%');
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date_of_enquiry', '>=', config('config.default_academic_session.start_date'))->where('date_of_enquiry', '<=', config('config.default_academic_session.end_date'));
    }

    public function scopeDateOfEnquiryBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_enquiry', '>=', getStartOfDate($dates['start_date']))->where('date_of_enquiry', '<=', getEndOfDate($dates['end_date']));
    }
}
