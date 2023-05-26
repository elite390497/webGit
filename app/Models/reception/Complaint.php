<?php

namespace App\Models\Reception;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Complaint extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'complaint_type_id',
                            'complainant_name',
                            'complainant_contact_number',
                            'complainant_address',
                            'description',
                            'date_of_complaint',
                            'employee_id',
                            'action',
                            'date_of_resolution',
                            'remarks',
                            'user_id',
                            'upload_token',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'complaints';
    protected static $logName = 'complaint';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }

    public function complaintType()
    {
        return $this->belongsTo('App\Models\Configuration\Reception\ComplaintType');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('complaintType','user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory',
            'employee', 'employee.employeeDesignations', 'employee.employeeDesignations.designation', 'employee.employeeDesignations.designation.employeeCategory');
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

    public function scopeFilterByComplainantName($q, $complainant_name, $s = 0)
    {
        if (! $complainant_name) {
            return $q;
        }

        return ($s) ? $q->where('complainant_name', '=', $complainant_name) : $q->where('complainant_name', 'like', '%'.$complainant_name.'%');
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date_of_complaint', '>=', config('config.default_academic_session.start_date'))->where('date_of_complaint', '<=', config('config.default_academic_session.end_date'));
    }

    public function scopeDateOfComplaintBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_complaint', '>=', getStartOfDate($dates['start_date']))->where('date_of_complaint', '<=', getEndOfDate($dates['end_date']));
    }

    public function scopeDateOfResolutionBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_resolution', '>=', getStartOfDate($dates['start_date']))->where('date_of_resolution', '<=', getEndOfDate($dates['end_date']));
    }
}