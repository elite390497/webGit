<?php
namespace App\Repositories\Academic;

use Illuminate\Support\Str;
use App\Models\Academic\Batch;
use App\Models\Academic\Subject;
use App\Models\Academic\Timetable;
use App\Models\Academic\ClassTiming;
use App\Models\Academic\TimetableSession;
use App\Models\Academic\TimetableAllocation;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Models\Academic\TimetableAllocationDetail;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class TimetableRepository
{
    protected $timetable;
    protected $class_timing;
    protected $batch;
    protected $course_group;
    protected $timetable_allocation;
    protected $subject;
    protected $timetable_allocation_detail;
    protected $student;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Timetable $timetable,
        ClassTiming $class_timing,
        Batch $batch,
        CourseGroupRepository $course_group,
        TimetableAllocation $timetable_allocation,
        Subject $subject,
        TimetableAllocationDetail $timetable_allocation_detail,
        StudentRepository $student
    ) {
        $this->timetable = $timetable;
        $this->class_timing = $class_timing;
        $this->batch = $batch;
        $this->course_group = $course_group;
        $this->timetable_allocation = $timetable_allocation;
        $this->subject = $subject;
        $this->timetable_allocation_detail = $timetable_allocation_detail;
        $this->student = $student;
    }

    /**
     * Find timetable with given id.
     *
     * @param integer $id
     * @return Timetable
     */
    public function find($id)
    {
        return $this->timetable->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find timetable with given id or throw an error.
     *
     * @param integer $id
     * @return Timetable
     */
    public function findOrFail($id, $field = 'message')
    {
        $timetable = $this->timetable->info()->filterBySession()->filterById($id)->first();

        if (! $timetable) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_timetable')]);
        }

        return $timetable;
    }

    /**
     * Find timetable with given uuid.
     *
     * @param string $uuid
     * @return Timetable
     */
    public function findByUuid($uuid)
    {
        return $this->timetable->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find timetable with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Timetable
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $timetable = $this->timetable->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $timetable) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_timetable')]);
        }

        return $timetable;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Tiemtable
     */
    public function getData($params)
    {
        $sort_by        = gv($params, 'sort_by', 'date_effective');
        $order          = gv($params, 'order', 'desc');
        $batch_id       = gv($params, 'batch_id');
        $date_effective = gv($params, 'date_effective');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->timetable->info()->filterBySession();

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
            $query->whereIn('batch_id', $batch_id);
        }

        if ($date_effective) {
            $query->where('date_effective', '<=', $date_effective);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all timetables using given params.
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
     * @return Timetable
     */
    public function print($params)
    {
        $date_effective = gv($params, 'date_effective', date('Y-m-d'));

        if (! dateBetweenSession($date_effective)) {
            throw ValidationException::withMessages(['message' => trans('academic.invalid_session_date_range')]);
        }

        return $this->getData($params)->get();
    }

    /**
     * Get timetable pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $class_timings = generateSelectOption($this->class_timing->filterBySession()->get()->pluck('name', 'id')->all());

        $batches = $this->course_group->getBatchOption();

        $days = getDaysInOrder();

        return compact('class_timings', 'batches', 'days');
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $batches = $this->course_group->getBatchOption();

        return compact('batches');
    }

    public function getAllotmentPreRequisite(Timetable $timetable)
    {
        return $this->subject->with('subjectTeachers', 'subjectTeachers.employee')->filterByBatchId($timetable->batch_id)->get();
    }

    /**
     * Create a new timetable.
     *
     * @param array $params
     * @return Timetable
     */
    public function create($params)
    {
        $this->validateTimetable($params);

        $this->validateInput($params);

        $timetable = $this->timetable->forceCreate([
            'uuid'           => Str::uuid(),
            'batch_id'       => gv($params, 'batch_id'),
            'date_effective' => toDate(gv($params, 'date_effective')),
            'description'    => gv($params, 'description'),
            'options'        => []
        ]);

        foreach (gv($params, 'days') as $day) {
            $is_weekoff = gbv($day, 'is_weekoff');

            $this->timetable_allocation->create([
                'timetable_id'    => $timetable->id,
                'class_timing_id' => (! $is_weekoff) ? gv($day, 'class_timing_id') : null,
                'day'             => gv($day, 'day')
            ]);
        }

        return $timetable;
    }

    /**
     * Validate timetable input.
     *
     * @param array $params
     * @return void
     */
    private function validateTimetable($params, $timetable_id = null)
    {
        $batch_id = gv($params, 'batch_id');
        $date_effective = toDate(gv($params, 'date_effective'));

        $batch = $this->batch->filterBySession()->whereId($batch_id)->first();

        if (! $batch) {
            throw ValidationException::withMessages(['batch_id' => trans('academic.could_not_find_batch')]);
        }

        if (! dateBetweenSession($date_effective)) {
            throw ValidationException::withMessages(['date_effective' => trans('academic.invalid_session_date_range')]);
        }

        $timetable_exist_query = ($timetable_id) ? $this->timetable->where('id', '!=', $timetable_id) : $this->timetable;

        if ($timetable_exist_query->whereBatchId($batch->id)->where('date_effective', '>=', $date_effective)->count()) {
            throw ValidationException::withMessages(['date_effective' => trans('academic.timetable_exists_for_previous_date')]);
        }
    }

    /**
     * Validate timetable days input.
     *
     * @param array $params
     * @return void
     */
    public function validateInput($params, $timetable_id = null)
    {
        $class_timings = $this->class_timing->filterBySession()->get()->pluck('id')->all();

        $days = gv($params, 'days');

        if (count($days) != 7) {
            throw ValidationException::withMessages(['message' => trans('academic.week_days_missing')]);
        }

        $list = getVar('list');
        $weekdays = isset($list['day']) ? $list['day'] : [];

        foreach ($days as $index => $day) {
            $is_weekoff = gbv($day, 'is_weekoff');
            $class_timing_id = gv($day, 'class_timing_id');
            $day_name = gv($day, 'day');

            if (! in_array($day_name, $weekdays)) {
                throw ValidationException::withMessages(['message' => trans('academic.invalid_week_day', ['attribute' => $day_name])]);
            }

            if (! $is_weekoff) {
                if (! in_array($class_timing_id, $class_timings)) {
                    throw ValidationException::withMessages([$index.'_class_timing' => trans('validation.required', ['attribute' => trans('academic.class_timing')])]);
                }
            }
        }
    }

    /**
     * Timetable allocation.
     *
     * @param Timetable $timetable
     * @param array $params
     * @return Timetable
     */
    public function allocation(Timetable $timetable, $params)
    {
        $days = gv($params, 'days', []);

        $allowed_subject_ids = $this->subject->filterByBatchId($timetable->batch_id)->get()->pluck('id')->all();

        $class_timings = $this->class_timing->filterBySession()->get();

        $timetable_allocation_ids = $timetable->TimetableAllocations->pluck('id')->all();

        foreach ($days as $day) {
            $sessions = gv($day, 'sessions', []);
            $timetable_allocation_id = gv($day, 'timetable_allocation_id');

            if (! in_array($timetable_allocation_id, $timetable_allocation_ids)) {
                throw ValidationException::withMessages(['message' => trans('academic.could_not_find_timetable')]);
            }

            foreach ($sessions as $session) {
                $subject_id = gv($session, 'subject_id');
                $session_id = gv($session, 'id');

                if ($subject_id && ! in_array($subject_id, $allowed_subject_ids)) {
                    throw ValidationException::withMessages(['message' => trans('academic.could_not_find_subject')]);
                }

                $timetable_allocation_detail = $this->timetable_allocation_detail->firstOrCreate([
                    'timetable_allocation_id' => $timetable_allocation_id,
                    'class_timing_session_id' => $session_id
                ]);

                $timetable_allocation_detail->subject_id = $subject_id;
                $timetable_allocation_detail->save();
            }
        }
    }

    /**
     * Update given Timetable.
     *
     * @param Timetable $timetable
     * @param array $params
     *
     * @return Timetable
     */
    public function update(Timetable $timetable, $params)
    {
        $this->validateTimetable($params, $timetable->id);
        
        $this->validateInput($params, $timetable->id);

        foreach ($timetable->TimetableAllocations as $timetable_allocation) {
            if ($timetable_allocation->TimetableAllocationDetails->count()) {
                throw ValidationException::withMessages(['message' => trans('academic.timetable_cannot_be_changed_after_allocation')]);
            }
        }

        $timetable->batch_id       = gv($params, 'batch_id');
        $timetable->date_effective = toDate(gv($params, 'date_effective'));
        $timetable->description    = gv($params, 'description');
        $timetable->save();

        foreach (gv($params, 'days') as $day) {
            $is_weekoff = gbv($day, 'is_weekoff');

            $timetable_allocation = $this->timetable_allocation->firstOrCreate([
                'timetable_id' => $timetable->id,
                'day' => gv($day, 'day')
            ]);

            $timetable_allocation->class_timing_id = (! $is_weekoff) ? gv($day, 'class_timing_id') : null;
            $timetable_allocation->save();
        }
    }

    /**
     * Find timetable & check it can be deleted or not.
     *
     * @param string $uuid
     * @return Timetable
     */
    public function deletable($uuid)
    {
        $timetable = $this->findByUuidOrFail($uuid);

        return $timetable;
    }

    /**
     * Delete timetable.
     *
     * @param Timetable $timetable
     * @return bool|null
     */
    public function delete(Timetable $timetable)
    {
        return $timetable->delete();
    }

    /**
     * Delete multiple timetables.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->timetable->whereIn('id', $ids)->delete();
    }

    /**
     * Get max session of given timetable.
     *
     * @param Timetable $timetable
     * @return integer
     */
    public function getMaxSessionOfTimetable(Timetable $timetable)
    {
        $max_session = 0;

        foreach ($timetable->TimetableAllocations as $allocation) {
            $session_count = $allocation->TimetableAllocationDetails->count();
            $max_session = $session_count > $max_session ? $session_count : $max_session;
        }
        
        return $max_session;
    }

    public function getAllBatchesTimetable($params)
    {
        $batch_id = gv($params, 'batch_id');
        $date = gv($params, 'date_effective');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);
        $date = $date ? toDate($date) : date('Y-m-d');

        $query = $this->batch->with('timetables', 'timetables.batch', 'timetables.batch.course', 'timetables.timetableAllocations', 'timetables.timetableAllocations.timetableAllocationDetails', 'timetables.timetableAllocations.classTiming', 'timetables.timetableAllocations.classTiming.classTimingSessions', 'timetables.timetableAllocations.timetableAllocationDetails.subject', 'timetables.timetableAllocations.timetableAllocationDetails.subject.subjectTeachers', 'timetables.timetableAllocations.timetableAllocationDetails.subject.subjectTeachers.employee', 'timetables.timetableAllocations.timetableAllocationDetails.classTimingSession')->filterBySession();

        if ($batch_id) {
            $query->whereIn('id', $batch_id);
        }
        
        $batches = $query->get();

        foreach ($batches as $batch) {
            foreach ($batch->Timetables as $timetable) {
                $timetable->max_session = $this->getMaxSessionOfTimetable($timetable);
            }
        }

        return $batches;
    }
}
