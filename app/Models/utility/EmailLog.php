<?php

namespace App\Models\Utility;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class EmailLog extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'module',
                            'module_id',
                            'to_address',
                            'from_address',
                            'subject',
                            'body',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'email_logs';
    protected static $logAttributes = ['*'];
    protected static $logName = 'email_log';

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }
    
    public function scopeCreatedAtDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('created_at', '>=', getStartOfDate($dates['start_date']))->where('created_at', '<=', getEndOfDate($dates['end_date']));
    }
}
