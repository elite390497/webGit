<?php
namespace App\Repositories\Configuration\Exam;

use App\Models\Configuration\Exam\Observation;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Exam\ObservationDetail;

class ObservationRepository
{
    protected $exam_observation;
    protected $exam_observation_detail;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Observation $exam_observation,
        ObservationDetail $exam_observation_detail
    ) {
        $this->exam_observation = $exam_observation;
        $this->exam_observation_detail = $exam_observation_detail;
    }

    /**
     * Get exam observation query
     *
     * @return Observation query
     */
    public function getQuery()
    {
        return $this->exam_observation;
    }

    /**
     * Count exam observation
     *
     * @return integer
     */
    public function count()
    {
        return $this->exam_observation->filterBySession()->count();
    }

    /**
     * List all exam observations by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->exam_observation->filterBySession()->all()->pluck('name', 'id')->all();
    }

    /**
     * List all exam observations by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->exam_observation->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all exam observations by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->exam_observation->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all exam observations
     *
     * @return array
     */
    public function getAll()
    {
        return $this->exam_observation->filterBySession()->get();
    }

    /**
     * Find exam observation with given id.
     *
     * @param integer $id
     * @return Observation
     */
    public function find($id)
    {
        return $this->exam_observation->filterBySession()->info()->find($id);
    }

    /**
     * Find exam observation with given id or throw an error.
     *
     * @param integer $id
     * @return Observation
     */
    public function findOrFail($id)
    {
        $exam_observation = $this->exam_observation->filterBySession()->info()->find($id);

        if (! $exam_observation) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_observation')]);
        }

        return $exam_observation;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Observation
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->exam_observation->filterBySession()->info()->orderBy($sort_by, $order);
    }

    /**
     * Paginate all exam observations using given params.
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
     * @return Observation
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new exam observation.
     *
     * @param array $params
     * @return Observation
     */
    public function create($params)
    {
        $exam_observation = $this->exam_observation->forceCreate($this->formatParams($params));

        $this->updateDetail($exam_observation, $params);

        return $exam_observation;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $exam_observation_id
     * @return array
     */
    private function formatParams($params, $exam_observation_id = null)
    {
        $name = gv($params, 'name');

        $query = (! $exam_observation_id) ? $this->exam_observation : $this->exam_observation->where('id', '!=', $exam_observation_id);

        $exam_observation_exists = $query->filterByName($name, 1)->count();

        if ($exam_observation_exists) {
            throw ValidationException::withMessages(['name' => trans('validation.unique', ['attribute' => trans('exam.observation')])]);
        }

        $details = gv($params, 'details', []);

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('exam.observation_detail_missing')]);
        }

        $names = array();
        $codes = array();
        foreach ($details as $index => $detail) {
            $name            = gv($detail, 'name');
            $max_mark        = gv($detail, 'max_mark');
            $description     = gv($detail, 'description');

            if (! $name) {
                throw ValidationException::withMessages([$index.'_detail_name' => trans('validation.required', ['attribute' => trans('exam.observation_detail_name')])]);
            }

            if (! is_numeric($max_mark)) {
                throw ValidationException::withMessages([$index.'_detail_max_mark' => trans('validation.numeric', ['attribute' => trans('exam.observation_detail_max_mark')])]);
            }

            if ($max_mark <= 0) {
                throw ValidationException::withMessages([$index.'_detail_max_mark' => trans('validation.min.numeric', ['attribute' => trans('exam.observation_detail_max_mark'), 'min' => 1])]);
            }

            $names[] = $name;
        }

        if (count($names) != count(array_unique($names))) {
            throw ValidationException::withMessages(['message' => trans('resource.observation_detail_name_duplicate')]);
        }

        $formatted = [
            'name'                => gv($params, 'name'),
            'academic_session_id' => config('config.default_academic_session.id'),
            'description'         => gv($params, 'description'),
            'options'             => []
        ];

        return $formatted;
    }

    /**
     * Update exam observation detail.
     *
     * @param ExamObservation $exam_observation
     * @param array $params
     *
     * @return ExamObservation
     */
    public function updateDetail(Observation $exam_observation, $params)
    {
        $details = gv($params, 'details');

        $previous_names = $exam_observation->Details->pluck('name')->all();

        $names = array();
        foreach ($details as $detail) {
            $name            = gv($detail, 'name');
            $max_mark        = gv($detail, 'max_mark');
            $description     = gv($detail, 'description');

            $exam_observation_detail = $this->exam_observation_detail->firstOrCreate([
                'exam_observation_id' => $exam_observation->id,
                'name' => $name
            ]);

            $names[] = $name;
            $exam_observation_detail->max_mark = formatNumber($max_mark);
            $exam_observation_detail->exam_observation_id = $exam_observation->id;
            $exam_observation_detail->description = $description;
            $exam_observation_detail->options = [];
            $exam_observation_detail->save();
        }

        foreach ($previous_names as $previous_name) {
            if (!in_array($previous_name, $names)) {
                $this->exam_observation_detail->filterByExamObservationId($exam_observation->id)->filterByName($previous_name,1)->delete();
            }
        }
    }

    /**
     * Update given exam observation.
     *
     * @param Observation $exam_observation
     * @param array $params
     *
     * @return Observation
     */
    public function update(Observation $exam_observation, $params)
    {
        $batches = $exam_observation->batches;

        foreach ($batches as $batch) {
            foreach ($batch->schedules as $schedule) {
                if (is_array($schedule->observation_marks) && count($schedule->observation_marks)) {
                    throw ValidationException::withMessages(['message' => trans('exam.observation_associated_with_exam')]);
                }
            }
        }
        
        $exam_observation->forceFill($this->formatParams($params, $exam_observation->id))->save();

        $this->updateDetail($exam_observation, $params);

        return $exam_observation;
    }

    /**
     * Reorder all details of a observation
     *
     * @param array $params
     */
    public function reorder(Observation $exam_observation, $params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $detail = $this->exam_observation_detail->filterByExamObservationId($exam_observation->id)->filterByName($item, 1)->first();
            $detail->position = $index;
            $detail->save();
        }
    }

    /**
     * Find exam observation & check it can be deleted or not.
     *
     * @param integer $id
     * @return Observation
     */
    public function deletable($id)
    {
        $exam_observation = $this->findOrFail($id);
        
        if ($exam_observation->batches()->count()) {
            throw ValidationException::withMessages(['message' => trans('exam.observation_associated_with_exam')]);
        }

        return $exam_observation;
    }

    /**
     * Delete exam observation.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Observation $exam_observation)
    {
        return $exam_observation->delete();
    }

    /**
     * Delete multiple exam observations.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->exam_observation->whereIn('id', $ids)->delete();
    }
}
