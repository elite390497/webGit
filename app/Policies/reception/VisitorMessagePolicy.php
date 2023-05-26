<?php

namespace App\Policies\Reception;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VisitorMessagePolicy
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
     * Determine whether the user can list all the visitor message.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorMessage  $visitor_message
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-visitor-message');
    }

    /**
     * Determine whether the user can view the visitor message.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorMessage  $visitor_message
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-visitor-message');
    }

    /**
     * Determine whether the user can delete the visitor message.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Reception\VisitorMessage  $visitor_message
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-visitor-message');
    }
}
