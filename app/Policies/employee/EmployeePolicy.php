<?php

namespace App\Policies\Employee;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmployeePolicy {
	use HandlesAuthorization;

	/**
	 * Create a new policy instance.
	 *
	 * @return void
	 */
	public function __construct() {
		//
	}

	/**
	 * Determine whether the user can fetch employee pre requisite
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Employee\Employee  $employee
	 * @return mixed
	 */
	public function preRequisite(User $user) {
		return $user->can('list-employee') || $user->can('create-employee') || $user->can('edit-employee');
	}

	/**
	 * Determine whether the user can list the employee.
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Employee\Employee  $employee
	 * @return mixed
	 */
	public function list(User $user) {
		return $user->can('list-employee');
	}

	/**
	 * Determine whether the user can create the employee.
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Employee\Employee  $employee
	 * @return mixed
	 */
	public function create(User $user) {
		return $user->can('create-employee');
	}

	/**
	 * Determine whether the user can view the employee.
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Employee\Employee  $employee
	 * @return mixed
	 */
	public function show(User $user) {
		return $user->can('list-employee');
	}

	/**
	 * Determine whether the user can update the employee.
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Employee\Employee  $employee
	 * @return mixed
	 */
	public function update(User $user) {
		return $user->can('edit-employee');
	}

	/**
	 * Determine whether the user can search the employee.
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Employee\Employee  $employee
	 * @return mixed
	 */
	public function search(User $user) {
		return $user->hasAnyPermission(['issue-book']);
	}

	/**
	 * Determine whether the user can generate employee's id-card
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Employee\Employee  $employee
	 * @return mixed
	 */
	public function idCard(User $user) {
		return $user->can('generate-employee-id-card');
	}
}
