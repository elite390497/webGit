<?php
namespace App\Repositories\Academic;

use App\Models\Academic\Batch;
use App\Models\Academic\Course;
use App\Models\Academic\Subject;
use App\Models\Finance\Fee\FeeHead;
use App\Models\Finance\Fee\FeeGroup;
use App\Models\Academic\AcademicSession;
use App\Models\Transport\TransportCircle;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Academic\CourseGroup;
use App\Repositories\Configuration\ConfigurationRepository;

class AcademicSessionRepository
{
    protected $academic_session;
    protected $config;
    protected $course_group;
    protected $course;
    protected $batch;
    protected $subject;
    protected $fee_group;
    protected $fee_head;
    protected $transport_circle;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        AcademicSession $academic_session,
        ConfigurationRepository $config,
        CourseGroup $course_group,
        Course $course,
        Batch $batch,
        Subject $subject,
        FeeGroup $fee_group,
        FeeHead $fee_head,
        TransportCircle $transport_circle
    ) {
        $this->academic_session = $academic_session;
        $this->config = $config;
        $this->course_group = $course_group;
        $this->course = $course;
        $this->batch = $batch;
        $this->subject = $subject;
        $this->fee_group = $fee_group;
        $this->fee_head = $fee_head;
        $this->transport_circle = $transport_circle;
    }

    /**
     * Get academic session query
     *
     * @return AcademicSession query
     */
    public function getQuery()
    {
        return $this->academic_session;
    }

    /**
     * Count academic session
     *
     * @return integer
     */
    public function count()
    {
        return $this->academic_session->count();
    }

    /**
     * List all academic sessions by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->academic_session->all()->pluck('name', 'id')->all();
    }

    /**
     * List all academic sessions by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->academic_session->all()->pluck('id')->all();
    }

    /**
     * Get all academic sessions
     *
     * @return array
     */
    public function getAll()
    {
        return $this->academic_session->all();
    }

    /**
     * Get default academic session
     *
     * @return array
     */
    public function default()
    {
        return $this->academic_session->filterByIsDefault(1)->first();
    }

    public function getNextSession()
    {
        return $this->academic_session->where('start_date', '>', config('config.default_academic_session.end_date'))->orderBy('start_date', 'asc')->first();
    }

    /**
     * Find academic session with given id.
     *
     * @param integer $id
     * @return AcademicSession
     */
    public function find($id)
    {
        return $this->academic_session->find($id);
    }

    /**
     * Find academic session with given id or throw an error.
     *
     * @param integer $id
     * @return AcademicSession
     */
    public function findOrFail($id)
    {
        $academic_session = $this->academic_session->find($id);

        if (! $academic_session) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_session')]);
        }

        return $academic_session;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return AcademicSession
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'start_date');
        $order       = gv($params, 'order', 'desc');

        return $this->academic_session->orderBy($sort_by, $order);
    }

    /**
     * Paginate all academic sessions using given params.
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
     * @return AcademicSession
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get academic session pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $data = getVar('data');
        $transfer_certificate_formats = gv($data, 'transfer_certificate_formats', []);

        return compact('transfer_certificate_formats');
    }

    /**
     * Import data
     *
     * @param array $params
     * @return void
     */
    public function import($params)
    {
        $academic_session_id = gv($params, 'academic_session_id');

        $academic_session = $this->findOrFail($academic_session_id);

        beginTransaction();

        if (gbv($params, 'course_group')) {
            $this->importCourseGroup($academic_session, $params);
        }

        if (gbv($params, 'fee_group')) {
            $this->importFeeGroup($academic_session, $params);
        }

        if (gbv($params, 'transport_circle')) {
            $this->importTransportCircle($academic_session, $params);
        }

        commitTransaction();
    }

    /**
     * Import Course Group
     *
     * @param AcademicSession $academic_session
     * @param Array $params
     * @return void
     */
    private function importCourseGroup(AcademicSession $academic_session, $params)
    {
        $course_groups = $this->course_group->filterBySession($academic_session->id)->get();

        if (! $course_groups) {
            throw ValidationException::withMessages(['message' => trans('general.no_data_found', ['data' => trans('academic.course_group')])]);
        }

        $session_id = config('config.default_academic_session.id');

        foreach ($course_groups as $course_group) {
            $new_course_group = $this->course_group->filterByName($course_group->name, 1)->filterBySession($session_id)->first();

            if (! $new_course_group) {
                $new_course_group = $course_group->replicate();
                $new_course_group->academic_session_id = $session_id;
                $new_course_group->save();
            }

            if (gbv($params, 'course')) {
                $this->importCourse($course_group, $new_course_group, $params);
            }
        }
    }

    /**
     * Import Course
     *
     * @param CourseGroup $course_group
     * @param CourseGroup $new_course_group
     * @param Array $params
     * @return void
     */
    private function importCourse(CourseGroup $course_group, CourseGroup $new_course_group, $params)
    {
        $courses = $course_group->Courses;

        if (! $courses) {
            throw ValidationException::withMessages(['message' => trans('general.no_data_found', ['data' => trans('academic.course')])]);
        }

        $session_id = config('config.default_academic_session.id');

        foreach ($courses as $course) {
            $new_course = $this->course->filterByName($course->name, 1)->filterBySession($session_id)->first();

            if (! $new_course) {
                $new_course = $course->replicate();
                $new_course->academic_session_id = $session_id;
                $new_course->course_group_id = $new_course_group->id;
                $new_course->save();
            }

            if (gbv($params, 'batch')) {
                $this->importBatch($course, $new_course, $params);
            }
        }
    }

    /**
     * Import Batch
     *
     * @param CourseGroup $course
     * @param CourseGroup $new_course
     * @param Array $params
     * @return void
     */
    private function importBatch(Course $course, Course $new_course, $params)
    {
        $batches = $course->Batches;

        if (! $batches) {
            throw ValidationException::withMessages(['message' => trans('general.no_data_found', ['data' => trans('academic.batch')])]);
        }

        foreach ($batches as $batch) {
            $new_batch = $this->batch->filterByName($batch->name, 1)->filterByCourseId($new_course->id)->first();

            if (! $new_batch) {
                $new_batch = $batch->replicate();
                $new_batch->course_id = $new_course->id;
                $new_batch->save();
            }

            if (gbv($params, 'subject')) {
                $this->importSubject($batch, $new_batch);
            }
        }
    }

    /**
     * Import Batch
     *
     * @param Batch $batch
     * @param Batch $new_batch
     * @return void
     */
    private function importSubject(Batch $batch, Batch $new_batch)
    {
        $subjects = $batch->Subjects;

        if (! $subjects) {
            throw ValidationException::withMessages(['message' => trans('general.no_data_found', ['data' => trans('academic.subject')])]);
        }

        foreach ($subjects as $subject) {
            $new_subject = $this->subject->filterByName($subject->name, 1)->filterByBatchId($new_batch->id)->first();

            if (! $new_subject) {
                $new_subject = $subject->replicate();
                $new_subject->batch_id = $new_batch->id;
                $new_subject->save();
            }
        }
    }

    /**
     * Import Fee Group
     *
     * @param AcademicSession $academic_session
     * @param Array $params
     * @return void
     */
    private function importFeeGroup(AcademicSession $academic_session, $params)
    {
        $fee_groups = $this->fee_group->filterBySession($academic_session->id)->get();

        if (! $fee_groups) {
            throw ValidationException::withMessages(['message' => trans('general.no_data_found', ['data' => trans('finance.fee_group')])]);
        }

        $session_id = config('config.default_academic_session.id');

        foreach ($fee_groups as $fee_group) {
            $new_fee_group = $this->fee_group->filterByName($fee_group->name, 1)->filterBySession($session_id)->first();

            if (! $new_fee_group) {
                $new_fee_group = $fee_group->replicate();
                $new_fee_group->academic_session_id = $session_id;
                $new_fee_group->save();
            }

            if (gbv($params, 'fee_head')) {
                $this->importFeeHead($fee_group, $new_fee_group, $params);
            }
        }
    }

    /**
     * Import Fee Head
     *
     * @param FeeGroup $fee_group
     * @param FeeGroup $new_fee_group
     * @param Array $params
     * @return void
     */
    private function importFeeHead(FeeGroup $fee_group, FeeGroup $new_fee_group, $params)
    {
        $fee_heads = $fee_group->FeeHeads;

        if (! $fee_heads) {
            throw ValidationException::withMessages(['message' => trans('general.no_data_found', ['data' => trans('finance.fee_heads')])]);
        }

        $session_id = config('config.default_academic_session.id');

        foreach ($fee_heads as $fee_head) {
            $new_fee_head = $this->fee_head->filterByName($fee_head->name, 1)->filterBySession($session_id)->first();

            if (! $new_fee_head) {
                $new_fee_head = $fee_head->replicate();
                $new_fee_head->fee_group_id = $new_fee_group->id;
                $new_fee_head->save();
            }
        }
    }

    /**
     * Import Transport Circle
     *
     * @param AcademicSession $academic_session
     * @param Array $params
     * @return void
     */
    private function importTransportCircle(AcademicSession $academic_session, $params)
    {
        $transport_circles = $this->transport_circle->filterBySession($academic_session->id)->get();

        if (! $transport_circles) {
            throw ValidationException::withMessages(['message' => trans('general.no_data_found', ['data' => trans('transport.transport_circle')])]);
        }

        $session_id = config('config.default_academic_session.id');

        foreach ($transport_circles as $transport_circle) {
            $new_transport_circle = $this->transport_circle->filterByName($transport_circle->name, 1)->filterBySession($session_id)->first();

            if (! $new_transport_circle) {
                $new_transport_circle = $transport_circle->replicate();
                $new_transport_circle->academic_session_id = $session_id;
                $new_transport_circle->save();
            }
        }
    }

    /**
     * Create a new academic_session.
     *
     * @param array $params
     * @return AcademicSession
     */
    public function create($params)
    {
        $academic_session = $this->academic_session->forceCreate($this->formatParams($params));

        if ($this->count() == 1)
            $this->config->setupWizard(['action' => 'hide']);

        return $academic_session;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $academic_session_id = null)
    {
        $is_default = gbv($params, 'is_default');

        if ($is_default) {
            if ($academic_session_id) {
                $this->academic_session->where('id', '!=', $academic_session_id)->update(['is_default' => 0]);
            } else {
                $this->academic_session->whereNotNull('id')->update(['is_default' => 0]);
            }
        }

        $start_date = toDate(gv($params, 'start_date'));
        $end_date   = toDate(gv($params, 'end_date'));

        $overlapping_query = (! $academic_session_id) ? $this->academic_session : $this->academic_session->where('id', '!=', $academic_session_id);

        $overlapping = $overlapping_query->where(function ($q) use ($start_date, $end_date) {
            $q->where(function($q1) use($start_date, $end_date) {
                $q1->where('start_date','<=',$start_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q2) use($start_date) {
                $q2->where('start_date','<=',$start_date)->where('end_date','>',$start_date);
            })->orWhere(function($q2) use($end_date) {
                $q2->where('start_date','<',$end_date)->where('end_date','>=',$end_date);
            })->orWhere(function($q3) use($start_date, $end_date) {
                $q3->where('start_date','>',$start_date)->where('end_date','<',$end_date);
            });
        })->count();

        if ($overlapping) {
            throw ValidationException::withMessages(['start_date' => trans('academic.session_overlapping')]);
        }

        $transfer_certificate_format = gv($params, 'transfer_certificate_format');
        $transfer_certificate_formats = gkv(gv(getVar('data'), 'transfer_certificate_formats', []), 'id');

        if ($transfer_certificate_format && ! in_array($transfer_certificate_format, $transfer_certificate_formats)) {
            throw ValidationException::withMessages(['transfer_certificate_format' => trans('general.invalid_input')]);
        }

        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description'),
            'is_default'  => $is_default
        ];

        $options['transfer_certificate_format'] = $transfer_certificate_format;
        $formatted['options'] = $options;

        if (! $academic_session_id) {
            $formatted['start_date'] = $start_date;
            $formatted['end_date']   = $end_date;
        }

        if ($this->count() < 1) {
            $formatted['is_default'] =  1;
        }

        return $formatted;
    }

    /**
     * Update given academic session.
     *
     * @param AcademicSession $academic_session
     * @param array $params
     *
     * @return AcademicSession
     */
    public function update(AcademicSession $academic_session, $params)
    {
        if (isTestMode()) {
            throw ValidationException::withMessages(['message' => trans('general.restricted_test_mode_action')]);
        }

        $academic_session->forceFill($this->formatParams($params, $academic_session->id))->save();

        if (! $this->default()) {
            $default_academic_session = $this->academic_session->first();
            $default_academic_session->is_default = 1;
            $default_academic_session->save();
        }

        return $academic_session;
    }

    /**
     * Find academic session & check it can be deleted or not.
     *
     * @param integer $id
     * @return AcademicSession
     */
    public function deletable($id)
    {
        $academic_session = $this->findOrFail($id);

        if (isTestMode()) {
            throw ValidationException::withMessages(['message' => trans('general.restricted_test_mode_action')]);
        }

        if ($academic_session->is_default) {
            throw ValidationException::withMessages(['message' => trans('academic.default_session_cannot_be_deleted')]);
        }
        
        if ($academic_session->courseGroups()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_course_group')]);
        }
        
        if ($academic_session->courses()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_course')]);
        }
        
        if ($academic_session->feeGroups()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_fee_group')]);
        }
        
        if ($academic_session->transportCircles()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_transport_circle')]);
        }
        
        if ($academic_session->transportFees()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_transport_fee')]);
        }
        
        if ($academic_session->studentRecords()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_student_record')]);
        }
        
        if ($academic_session->feeConcessions()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_fee_concession')]);
        }
        
        if ($academic_session->classTimings()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.session_associated_with_class_timing')]);
        }

        return $academic_session;
    }

    /**
     * Delete academic session.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(AcademicSession $academic_session)
    {
        return $academic_session->delete();
    }

    /**
     * Delete multiple academic sessions.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->academic_session->whereIn('id', $ids)->delete();
    }

    /**
     * Set academic session as default for particular user.
     *
     * @param AcademicSession $academic_session
     *
     * @return AcademicSession
     */
    public function setUserDefault($academic_session)
    {
        $this->alreadySetAsUserDefault($academic_session);

        $user_preference = \Auth::user()->UserPreference;
        $user_preference->academic_session_id = $academic_session->id;
        $user_preference->save();
        
        return $academic_session;
    }

    /**
     * Check if academic session is already default for user.
     *
     * @param AcademicSession $academic_session
     *
     * @return null
     */
    public function alreadySetAsUserDefault($academic_session)
    {
        if (\Auth::user()->UserPreference->academic_session_id === $academic_session->id) {
            throw ValidationException::withMessages(['message' => trans('academic.session_currently_in_use')]);
        }
    }
}
