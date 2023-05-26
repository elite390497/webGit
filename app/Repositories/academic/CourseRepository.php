<?php
namespace App\Repositories\Academic;

use App\Models\Academic\Batch;
use App\Models\Academic\Course;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class CourseRepository
{
    protected $course;
    protected $course_group;
    protected $batch;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Course $course,
        CourseGroupRepository $course_group,
        Batch $batch
    ) {
        $this->course = $course;
        $this->course_group = $course_group;
        $this->batch = $batch;
    }

    /**
     * Get course query
     *
     * @return Course query
     */
    public function getQuery()
    {
        return $this->course;
    }

    /**
     * Count course
     *
     * @return integer
     */
    public function count()
    {
        return $this->course->filterBySession()->count();
    }

    /**
     * List all courses by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->course->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all courses by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->course->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all courses which has registration enabled by name & id for select option
     *
     * @return array
     */

    public function selectAllRegistrationEnabled()
    {
        $courses = $this->getAll();

        $ids = array();
        foreach ($courses as $course) {
            if ($course->getOption('enable_registration')) {
                $ids[] = $course->id;
            }
        }

        return $this->course->whereIn('id', $ids)->get(['name', 'id']);
    }

    /**
     * List all courses by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->course->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all courses
     *
     * @return array
     */
    public function getAll()
    {
        return $this->course->info()->filterBySession()->get();
    }

    /**
     * Find course with given id.
     *
     * @param integer $id
     * @return Course
     */
    public function find($id)
    {
        return $this->course->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find course with given id or throw an error.
     *
     * @param integer $id
     * @return Course
     */
    public function findOrFail($id, $field = 'message')
    {
        $course = $this->course->info()->filterBySession()->filterById($id)->first();

        if (! $course) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_course')]);
        }

        return $course;
    }

    /**
     * Find course by session with given id or throw an error.
     *
     * @param integer $id
     * @return Course
     */
    public function findOrFailBySessionId($id, $session_id, $field = 'message')
    {
        $course = $this->course->info()->filterBySession($session_id)->filterById($id)->first();

        if (! $course) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_course')]);
        }

        return $course;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Course
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'position');
        $order           = gv($params, 'order', 'asc');
        $course_group_id = gv($params, 'course_group_id');

        $course_group_id = is_array($course_group_id) ? $course_group_id : ($course_group_id ? explode(',', $course_group_id) : []);

        $query = $this->course->info()->filterBySession();

        if (count($course_group_id)) {
            $query->whereIn('course_group_id', $course_group_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all courses using given params.
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
     * @return Course
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Reorder all course
     *
     * @param array $params
     */
    public function reorder($params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $course = $this->course->filterBySession()->filterByName($item, 1)->first();
            $course->position = $index;
            $course->save();
        }
    }

    /**
     * Reorder all batch of a course
     *
     * @param array $params
     */
    public function batchReorder(Course $course, $params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $batch = $this->batch->filterBySession()->filterByCourseId($course->id)->filterByName($item, 1)->first();
            $batch->position = $index;
            $batch->save();
        }
    }

    /**
     * Get course pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->course_group->selectAll();
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $course_groups = $this->course_group->selectAll();
        return compact('course_groups');
    }

    /**
     * Create a new course.
     *
     * @param array $params
     * @return Course
     */
    public function create($params)
    {
        return $this->course->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $course_id = null)
    {
        $this->course_group->findOrFail(gv($params, 'course_group_id'));

        $name = gv($params, 'name');

        $course_exist_query = (! $course_id) ? $this->course : $this->course->where('id', '!=', $course_id);

        $course_exists = $course_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($course_exists) {
            throw ValidationException::withMessages(['name' => trans('academic.course_exists')]);
        }

        $registration_fee                   = gbv($params, 'enable_registration_fee');
        // $options['attendance_type']         = gv($params, 'attendance_type', config('config.default_attendance_type'));
        $options['enable_registration']     = gbv($params, 'enable_registration');
        $options['enable_registration_fee'] = $registration_fee;
        $options['registration_fee']        = $registration_fee ? gv($params, 'registration_fee') : 0;

        $formatted = [
            'name'            => gv($params, 'name'),
            'description'     => gv($params, 'description'),
            'options'         => $options,
            'course_group_id' => gv($params, 'course_group_id')
        ];

        if (! $course_id) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Update given course.
     *
     * @param Course $course
     * @param array $params
     *
     * @return Course
     */
    public function update(Course $course, $params)
    {
        return $course->forceFill($this->formatParams($params, $course->id))->save();
    }

    /**
     * Find course & check it can be deleted or not.
     *
     * @param integer $id
     * @return Course
     */
    public function deletable($id)
    {
        $course = $this->findOrFail($id);

        if ($course->batches()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.course_associated_with_batch')]);
        }

        if ($course->registrations()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.course_associated_with_registration')]);
        }

        if ($course->enquiryDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.course_associated_with_enquiry')]);
        }

        return $course;
    }

    /**
     * Delete course.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Course $course)
    {
        return $course->delete();
    }

    /**
     * Delete multiple courses.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->course->whereIn('id', $ids)->delete();
    }
}
