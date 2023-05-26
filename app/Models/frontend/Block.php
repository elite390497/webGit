<?php

namespace App\Models\Frontend;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Block extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'body',
                            'frontend_menu_id',
                            'url',
                            'is_draft',
                            'featured_image',
                            'icon',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'frontend_blocks';
    protected static $logName = 'frontend_block';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['excerpt'];

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getExcerptAttribute()
    {
        return createExcerpt($this->attributes['body']);
    }

    public function menu()
    {
        return $this->belongsTo('App\Models\Frontend\Menu', 'frontend_menu_id');
    }

    public function scopeInfo($q)
    {
        return $q->with('menu');
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
