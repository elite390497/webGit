<?php

namespace App\Policies\Finance\Fee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FeeGroupPolicy
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
     * Determine whether the user can list all the fee group.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeGroup  $fee_group
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-fee-group');
    }

    /**
     * Determine whether the user can create fee group.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-fee-group');
    }

    /**
     * Determine whether the user can view the fee group.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeGroup  $fee_group
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-fee-group');
    }

    /**
     * Determine whether the user can update the fee group.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeGroup  $fee_group
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-fee-group');
    }

    /**
     * Determine whether the user can delete the fee group.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeGroup  $fee_group
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-fee-group');
    }
}
