<?php

namespace App\Policies\Finance\Transaction;

use App\User;
use App\Models\Finance\Transaction\Expense;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Repositories\Employee\EmployeeRepository;

class ExpensePolicy
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
     * Determine whether the user can fetch expense pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Expense  $expense
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-expense') || $user->can('edit-expense');
    }

    /**
     * Determine whether the user can list all the expense.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Expense  $expense
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-expense');
    }

    /**
     * Determine whether the user can create expense.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-expense');
    }

    /**
     * Determine whether the user can view the expense.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Expense  $expense
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-expense');
    }

    /**
     * Determine whether the user can update the expense.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Expense  $expense
     * @return mixed
     */
    public function update(User $user, Expense $expense)
    {
        return ($user->can('edit-expense') && ($expense->user_id == $user->id || $this->employee->userAccessible($expense->user->employee)));
    }

    /**
     * Determine whether the user can cancel the expense.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Expense  $expense
     * @return mixed
     */
    public function cancel(User $user, Expense $expense)
    {
        return ($user->can('cancel-expense') && ($expense->user_id == $user->id || $this->employee->userAccessible($expense->user->employee)));
    }
}
