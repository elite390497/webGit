<?php
namespace App\Repositories\Resource;

use Illuminate\Support\Str;
use App\Models\Resource\LessonPlan;
use App\Models\Resource\LessonPlanDetail;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Academic\SubjectRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class LessonPlanRepository
{
    protected $lesson_plan;
    protected $upload;
    protected $course_group;
    protected $subject;
    protected $student;
    protected $lesson_plan_detail;
    protected $module = 'lesson_plan';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        LessonPlan $lesson_plan,
        UploadRepository $upload,
        CourseGroupRepository $course_group,
        SubjectRepository $subject,
        StudentRepository $student,
        LessonPlanDetail $lesson_plan_detail
    ) {
        $this->lesson_plan = $lesson_plan;
        $this->upload = $upload;
        $this->course_group = $course_group;
        $this->subject = $subject;
        $this->student = $student;
        $this->lesson_plan_detail = $lesson_plan_detail;
    }

    /**
     * Get lesson plan query
     *
     * @return LessonPlan query
     */
    public function getQuery()
    {
        return $this->lesson_plan;
    }

    /**
     * Count Lesson Plan
     *
     * @return integer
     */
    public function count()
    {
        return $this->lesson_plan->filterBySession()->count();
    }

    /**
     * List all lesson plan by topic & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->lesson_plan->filterBySession()->get()->pluck('topic', 'id')->all();
    }

    /**
     * Get all lesson plans
     *
     * @return array
     */
    public function getAll()
    {
        return $this->lesson_plan->all();
    }

    /**
     * Find lesson plan with given id.
     *
     * @param integer $id
     * @return LessonPlan
     */
    public function find($id)
    {
        return $this->lesson_plan->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find lesson plan with given id or throw an error.
     *
     * @param integer $id
     * @return LessonPlan
     */
    public function findOrFail($id, $field = 'message')
    {
        $lesson_plan = $this->lesson_plan->info()->filterBySession()->filterById($id)->first();

        if (! $lesson_plan) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_lesson_plan')]);
        }

        return $lesson_plan;
    }

    /**
     * Find lesson plan with given uuid.
     *
     * @param string $uuid
     * @return LessonPlan
     */
    public function findByUuid($uuid)
    {
        return $this->lesson_plan->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find lesson plan with given uuid or throw an error.
     *
     * @param string $uuid
     * @return LessonPlan
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $lesson_plan = $this->lesson_plan->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $lesson_plan) {
            throw ValidationException::withMessages([$field => trans('resource.could_not_find_lesson_plan')]);
        }

        return $lesson_plan;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return LessonPlan
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'start_date');
        $order    = gv($params, 'order', 'desc');
        $topic    = gv($params, 'topic');
        $batch_id = gv($params, 'batch_id');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->lesson_plan->info()->filterBySession()->filterByTopic($topic);

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
     * Paginate all lesson plan using given params.
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
     * @return LessonPlan
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
     * Create a new lesson plan.
     *
     * @param array $params
     * @return LessonPlan
     */
    public function create($params)
    {
        $lesson_plan = $this->lesson_plan->forceCreate($this->formatParams($params));

        $this->updateLessonPlanDetail($lesson_plan, $params);

        $this->processUpload($lesson_plan, $params);

        return $lesson_plan;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $lesson_plan_id = null)
    {
        $topic      = gv($params, 'topic');
        $start_date = toDate(gv($params, 'start_date'));
        $end_date   = toDate(gv($params, 'end_date'));
        $subject_id = gv($params, 'subject_id');

        if (! dateBetweenSession($start_date)) {
            throw ValidationException::withMessages(['start_date' => trans('resource.not_in_academic_session_range', ['date' => showDate($start_date)])]);
        }

        if (! dateBetweenSession($end_date)) {
            throw ValidationException::withMessages(['end_date' => trans('resource.not_in_academic_session_range', ['date' => showDate($end_date)])]);
        }

        $details = gv($params, 'details', []);

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('resource.lesson_plan_detail_missing')]);
        }

        $titles = array();
        foreach ($details as $index => $detail) {
            $title = gv($detail, 'title');
            $description = gv($detail, 'description');

            if (! $title) {
                throw ValidationException::withMessages([$index.'_detail_title' => trans('validation.required', ['attribute' => trans('resource.lesson_plan_detail_title')])]);
            }

            if (! $description) {
                throw ValidationException::withMessages([$index.'_detail_description' => trans('validation.required', ['attribute' => trans('resource.lesson_plan_detail_description')])]);
            }

            $titles[] = $title;
        }

        if (count($titles) != count(array_unique($titles))) {
            throw ValidationException::withMessages(['message' => trans('resource.lesson_plan_detail_title_duplicate')]);
        }

        $formatted = [
            'subject_id' => $subject_id,
            'topic'      => $topic,
            'start_date' => toDate($start_date),
            'end_date'   => toDate($end_date),
            'options'    => []
        ];

        if (! $lesson_plan_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid']         = Str::uuid();
            $formatted['employee_id']  = \Auth::user()->Employee->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param LessonPlan $lesson_plan
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(LessonPlan $lesson_plan, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $lesson_plan->id, $upload_token);
        } else {
            $this->upload->update($this->module, $lesson_plan->id, $upload_token);
        }
    }

    /**
     * Check Lesson plan accessibility.
     *
     * @param LessonPlan $lesson_plan
     *
     * @return boolean
     */
    public function isAccessible(LessonPlan $lesson_plan)
    {
        if (\Auth::user()->hasAnyRole([
                config('system.default_role.parent'),
                config('system.default_role.student'),
            ])
        ) {
            $student_batch_ids = getAuthUserBatchId();
            
            if (! in_array($lesson_plan->subject->batch_id, $student_batch_ids))
                throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Update lesson plan detail.
     *
     * @param LessonPlan $lesson_plan
     * @param array $params
     *
     * @return LessonPlan
     */
    public function updateLessonPlanDetail(LessonPlan $lesson_plan, $params)
    {
        $details = gv($params, 'details');

        $previous_titles = $lesson_plan->LessonPlanDetails->pluck('title')->all();

        $titles = array();
        foreach ($details as $detail) {
            $title = gv($detail, 'title');
            $lesson_plan_detail = $this->lesson_plan_detail->firstOrCreate([
                'title' => $title
            ]);

            $titles[] = $title;
            $lesson_plan_detail->lesson_plan_id = $lesson_plan->id;
            $lesson_plan_detail->description = gv($detail, 'description');
            $lesson_plan_detail->save();
        }

        foreach ($previous_titles as $previous_title) {
            if (!in_array($previous_title, $titles)) {
                $this->lesson_plan_detail->filterByLessonPlanId($lesson_plan->id)->filterByTitle($previous_title,1)->delete();
            }
        }
    }

    /**
     * Update given lesson plan.
     *
     * @param LessonPlan $lesson_plan
     * @param array $params
     *
     * @return LessonPlan
     */
    public function update(LessonPlan $lesson_plan, $params)
    {
        $lesson_plan->forceFill($this->formatParams($params, $lesson_plan->id))->save();

        $this->updateLessonPlanDetail($lesson_plan, $params);

        $this->processUpload($lesson_plan, $params, 'update');

        return $lesson_plan;
    }

    /**
     * Delete lesson plan.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(LessonPlan $lesson_plan)
    {
        return $lesson_plan->delete();
    }

    /**
     * Delete multiple lesson plan.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->lesson_plan->whereIn('id', $ids)->delete();
    }
}
