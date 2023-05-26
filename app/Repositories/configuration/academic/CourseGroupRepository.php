<?php
namespace App\Repositories\Configuration\Academic;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Academic\CourseGroup;

class CourseGroupRepository
{
    protected $course_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CourseGroup $course_group
    ) {
        $this->course_group = $course_group;
    }

    /**
     * Get course group query
     *
     * @return CourseGroup query
     */
    public function getQuery()
    {
        return $this->course_group;
    }

    /**
     * Count course group
     *
     * @return integer
     */
    public function count()
    {
        return $this->course_group->filterBySession()->count();
    }

    /**
     * List all course groups by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->course_group->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all course groups by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->course_group->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all course groups by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->course_group->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all course groups
     *
     * @return array
     */
    public function getAll()
    {
        return $this->course_group->info()->filterBySession()->get();
    }

    /**
     * Find course group with given id.
     *
     * @param integer $id
     * @return CourseGroup
     */
    public function find($id)
    {
        return $this->course_group->info()->filterBySession()->find($id);
    }

    /**
     * Get course option with course group.
     *
     * @return Array $courses
     */
    public function getCourseOption($session_id = null)
    {
        $course_groups = $this->course_group->with('courses', 'courses.batches')->filterBySession($session_id)->orderBy('position','asc')->get();

        $is_student_or_parent = 0;
        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $is_student_or_parent = 1;
            $student_batch_ids = getAuthUserBatchId();
        }

        $courses = array();
        foreach ($course_groups as $course_group) {
            $data = array();
            foreach ($course_group->courses->sortBy('position')->all() as $course) {
                if (! $is_student_or_parent || ($is_student_or_parent && count(array_intersect($student_batch_ids, $course->batches->pluck('id')->all())))) {
                    $data[] = array(
                        'id' => $course->id,
                        'name' => $course->name
                    );
                }
            }

            if ($data) {
                $courses[] = array(
                    'course_group' => $course_group->name,
                    'courses' => $data
                );
            }
        }

        return $courses;
    }

    /**
     * Get course option with course group and its detail.
     *
     * @return Array $courses
     */
    public function getCourseOptionWithDetail($session_id = null)
    {
        $course_groups = $this->course_group->with('courses')->filterBySession($session_id)->orderBy('position','asc')->get();

        $courses = array();
        $course_details = array();
        foreach ($course_groups as $course_group) {
            $data = array();
            foreach ($course_group->courses->sortBy('position')->all() as $course) {
                if ($course->getOption('enable_registration')) {
                    $data[] = array(
                    'id' => $course->id,
                    'name' => $course->name
                );
                }

                $course_details[] = array(
                    'course_id' => $course->id,
                    'enable_registration_fee' => $course->getOption('enable_registration_fee'),
                    'registration_fee' => $course->getOption('registration_fee') ? : 0
                );
            }

            $courses[] = array(
                'course_group' => $course_group->name,
                'courses' => $data
            );
        }

        return compact('courses', 'course_details');
    }

    /**
     * Get batch option with course group.
     *
     * @return Array $batches
     */
    public function getBatchOption($session_id = null)
    {
        $course_groups = $this->course_group->with(['courses','courses.batches'])->filterBySession($session_id)->orderBy('position','asc')->get();

        $is_student_or_parent = 0;
        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $is_student_or_parent = 1;
            $student_batch_ids = getAuthUserBatchId();
        }

        $batches = array();
        foreach ($course_groups as $course_group) {
            $batch_data = array();
            foreach ($course_group->courses->sortBy('position')->all() as $course) {
                $course_batches = $course->batches->sortBy('position')->values()->all();
                foreach ($course_batches as $batch) {
                    if (! $is_student_or_parent || ($is_student_or_parent && in_array($batch->id, $student_batch_ids))) {
                        $batch_data[] = array(
                            'id' => $batch->id,
                            'name' => $course->name.' '.$batch->name
                        );
                    }
                }
            }

            if ($batch_data) {
                $batches[] = array(
                    'course_group' => $course_group->name,
                    'batches' => $batch_data
                );
            }
        }

        return $batches;
    }

    /**
     * Find course group with given id or throw an error.
     *
     * @param integer $id
     * @return CourseGroup
     */
    public function findOrFail($id, $field = 'message')
    {
        $course_group = $this->course_group->info()->filterBySession()->find($id);

        if (! $course_group) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_course_group')]);
        }

        return $course_group;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return CourseGroup
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'position');
        $order       = gv($params, 'order', 'asc');

        return $this->course_group->info()->filterBySession()->orderBy($sort_by, $order);
    }

    /**
     * Paginate all course groups using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return CourseGroup
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Reorder all course group
     *
     * @param array $params
     */
    public function reorder($params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $course_group = $this->course_group->filterBySession()->filterByName($item, 1)->first();
            $course_group->position = $index;
            $course_group->save();
        }
    }

    /**
     * Create a new course group.
     *
     * @param array $params
     * @return CourseGroup
     */
    public function create($params)
    {
        return $this->course_group->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $course_group_id = null)
    {
        $course_group_exist_query = ($course_group_id) ? $this->course_group->filterBySession()->where('id', '!=', $course_group_id) : $this->course_group->filterBySession();

        if ($course_group_exist_query->filterByName(gv($params, 'name'), 1)->count()) {
            throw ValidationException::withMessages(['name' => trans('academic.course_group_exists')]);
        }

        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        if (! $course_group_id) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }
        
        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given course group.
     *
     * @param CourseGroup $course_group
     * @param array $params
     *
     * @return CourseGroup
     */
    public function update(CourseGroup $course_group, $params)
    {
        return $course_group->forceFill($this->formatParams($params, $course_group->id))->save();
    }

    /**
     * Find course group & check it can be deleted or not.
     *
     * @param integer $id
     * @return CourseGroup
     */
    public function deletable($id)
    {
        $course_group = $this->findOrFail($id);

        if ($course_group->courses()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.course_group_associated_with_course')]);
        }

        return $course_group;
    }

    /**
     * Delete course group.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(CourseGroup $course_group)
    {
        return $course_group->delete();
    }

    /**
     * Delete multiple course groups.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->course_group->whereIn('id', $ids)->delete();
    }
}
