<?php

namespace App\Models\Reception;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class VisitorMessage extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'email',
                            'contact_number',
                            'subject',
                            'message',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'visitor_messages';
    protected static $logName = 'visitor_message';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

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
    
    public function scopeFilterByName($q, $name, $strict = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($strict) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
    
    public function scopeFilterByEmail($q, $email, $strict = 0)
    {
        if (! $email) {
            return $q;
        }

        return ($strict) ? $q->where('email', '=', $email) : $q->where('email', 'like', '%'.$email.'%');
    }

    public function scopeDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('created_at', '>=', getStartOfDate($dates['start_date']))->where('created_at', '<=', getEndOfDate($dates['end_date']));
    }
}
