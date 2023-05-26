<?php

namespace App\Policies\Post;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ArticlePolicy
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
     * Determine whether the user can fetch article pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Post\Article  $article
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-article') || $user->can('edit-article');
    }

    /**
     * Determine whether the user can list all the article.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Post\Article  $article
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-article');
    }

    /**
     * Determine whether the user can create article.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-article');
    }

    /**
     * Determine whether the user can view the article.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Post\Article  $article
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-article');
    }

    /**
     * Determine whether the user can update the article.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Post\Article  $article
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-article');
    }

    /**
     * Determine whether the user can delete the article.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Post\Article  $article
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-article');
    }
}
