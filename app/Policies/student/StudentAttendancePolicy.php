<?php

namespace App\Policies\Student;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StudentAttendancePolicy
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
     * Determine whether the user can request pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\StudentAttendance  $student_attendance
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->hasAnyPermission(['list-student-attendance','mark-student-attendance']);
    }

    /**
     * Determine whether the user can mark student attendance
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\StudentAttendance  $student_attendance
     * @return mixed
     */
    public function store(User $user)
    {
        return $user->can('mark-student-attendance') || $user->can('mark-class-teacher-wise-student-attendance');
    }

    /**
     * Determine whether the user can list student attendance
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\StudentAttendance  $student_attendance
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-student-attendance');
    }
}
