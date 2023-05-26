<?php

namespace App\Models\Reception;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class PostalRecord extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'type',
                            'sender_title',
                            'sender_address',
                            'receiver_title',
                            'receiver_address',
                            'reference_number',
                            'is_confidential',
                            'date',
                            'description',
                            'user_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'postal_records';
    protected static $logName = 'postal_record';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory');
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

    public function scopeFilterBySender($q, $sender)
    {
        if (! $sender) {
            return $q;
        }

        return $q->where(function($q1) use($sender) {
            $q1->where('sender_title', 'like', '%'.$sender.'%')->orWhere('sender_address', 'like', '%'.$sender.'%');
        });
    }

    public function scopeFilterByReceiver($q, $receiver, $s = 0)
    {
        if (! $receiver) {
            return $q;
        }

        return $q->where(function($q1) use($receiver) {
            $q1->where('receiver_title', 'like', '%'.$receiver.'%')->orWhere('receiver_address', 'like', '%'.$receiver.'%');
        });
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date', '>=', config('config.default_academic_session.start_date'))->where('date', '<=', config('config.default_academic_session.end_date'));
    }

    public function scopeDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date', '>=', getStartOfDate($dates['start_date']))->where('date', '<=', getEndOfDate($dates['end_date']));
    }
}