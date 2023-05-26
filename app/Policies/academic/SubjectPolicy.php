<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubjectPolicy
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
     * Determine whether the user can fetch subject pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Subject  $subject
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-subject') || $user->can('edit-subject');
    }

    /**
     * Determine whether the user can list all the subject.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Subject  $subject
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-subject');
    }

    /**
     * Determine whether the user can create subject.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-subject');
    }

    /**
     * Determine whether the user can view the subject.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Subject  $subject
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-subject');
    }

    /**
     * Determine whether the user can update the subject.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Subject  $subject
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-subject');
    }

    /**
     * Determine whether the user can delete the subject.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Subject  $subject
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-subject');
    }
}
