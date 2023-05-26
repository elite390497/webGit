<?php

namespace App\Policies\Resource;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotesPolicy
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
     * Determine whether the user can fetch notes pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Notes  $notes
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-notes') || $user->can('edit-notes');
    }

    /**
     * Determine whether the user can list all the notes.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Notes  $notes
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-notes');
    }

    /**
     * Determine whether the user can create notes.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-notes');
    }

    /**
     * Determine whether the user can view the notes.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Notes  $notes
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-notes');
    }

    /**
     * Determine whether the user can update the notes.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Notes  $notes
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-notes');
    }

    /**
     * Determine whether the user can delete the notes.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\Notes  $notes
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-notes');
    }
}
