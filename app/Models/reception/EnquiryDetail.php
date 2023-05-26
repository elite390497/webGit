<?php

namespace App\Models\Reception;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class EnquiryDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'enquiry_id',
                            'student_name',
                            'gender',
                            'date_of_birth',
                            'course_id',
                            'institute_id',
                            'is_admitted',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_birth' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'enquiry_details';
    protected static $logName = 'enquiry_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function enquiry()
    {
        return $this->belongsTo('App\Models\Reception\Enquiry');
    }

    public function course()
    {
        return $this->belongsTo('App\Models\Academic\Course');
    }

    public function institute()
    {
        return $this->belongsTo('App\Models\Configuration\Academic\Institute');
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
}
