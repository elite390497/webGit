<?php

namespace App;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable,HasRoles;
    
    protected $guard_name = 'api';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'username', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token','activation_token'
    ];
    
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function student()
    {
        return $this->hasOne('App\Models\Student\Student');
    }

    public function parent()
    {
        return $this->hasOne('App\Models\Student\StudentParent');
    }

    public function employee()
    {
        return $this->hasOne('App\Models\Employee\Employee');
    }

    public function userPreference()
    {
        return $this->hasOne('App\UserPreference');
    }

    public function getProfile()
    {
        if ($this->hasRole(config('system.default_role.student'))) {
            $profile = $this->Student;
        } else if ($this->hasRole(config('system.default_role.parent'))) {
            $profile = $this->Parent;
        } else {
            $profile = $this->Employee;
        }

        return $profile;
    }

    public function getNameAttribute()
    {
        $profile = $this->getProfile();

        if ($profile->first_guardian_name) {
            return $profile->first_guardian_name;
        }

        return $profile->first_name.' '.$profile->middle_name.' '.$profile->last_name;
    }

    public function getNameWithEmailAttribute()
    {
        $profile = $this->getProfile();

        if ($profile->first_guardian_name) {
            return $profile->first_guardian_name.' ('.$this->email.')';
        }

        return $profile->first_name.' '.$profile->middle_name.' '.$profile->last_name.' ('.$this->email.')';
    }

    public function scopeFilterByEmail($q, $email = null, $s = 0)
    {
        if (! $email) {
            return $q;
        }

        return ($s) ? $q->where('email', '=', $email) : $q->where('email', 'like', '%'.$email.'%');
    }

    public function scopeFilterByUsername($q, $username = null, $s = 0)
    {
        if (! $username) {
            return $q;
        }
        
        return ($s) ? $q->where('username', '=', $username) : $q->where('username', 'like', '%'.$username.'%');
    }

    public function scopeFilterByRoleId($q, $role_id = null)
    {
        if (! $role_id) {
            return $q;
        }

        return $q->whereHas('roles', function ($q) use ($role_id) {
            $q->where('role_id', '=', $role_id);
        });
    }

    public function scopeFilterByStatus($q, $status = null)
    {
        if (! $status) {
            return $q;
        }

        return $q->where('status', '=', $status);
    }

    public function scopeCreatedAtDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('created_at', '>=', getStartOfDate($dates['start_date']))->where('created_at', '<=', getEndOfDate($dates['end_date']));
    }
}
