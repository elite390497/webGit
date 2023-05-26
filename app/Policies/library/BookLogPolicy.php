<?php

namespace App\Policies\Library;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookLogPolicy
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
     * Determine whether the user can list issued book.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->hasAnyPermission(['issue-book','return-book']);
    }

    /**
     * Determine whether the user can issue book.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('issue-book');
    }

    /**
     * Determine whether the user can return book.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function returnBook(User $user)
    {
        return $user->can('return-book');
    }
}
