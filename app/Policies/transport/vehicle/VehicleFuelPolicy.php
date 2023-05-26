<?php

namespace App\Policies\Transport\Vehicle;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehicleFuelPolicy
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
     * Determine whether the user can fetch fuel pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleFuel  $vehicle_fuel
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-vehicle-fuel') || $user->can('edit-vehicle-fuel');
    }

    /**
     * Determine whether the user can list all the vehicle fuel.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleFuel  $vehicle_fuel
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-vehicle-fuel');
    }

    /**
     * Determine whether the user can create vehicle fuel.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-vehicle-fuel');
    }

    /**
     * Determine whether the user can view the vehicle fuel.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleFuel  $vehicle_fuel
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-vehicle-fuel');
    }

    /**
     * Determine whether the user can update the vehicle fuel.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleFuel  $vehicle_fuel
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-vehicle-fuel');
    }

    /**
     * Determine whether the user can delete the vehicle fuel.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleFuel  $vehicle_fuel
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-vehicle-fuel');
    }
}
