<?php

namespace App\Policies\Transport;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransportRoutePolicy
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
     * Determine whether the user can fetch transport route pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportRoute  $transport_route
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-transport-route') || $user->can('edit-transport-route');
    }

    /**
     * Determine whether the user can list all the transport route.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportRoute  $transport_route
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-transport-route');
    }

    /**
     * Determine whether the user can create transport route.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-transport-route');
    }

    /**
     * Determine whether the user can view the transport route.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportRoute  $transport_route
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-transport-route');
    }

    /**
     * Determine whether the user can list all the transport route.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportRoute  $transport_route
     * @return mixed
     */
    public function assign(User $user)
    {
        return $user->can('assign-transport-route');
    }

    /**
     * Determine whether the user can update the transport route.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportRoute  $transport_route
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-transport-route');
    }

    /**
     * Determine whether the user can delete the transport route.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportRoute  $transport_route
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-transport-route');
    }
}
