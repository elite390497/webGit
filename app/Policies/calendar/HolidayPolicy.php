<?php

namespace App\Policies\Calendar;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HolidayPolicy
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
     * Determine whether the user can list all the holiday.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Calendar\Holiday  $holiday
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-holiday');
    }

    /**
     * Determine whether the user can create holiday.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-holiday');
    }

    /**
     * Determine whether the user can view the holiday.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Calendar\Holiday  $holiday
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-holiday');
    }

    /**
     * Determine whether the user can update the holiday.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Calendar\Holiday  $holiday
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-holiday');
    }

    /**
     * Determine whether the user can delete the holiday.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Calendar\Holiday  $holiday
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-holiday');
    }
}
