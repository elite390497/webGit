<?php
namespace App\Repositories\Configuration\Exam;

use App\Models\Configuration\Exam\Grade;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Exam\GradeDetail;

class GradeRepository
{
    protected $exam_grade;
    protected $exam_grade_detail;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Grade $exam_grade,
        GradeDetail $exam_grade_detail
    ) {
        $this->exam_grade = $exam_grade;
        $this->exam_grade_detail = $exam_grade_detail;
    }

    /**
     * Get exam grade query
     *
     * @return Grade query
     */
    public function getQuery()
    {
        return $this->exam_grade;
    }

    /**
     * Count exam grade
     *
     * @return integer
     */
    public function count()
    {
        return $this->exam_grade->filterBySession()->count();
    }

    /**
     * List all exam grades by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->exam_grade->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all exam grades by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->exam_grade->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all exam grades by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->exam_grade->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all exam grades
     *
     * @return array
     */
    public function getAll()
    {
        return $this->exam_grade->filterBySession()->get();
    }

    /**
     * Find exam grade with given id.
     *
     * @param integer $id
     * @return Grade
     */
    public function find($id)
    {
        return $this->exam_grade->filterBySession()->info()->find($id);
    }

    /**
     * Find exam grade with given id or throw an error.
     *
     * @param integer $id
     * @return Grade
     */
    public function findOrFail($id)
    {
        $exam_grade = $this->exam_grade->filterBySession()->info()->find($id);

        if (! $exam_grade) {
            throw ValidationException::withMessages(['message' => trans('exam.could_not_find_grade')]);
        }

        return $exam_grade;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Grade
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->exam_grade->info()->filterBySession()->orderBy($sort_by, $order);
    }

    /**
     * Paginate all exam grades using given params.
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
     * @return Grade
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new exam grade.
     *
     * @param array $params
     * @return Grade
     */
    public function create($params)
    {
        $exam_grade = $this->exam_grade->forceCreate($this->formatParams($params));

        $this->updateDetail($exam_grade, $params);

        return $exam_grade;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $exam_grade_id
     * @return array
     */
    private function formatParams($params, $exam_grade_id = null)
    {
        $name = gv($params, 'name');

        $query = (! $exam_grade_id) ? $this->exam_grade : $this->exam_grade->where('id', '!=', $exam_grade_id);

        $exam_grade_exists = $query->filterByName($name, 1)->count();

        if ($exam_grade_exists) {
            throw ValidationException::withMessages(['name' => trans('validation.unique', ['attribute' => trans('exam.grade')])]);
        }

        $details = gv($params, 'details', []);

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('exam.grade_detail_missing')]);
        }

        $names = array();
        foreach ($details as $index => $detail) {
            $name = gv($detail, 'name');
            $min_percentage = gv($detail, 'min_percentage', 0);
            $max_percentage = gv($detail, 'max_percentage');
            $description = gv($detail, 'description');

            if (! $name) {
                throw ValidationException::withMessages([$index.'_detail_name' => trans('validation.required', ['attribute' => trans('exam.grade_detail_name')])]);
            }

            if (! is_numeric($min_percentage)) {
                throw ValidationException::withMessages([$index.'_detail_min_percentage' => trans('validation.numeric', ['attribute' => trans('exam.grade_detail_min_percentage')])]);
            }

            if ($min_percentage < 0) {
                throw ValidationException::withMessages([$index.'_detail_min_percentage' => trans('validation.min.numeric', ['attribute' => trans('exam.grade_detail_min_percentage'), 'min' => 0])]);
            }

            if (! is_numeric($max_percentage)) {
                throw ValidationException::withMessages([$index.'_detail_max_percentage' => trans('validation.numeric', ['attribute' => trans('exam.grade_detail_max_percentage')])]);
            }

            if ($max_percentage <= 0) {
                throw ValidationException::withMessages([$index.'_detail_max_percentage' => trans('validation.min.numeric', ['attribute' => trans('exam.grade_detail_max_percentage'), 'min' => 1])]);
            }

            if ($min_percentage > $max_percentage) {
                throw ValidationException::withMessages([$index.'_detail_max_percentage' => trans('validation.gt.numeric', ['attribute' => trans('exam.grade_detail_max_percentage'), 'value' => trans('exam.grade_detail_min_percentage')])]);
            }

            $names[] = $name;
        }

        if (count($names) != count(array_unique($names))) {
            throw ValidationException::withMessages(['message' => trans('resource.grade_detail_name_duplicate')]);
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
     * Update exam grade detail.
     *
     * @param ExamGrade $exam_grade
     * @param array $params
     *
     * @return ExamGrade
     */
    public function updateDetail(Grade $exam_grade, $params)
    {
        $details = gv($params, 'details');

        $previous_names = $exam_grade->Details->pluck('name')->all();

        $names = array();
        foreach ($details as $detail) {
            $name           = gv($detail, 'name');
            $min_percentage = gv($detail, 'min_percentage');
            $max_percentage = gv($detail, 'max_percentage');
            $description    = gv($detail, 'description');

            $exam_grade_detail = $this->exam_grade_detail->filterByExamGradeId($exam_grade->id)->firstOrCreate([
                'exam_grade_id' => $exam_grade->id,
                'name' => $name
            ]);

            $names[] = $name;
            $exam_grade_detail->min_percentage = formatNumber($min_percentage);
            $exam_grade_detail->max_percentage = formatNumber($max_percentage);
            $exam_grade_detail->exam_grade_id = $exam_grade->id;
            $exam_grade_detail->description = $description;
            $exam_grade_detail->options = [];
            $exam_grade_detail->save();
        }

        foreach ($previous_names as $previous_name) {
            if (!in_array($previous_name, $names)) {
                $this->exam_grade_detail->filterByExamGradeId($exam_grade->id)->filterByName($previous_name,1)->delete();
            }
        }
    }

    /**
     * Update given exam grade.
     *
     * @param Grade $exam_grade
     * @param array $params
     *
     * @return Grade
     */
    public function update(Grade $exam_grade, $params)
    {
        $exam_grade->forceFill($this->formatParams($params, $exam_grade->id))->save();

        $this->updateDetail($exam_grade, $params);

        return $exam_grade;
    }

    /**
     * Find exam grade & check it can be deleted or not.
     *
     * @param integer $id
     * @return Grade
     */
    public function deletable($id)
    {
        $exam_grade = $this->findOrFail($id);
        
        if ($exam_grade->schedules()->count()) {
            throw ValidationException::withMessages(['message' => trans('exam.grade_associated_with_exam')]);
        }

        return $exam_grade;
    }

    /**
     * Delete exam grade.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Grade $exam_grade)
    {
        return $exam_grade->delete();
    }

    /**
     * Delete multiple exam grades.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->exam_grade->whereIn('id', $ids)->delete();
    }
}
