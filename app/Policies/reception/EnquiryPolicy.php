<?php

namespace App\Policies\Reception;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EnquiryPolicy
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
     * Determine whether the user can fetch enquiry pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\Enquiry  $enquiry
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-enquiry') || $user->can('edit-enquiry');
    }

    /**
     * Determine whether the user can list all the enquiry.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\Enquiry  $enquiry
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-enquiry');
    }

    /**
     * Determine whether the user can create enquiry.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-enquiry');
    }

    /**
     * Determine whether the user can view the enquiry.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\Enquiry  $enquiry
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-enquiry');
    }

    /**
     * Determine whether the user can update the enquiry.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\Enquiry  $enquiry
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-enquiry');
    }

    /**
     * Determine whether the user can delete the enquiry.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\Enquiry  $enquiry
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-enquiry');
    }
}
