<?php

namespace App\Models\Employee;

use App\Helper\Cal;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
                            'user_id',
                            'code',
                            'first_name',
                            'middle_name',
                            'last_name',
                            'date_of_birth',
                            'date_of_anniversary',
                            'birth_place',
                            'gender',
                            'marital_status',
                            'contact_number',
                            'alternate_contact_number',
                            'email',
                            'alternate_email',
                            'nationality',
                            'blood_group_id',
                            'religion_id',
                            'category_id',
                            'caste_id',
                            'photo',
                            'mother_tongue',
                            'unique_identification_number',
                            'father_name',
                            'mother_name',
                            'spouse_name',
                            'emergency_contact_name',
                            'emergency_contact_number',
                            'present_address_line_1',
                            'present_address_line_2',
                            'present_city',
                            'present_state',
                            'present_zipcode',
                            'present_country',
                            'permanent_address_line_1',
                            'permanent_address_line_2',
                            'permanent_city',
                            'permanent_state',
                            'permanent_zipcode',
                            'permanent_country',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_birth' => 'date', 'date_of_anniversary' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'employees';
    protected static $logName = 'student';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['present_address','permanent_address','name', 'age', 'employee_code'];
    
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function employeeGroups()
    {
        return $this->belongsToMany('App\Models\Configuration\Employee\EmployeeGroup', 'employee_group_collection', 'employee_id', 'employee_group_id');
    }

    public function bloodGroup()
    {
        return $this->belongsTo('App\Models\Configuration\Misc\BloodGroup');
    }

    public function religion()
    {
        return $this->belongsTo('App\Models\Configuration\Misc\Religion');
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Configuration\Misc\Category');
    }

    public function caste()
    {
        return $this->belongsTo('App\Models\Configuration\Misc\Caste');
    }

    public function employeeTerms()
    {
        return $this->hasMany('App\Models\Employee\EmployeeTerm');
    }

    public function employeeDesignations()
    {
        return $this->hasMany('App\Models\Employee\EmployeeDesignation');
    }

    public function classTeachers()
    {
        return $this->hasMany('App\Models\Academic\ClassTeacher');
    }

    public function transactions()
    {
        return $this->hasMany('App\Models\Finance\Transaction\Transaction');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getEmployeeCodeAttribute()
    {
        return $this->prefix.str_pad($this->code, config('config.employee_code_digit'), '0', STR_PAD_LEFT);
    }

    public function getNameAttribute()
    {
        return $this->first_name.' '.($this->middle_name ? ($this->middle_name.' ') : '').$this->last_name;
    }

    public function getAgeAttribute()
    {
        return $this->date_of_birth ? Cal::getAge($this->date_of_birth) : null;
    }

    public function getNameWithCodeAttribute()
    {
        return $this->name.' ('.$this->employee_code.')';
    }

    public function getPresentAddressAttribute()
    {
        $data= array(
            $this->present_address_line_1,
            $this->present_address_line_2,
            $this->present_city,
            $this->present_state,
            $this->present_zipcode,
            $this->present_country
        );

        $data = array_filter($data);

        return implode(', ', $data);
    }

    public function getPermanentAddressAttribute()
    {
        $data= array(
            $this->permanent_address_line_1,
            $this->permanent_address_line_2,
            $this->permanent_city,
            $this->permanent_state,
            $this->permanent_zipcode,
            $this->permanent_country
        );

        $data = array_filter($data);

        return implode(', ', $data);
    }

    public function scopeInfo($q)
    {
        return $q->with(['caste:id,name','category:id,name','religion:id,name','bloodGroup:id,name','employeeTerms' => function ($q1) {
            $q1->where('date_of_joining', '<=', date('Y-m-d'))->orderBy('date_of_joining', 'desc');
        },'employeeDesignations' => function ($q2) {
            $q2->where('date_effective', '<=', date('Y-m-d'))->orderBy('date_effective', 'desc');
        },'employeeDesignations.department','employeeDesignations.designation','employeeDesignations.designation.employeeCategory','user','user.roles']);
    }

    public function scopeSummary($q)
    {
        return $q->select('id','code','prefix','first_name','middle_name','last_name')->with([
            'employeeDesignations:id,employee_id,designation_id,department_id,date_effective,date_end',
            'employeeDesignations.designation:id,name,employee_category_id',
            'employeeDesignations.designation.employeeCategory:id,name',
            'employeeDesignations.department:id,name'
        ]);
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
    
    public function scopeFilterByCode($q, $code)
    {
        if (! $code) {
            return $q;
        }

        return $q->where('code', '=', $code);
    }
    
    public function scopeFilterByPrefix($q, $prefix)
    {
        if (! $prefix) {
            return $q;
        }

        return $q->where('prefix', '=', $prefix);
    }
    
    public function scopeFilterByFirstName($q, $first_name, $strict = 0)
    {
        if (! $first_name) {
            return $q;
        }

        return ($strict) ? $q->where('first_name', '=', $first_name) : $q->where('first_name', 'like', '%'.$first_name.'%');
    }
    
    public function scopeFilterByMiddleName($q, $middle_name, $strict = 0)
    {
        if (! $middle_name) {
            return $q;
        }

        return ($strict) ? $q->where('middle_name', '=', $middle_name) : $q->where('middle_name', 'like', '%'.$middle_name.'%');
    }
    
    public function scopeFilterByLastName($q, $last_name, $strict = 0)
    {
        if (! $last_name) {
            return $q;
        }

        return ($strict) ? $q->where('last_name', '=', $last_name) : $q->where('last_name', 'like', '%'.$last_name.'%');
    }
    
    public function scopeFilterByFatherName($q, $father_name, $strict = 0)
    {
        if (! $father_name) {
            return $q;
        }

        return ($strict) ? $q->where('father_name', '=', $father_name) : $q->where('father_name', 'like', '%'.$father_name.'%');
    }
    
    public function scopeFilterBySpouseName($q, $spouse_name, $strict = 0)
    {
        if (! $spouse_name) {
            return $q;
        }

        return ($strict) ? $q->where('spouse_name', '=', $spouse_name) : $q->where('spouse_name', 'like', '%'.$spouse_name.'%');
    }
    
    public function scopeFilterByDOB($q, $date_of_birth)
    {
        if (! $date_of_birth) {
            return $q;
        }

        return $q->where('date_of_birth', '=', $date_of_birth);
    }
}
