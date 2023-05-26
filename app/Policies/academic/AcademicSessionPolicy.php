<?php

namespace App\Policies\Academic;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AcademicSessionPolicy
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
     * Determine whether the user can fetch academic session pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\AcademicSession  $academic_session
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-academic-session') || $user->can('edit-academic-session');
    }

    /**
     * Determine whether the user can list all the academic session.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\AcademicSession  $academic_session
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-academic-session');
    }

    /**
     * Determine whether the user can import previous session data
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\AcademicSession  $academic_session
     * @return mixed
     */
    public function importPreviousSessionData(User $user)
    {
        return $user->can('import-previous-session-data');
    }

    /**
     * Determine whether the user can create academic session.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-academic-session');
    }

    /**
     * Determine whether the user can view the academic session.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\AcademicSession  $academic_session
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-academic-session');
    }

    /**
     * Determine whether the user can update the academic session.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\AcademicSession  $academic_session
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-academic-session');
    }

    /**
     * Determine whether the user can delete the academic session.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Academic\AcademicSession  $academic_session
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-academic-session');
    }
}
