<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BatchPolicy
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
     * Determine whether the user can fetch batch pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Batch  $batch
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-batch') || $user->can('edit-batch');
    }

    /**
     * Determine whether the user can list all the batch.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Batch  $batch
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-batch');
    }

    /**
     * Determine whether the user can create batch.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-batch');
    }

    /**
     * Determine whether the user can view the batch.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Batch  $batch
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-batch');
    }

    /**
     * Determine whether the user can update the batch.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Batch  $batch
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-batch');
    }

    /**
     * Determine whether the user can delete the batch.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\Batch  $batch
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-batch');
    }
}
