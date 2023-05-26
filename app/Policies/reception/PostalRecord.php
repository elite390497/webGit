<?php

namespace App\Policies\Reception;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostalRecordPolicy
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
     * Determine whether the user can fetch postal record pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\PostalRecord  $postal_record
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-postal-record') || $user->can('edit-postal-record');
    }

    /**
     * Determine whether the user can list all the postal record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\PostalRecord  $postal_record
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-postal-record');
    }

    /**
     * Determine whether the user can create postal record.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-postal-record');
    }

    /**
     * Determine whether the user can view the postal record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\PostalRecord  $postal_record
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-postal-record');
    }

    /**
     * Determine whether the user can update the postal record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\PostalRecord  $postal_record
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-postal-record');
    }

    /**
     * Determine whether the user can delete the postal record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\PostalRecord  $postal_record
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-postal-record');
    }
}