<?php
namespace App\Repositories\Resource;

use Illuminate\Support\Str;
use App\Models\Resource\Assignment;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Academic\SubjectRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class AssignmentRepository
{
    protected $assignment;
    protected $upload;
    protected $course_group;
    protected $subject;
    protected $student;
    protected $module = 'assignment';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Assignment $assignment,
        UploadRepository $upload,
        CourseGroupRepository $course_group,
        SubjectRepository $subject,
        StudentRepository $student
    ) {
        $this->assignment = $assignment;
        $this->upload = $upload;
        $this->course_group = $course_group;
        $this->subject = $subject;
        $this->student = $student;
    }

    /**
     * Get assignment query
     *
     * @return Assignment query
     */
    public function getQuery()
    {
        return $this->assignment;
    }

    /**
     * Count Assignment
     *
     * @return integer
     */
    public function count()
    {
        return $this->assignment->filterBySession()->count();
    }

    /**
     * List all assignment by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->assignment->filterBySession()->get()->pluck('title', 'id')->all();
    }

    /**
     * Get all assignments
     *
     * @return array
     */
    public function getAll()
    {
        return $this->assignment->all();
    }

    /**
     * Find assignment with given id.
     *
     * @param integer $id
     * @return Assignment
     */
    public function find($id)
    {
        return $this->assignment->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find assignment with given id or throw an error.
     *
     * @param integer $id
     * @return Assignment
     */
    public function findOrFail($id, $field = 'message')
    {
        $assignment = $this->assignment->info()->filterBySession()->filterById($id)->first();

        if (! $assignment) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_assignment')]);
        }

        return $assignment;
    }

    /**
     * Find assignment with given uuid.
     *
     * @param string $uuid
     * @return Assignment
     */
    public function findByUuid($uuid)
    {
        return $this->assignment->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find assignment with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Assignment
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $assignment = $this->assignment->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $assignment) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_assignment')]);
        }

        return $assignment;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Assignment
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'date_of_assignment');
        $order    = gv($params, 'order', 'desc');
        $title    = gv($params, 'title');
        $batch_id = gv($params, 'batch_id');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $date_of_assignment_start_date = gv($params, 'date_of_assignment_start_date');
        $date_of_assignment_end_date   = gv($params, 'date_of_assignment_end_date');
        $due_date_start_date = gv($params, 'due_date_start_date');
        $due_date_end_date   = gv($params, 'due_date_end_date');

        $query = $this->assignment->info()->filterBySession()->dateOfAssignmentBetween([
                'start_date' => $date_of_assignment_start_date,
                'end_date' => $date_of_assignment_end_date
            ])->dueDateBetween([
                'start_date' => $due_date_start_date,
                'end_date' => $due_date_end_date
            ])->filterByTitle($title);

        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();
            $batch_id = $batch_id ? array_intersect($student_batch_ids, $batch_id) : $student_batch_ids;
        }

        $batch_id = array_unique($batch_id);
        if (count($batch_id)) {
            $query->whereHas('subject',function($q) use($batch_id){
                $q->whereIn('batch_id', $batch_id);
            });                
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all assignment using given params.
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
     * @return Assignment
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get pre requisite
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
        return $this->getPreRequisite();
    }

    /**
     * Create a new assignment.
     *
     * @param array $params
     * @return Assignment
     */
    public function create($params)
    {
        $assignment = $this->assignment->forceCreate($this->formatParams($params));

        $this->processUpload($assignment, $params);

        return $assignment;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $assignment_id = null)
    {
        $title              = gv($params, 'title');
        $date_of_assignment = toDate(gv($params, 'date_of_assignment'));
        $due_date           = toDate(gv($params, 'due_date'));
        $description        = clean(gv($params, 'description'));
        $subject_id         = gv($params, 'subject_id');

        if (! dateBetweenSession($date_of_assignment)) {
            throw ValidationException::withMessages(['date_of_assignment' => trans('resource.not_in_academic_session_range', ['date' => showDate($date_of_assignment)])]);
        }

        $formatted = [
            'subject_id'         => $subject_id,
            'title'              => $title,
            'date_of_assignment' => toDate($date_of_assignment),
            'due_date'           => toDate($due_date),
            'description'        => clean($description),
            'options'            => []
        ];

        if (! $assignment_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid']         = Str::uuid();
            $formatted['employee_id']  = \Auth::user()->Employee->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Assignment $assignment
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Assignment $assignment, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $assignment->id, $upload_token);
        } else {
            $this->upload->update($this->module, $assignment->id, $upload_token);
        }
    }

    /**
     * Check Assignment accessibility.
     *
     * @param Assignment $assignment
     *
     * @return boolean
     */
    public function isAccessible(Assignment $assignment)
    {
        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();

            if (! in_array($assignment->subject->batch_id, $student_batch_ids))
                throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Update given assignment.
     *
     * @param Assignment $assignment
     * @param array $params
     *
     * @return Assignment
     */
    public function update(Assignment $assignment, $params)
    {
        $assignment->forceFill($this->formatParams($params, $assignment->id))->save();

        $this->processUpload($assignment, $params, 'update');

        return $assignment;
    }

    /**
     * Delete assignment.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Assignment $assignment)
    {
        return $assignment->delete();
    }

    /**
     * Delete multiple assignment.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->assignment->whereIn('id', $ids)->delete();
    }
}
