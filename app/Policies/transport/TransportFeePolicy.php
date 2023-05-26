<?php

namespace App\Policies\Transport;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransportFeePolicy
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
     * Determine whether the user can fetch transport fee pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportFee  $transport_fee
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-transport-fee') || $user->can('edit-transport-fee');
    }

    /**
     * Determine whether the user can list all the transport fee.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportFee  $transport_fee
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-transport-fee');
    }

    /**
     * Determine whether the user can create transport fee.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-transport-fee');
    }

    /**
     * Determine whether the user can view the transport fee.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportFee  $transport_fee
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-transport-fee');
    }

    /**
     * Determine whether the user can update the transport fee.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportFee  $transport_fee
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-transport-fee');
    }

    /**
     * Determine whether the user can delete the transport fee.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Transport\TransportFee  $transport_fee
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-transport-fee');
    }
}
