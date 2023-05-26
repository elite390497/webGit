<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubjectTeacherPolicy
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
     * Determine whether the user can list all the subject teacher.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\SubjectTeacher  $subject_teacher
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-subject-teacher');
    }

    /**
     * Determine whether the user can store subject teacher.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function store(User $user)
    {
        return $user->can('store-subject-teacher');
    }

    /**
     * Determine whether the user can delete the subject teacher.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\SubjectTeacher  $subject_teacher
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-subject-teacher');
    }
}
