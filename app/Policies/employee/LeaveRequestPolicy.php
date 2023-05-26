<?php

namespace App\Policies\Employee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LeaveRequestPolicy
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
     * Determine whether the user can fetch leave request pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\LeaveRequest  $leave_request
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('request-leave');
    }

    /**
     * Determine whether the user can list the leave request.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\LeaveRequest  $leave_request
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('request-leave');
    }

    /**
     * Determine whether the user can request the leave.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\LeaveRequest  $leave_request
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('request-leave');
    }

    /**
     * Determine whether the user can view the leave reqeuest.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\LeaveRequest  $leave_request
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('request-leave');
    }

    /**
     * Determine whether the user can update status of the leave reqeuest.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\LeaveRequest  $leave_request
     * @return mixed
     */
    public function updateStatus(User $user)
    {
        return $user->can('take-action-on-leave-request');
    }
}
