<?php
namespace App\Repositories\Resource;

use Illuminate\Support\Str;
use App\Models\Resource\Notes;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Academic\SubjectRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class NotesRepository
{
    protected $notes;
    protected $upload;
    protected $course_group;
    protected $subject;
    protected $student;
    protected $module = 'notes';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Notes $notes,
        UploadRepository $upload,
        CourseGroupRepository $course_group,
        SubjectRepository $subject,
        StudentRepository $student
    ) {
        $this->notes = $notes;
        $this->upload = $upload;
        $this->course_group = $course_group;
        $this->subject = $subject;
        $this->student = $student;
    }

    /**
     * Get notes query
     *
     * @return Notes query
     */
    public function getQuery()
    {
        return $this->notes;
    }

    /**
     * Count Notes
     *
     * @return integer
     */
    public function count()
    {
        return $this->notes->filterBySession()->count();
    }

    /**
     * List all notes by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->notes->filterBySession()->get()->pluck('title', 'id')->all();
    }

    /**
     * Get all notess
     *
     * @return array
     */
    public function getAll()
    {
        return $this->notes->all();
    }

    /**
     * Find notes with given id.
     *
     * @param integer $id
     * @return Notes
     */
    public function find($id)
    {
        return $this->notes->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find notes with given id or throw an error.
     *
     * @param integer $id
     * @return Notes
     */
    public function findOrFail($id, $field = 'message')
    {
        $notes = $this->notes->info()->filterBySession()->filterById($id)->first();

        if (! $notes) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_notes')]);
        }

        return $notes;
    }

    /**
     * Find notes with given uuid.
     *
     * @param string $uuid
     * @return Notes
     */
    public function findByUuid($uuid)
    {
        return $this->notes->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find notes with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Notes
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $notes = $this->notes->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $notes) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_notes')]);
        }

        return $notes;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Notes
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'created_at');
        $order    = gv($params, 'order', 'desc');
        $title    = gv($params, 'title');
        $batch_id = gv($params, 'batch_id');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->notes->info()->filterBySession()->filterByTitle($title);

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
     * Paginate all notes using given params.
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
     * @return Notes
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
     * Create a new notes.
     *
     * @param array $params
     * @return Notes
     */
    public function create($params)
    {
        $notes = $this->notes->forceCreate($this->formatParams($params));

        $this->processUpload($notes, $params);

        return $notes;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $notes_id = null)
    {
        $title       = gv($params, 'title');
        $description = gv($params, 'description');
        $subject_id  = gv($params, 'subject_id');

        $formatted = [
            'subject_id'  => $subject_id,
            'title'       => $title,
            'description' => clean($description),
            'options'     => []
        ];

        if (! $notes_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid']         = Str::uuid();
            $formatted['employee_id']  = \Auth::user()->Employee->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Notes $notes
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Notes $notes, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $notes->id, $upload_token);
        } else {
            $this->upload->update($this->module, $notes->id, $upload_token);
        }
    }

    /**
     * Check Notes accessibility.
     *
     * @param Notes $notes
     *
     * @return boolean
     */
    public function isAccessible(Notes $notes)
    {
        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();

            if (! in_array($notes->subject->batch_id, $student_batch_ids))
                throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Update given notes.
     *
     * @param Notes $notes
     * @param array $params
     *
     * @return Notes
     */
    public function update(Notes $notes, $params)
    {
        $notes->forceFill($this->formatParams($params, $notes->id))->save();

        $this->processUpload($notes, $params, 'update');

        return $notes;
    }

    /**
     * Delete notes.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Notes $notes)
    {
        return $notes->delete();
    }

    /**
     * Delete multiple notes.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->notes->whereIn('id', $ids)->delete();
    }
}
