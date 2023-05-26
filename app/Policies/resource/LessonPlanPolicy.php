<?php

namespace App\Policies\Resource;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LessonPlanPolicy
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
     * Determine whether the user can fetch lesson plan pre requisite
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\LessonPlan  $lesson_plan
     * @return mixed
     */
    public function preRequisite(User $user)
    {
        return $user->can('create-lesson-plan') || $user->can('edit-lesson-plan');
    }

    /**
     * Determine whether the user can list all the lesson plan.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\LessonPlan  $lesson_plan
     * @return mixed
     */
    public function list(User $user)
    {
        return $user->can('list-lesson-plan');
    }

    /**
     * Determine whether the user can create lesson plan.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-lesson-plan');
    }

    /**
     * Determine whether the user can view the lesson plan.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\LessonPlan  $lesson_plan
     * @return mixed
     */
    public function show(User $user)
    {
        return $user->can('list-lesson-plan');
    }

    /**
     * Determine whether the user can update the lesson plan.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\LessonPlan  $lesson_plan
     * @return mixed
     */
    public function update(User $user)
    {
        return $user->can('edit-lesson-plan');
    }

    /**
     * Determine whether the user can delete the lesson plan.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Resource\LessonPlan  $lesson_plan
     * @return mixed
     */
    public function delete(User $user)
    {
        return $user->can('delete-lesson-plan');
    }
}
