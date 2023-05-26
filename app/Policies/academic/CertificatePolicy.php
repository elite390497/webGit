<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CertificatePolicy
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
     * Determine whether the user can fetch certificates pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Certificate  $certificates
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-certificate') || $user->can('edit-certificate');
    }

    /**
     * Determine whether the user can list all the certificates.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Certificate  $certificates
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-certificate');
    }

    /**
     * Determine whether the user can create certificates.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-certificate');
    }

    /**
     * Determine whether the user can view the certificates.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Certificate  $certificates
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-certificate');
    }

    /**
     * Determine whether the user can update the certificates.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Certificate  $certificates
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-certificate');
    }

    /**
     * Determine whether the user can delete the certificates.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Certificate  $certificates
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-certificate');
    }
}
