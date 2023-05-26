<?php

namespace App\Policies\Finance\Fee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FeeAllocationPolicy
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
     * Determine whether the user can fetch fee allocation pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeAllocation  $fee_allocation
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-fee-allocation') || $user->can('edit-fee-allocation');
    }

    /**
     * Determine whether the user can list all the fee allocation.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeAllocation  $fee_allocation
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-fee-allocation');
    }

    /**
     * Determine whether the user can create fee allocation.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-fee-allocation');
    }

    /**
     * Determine whether the user can view the fee allocation.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeAllocation  $fee_allocation
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-fee-allocation');
    }

    /**
     * Determine whether the user can update the fee allocation.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeAllocation  $fee_allocation
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-fee-allocation');
    }

    /**
     * Determine whether the user can delete the fee allocation.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeAllocation  $fee_allocation
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-fee-allocation');
    }
}
