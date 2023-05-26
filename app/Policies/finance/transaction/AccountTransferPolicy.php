<?php

namespace App\Policies\Finance\Transaction;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Repositories\Employee\EmployeeRepository;
use App\Models\Finance\Transaction\AccountTransfer;

class AccountTransferPolicy
{
    protected $employee;

    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeRepository $employee
    ) {
        $this->employee = $employee;
    }

    /**
     * Determine whether the user can fetch account transfer pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\AccountTransfer  $account_transfer
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-account-transfer') || $user->can('edit-account-transfer');
    }

    /**
     * Determine whether the user can list all the account transfer.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\AccountTransfer  $account_transfer
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-account-transfer');
    }

    /**
     * Determine whether the user can create account transfer.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-account-transfer');
    }

    /**
     * Determine whether the user can view the account transfer.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\AccountTransfer  $account_transfer
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-account-transfer');
    }

    /**
     * Determine whether the user can update the account transfer.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\AccountTransfer  $account_transfer
     * @return mixed
     */
    public function update(User $user, AccountTransfer $account_transfer)
    {
        return ($user->can('edit-account-transfer') && ($account_transfer->user_id == $user->id || $this->employee->userAccessible($account_transfer->user->employee)));
    }

    /**
     * Determine whether the user can cancel the account transfer.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\AccountTransfer  $account_transfer
     * @return mixed
     */
    public function cancel(User $user, AccountTransfer $account_transfer)
    {
        return ($user->can('cancel-account-transfer') && ($account_transfer->user_id == $user->id || $this->employee->userAccessible($account_transfer->user->employee)));
    }
}
