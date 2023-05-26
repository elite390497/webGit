<?php

namespace App\Models\Finance\Fee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class FeeGroup extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'name',
                            'description',
                            'academic_session_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'fee_groups';
    protected static $logName = 'fee_group';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function academicSession()
    {
        return $this->belongsTo('App\Models\Academic\AcademicSession');
    }

    public function feeHeads()
    {
        return $this->hasMany('App\Models\Finance\Fee\FeeHead');
    }

    public function feeAllocationGroups()
    {
        return $this->hasMany('App\Models\Finance\Fee\FeeAllocationGroup');
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

    public function scopeFilterBySession($q, $session_id = null)
    {
        return $q->where('academic_session_id', '=', $session_id ? : config('config.default_academic_session.id'));
    }

    public function scopeFilterByAcademicSessionId($q, $academic_session_id)
    {
        if (! $academic_session_id) {
            return $q;
        }

        return $q->where('academic_session_id', '=', $academic_session_id);
    }

    public function scopeFilterByName($q, $name, $s = 0)
    {
        if (! $name) {
            return $q;
        }

        return $s ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }
}
