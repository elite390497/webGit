<?php

namespace App\Models\Utility;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class IpFilter extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'start_ip',
                            'end_ip',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'ip_filters';
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logFillable  = true;
    protected static $logName = 'ip_filter';
    protected static $logOnlyDirty = true;

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }
}
