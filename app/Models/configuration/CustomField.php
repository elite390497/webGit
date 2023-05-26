<?php

namespace App\Models\Configuration;

use Illuminate\Database\Eloquent\Model;

class CustomField extends Model
{
    protected $fillable = [
        'form',
        'name',
        'type',
        'is_required',
        'values'
    ];
    protected $hidden = [];
    protected $casts = ['options' => 'array','values' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'custom_fields';

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getValue(string $value)
    {
        return array_get($this->values, $value);
    }

    public function scopeFilterByForm($q, $form, $s = 0)
    {
        if (! $form) {
            return $q;
        }

        return ($s) ? $q->where('form', '=', $form) : $q->where('form', 'like', '%'.$form.'%');
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeFilterByType($q, $type, $s = 0)
    {
        if (! $type) {
            return $q;
        }

        return ($s) ? $q->where('type', '=', $type) : $q->where('type', 'like', '%'.$type.'%');
    }
}