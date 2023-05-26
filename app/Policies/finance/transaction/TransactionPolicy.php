<?php

namespace App\Policies\Finance\Transaction;

use App\User;
use App\Models\Finance\Transaction\Transaction;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Repositories\Employee\EmployeeRepository;

class TransactionPolicy
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
     * Determine whether the user can fetch payroll transaction pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Transaction  $transaction
     * @return mixed
     */
    public function getPayrollTransactionPreRequisite(User $user)
    {
        return $user->can('create-payroll-transaction') || $user->can('edit-payroll-transaction');
    }

    /**
     * Determine whether the user can list all the payroll transaction.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Transaction  $transaction
     * @return mixed
     */
    public function listPayrollTransaction(User $user)
    {
        return $user->can('list-payroll-transaction');
    }

    /**
     * Determine whether the user can create payroll transaction.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function createPayrollTransaction(User $user)
    {
        return $user->can('create-payroll-transaction');
    }

    /**
     * Determine whether the user can update the payroll transaction.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Transaction  $transaction
     * @return mixed
     */
    public function updatePayrollTransaction(User $user, Transaction $transaction)
    {
        return ($user->can('edit-payroll-transaction') && ($transaction->user_id == $user->id || $this->employee->userAccessible($transaction->user->employee)));
    }

    /**
     * Determine whether the user can cancel the payroll transaction.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Transaction  $transaction
     * @return mixed
     */
    public function cancelPayrollTransaction(User $user, Transaction $transaction)
    {
        return ($user->can('cancel-payroll-transaction') && ($transaction->user_id == $user->id || $this->employee->userAccessible($transaction->user->employee)));
    }
}
