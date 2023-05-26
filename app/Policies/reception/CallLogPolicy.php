<?php

namespace App\Policies\Reception;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CallLogPolicy
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
     * Determine whether the user can fetch call log pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\CallLog  $call_log
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-call-log') || $user->can('edit-call-log');
    }

    /**
     * Determine whether the user can list all the call log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\CallLog  $call_log
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-call-log');
    }

    /**
     * Determine whether the user can create call log.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-call-log');
    }

    /**
     * Determine whether the user can view the call log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\CallLog  $call_log
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-call-log');
    }

    /**
     * Determine whether the user can update the call log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\CallLog  $call_log
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-call-log');
    }

    /**
     * Determine whether the user can delete the call log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\CallLog  $call_log
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-call-log');
    }
}