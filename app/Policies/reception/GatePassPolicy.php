<?php

namespace App\Policies\Reception;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class GatePassPolicy
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
     * Determine whether the user can fetch gate pass pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\GatePass  $gate_pass
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-gate-pass') || $user->can('edit-gate-pass');
    }

    /**
     * Determine whether the user can list all the gate pass.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\GatePass  $gate_pass
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-gate-pass');
    }

    /**
     * Determine whether the user can create gate pass.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-gate-pass');
    }

    /**
     * Determine whether the user can view the gate pass.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\GatePass  $gate_pass
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-gate-pass');
    }

    /**
     * Determine whether the user can update the gate pass.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\GatePass  $gate_pass
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-gate-pass');
    }

    /**
     * Determine whether the user can delete the gate pass.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\GatePass  $gate_pass
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-gate-pass');
    }
}