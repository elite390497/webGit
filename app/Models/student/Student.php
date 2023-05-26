<?php

namespace App\Models\Student;

use App\Helper\Cal;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Student extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'user_id',
                            'student_parent_id',
                            'status',
                            'first_name',
                            'middle_name',
                            'last_name',
                            'date_of_birth',
                            'birth_place',
                            'gender',
                            'contact_number',
                            'email',
                            'nationality',
                            'blood_group_id',
                            'religion_id',
                            'category_id',
                            'caste_id',
                            'student_photo',
                            'mother_tongue',
                            'unique_identification_number',
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
    protected $casts = ['options' => 'array', 'date_of_birth' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'students';
    protected static $logName = 'student';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['present_address','permanent_address','name', 'age'];
    
    public function parent()
    {
        return $this->belongsTo('App\Models\Student\StudentParent', 'student_parent_id');
    }

    public function studentGroups()
    {
        return $this->belongsToMany('App\Models\Configuration\Student\StudentGroup', 'student_group_collection', 'student_id', 'student_group_id');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
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

    public function registrations()
    {
        return $this->hasMany('App\Models\Student\Registration');
    }

    public function studentRecords()
    {
        return $this->hasMany('App\Models\Student\StudentRecord');
    }

    public function siblings()
    {
        return $this->hasMany('App\Models\Student\StudentSibling', 'student_id');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getNameAttribute()
    {
        return $this->first_name.($this->middle_name ? (' '.$this->middle_name) : '').($this->last_name ? (' '.$this->last_name) : '');
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

    public function getAgeAttribute()
    {
        return $this->date_of_birth ? Cal::getAge($this->date_of_birth) : null;
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
    
    public function scopeFilterByContactNumber($q, $contact_number, $strict = 0)
    {
        if (! $contact_number) {
            return $q;
        }

        return ($strict) ? $q->where('contact_number', '=', $contact_number) : $q->where('contact_number', 'like', '%'.$contact_number.'%');
    }
    
    public function scopeFilterByBloodGroupId($q, $blood_group_id)
    {
        if (! $blood_group_id) {
            return $q;
        }

        return $q->where('blood_group_id', '=', $blood_group_id);
    }
    
    public function scopeFilterByReligionId($q, $religion_id)
    {
        if (! $religion_id) {
            return $q;
        }

        return $q->where('religion_id', '=', $religion_id);
    }
    
    public function scopeFilterByDateOfBirth($q, $date_of_birth)
    {
        if (! $date_of_birth) {
            return $q;
        }

        return $q->where('date_of_birth', '=', $date_of_birth);
    }
    
    public function scopeFilterByCasteId($q, $caste_id)
    {
        if (! $caste_id) {
            return $q;
        }

        return $q->where('caste_id', '=', $caste_id);
    }
    
    public function scopeFilterByCategoryId($q, $category_id)
    {
        if (! $category_id) {
            return $q;
        }

        return $q->where('category_id', '=', $category_id);
    }

    public function scopeDateOfBirthBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_birth', '>=', getStartOfDate($dates['start_date']))->where('date_of_birth', '<=', getEndOfDate($dates['end_date']));
    }
}
