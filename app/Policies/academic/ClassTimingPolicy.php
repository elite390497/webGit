<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClassTimingPolicy
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
     * Determine whether the user can list all the class timing.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\ClassTiming  $class_timing
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-class-timing');
    }

    /**
     * Determine whether the user can create class timing.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-class-timing');
    }

    /**
     * Determine whether the user can view the class timing.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\ClassTiming  $class_timing
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-class-timing');
    }

    /**
     * Determine whether the user can update the class timing.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\ClassTiming  $class_timing
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-class-timing');
    }

    /**
     * Determine whether the user can delete the class timing.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\ClassTiming  $class_timing
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-class-timing');
    }
}
