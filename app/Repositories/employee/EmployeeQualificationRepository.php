<?php
namespace App\Repositories\Employee;

use App\Models\Employee\EmployeeQualification;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;

class EmployeeQualificationRepository
{
    protected $employee_qualification;
    protected $upload;
    protected $module = 'employee_qualification';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeQualification $employee_qualification,
        UploadRepository $upload
    ) {
        $this->employee_qualification = $employee_qualification;
        $this->upload = $upload;
    }

    /**
     * Get employee qualification query
     *
     * @return EmployeeQualification query
     */
    public function getQuery()
    {
        return $this->employee_qualification;
    }

    /**
     * Find employee qualification with given id.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeQualification
     */
    public function find($employee_id, $id)
    {
        return $this->employee_qualification->filterByEmployeeId($employee_id)->filterById($id)->first();
    }

    /**
     * Find employee qualification with given id or throw an error.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeQualification
     */
    public function findOrFail($employee_id, $id, $field = 'message')
    {
        $employee_qualification = $this->employee_qualification->filterByEmployeeId($employee_id)->filterById($id)->first();

        if (! $employee_qualification) {
            throw ValidationException::withMessages([$field => trans('employee.could_not_find_qualification')]);
        }

        return $employee_qualification;
    }

    /**
     * Paginate all employee qualifications using given params.
     *
     * @param integer $employee_id
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($employee_id, $params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->employee_qualification->filterByEmployeeId($employee_id)->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Create a new employee qualification.
     *
     * @param integer $employee_id
     * @param array $params
     * @return EmployeeQualification
     */
    public function create($employee_id, $params)
    {
        $this->validateInput($employee_id, $params);

        $employee_qualification = $this->employee_qualification->forceCreate($this->formatParams($params, $employee_id));

        $this->processUpload($employee_qualification, $params);

        return $employee_qualification;
    }

    /**
     * Validate unique standard with employee.
     *
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput($employee_id, $params, $id = null)
    {
        $query = $this->employee_qualification->filterByEmployeeId($employee_id);

        if ($id) {
            $query->where('id', '!=', $id);
        }

        if ($query->filterByStandard(gv($params, 'standard'))->count()) {
            throw ValidationException::withMessages(['standard' => trans('validation.unique', ['attribute' => trans('employee.qualification_standard')])]);
        }

        $start_period = gv($params, 'start_period').'-01';
        $end_period = gv($params, 'end_period').'-01';

        if ($start_period > $end_period) {
            throw ValidationException::withMessages(['start_period' => trans('employee.qualification_start_period_greater_than_end_period')]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $employee_id = null, $action = 'create')
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
            $formatted['employee_id']   = $employee_id;
            $formatted['upload_token'] = gv($params, 'upload_token');
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param EmployeeQualification $employee_qualification
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(EmployeeQualification $employee_qualification, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $employee_qualification->id, $upload_token);
        } else {
            $this->upload->update($this->module, $employee_qualification->id, $upload_token);
        }
    }

    /**
     * Update given employee qualification.
     *
     * @param EmployeeQualification $employee_qualification
     * @param array $params
     *
     * @return EmployeeQualification
     */
    public function update(EmployeeQualification $employee_qualification, $params)
    {
        $this->validateInput($employee_qualification->employee_id, $params, $employee_qualification->id);

        $employee_qualification->forceFill($this->formatParams($params, null, 'update'))->save();

        $this->processUpload($employee_qualification, $params, 'update');

        return $employee_qualification;
    }

    /**
     * Delete employee qualification.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EmployeeQualification $employee_qualification)
    {
        return $employee_qualification->delete();
    }

    /**
     * Delete multiple employee qualifications.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->employee_qualification->whereIn('id', $ids)->delete();
    }
}
