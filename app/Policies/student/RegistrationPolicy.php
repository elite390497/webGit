<?php

namespace App\Policies\Student;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RegistrationPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Determine whether the user can fetch registration pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Modles\Student\Registration  $registration
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('new-registration');
    }

    /**
     * Determine whether the user can fetch registration fee pre requisite or make fee payment
     *
     * @param  \App\User  $user
     * @param  \App\Modles\Student\Registration  $registration
     * @return mixed
     */
    public function feePayment(User $user)
    {
        return $user->can('make-registration-fee-payment');
    }

    /**
     * Determine whether the user can list all the registration.
     *
     * @param  \App\User  $user
     * @param  \App\Modles\Student\Registration  $registration
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-registration');
    }

    /**
     * Determine whether the user can create registration.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('new-registration');
    }

    /**
     * Determine whether the user can view the registration.
     *
     * @param  \App\User  $user
     * @param  \App\Modles\Student\Registration  $registration
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-registration');
    }

    /**
     * Determine whether the user can update registration
     *
     * @param  \App\User  $user
     * @param  \App\Modles\Student\Registration  $registration
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-registration');
    }

    /**
     * Determine whether the user can update registration status
     *
     * @param  \App\User  $user
     * @param  \App\Modles\Student\Registration  $registration
     * @return mixed
     */
    public function updateStatus(User $user)
    {
        return $user->can('change-registration-status');
    }

    /**
     * Determine whether the user can delete registration
     *
     * @param  \App\User  $user
     * @param  \App\Modles\Student\Registration  $registration
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-registration');
    }
}
