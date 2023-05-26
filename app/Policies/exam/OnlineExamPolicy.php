<?php

namespace App\Policies\Exam;

use App\User;
use App\Models\Exam\OnlineExam;
use Illuminate\Auth\Access\HandlesAuthorization;

class OnlineExamPolicy
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
     * Determine whether the user can fetch pre requisite all the online exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\OnlineExam  $online_exam
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-online-exam') || $user->can('edit-online-exam');
    }

    /**
     * Determine whether the user can list all the online exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\OnlineExam  $online_exam
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-online-exam');
    }

    /**
     * Determine whether the user can fetch all the online exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\OnlineExam  $online_exam
     * @return mixed
     */
    public function exam(User $user, OnlineExam $online_exam)
    {
        return (
                $user->hasRole(config('system.default_role.student')) && in_array($online_exam->status, ['running', 'expired'])
            ) || (
                $user->hasRole(config('system.default_role.parent')) && in_array($online_exam->status, ['expired'])
            );
    }

    /**
     * Determine whether the user can get student's online exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\OnlineExam  $online_exam
     * @return mixed
     */
    public function getExam(User $user, OnlineExam $online_exam)
    {
        return ! $user->hasAnyRole([
                    config('system.default_role.student'), 
                    config('system.default_role.parent')
                ]) && in_array($online_exam->status, ['expired']);
    }

    /**
     * Determine whether the user can create exam.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-online-exam');
    }

    /**
     * Determine whether the user can view the online exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\OnlineExam  $online_exam
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-online-exam');
    }

    /**
     * Determine whether the user can update the online exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\OnlineExam  $online_exam
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-online-exam');
    }

    /**
     * Determine whether the user can delete the online exam.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\OnlineExam  $online_exam
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-online-exam');
    }
}