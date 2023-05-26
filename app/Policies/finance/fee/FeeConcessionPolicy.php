<?php

namespace App\Policies\Finance\Fee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FeeConcessionPolicy
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
     * Determine whether the user can fetch fee concession pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeConcession  $fee_concession
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-fee-concession') || $user->can('edit-fee-concession');
    }

    /**
     * Determine whether the user can list all the fee concession.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeConcession  $fee_concession
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-fee-concession');
    }

    /**
     * Determine whether the user can create fee concession.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-fee-concession');
    }

    /**
     * Determine whether the user can view the fee concession.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeConcession  $fee_concession
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-fee-concession');
    }

    /**
     * Determine whether the user can update the fee concession.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeConcession  $fee_concession
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-fee-concession');
    }

    /**
     * Determine whether the user can delete the fee concession.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeConcession  $fee_concession
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-fee-concession');
    }
}
