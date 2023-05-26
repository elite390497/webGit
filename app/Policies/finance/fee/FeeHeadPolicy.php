<?php

namespace App\Policies\Finance\Fee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FeeHeadPolicy
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
     * Determine whether the user can fetch fee head pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeHead  $fee_head
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-fee-head') || $user->can('edit-fee-head');
    }

    /**
     * Determine whether the user can list all the fee head.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeHead  $fee_head
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-fee-head');
    }

    /**
     * Determine whether the user can create fee head.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-fee-head');
    }

    /**
     * Determine whether the user can view the fee head.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeHead  $fee_head
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-fee-head');
    }

    /**
     * Determine whether the user can update the fee head.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeHead  $fee_head
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-fee-head');
    }

    /**
     * Determine whether the user can delete the fee head.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Fee\FeeHead  $fee_head
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-fee-head');
    }
}
