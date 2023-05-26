<?php

namespace App\Policies\Reception;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VisitorLogPolicy
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
     * Determine whether the user can fetch visitor log pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorLog  $visitor_log
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-visitor-log') || $user->can('edit-visitor-log');
    }

    /**
     * Determine whether the user can list all the visitor log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorLog  $visitor_log
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-visitor-log');
    }

    /**
     * Determine whether the user can create visitor log.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-visitor-log');
    }

    /**
     * Determine whether the user can view the visitor log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorLog  $visitor_log
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-visitor-log');
    }

    /**
     * Determine whether the user can update the visitor log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorLog  $visitor_log
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-visitor-log');
    }

    /**
     * Determine whether the user can delete the visitor log.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorLog  $visitor_log
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-visitor-log');
    }
}
