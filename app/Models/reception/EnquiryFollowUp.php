<?php

namespace App\Models\Reception;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class EnquiryFollowUp extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'enquiry_id',
                            'date_of_follow_up',
                            'status',
                            'date_of_next_follow_up',
                            'user_id',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_follow_up' => 'date', 'date_of_next_follow_up' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'enquiry_follow_ups';
    protected static $logName = 'enquiry_follow_up';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function enquiry()
    {
        return $this->belongsTo('App\Models\Reception\Enquiry');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
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

    public function scopeFilterByEnquiryId($q, $enquiry_id)
    {
        if (! $enquiry_id) {
            return $q;
        }

        return $q->where('enquiry_id', '=', $enquiry_id);
    }
}
