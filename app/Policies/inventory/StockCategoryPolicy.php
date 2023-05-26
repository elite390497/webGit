<?php

namespace App\Policies\Inventory;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StockCategoryPolicy
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
     * Determine whether the user can fetch pre requisite all the stock category.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockCategory  $stock_category
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-stock-category') || $user->can('edit-stock-category');
    }

    /**
     * Determine whether the user can list all the stock category.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockCategory  $stock_category
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-stock-category');
    }

    /**
     * Determine whether the user can create exam.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-stock-category');
    }

    /**
     * Determine whether the user can view the stock category.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockCategory  $stock_category
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-stock-category');
    }

    /**
     * Determine whether the user can update the stock category.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockCategory  $stock_category
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-stock-category');
    }

    /**
     * Determine whether the user can delete the stock category.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockCategory  $stock_category
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-stock-category');
    }
}