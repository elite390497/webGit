<?php

namespace App\Policies\Student;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StudentRecordPolicy {
	use HandlesAuthorization;

	/**
	 * Create a new policy instance.
	 *
	 * @return void
	 */
	public function __construct() {
	}

	/**
	 * Determine whether the user can fetch student list
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function list(User $user) {
		return $user->can('list-student') || $user->can('list-class-teacher-wise-student');
	}

	/**
	 * Determine whether the user can list student fee
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function listFee(User $user) {
		return $user->can('list-student-fee');
	}

	/**
	 * Determine whether the user can set student fee
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function setFee(User $user) {
		return $user->can('set-fee');
	}

	/**
	 * Determine whether the user can make student fee payment
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function makePayment(User $user) {
		return (request('is_partial_payment')) ? $user->can('make-partial-fee-payment') : $user->can('make-fee-payment');
	}

	/**
	 * Determine whether the user can make student fee payment as parent
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function makePaymentAsParent(User $user) {
		return $user->can('make-fee-payment') && $user->hasAnyRole([
			config('system.default_role.parent'),
			config('system.default_role.student'),
		]);
	}

	/**
	 * Determine whether the user can cancel student fee payment
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function cancelPayment(User $user) {
		return $user->can('cancel-fee-payment');
	}

	/**
	 * Determine whether the user can edit student record
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function update(User $user) {
		return $user->can('edit-student');
	}

	/**
	 * Determine whether the user can promote student
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function promote(User $user) {
		return $user->can('promote-student');
	}

	/**
	 * Determine whether the user can terminate student
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function terminate(User $user) {
		return $user->can('terminate-student');
	}

	/**
	 * Determine whether the user can edit student's roll number
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function rollNumber(User $user) {
		return $user->can('edit-roll-number');
	}

	/**
	 * Determine whether the user can generate student's id-card
	 *
	 * @param  \App\User  $user
	 * @param  \App\Models\Student\StudentRecord  $student_record
	 * @return mixed
	 */
	public function idCard(User $user) {
		return $user->can('generate-student-id-card');
	}
}
