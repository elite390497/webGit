<?php

namespace App\Models\Configuration\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Department extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'departments';
    protected static $logName = 'department';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];

    public function employeeDesignations()
    {
        return $this->hasMany('App\Models\Employee\EmployeeDesignation');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
