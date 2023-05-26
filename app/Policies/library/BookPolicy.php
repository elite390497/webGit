<?php

namespace App\Policies\Library;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookPolicy
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
     * Determine whether the user can fetch book pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Library\Book  $book
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-book') || $user->can('edit-book');
    }

    /**
     * Determine whether the user can list all the book.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Library\Book  $book
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-book');
    }

    /**
     * Determine whether the user can create book.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-book');
    }

    /**
     * Determine whether the user can view the book.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Library\Book  $book
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-book');
    }

    /**
     * Determine whether the user can update the book.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Library\Book  $book
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-book');
    }

    /**
     * Determine whether the user can delete the book.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Library\Book  $book
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-book');
    }
}
