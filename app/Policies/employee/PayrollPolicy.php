<?php

namespace App\Policies\Employee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PayrollPolicy
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
     * Determine whether the user can fetch payroll pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Payroll  $payroll
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('generate-payroll') || $user->can('edit-payroll');
    }

    /**
     * Determine whether the user can list all the payroll.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Payroll  $payroll
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-payroll');
    }

    /**
     * Determine whether the user can generate payroll.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function generate(User $user)
    {
        return $user->can('generate-payroll');
    }

    /**
     * Determine whether the user can view the payroll.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Payroll  $payroll
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-payroll');
    }

    /**
     * Determine whether the user can update the payroll.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Payroll  $payroll
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-payroll');
    }

    /**
     * Determine whether the user can delete the payroll.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Employee\Payroll  $payroll
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-payroll');
    }
}
