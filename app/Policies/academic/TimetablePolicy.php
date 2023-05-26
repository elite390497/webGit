<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TimetablePolicy
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
     * Determine whether the user can fetch timetable pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Timetable  $timetable
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-timetable') || $user->can('edit-timetable');
    }

    /**
     * Determine whether the user can list all the timetable.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Timetable  $timetable
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-timetable');
    }

    /**
     * Determine whether the user can create timetable.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-timetable');
    }

    /**
     * Determine whether the user can view the timetable.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Timetable  $timetable
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-timetable');
    }

    /**
     * Determine whether the user can update the timetable.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Timetable  $timetable
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-timetable');
    }

    /**
     * Determine whether the user can delete the timetable.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Timetable  $timetable
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-timetable');
    }
}
