<?php

namespace App\Policies\Exam;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExamPolicy
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
     * Determine whether the user can fetch pre requisite all the exam/exam_record.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Exam  $exam
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-exam') || $user->can('edit-exam');
    }

    /**
     * Determine whether the user can list all the exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Exam  $exam
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-exam');
    }

    /**
     * Determine whether the user can create exam.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-exam');
    }

    /**
     * Determine whether the user can view the exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Exam  $exam
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-exam');
    }

    /**
     * Determine whether the user can update the exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Exam  $exam
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-exam');
    }

    /**
     * Determine whether the user can delete the exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Exam  $exam
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-exam');
    }
}
