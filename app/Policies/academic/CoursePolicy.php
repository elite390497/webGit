<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CoursePolicy
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
     * Determine whether the user can fetch course pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Course  $course
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-course') || $user->can('edit-course');
    }

    /**
     * Determine whether the user can list all the course.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Course  $course
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-course');
    }

    /**
     * Determine whether the user can create course.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-course');
    }

    /**
     * Determine whether the user can view the course.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Course  $course
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-course');
    }

    /**
     * Determine whether the user can update the course.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Course  $course
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-course');
    }

    /**
     * Determine whether the user can delete the course.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Course  $course
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-course');
    }
}
