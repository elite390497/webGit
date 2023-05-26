<?php

namespace App\Policies\Employee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttendancePolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine whether the user can fetch attendance pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Attendance  $attendance
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('mark-employee-attendance') || $user->can('list-employee-attendance');
    }

    /**
     * Determine whether the user can list the attendance.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Attendance  $attendance
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-employee-attendance');
    }

    /**
     * Determine whether the user can mark attendance
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Attendance  $attendance
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('mark-employee-attendance');
    }
}
