<?php

namespace App\Policies\Resource;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SyllabusPolicy
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
     * Determine whether the user can fetch syllabus pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Syllabus  $syllabus
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-syllabus') || $user->can('edit-syllabus');
    }

    /**
     * Determine whether the user can list all the syllabus.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Syllabus  $syllabus
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-syllabus');
    }

    /**
     * Determine whether the user can create syllabus.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-syllabus');
    }

    /**
     * Determine whether the user can view the syllabus.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Syllabus  $syllabus
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-syllabus');
    }

    /**
     * Determine whether the user can update the syllabus.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Syllabus  $syllabus
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-syllabus');
    }

    /**
     * Determine whether the user can delete the syllabus.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Syllabus  $syllabus
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-syllabus');
    }
}
