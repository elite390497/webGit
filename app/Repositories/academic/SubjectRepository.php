<?php
namespace App\Repositories\Academic;

use App\Models\Academic\Batch;
use App\Models\Academic\Course;
use App\Models\Academic\Subject;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class SubjectRepository
{
    protected $subject;
    protected $batch;
    protected $course_group;
    protected $course;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Subject $subject,
        Batch $batch,
        CourseGroupRepository $course_group,
        Course $course
    ) {
        $this->subject = $subject;
        $this->batch = $batch;
        $this->course_group = $course_group;
        $this->course = $course;
    }

    /**
     * Get subject query
     *
     * @return Subject query
     */
    public function getQuery()
    {
        return $this->subject;
    }

    /**
     * Count subject
     *
     * @return integer
     */
    public function count()
    {
        return $this->subject->filterBySession()->count();
    }

    /**
     * List all subjects by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->subject->filterBySession()->get()->pluck('name_with_code', 'id')->all();
    }

    /**
     * List all subjects by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return generateSelectOption($this->subject->filterBySession()->get()->pluck('name_with_code', 'id')->all());
    }

    /**
     * List all subjects by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->subject->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all subjects
     *
     * @return array
     */
    public function getAll()
    {
        return $this->subject->all();
    }

    /**
     * Find subject with given id.
     *
     * @param integer $id
     * @return Subject
     */
    public function find($id)
    {
        return $this->subject->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find subject with given id or throw an error.
     *
     * @param integer $id
     * @return Subject
     */
    public function findOrFail($id)
    {
        $subject = $this->subject->info()->filterBySession()->filterById($id)->first();

        if (! $subject) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_subject')]);
        }

        return $subject;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Batch
     */
    public function getData($params)
    {
        $sort_by   = gv($params, 'sort_by', 'name');
        $order     = gv($params, 'order', 'asc');
        $course_id = gv($params, 'course_id');

        $course_id = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);

        $query = $this->batch->with([
            'course', 
            'subjects' => function($q) {
                $q->orderBy('position','asc');
            }
        ])->filterBySession()->has('subjects', '>', 0);
        

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $query->whereIn('id', getAuthUserBatchId());
        }

        if (count($course_id)) {
            $query->whereIn('course_id', $course_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all batches using given params.
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
     * @return Batch
     */
    public function print($params)
    {
        $batches = $this->getData($params)->get();

        $course_groups = $this->course_group->getAll();

        return compact('batches', 'course_groups');
    }

    /**
     * Get subject pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $batches = $this->course_group->getBatchOption();

        return compact('batches');
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $courses = $this->course_group->getCourseOption();

        return compact('courses');
    }

    /**
     * Create a new subject.
     *
     * @param array $params
     * @return Subject
     */
    public function create($params)
    {
        $this->validateInput($params);

        return $this->subject->forceCreate($this->formatParams($params));
    }

    /**
     * validate input
     *
     * @param array $params
     */
    public function validateInput($params, $subject = null)
    {
        $batch = $this->batch->findOrFail(gv($params, 'batch_id'));

        $subject_name_query = ($subject) ? $this->subject->where('id', '!=', $subject->id) : $this->subject;

        if ($subject_name_query->filterByBatchId($batch->id)->filterByName(gv($params, 'name'), 1)->count()) {
            throw ValidationException::withMessages(['name' => trans('academic.duplicate_subject_name')]);
        }

        $subject_code_query = ($subject) ? $this->subject->where('id', '!=', $subject->id) : $this->subject;

        if ($subject_code_query->filterByBatchId($batch->id)->filterByCode(gv($params, 'code'), 1)->count()) {
            throw ValidationException::withMessages(['code' => trans('academic.duplicate_subject_code')]);
        }

        $subject_shortcode_query = ($subject) ? $this->subject->where('id', '!=', $subject->id) : $this->subject;

        $shortcode = gv($params, 'shortcode');
        if ($shortcode && $subject_shortcode_query->filterByBatchId($batch->id)->filterByShortcode($shortcode, 1)->count()) {
            throw ValidationException::withMessages(['shortcode' => trans('academic.duplicate_subject_shortcode')]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $subject = null)
    {
        $formatted = [
            'name'               => gv($params, 'name'),
            'code'               => gv($params, 'code'),
            'shortcode'          => gv($params, 'shortcode'),
            'max_class_per_week' => gv($params, 'max_class_per_week'),
            'batch_id'           => gv($params, 'batch_id'),
            'is_elective'        => gbv($params, 'is_elective'),
            'has_no_exam'        => gbv($params, 'has_no_exam'),
            'description'        => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given subject.
     *
     * @param Subject $subject
     * @param array $params
     *
     * @return Subject
     */
    public function update(Subject $subject, $params)
    {
        $this->validateInput($params, $subject);

        return $subject->forceFill($this->formatParams($params, $subject))->save();
    }

    /**
     * Find subject & check it can be deleted or not.
     *
     * @param integer $id
     * @return Subject
     */
    public function deletable($id)
    {
        $subject = $this->findOrFail($id);

        if ($subject->subjectTeachers()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.subject_assigned_to_teacher')]);
        }

        return $subject;
    }

    /**
     * Delete subject.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Subject $subject)
    {
        return $subject->delete();
    }

    /**
     * Delete multiple subjects.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->subject->whereIn('id', $ids)->delete();
    }

    /**
     * Copy subjects.
     *
     * @param integer $batch_id
     */
    public function copy($batch_id)
    {
        $batch = $this->batch->findOrFail($batch_id);

        $course = $this->course->with('batches')->filterBySession()->whereId($batch->course_id)->first();

        $other_batches = $course->Batches->where('id', '!=', $batch->id);

        $other_batch_ids = $other_batches->pluck('id')->all();

        $batches = $this->batch->whereIn('id',$other_batch_ids)->doesnthave('subjects')->get()->pluck('id')->all();

        if (! $batches) {
            throw ValidationException::withMessages(['message' => trans('academic.batch_already_has_subject')]);
        }

        $data = array();

        $subjects = $this->subject->filterByBatchId($batch->id)->get();

        foreach ($batches as $batch) {
            foreach ($subjects as $subject) {
                $data[] = array(
                    'name'               => $subject->name,
                    'code'               => $subject->code,
                    'shortcode'          => $subject->shortcode,
                    'max_class_per_week' => $subject->max_class_per_week,
                    'batch_id'           => $batch,
                    'is_elective'        => $subject->is_elective,
                    'has_no_exam'        => $subject->has_no_exam
                );
            }
        }

        $this->subject->insert($data);
    }

    /**
     * Delete batch subjects.
     *
     * @param integer $batch_id
     */
    public function batchDelete($batch_id)
    {
        $batch = $this->batch->findOrFail($batch_id);

        $this->subject->filterByBatchId($batch->id)->delete();
    }
}
