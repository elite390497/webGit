<?php

namespace App\Models\Transport;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TransportRouteStudent extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'transport_route_detail_id',
                            'student_record_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'transport_route_students';
    protected static $logName = 'transport_route_student';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function transportRouteDetail()
    {
        return $this->belongsTo('App\Models\Transport\TransportRouteDetail');
    }

    public function studentRecord()
    {
        return $this->belongsTo('App\Models\Student\StudentRecord');
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
    
    public function scopeFilterByTransportRouteDetailId($q, $transport_route_detail_id)
    {
        if (! $transport_route_detail_id) {
            return $q;
        }

        return $q->where('transport_route_detail_id', '=', $transport_route_detail_id);
    }
    
    public function scopeFilterByStudentRecordId($q, $student_record_id)
    {
        if (! $student_record_id) {
            return $q;
        }

        return $q->where('student_record_id', '=', $student_record_id);
    }
}
