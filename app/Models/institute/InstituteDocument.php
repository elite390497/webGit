<?php

namespace App\Models\Institute;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class InstituteDocument extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'date_of_expiry',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'institute_documents';
    protected static $logName = 'institute_document';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function tags()
    {
        return $this->morphToMany('App\Models\Tag', 'taggable');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('tags');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByTitle($q, $title, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return $s ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }

    public function scopeFilterByKeyword($q, $keyword)
    {
        if (! $keyword) {
            return $q;
        }

        return $q->where(function ($q1) use ($keyword) {
            $q1->where('title', 'like', '%'.$keyword.'%')->where('description', 'like', '%'.$keyword.'%');
        });
    }
}