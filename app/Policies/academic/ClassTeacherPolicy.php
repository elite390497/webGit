<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClassTeacherPolicy
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
     * Determine whether the user can list all the class teacher.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\ClassTeacher  $class_teacher
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-class-teacher');
    }

    /**
     * Determine whether the user can store class teacher.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function store(User $user)
    {
        return $user->can('store-class-teacher');
    }

    /**
     * Determine whether the user can delete the class teacher.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\ClassTeacher  $class_teacher
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-class-teacher');
    }
}
