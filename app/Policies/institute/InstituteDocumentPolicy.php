<?php

namespace App\Policies\Institute;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InstituteDocumentPolicy
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
     * Determine whether the user can fetch institute document pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Institute\InstituteDocument  $vehicle_document
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-institute-document') || $user->can('edit-institute-document');
    }

    /**
     * Determine whether the user can list all the institute document.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Institute\InstituteDocument  $vehicle_document
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-institute-document');
    }

    /**
     * Determine whether the user can create institute document.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-institute-document');
    }

    /**
     * Determine whether the user can view the institute document.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Institute\InstituteDocument  $vehicle_document
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-institute-document');
    }

    /**
     * Determine whether the user can update the institute document.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Institute\InstituteDocument  $vehicle_document
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-institute-document');
    }

    /**
     * Determine whether the user can delete the institute document.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Institute\InstituteDocument  $vehicle_document
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-institute-document');
    }
}
