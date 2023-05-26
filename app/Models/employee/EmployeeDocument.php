<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class EmployeeDocument extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'description',
                            'employee_id',
                            'employee_document_type_id',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'employee_documents';
    protected static $logName = 'employee';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function employeeDocumentType()
    {
        return $this->belongsTo('App\Models\Configuration\Employee\EmployeeDocumentType');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
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

    public function scopeFilterByEmployeeId($q, $employee_id)
    {
        if (! $employee_id) {
            return $q;
        }

        return $q->where('employee_id', '=', $employee_id);
    }

    public function scopeFilterByEmployeeDocumentTypeId($q, $employee_document_type_id)
    {
        if (! $employee_document_type_id) {
            return $q;
        }

        return $q->where('employee_document_type_id', '=', $employee_document_type_id);
    }

    public function scopeFilterByTitle($q, $title, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return $s ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }
}
