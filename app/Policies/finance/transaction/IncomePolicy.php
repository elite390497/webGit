<?php

namespace App\Policies\Finance\Transaction;

use App\User;
use App\Models\Finance\Transaction\Income;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Repositories\Employee\EmployeeRepository;

class IncomePolicy
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
     * Determine whether the user can fetch income pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Income  $income
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-income') || $user->can('edit-income');
    }

    /**
     * Determine whether the user can list all the income.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Income  $income
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-income');
    }

    /**
     * Determine whether the user can create income.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-income');
    }

    /**
     * Determine whether the user can view the income.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Income  $income
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-income');
    }

    /**
     * Determine whether the user can update the income.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Income  $income
     * @return mixed
     */
    public function update(User $user, Income $income)
    {
        return ($user->can('edit-income') && ($income->user_id == $user->id || $this->employee->userAccessible($income->user->employee)));
    }

    /**
     * Determine whether the user can cancel the income.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Finance\Transaction\Income  $income
     * @return mixed
     */
    public function cancel(User $user, Income $income)
    {
        return ($user->can('cancel-income') && ($income->user_id == $user->id || $this->employee->userAccessible($income->user->employee)));
    }
}
