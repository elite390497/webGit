<?php

namespace App\Policies\Resource;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AssignmentPolicy
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
     * Determine whether the user can fetch assignment pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Assignment  $assignment
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-assignment') || $user->can('edit-assignment');
    }

    /**
     * Determine whether the user can list all the assignment.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Assignment  $assignment
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-assignment');
    }

    /**
     * Determine whether the user can create assignment.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-assignment');
    }

    /**
     * Determine whether the user can view the assignment.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Assignment  $assignment
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-assignment');
    }

    /**
     * Determine whether the user can update the assignment.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Assignment  $assignment
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-assignment');
    }

    /**
     * Determine whether the user can delete the assignment.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Assignment  $assignment
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-assignment');
    }
}
