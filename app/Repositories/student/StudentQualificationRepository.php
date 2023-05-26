<?php
namespace App\Repositories\Student;

use App\Models\Student\StudentQualification;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;

class StudentQualificationRepository
{
    protected $student_qualification;
    protected $upload;
    protected $module = 'student_qualification';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentQualification $student_qualification,
        UploadRepository $upload
    ) {
        $this->student_qualification = $student_qualification;
        $this->upload = $upload;
    }

    /**
     * Get student qualification query
     *
     * @return StudentQualification query
     */
    public function getQuery()
    {
        return $this->student_qualification;
    }

    /**
     * Find student qualification with given id.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentQualification
     */
    public function find($student_id, $id)
    {
        return $this->student_qualification->filterByStudentId($student_id)->filterById($id)->first();
    }

    /**
     * Find student qualification with given id or throw an error.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentQualification
     */
    public function findOrFail($student_id, $id, $field = 'message')
    {
        $student_qualification = $this->student_qualification->filterByStudentId($student_id)->filterById($id)->first();

        if (! $student_qualification) {
            throw ValidationException::withMessages([$field => trans('student.could_not_find_qualification')]);
        }

        return $student_qualification;
    }

    /**
     * Paginate all student qualifications using given params.
     *
     * @param integer $student_id
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($student_id, $params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->student_qualification->filterByStudentId($student_id)->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Create a new student qualification.
     *
     * @param integer $student_id
     * @param array $params
     * @return StudentQualification
     */
    public function create($student_id, $params)
    {
        $this->validateInput($student_id, $params);

        $this->upload->validateUpload($params, $this->module);

        $student_qualification = $this->student_qualification->forceCreate($this->formatParams($params, $student_id));

        $this->processUpload($student_qualification, $params);

        return $student_qualification;
    }

    /**
     * Validate unique standard with student.
     *
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput($student_id, $params, $id = null)
    {
        $query = $this->student_qualification->filterByStudentId($student_id);

        if ($id) {
            $query->where('id', '!=', $id);
        }

        if ($query->filterByStandard(gv($params, 'standard'))->count()) {
            throw ValidationException::withMessages(['standard' => trans('validation.unique', ['attribute' => trans('student.qualification_standard')])]);
        }

        $start_period = gv($params, 'start_period').'-01';
        $end_period = gv($params, 'end_period').'-01';

        if ($start_period > $end_period) {
            throw ValidationException::withMessages(['start_period' => trans('student.qualification_start_period_greater_than_end_period')]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $student_id = null, $action = 'create')
    {
        $formatted = [
            'standard'       => gv($params, 'standard'),
            'institute_name' => gv($params, 'institute_name'),
            'board_name'     => gv($params, 'board_name'),
            'start_period'   => gv($params, 'start_period'),
            'end_period'     => gv($params, 'end_period'),
            'result'         => gv($params, 'result'),
            'description'           => gv($params, 'description')
        ];

        if ($action === 'create') {
            $formatted['student_id']   = $student_id;
            $formatted['upload_token'] = gv($params, 'upload_token');
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param StudentQualification $student_qualification
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(StudentQualification $student_qualification, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $student_qualification->id, $upload_token);
        } else {
            $this->upload->update($this->module, $student_qualification->id, $upload_token);
        }
    }

    /**
     * Update given student qualification.
     *
     * @param StudentQualification $student_qualification
     * @param array $params
     *
     * @return StudentQualification
     */
    public function update(StudentQualification $student_qualification, $params)
    {
        $this->validateInput($student_qualification->student_id, $params, $student_qualification->id);

        $this->upload->validateUpload($params, $this->module, $student_qualification->id);

        $student_qualification->forceFill($this->formatParams($params, null, 'update'))->save();

        $this->processUpload($student_qualification, $params, 'update');

        return $student_qualification;
    }

    /**
     * Delete student qualification.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StudentQualification $student_qualification)
    {
        return $student_qualification->delete();
    }

    /**
     * Delete multiple student qualifications.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->student_qualification->whereIn('id', $ids)->delete();
    }
}
