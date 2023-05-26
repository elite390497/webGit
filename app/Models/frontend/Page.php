<?php

namespace App\Models\Frontend;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Page extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'body',
                            'is_draft',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'frontend_pages';
    protected static $logName = 'frontend_page';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['excerpt'];

    public function menu()
    {
        return $this->hasOne('App\Models\Frontend\Menu', 'frontend_page_id');
    }
    
    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getExcerptAttribute()
    {
        return createExcerpt(isset($this->attributes['body']) ? $this->attributes['body'] : '');
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

    public function scopeFilterByIsDraft($q, $is_draft)
    {
        return $q->where('is_draft', '=', $is_draft);
    }

    public function scopeFilterByTitle($q, $title, $strict = 0)
    {
        if (! $title) {
            return $q;
        }

        return ($strict) ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }
}
