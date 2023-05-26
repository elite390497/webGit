<?php
namespace App\Models\Configuration;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Locale extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'locale',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'locales';
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logFillable = true;
    protected static $logName = 'locale';
    protected static $logOnlyDirty = true;

    public function getLocaleWithNameAttribute()
    {
        return $this->name.' ('.$this->locale.')';
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeFilterByLocale($q, $locale)
    {
        if (! $locale) {
            return $q;
        }

        return $q->where('locale', '=', $locale);
    }
}
