<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['slug','type'];

    public function instituteDocuments()
    {
        return $this->morphedByMany('App\Models\Institute\Document', 'taggable');
    }

    public function scopeFilterByType($q, $type = null)
    {
    	return $q->whereType($type);
    }
}