<?php

namespace App\Models\Frontend;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Menu extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'slug',
                            'type',
                            'parent_id',
                            'position',
                            'frontend_page_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'frontend_menus';
    protected static $logName = 'frontend_menu';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function parentMenu()
    {
        return $this->belongsTo('App\Models\Frontend\Menu', 'parent_id');
    }

    public function children()
    {
        return $this->hasMany('App\Models\Frontend\Menu', 'parent_id');
    }

    public function page()
    {
        return $this->belongsTo('App\Models\Frontend\Page', 'frontend_page_id');
    }
    
    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfoWithPageDetail($q)
    {
        return $q->with(['page:','children' => function($q) {
            $q->orderby('position','asc');
        } ,'children.page']);
    }

    public function scopeInfo($q)
    {
        return $q->with(['page:id,title,is_draft','children' => function($q) {
            $q->orderby('position','asc');
        } ,'children.page:id,title,is_draft']);
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByParentId($q, $parent_id)
    {
        if (! $parent_id) {
            return $q;
        }

        return $q->where('parent_id', '=', $parent_id);
    }

    public function scopeMainMenu($q)
    {
        return $q->whereNull('parent_id');
    }

    public function scopeHeaderOrFooterMenu($q)
    {
        return $q->where(function($q1) {
            $q1->where('type','header')->orWhere('type','footer');
        });
    }

    public function scopeFilterByName($q, $name, $strict = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($strict) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByType($q, $type)
    {
        if (! $type) {
            return $q;
        }

        return $q->where('type', '=', $type);
    }

    public function scopeFilterBySlug($q, $slug)
    {
        if (! $slug) {
            return $q;
        }

        return $q->where('slug', '=', $slug);
    }
}
