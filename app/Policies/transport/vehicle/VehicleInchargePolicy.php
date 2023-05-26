<?php

namespace App\Policies\Transport\Vehicle;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehicleInchargePolicy
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
     * Determine whether the user can list all the vehicle incharge.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleIncharge  $vehicle_incharge
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-vehicle-incharge');
    }

    /**
     * Determine whether the user can store vehicle incharge.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function store(User $user)
    {
        return $user->can('store-vehicle-incharge');
    }

    /**
     * Determine whether the user can delete the vehicle incharge.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleIncharge  $vehicle_incharge
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-vehicle-incharge');
    }
}
