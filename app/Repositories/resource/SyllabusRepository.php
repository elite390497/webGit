<?php
namespace App\Repositories\Resource;

use Illuminate\Support\Str;
use App\Models\Resource\Syllabus;
use App\Models\Resource\SyllabusTopic;
use App\Models\Resource\SyllabusDetail;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Academic\SubjectRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class SyllabusRepository
{
    protected $syllabus;
    protected $upload;
    protected $course_group;
    protected $subject;
    protected $student;
    protected $syllabus_detail;
    protected $syllabus_topic;
    protected $module = 'syllabus';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Syllabus $syllabus,
        UploadRepository $upload,
        CourseGroupRepository $course_group,
        SubjectRepository $subject,
        StudentRepository $student,
        SyllabusDetail $syllabus_detail,
        SyllabusTopic $syllabus_topic
    ) {
        $this->syllabus = $syllabus;
        $this->upload = $upload;
        $this->course_group = $course_group;
        $this->subject = $subject;
        $this->student = $student;
        $this->syllabus_detail = $syllabus_detail;
        $this->syllabus_topic = $syllabus_topic;
    }

    /**
     * Get syllabus query
     *
     * @return Syllabus query
     */
    public function getQuery()
    {
        return $this->syllabus;
    }

    /**
     * Count Lesson Plan
     *
     * @return integer
     */
    public function count()
    {
        return $this->syllabus->filterBySession()->count();
    }

    /**
     * List all syllabus by topic & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->syllabus->filterBySession()->get()->pluck('topic', 'id')->all();
    }

    /**
     * Get all syllabuss
     *
     * @return array
     */
    public function getAll()
    {
        return $this->syllabus->all();
    }

    /**
     * Find syllabus with given id.
     *
     * @param integer $id
     * @return Syllabus
     */
    public function find($id)
    {
        return $this->syllabus->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find syllabus with given id or throw an error.
     *
     * @param integer $id
     * @return Syllabus
     */
    public function findOrFail($id, $field = 'message')
    {
        $syllabus = $this->syllabus->info()->filterBySession()->filterById($id)->first();

        if (! $syllabus) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_syllabus')]);
        }

        return $syllabus;
    }

    /**
     * Find syllabus with given uuid.
     *
     * @param string $uuid
     * @return Syllabus
     */
    public function findByUuid($uuid)
    {
        return $this->syllabus->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find syllabus with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Syllabus
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $syllabus = $this->syllabus->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $syllabus) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_syllabus')]);
        }

        return $syllabus;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Syllabus
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'created_at');
        $order    = gv($params, 'order', 'desc');
        $title    = gv($params, 'title');
        $batch_id = gv($params, 'batch_id');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->syllabus->info()->filterBySession()->filterByTitle($title);

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
     * Paginate all syllabus using given params.
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
     * @return Syllabus
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
     * Create a new syllabus.
     *
     * @param array $params
     * @return Syllabus
     */
    public function create($params)
    {
        $syllabus = $this->syllabus->forceCreate($this->formatParams($params));

        $this->updateSyllabusDetail($syllabus, $params);

        $this->updateSyllabusTopic($syllabus, $params);

        $this->processUpload($syllabus, $params);

        return $syllabus;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $syllabus_id = null)
    {
        $subject_id = gv($params, 'subject_id');

        $details = gv($params, 'details', []);

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('resource.syllabus_detail_missing')]);
        }

        $titles = array();
        foreach ($details as $index => $detail) {
            $title = gv($detail, 'title');
            $description = gv($detail, 'description');

            if (! $title) {
                throw ValidationException::withMessages([$index.'_detail_title' => trans('validation.required', ['attribute' => trans('resource.syllabus_detail_title')])]);
            }

            if (! $description) {
                throw ValidationException::withMessages([$index.'_detail_description' => trans('validation.required', ['attribute' => trans('resource.syllabus_detail_description')])]);
            }

            $titles[] = $title;
        }

        if (count($titles) != count(array_unique($titles))) {
            throw ValidationException::withMessages(['message' => trans('resource.syllabus_detail_title_duplicate')]);
        }

        $topics = gv($params, 'topics', []);

        if (! $topics) {
            throw ValidationException::withMessages(['message' => trans('resource.syllabus_topic_missing')]);
        }

        $titles = array();
        foreach ($topics as $index => $topic) {
            $title       = gv($topic, 'title');
            $start_date  = toDate(gv($topic, 'start_date'));
            $end_date    = toDate(gv($topic, 'end_date'));
            $description = gv($topic, 'description');

            if (! $title) {
                throw ValidationException::withMessages([$index.'_topic_title' => trans('validation.required', ['attribute' => trans('resource.syllabus_topic_title')])]);
            }

            if (! $description) {
                throw ValidationException::withMessages([$index.'_topic_description' => trans('validation.required', ['attribute' => trans('resource.syllabus_topic_description')])]);
            }

            if ($start_date && $end_date && toDate($end_date) < toDate($start_date)) {
                throw ValidationException::withMessages(['message' => trans('resource.syllabus_topic_start_date_greater_than_end_date')]);
            }

            $titles[] = $title;
        }

        if (count($titles) != count(array_unique($titles))) {
            throw ValidationException::withMessages(['message' => trans('resource.syllabus_topic_title_duplicate')]);
        }

        $formatted = [
            'title'       => gv($params, 'title'),
            'description' => gv($params, 'description'),
            'subject_id'  => $subject_id,
            'options'     => []
        ];

        if (! $syllabus_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid']         = Str::uuid();
            $formatted['employee_id']  = \Auth::user()->Employee->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Syllabus $syllabus
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Syllabus $syllabus, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $syllabus->id, $upload_token);
        } else {
            $this->upload->update($this->module, $syllabus->id, $upload_token);
        }
    }

    /**
     * Check Syllabus accessibility.
     *
     * @param Syllabus $syllabus
     *
     * @return boolean
     */
    public function isAccessible(Syllabus $syllabus)
    {
        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();
            
            if (! in_array($syllabus->subject->batch_id, $student_batch_ids))
                throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Update syllabus detail.
     *
     * @param Syllabus $syllabus
     * @param array $params
     *
     * @return Syllabus
     */
    public function updateSyllabusDetail(Syllabus $syllabus, $params)
    {
        $details = gv($params, 'details');

        $previous_titles = $syllabus->SyllabusDetails->pluck('title')->all();

        $titles = array();
        foreach ($details as $detail) {
            $title = gv($detail, 'title');
            $syllabus_detail = $this->syllabus_detail->firstOrCreate([
                'title' => $title
            ]);

            $titles[] = $title;
            $syllabus_detail->syllabus_id = $syllabus->id;
            $syllabus_detail->description = gv($detail, 'description');
            $syllabus_detail->save();
        }

        foreach ($previous_titles as $previous_title) {
            if (!in_array($previous_title, $titles)) {
                $this->syllabus_detail->filterBySyllabusId($syllabus->id)->filterByTitle($previous_title,1)->delete();
            }
        }
    }

    /**
     * Update syllabus topic.
     *
     * @param Syllabus $syllabus
     * @param array $params
     *
     * @return Syllabus
     */
    public function updateSyllabusTopic(Syllabus $syllabus, $params)
    {
        $topics = gv($params, 'topics');

        $previous_titles = $syllabus->SyllabusTopics->pluck('title')->all();

        $titles = array();
        foreach ($topics as $topic) {
            $title = gv($topic, 'title');
            $syllabus_topic = $this->syllabus_topic->firstOrCreate([
                'title' => $title
            ]);

            $titles[] = $title;
            $syllabus_topic->syllabus_id = $syllabus->id;
            $syllabus_topic->start_date = toDate(gv($topic, 'start_date'));
            $syllabus_topic->end_date = toDate(gv($topic, 'end_date'));
            $syllabus_topic->description = gv($topic, 'description');
            $syllabus_topic->save();
        }

        foreach ($previous_titles as $previous_title) {
            if (!in_array($previous_title, $titles)) {
                $this->syllabus_topic->filterBySyllabusId($syllabus->id)->filterByTitle($previous_title,1)->delete();
            }
        }
    }

    /**
     * Update given syllabus.
     *
     * @param Syllabus $syllabus
     * @param array $params
     *
     * @return Syllabus
     */
    public function update(Syllabus $syllabus, $params)
    {
        $syllabus->forceFill($this->formatParams($params, $syllabus->id))->save();

        $this->updateSyllabusDetail($syllabus, $params);

        $this->processUpload($syllabus, $params, 'update');

        return $syllabus;
    }

    /**
     * Delete syllabus.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Syllabus $syllabus)
    {
        return $syllabus->delete();
    }

    /**
     * Delete multiple syllabus.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->syllabus->whereIn('id', $ids)->delete();
    }
}
