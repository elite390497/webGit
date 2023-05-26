<?php
namespace App\Repositories\Configuration\Exam;

use App\Models\Configuration\Exam\Assessment;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Exam\AssessmentDetail;

class AssessmentRepository
{
    protected $exam_assessment;
    protected $exam_assessment_detail;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Assessment $exam_assessment,
        AssessmentDetail $exam_assessment_detail
    ) {
        $this->exam_assessment = $exam_assessment;
        $this->exam_assessment_detail = $exam_assessment_detail;
    }

    /**
     * Get exam assessment query
     *
     * @return Assessment query
     */
    public function getQuery()
    {
        return $this->exam_assessment;
    }

    /**
     * Count exam assessment
     *
     * @return integer
     */
    public function count()
    {
        return $this->exam_assessment->filterBySession()->count();
    }

    /**
     * List all exam assessments by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->exam_assessment->filterBySession()->all()->pluck('name', 'id')->all();
    }

    /**
     * List all exam assessments by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->exam_assessment->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all exam assessments by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->exam_assessment->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all exam assessments
     *
     * @return array
     */
    public function getAll()
    {
        return $this->exam_assessment->info()->filterBySession()->get();
    }

    /**
     * Find exam assessment with given id.
     *
     * @param integer $id
     * @return Assessment
     */
    public function find($id)
    {
        return $this->exam_assessment->filterBySession()->info()->find($id);
    }

    /**
     * Find exam assessment with given id or throw an error.
     *
     * @param integer $id
     * @return Assessment
     */
    public function findOrFail($id)
    {
        $exam_assessment = $this->exam_assessment->filterBySession()->info()->find($id);

        if (! $exam_assessment) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_assessment')]);
        }

        return $exam_assessment;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Assessment
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->exam_assessment->filterBySession()->info()->orderBy($sort_by, $order);
    }

    /**
     * Paginate all exam assessments using given params.
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
     * @return Assessment
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new exam assessment.
     *
     * @param array $params
     * @return Assessment
     */
    public function create($params)
    {
        $exam_assessment = $this->exam_assessment->forceCreate($this->formatParams($params));

        $this->updateDetail($exam_assessment, $params);

        return $exam_assessment;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $exam_assessment_id
     * @return array
     */
    private function formatParams($params, $exam_assessment_id = null)
    {
        $name = gv($params, 'name');

        $query = (! $exam_assessment_id) ? $this->exam_assessment : $this->exam_assessment->where('id', '!=', $exam_assessment_id);

        $exam_assessment_exists = $query->filterByName($name, 1)->count();

        if ($exam_assessment_exists) {
            throw ValidationException::withMessages(['name' => trans('validation.unique', ['attribute' => trans('exam.assessment')])]);
        }

        $details = gv($params, 'details', []);

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('exam.assessment_detail_missing')]);
        }

        $names = array();
        $codes = array();
        foreach ($details as $index => $detail) {
            $name            = gv($detail, 'name');
            $code            = gv($detail, 'code');
            $max_mark        = gv($detail, 'max_mark');
            $pass_percentage = gv($detail, 'pass_percentage');
            $description     = gv($detail, 'description');

            if (! $name) {
                throw ValidationException::withMessages([$index.'_detail_name' => trans('validation.required', ['attribute' => trans('exam.assessment_detail_name')])]);
            }

            if (! $code) {
                throw ValidationException::withMessages([$index.'_detail_code' => trans('validation.required', ['attribute' => trans('exam.assessment_detail_code')])]);
            }

            if (! is_numeric($max_mark)) {
                throw ValidationException::withMessages([$index.'_detail_max_mark' => trans('validation.numeric', ['attribute' => trans('exam.assessment_detail_max_mark')])]);
            }

            if ($max_mark <= 0) {
                throw ValidationException::withMessages([$index.'_detail_max_mark' => trans('validation.min.numeric', ['attribute' => trans('exam.assessment_detail_max_mark'), 'min' => 1])]);
            }

            if (! is_numeric($pass_percentage) && $pass_percentage != 0) {
                throw ValidationException::withMessages([$index.'_detail_pass_percentage' => trans('validation.numeric', ['attribute' => trans('exam.assessment_detail_pass_percentage')])]);
            }

            if ($pass_percentage < 0) {
                throw ValidationException::withMessages([$index.'_detail_pass_percentage' => trans('validation.min.numeric', ['attribute' => trans('exam.assessment_detail_pass_percentage'), 'min' => 0])]);
            }

            if ($pass_percentage > 100) {
                throw ValidationException::withMessages([$index.'_detail_pass_percentage' => trans('validation.max.numeric', ['attribute' => trans('exam.assessment_detail_pass_percentage'), 'max' => 100])]);
            }

            $names[] = $name;
            $codes[] = $code;
        }

        if (count($names) != count(array_unique($names))) {
            throw ValidationException::withMessages(['message' => trans('resource.assessment_detail_name_duplicate')]);
        }

        if (count($codes) != count(array_unique($codes))) {
            throw ValidationException::withMessages(['message' => trans('resource.assessment_detail_code_duplicate')]);
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
     * Update exam assessment detail.
     *
     * @param ExamAssessment $exam_assessment
     * @param array $params
     *
     * @return ExamAssessment
     */
    public function updateDetail(Assessment $exam_assessment, $params)
    {
        $details = gv($params, 'details');

        $previous_names = $exam_assessment->Details->pluck('name')->all();

        $names = array();
        foreach ($details as $detail) {
            $name            = gv($detail, 'name');
            $code            = gv($detail, 'code');
            $max_mark        = gv($detail, 'max_mark');
            $pass_percentage = gv($detail, 'pass_percentage');
            $description     = gv($detail, 'description');

            $exam_assessment_detail = $this->exam_assessment_detail->filterByExamAssessmentId($exam_assessment->id)->firstOrCreate([
                'exam_assessment_id' => $exam_assessment->id,
                'name' => $name
            ]);

            $names[] = $name;
            $exam_assessment_detail->max_mark = formatNumber($max_mark);
            $exam_assessment_detail->pass_percentage = formatNumber($pass_percentage);
            $exam_assessment_detail->exam_assessment_id = $exam_assessment->id;
            $exam_assessment_detail->code = $code;
            $exam_assessment_detail->description = $description;
            $exam_assessment_detail->options = [];
            $exam_assessment_detail->save();
        }

        foreach ($previous_names as $previous_name) {
            if (!in_array($previous_name, $names)) {
                $this->exam_assessment_detail->filterByExamAssessmentId($exam_assessment->id)->filterByName($previous_name,1)->delete();
            }
        }
    }

    /**
     * Update given exam assessment.
     *
     * @param Assessment $exam_assessment
     * @param array $params
     *
     * @return Assessment
     */
    public function update(Assessment $exam_assessment, $params)
    {
        $exam_schedules = $exam_assessment->schedules;

        foreach ($exam_schedules as $exam_schedule) {
            foreach ($exam_schedule->records as $record) {
                if ((is_array($record->marks) && count($record->marks)) || $record->getOption('assessment_details')) {
                    throw ValidationException::withMessages(['message' => trans('exam.assessment_associated_with_exam')]);
                }
            }
        }
        
        $exam_assessment->forceFill($this->formatParams($params, $exam_assessment->id))->save();
        
        $this->updateDetail($exam_assessment, $params);

        return $exam_assessment;
    }

    /**
     * Reorder all details of a assessment
     *
     * @param array $params
     */
    public function reorder(Assessment $exam_assessment, $params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $detail = $this->exam_assessment_detail->filterByExamAssessmentId($exam_assessment->id)->filterByName($item, 1)->first();
            $detail->position = $index;
            $detail->save();
        }
    }

    /**
     * Find exam assessment & check it can be deleted or not.
     *
     * @param integer $id
     * @return Assessment
     */
    public function deletable($id)
    {
        $exam_assessment = $this->findOrFail($id);

        if ($exam_assessment->schedules()->count()) {
            throw ValidationException::withMessages(['message' => trans('exam.assessment_associated_with_exam')]);
        }

        return $exam_assessment;
    }

    /**
     * Delete exam assessment.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Assessment $exam_assessment)
    {
        return $exam_assessment->delete();
    }

    /**
     * Delete multiple exam assessments.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->exam_assessment->whereIn('id', $ids)->delete();
    }
}
