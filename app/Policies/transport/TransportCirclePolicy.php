<?php

namespace App\Policies\Transport;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransportCirclePolicy
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
     * Determine whether the user can list all the transport circle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportCircle  $transport_circle
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-transport-circle');
    }

    /**
     * Determine whether the user can create transport circle.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-transport-circle');
    }

    /**
     * Determine whether the user can view the transport circle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportCircle  $transport_circle
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-transport-circle');
    }

    /**
     * Determine whether the user can update the transport circle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportCircle  $transport_circle
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-transport-circle');
    }

    /**
     * Determine whether the user can delete the transport circle.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportCircle  $transport_circle
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-transport-circle');
    }
}
