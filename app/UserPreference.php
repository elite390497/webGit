<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class UserPreference extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'color_theme',
                            'sidebar',
                            'locale',
                            'direction',
                            'academic_session_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'user_preferences';
    protected static $logName = 'user_preference';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function academicSession()
    {
        return $this->belongsTo('App\Models\Academic\AcademicSession');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }
}
