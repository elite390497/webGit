<?php

namespace App\Policies\Transport\Vehicle;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehicleServiceRecordPolicy
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
     * Determine whether the user can fetch vehicle service record pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleServiceRecord  $vehicle_service_record
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-vehicle-service-record') || $user->can('edit-vehicle-service-record');
    }

    /**
     * Determine whether the user can list all the vehicle service record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleServiceRecord  $vehicle_service_record
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-vehicle-service-record');
    }

    /**
     * Determine whether the user can create vehicle service record.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-vehicle-service-record');
    }

    /**
     * Determine whether the user can view the vehicle service record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleServiceRecord  $vehicle_service_record
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-vehicle-service-record');
    }

    /**
     * Determine whether the user can update the vehicle service record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleServiceRecord  $vehicle_service_record
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-vehicle-service-record');
    }

    /**
     * Determine whether the user can delete the vehicle service record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\Vehicle\VehicleServiceRecord  $vehicle_service_record
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-vehicle-service-record');
    }
}
