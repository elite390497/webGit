<?php
namespace App\Repositories\Academic;

use Illuminate\Support\Str;
use App\Models\Academic\ClassTiming;
use App\Models\Academic\ClassTimingSession;
use Illuminate\Validation\ValidationException;

class ClassTimingRepository
{
    protected $class_timing;
    protected $class_timing_session;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        ClassTiming $class_timing,
        ClassTimingSession $class_timing_session
    ) {
        $this->class_timing = $class_timing;
        $this->class_timing_session = $class_timing_session;
    }

    /**
     * Find class timing with given id.
     *
     * @param integer $id
     * @return ClassTiming
     */
    public function find($id)
    {
        return $this->class_timing->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find class timing with given id or throw an error.
     *
     * @param integer $id
     * @return ClassTiming
     */
    public function findOrFail($id)
    {
        $class_timing = $this->class_timing->info()->filterBySession()->filterById($id)->first();

        if (! $class_timing) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_class_timing')]);
        }

        return $class_timing;
    }

    /**
     * Find class timing with given uuid.
     *
     * @param string $uuid
     * @return ClassTiming
     */
    public function findByUuid($uuid)
    {
        return $this->class_timing->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find class timing with given uuid or throw an error.
     *
     * @param string $uuid
     * @return ClassTiming
     */
    public function findByUuidOrFail($uuid)
    {
        $class_timing = $this->class_timing->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $class_timing) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_class_timing')]);
        }

        return $class_timing;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return ClassTiming
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'name');
        $order       = gv($params, 'order', 'asc');

        return $this->class_timing->info()->filterBySession()->orderBy($sort_by, $order);
    }

    /**
     * Paginate all class timings using given params.
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
     * @return Classtiming
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new class timing.
     *
     * @param array $params
     * @return ClassTiming
     */
    public function create($params)
    {
        $this->validateInput($params);

        $class_timing = $this->class_timing->forceCreate([
            'uuid'                => Str::uuid(),
            'academic_session_id' => config('config.default_academic_session.id'),
            'name'                => gv($params, 'name'),
            'description'         => gv($params, 'description'),
            'options'             => []
        ]);

        foreach (gv($params, 'sessions') as $session) {
            $this->class_timing_session->forceCreate([
                'uuid'            => Str::uuid(),
                'class_timing_id' => $class_timing->id,
                'name'            => gv($session, 'name'),
                'start'           => gv($session, 'start_hour', 0).':'.gv($session, 'start_min', 0),
                'end'             => gv($session, 'end_hour', 0).':'.gv($session, 'end_min', 0),
                'is_a_break'      => gbv($session, 'is_a_break'),
                'options'         => []
            ]);
        }

        return $class_timing;
    }

    /**
     * Validate class timing input.
     *
     * @param array $params
     * @return void
     */
    public function validateInput($params, $class_timing_id = null)
    {
        $sessions = gv($params, 'sessions');

        if (! $sessions) {
            throw ValidationException::withMessages(['message' => trans('academic.no_class_timing_session_found')]);
        }

        $class_timing_name_exist_query = ($class_timing_id) ? $this->class_timing->where('id', '!=', $class_timing_id) : $this->class_timing;

        if ($class_timing_name_exist_query->filterBySession()->filterByName(gv($params, 'name'), 1)->count()) {
            throw ValidationException::withMessages(['name' => trans('academic.class_timing_name_exists')]);
        }

        $session_names = array();
        foreach ($sessions as $index => $session) {
            $name = gv($session, 'name');

            if (! $name) {
                throw ValidationException::withMessages([$index.'_name' => trans('validation.required', ['attribute' => trans('academic.class_timing_session')])]);
            }

            $session_names[] = $name;

            $start_hour = gv($session, 'start_hour', 0);
            $end_hour = gv($session, 'end_hour', 0);
            $start_min = gv($session, 'start_min', 0);
            $end_min = gv($session, 'end_min', 0);

            if (! is_numeric($start_hour) || $start_hour < 0 || $start_hour > 23) {
                throw ValidationException::withMessages([$index.'_start_hour' => trans('academic.invalid_class_timing_session_hour')]);
            }

            if (! is_numeric($start_min) || $start_min < 0 || $start_min > 55) {
                throw ValidationException::withMessages([$index.'_start_min' => trans('academic.invalid_class_timing_session_min')]);
            }

            if (! is_numeric($end_hour) || $end_hour < 0 || $end_hour > 23) {
                throw ValidationException::withMessages([$index.'_end_hour' => trans('academic.invalid_class_timing_session_hour')]);
            }
            
            if (! is_numeric($end_min) || $end_min < 0 || $end_min > 55) {
                throw ValidationException::withMessages([$index.'_end_min' => trans('academic.invalid_class_timing_session_min')]);
            }

            $start = numberPadding($start_hour, 2).':'.numberPadding($start_min, 2);
            $end = numberPadding($end_hour, 2).':'.numberPadding($end_min, 2);

            if ($start > $end) {
                throw ValidationException::withMessages([$index.'_end_hour' => trans('academic.start_time_cannot_greater_than_end_time')]);
            }

            if ($start == $end) {
                throw ValidationException::withMessages([$index.'_end_hour' => trans('academic.start_time_cannot_same_as_end_time')]);
            }

            if (isset($previous_end) && $start != $previous_end) {
                throw ValidationException::withMessages([$index.'_start_hour' => trans('academic.no_gap_between_class_timing_session')]);
            }

            $previous_end = $end;
        }

        if (count($sessions) > count(array_unique($session_names))) {
            throw ValidationException::withMessages(['message' => trans('academic.duplicate_class_timing_session_name')]);
        }
    }

    /**
     * Update given Class Timing.
     *
     * @param ClassTiming $class_timing
     * @param array $params
     *
     * @return ClassTiming
     */
    public function update(ClassTiming $class_timing, $params)
    {
        $this->validateInput($params, $class_timing->id);

        if ($class_timing->TimetableAllocations->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.class_timing_associated_with_timetable')]);
        }

        $class_timing->name = gv($params, 'name');
        $class_timing->description = gv($params, 'description');
        $class_timing->save();

        $session_uuid = array();
        foreach ($params['sessions'] as $session) {
            $session_uuid[] = gv($session, 'uuid');
        }

        $previous_sessions = $class_timing->ClassTimingSessions->pluck('uuid')->all();
        foreach ($previous_sessions as $previous_session) {
            if (!in_array($previous_session, $session_uuid)) {
                $this->class_timing_session->whereUuid($previous_session)->delete();
            }
        }

        foreach ($params['sessions'] as $session) {
            $uuid = gv($session, 'uuid');
            $class_timing_session = $this->class_timing_session->firstOrCreate([
                'uuid' => $uuid
            ]);

            $class_timing_session->uuid            = $uuid;
            $class_timing_session->class_timing_id = $class_timing->id;
            $class_timing_session->name            = gv($session, 'name');
            $class_timing_session->description     = gv($session, 'description');
            $class_timing_session->start           = gv($session, 'start_hour', 0).':'.gv($session, 'start_min', 0);
            $class_timing_session->end             = gv($session, 'end_hour', 0).':'.gv($session, 'end_min', 0);
            $class_timing_session->is_a_break      = gbv($session, 'is_a_break');
            $class_timing_session->options         = [];
            $class_timing_session->save();
        }
    }

    /**
     * Find class timing & check it can be deleted or not.
     *
     * @param string $uuid
     * @return ClassTiming
     */
    public function deletable($uuid)
    {
        $class_timing = $this->findByUuidOrFail($uuid);

        if ($class_timing->TimetableAllocations->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.class_timing_associated_with_timetable')]);
        }

        return $class_timing;
    }

    /**
     * Delete class timing.
     *
     * @param ClassTiming $class_timing
     * @return bool|null
     */
    public function delete(ClassTiming $class_timing)
    {
        return $class_timing->delete();
    }

    /**
     * Delete multiple class timings.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->class_timing->whereIn('id', $ids)->delete();
    }
}
