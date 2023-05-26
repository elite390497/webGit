<?php

namespace App\Policies\Student;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StudentPolicy
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
     * Determine whether the user can fetch student pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\Student  $student
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('edit-student');
    }

    /**
     * Determine whether the user can list the student.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\Student  $student
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-student') || $user->can('list-class-teacher-wise-student');
    }

    /**
     * Determine whether the user can view the student.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\Student  $student
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-student') || $user->can('list-class-teacher-wise-student');
    }

    /**
     * Determine whether the user can update the student.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\Student  $student
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-student');
    }

    /**
     * Determine whether the user can search the student.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\Student  $student
     * @return mixed
     */
    public function search(User $user)
    {
        return $user->hasAnyPermission(['issue-book','create-certificate']);
    }

    /**
     * Determine whether the user can update student & parent login detail.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Student\Student  $student
     * @return mixed
     */
    public function updateUserLogin(User $user)
    {
        return $user->can('edit-student');
    }
}
