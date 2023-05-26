<?php

namespace App\Policies\Inventory;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StockItemPolicy
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
     * Determine whether the user can fetch pre requisite all the stock item.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockItem  $stock_item
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-stock-item') || $user->can('edit-stock-item');
    }

    /**
     * Determine whether the user can list all the stock item.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockItem  $stock_item
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-stock-item');
    }

    /**
     * Determine whether the user can create exam.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-stock-item');
    }

    /**
     * Determine whether the user can view the stock item.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockItem  $stock_item
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-stock-item');
    }

    /**
     * Determine whether the user can update the stock item.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockItem  $stock_item
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-stock-item');
    }

    /**
     * Determine whether the user can delete the stock item.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Inventory\StockItem  $stock_item
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-stock-item');
    }
}