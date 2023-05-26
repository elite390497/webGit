<?php

namespace App\Policies\Communication;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MeetingPolicy
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
     * Determine whether the user can fetch event pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Communication\Meeting  $meeting
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-meeting') || $user->can('edit-meeting');
    }

    /**
     * Determine whether the user can list all the event.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Communication\Meeting  $meeting
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-meeting');
    }

    /**
     * Determine whether the user can create event.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-meeting');
    }

    /**
     * Determine whether the user can view the event.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Communication\Meeting  $meeting
     * @return mixed
     */
    public function show(User $user, Meeting $meeting)
    {
        if (! $user->can('list-meeting'))
            return false;

        if ($user->hasAnyRole([
            config('system.default_role.student'),
            config('system.default_role.parent')
        ]) && ! in_array($meeting->audience, ['everyone','selected_course','selected_batch']));
            return false;

        return true;
    }

    /**
     * Determine whether the user can update the event.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Communication\Meeting  $meeting
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-meeting');
    }

    /**
     * Determine whether the user can delete the event.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Communication\Meeting  $meeting
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-meeting');
    }
}
