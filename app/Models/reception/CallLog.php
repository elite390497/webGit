<?php

namespace App\Models\Reception;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class CallLog extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'calling_purpose_id',
                            'type',
                            'name',
                            'incoming_number',
                            'outgoing_number',
                            'date',
                            'start_time',
                            'end_time',
                            'description',
                            'user_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array','date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'call_logs';
    protected static $logName = 'call_log';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['call_duration'];

    public function callingPurpose()
    {
        return $this->belongsTo('App\Models\Configuration\Reception\CallingPurpose');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getCallDurationAttribute()
    {
        $start_time = Carbon::parse(toDate($this->date).' '.$this->start_time);
        $end_time = Carbon::parse(toDate($this->date).' '.$this->end_time);

        return $end_time->diff($start_time)->format('%H:%I:%S');
    }

    public function scopeInfo($q)
    {
        return $q->with('callingPurpose', 'user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory');
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

    public function scopeFilterByType($q, $type)
    {
        if (! $type) {
            return $q;
        }

        return $q->where('type', '=', $type);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByIncomingNumber($q, $incoming_number, $s = 0)
    {
        if (! $incoming_number) {
            return $q;
        }

        return ($s) ? $q->where('incoming_number', '=', $incoming_number) : $q->where('incoming_number', 'like', '%'.$incoming_number.'%');
    }

    public function scopeFilterByOutgoingNumber($q, $outgoing_number, $s = 0)
    {
        if (! $outgoing_number) {
            return $q;
        }

        return ($s) ? $q->where('outgoing_number', '=', $outgoing_number) : $q->where('outgoing_number', 'like', '%'.$outgoing_number.'%');
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date', '>=', config('config.default_academic_session.start_date'))->where('date', '<=', config('config.default_academic_session.end_date'));
    }

    public function scopeDateOfCallBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date', '>=', getStartOfDate($dates['start_date']))->where('date', '<=', getEndOfDate($dates['end_date']));
    }
}