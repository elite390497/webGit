<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentParent extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'user_id',
                            'first_guardian_name',
                            'first_guardian_date_of_birth',
                            'first_guardian_qualification',
                            'first_guardian_occupation',
                            'first_guardian_annual_income',
                            'first_guardian_email',
                            'first_guardian_contact_number_1',
                            'first_guardian_contact_number_2',
                            'first_guardian_photo',
                            'first_guardian_unique_identification_number',
                            'second_guardian_name',
                            'second_guardian_date_of_birth',
                            'second_guardian_qualification',
                            'second_guardian_occupation',
                            'second_guardian_annual_income',
                            'second_guardian_email',
                            'second_guardian_contact_number_1',
                            'second_guardian_contact_number_2',
                            'second_guardian_photo',
                            'second_guardian_unique_identification_number',
                            'third_guardian_name',
                            'third_guardian_relation',
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
    protected $casts = ['options' => 'array', 'first_guardian_date_of_birth' => 'date', 'second_guardian_date_of_birth' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'student_parents';
    protected static $logName = 'student_parent';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['father_name', 'mother_name', 'spouse_name'];
    
    public function students()
    {
        return $this->hasMany('App\Models\Student\Student');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getFatherNameAttribute()
    {
        if ($this->first_guardian_relation == 'father') {
            return $this->first_guardian_name;
        } else if ($this->second_guardian_relation == 'father') {
            return $this->second_guardian_name;
        } else if ($this->third_guardian_relation == 'father') {
            return $this->third_guardian_name;
        } else {
            return;
        }
    }

    public function getMotherNameAttribute()
    {
        if ($this->first_guardian_relation == 'mother') {
            return $this->first_guardian_name;
        } else if ($this->second_guardian_relation == 'mother') {
            return $this->second_guardian_name;
        } else if ($this->third_guardian_relation == 'mother') {
            return $this->third_guardian_name;
        } else {
            return;
        }
    }

    public function getSpouseNameAttribute()
    {
        if ($this->first_guardian_relation == 'spouse') {
            return $this->first_guardian_name;
        } else if ($this->second_guardian_relation == 'spouse') {
            return $this->second_guardian_name;
        } else if ($this->third_guardian_relation == 'spouse') {
            return $this->third_guardian_name;
        } else {
            return;
        }
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
    
    public function scopeFilterByFirstGuardianName($q, $first_guardian_name, $strict = 0)
    {
        if (! $first_guardian_name) {
            return $q;
        }

        return ($strict) ? $q->where('first_guardian_name', '=', $first_guardian_name) : $q->where('first_guardian_name', 'like', '%'.$first_guardian_name.'%');
    }
    
    public function scopeFilterBySecondGuardianName($q, $second_guardian_name, $strict = 0)
    {
        if (! $second_guardian_name) {
            return $q;
        }

        return ($strict) ? $q->where('second_guardian_name', '=', $second_guardian_name) : $q->where('second_guardian_name', 'like', '%'.$second_guardian_name.'%');
    }
    
    public function scopeFilterByFirstGuardianContactNumber1($q, $first_guardian_contact_number_1)
    {
        if (! $first_guardian_contact_number_1) {
            return $q;
        }

        return $q->where('first_guardian_contact_number_1', '=', $first_guardian_contact_number_1);
    }
}
