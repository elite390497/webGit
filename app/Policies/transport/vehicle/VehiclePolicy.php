<?php

namespace App\Policies\Transport\Vehicle;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehiclePolicy
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
     * Determine whether the user can fetch vehicle pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\Vehicle  $vehicle
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-vehicle') || $user->can('edit-vehicle');
    }

    /**
     * Determine whether the user can list all the vehicle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\Vehicle  $vehicle
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-vehicle');
    }

    /**
     * Determine whether the user can create vehicle.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-vehicle');
    }

    /**
     * Determine whether the user can view the vehicle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\Vehicle  $vehicle
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-vehicle');
    }

    /**
     * Determine whether the user can update the vehicle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\Vehicle  $vehicle
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-vehicle');
    }

    /**
     * Determine whether the user can delete the vehicle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\Vehicle  $vehicle
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-vehicle');
    }
}
