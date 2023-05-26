<?php

namespace App\Policies\Exam;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RecordPolicy
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
     * Determine whether the user can fetch pre requisite all the exam mark.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Mark  $exam_mark
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('store-exam-mark');
    }

    /**
     * Determine whether the user can list all the exam mark.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Mark  $exam_mark
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-exam-mark');
    }

    /**
     * Determine whether the user can store the exam mark.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Mark  $exam_mark
     * @return mixed
     */
    public function store(User $user)
    {
        return $user->can('store-exam-mark');
    }

    /**
     * Determine whether the user can access mark report
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Mark  $exam_mark
     * @return mixed
     */
    public function report(User $user)
    {
        return $user->can('access-exam-report') || $user->can('access-class-teacher-wise-exam-report');
    }

    /**
     * Determine whether the user can delete the exam mark.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Exam\Mark  $exam_mark
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('store-exam-mark');
    }
}
