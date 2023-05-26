<?php
namespace App\Repositories\Reception;

use Illuminate\Support\Str;
use App\Models\Reception\GatePass;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Employee\EmployeeRepository;

class GatePassRepository
{
    protected $gate_pass;
    protected $upload;
    protected $student;
    protected $employee;
    protected $module = 'gate_pass';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        GatePass $gate_pass,
        UploadRepository $upload,
        StudentRepository $student,
        EmployeeRepository $employee
    ) {
        $this->gate_pass = $gate_pass;
        $this->upload = $upload;
        $this->student = $student;
        $this->employee = $employee;
    }

    /**
     * Get gate pass query
     *
     * @return GatePass query
     */
    public function getQuery()
    {
        return $this->gate_pass;
    }

    /**
     * Count GatePass
     *
     * @return integer
     */
    public function count()
    {
        return $this->gate_pass->filterBySession()->count();
    }

    /**
     * Get all visitor passes
     *
     * @return array
     */
    public function getAll()
    {
        return $this->gate_pass->all();
    }

    /**
     * Find gate pass with given id.
     *
     * @param integer $id
     * @return GatePass
     */
    public function find($id)
    {
        return $this->gate_pass->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find gate pass with given id or throw an error.
     *
     * @param integer $id
     * @return GatePass
     */
    public function findOrFail($id, $field = 'message')
    {
        $gate_pass = $this->gate_pass->info()->filterBySession()->filterById($id)->first();

        if (! $gate_pass) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_gate_pass')]);
        }

        return $gate_pass;
    }

    /**
     * Find gate pass with given uuid.
     *
     * @param string $uuid
     * @return GatePass
     */
    public function findByUuid($uuid)
    {
        return $this->gate_pass->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find gate pass with given uuid or throw an error.
     *
     * @param string $uuid
     * @return GatePass
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $gate_pass = $this->gate_pass->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $gate_pass) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_gate_pass')]);
        }

        return $gate_pass;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return GatePass
     */
    public function getData($params)
    {
        $sort_by             = gv($params, 'sort_by', 'created_at');
        $order               = gv($params, 'order', 'desc');
        $student_id          = gv($params, 'student_id', []);
        $employee_id         = gv($params, 'employee_id', []);
        $type                = gv($params, 'type');

        $student_id = is_array($student_id) ? $student_id : ($student_id ? explode(',', $student_id) : []);
        $employee_id = is_array($employee_id) ? $employee_id : ($employee_id ? explode(',', $employee_id) : []);

        $date_start_date = gv($params, 'date_start_date');
        $date_end_date   = gv($params, 'date_end_date');

        $query = $this->gate_pass->info()->filterBySession()->filterByType($type)->dateBetween([
            'start_date' => $date_start_date,
            'end_date' => $date_end_date
        ]);

        if (count($student_id)) {
            $query->whereIn('student_id', $student_id);
        }

        if (count($employee_id)) {
            $query->whereIn('employee_id', $employee_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all visitor passes using given params.
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
     * @return GatePass
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get gate pass filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $students = $this->student->selectAll();
        $employees = $this->employee->selectAll();

        return compact('students', 'employees');
    }

    /**
     * Create a new gate pass.
     *
     * @param array $params
     * @return GatePass
     */
    public function create($params)
    {
        $gate_pass = $this->gate_pass->forceCreate($this->formatParams($params));

        // $this->processUpload($gate_pass, $params);

        return $gate_pass;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $gate_pass_id = null)
    {
        $type        = gv($params, 'type');
        $reason      = gv($params, 'reason');
        $student_id  = gv($params, 'student_id');
        $employee_id = gv($params, 'employee_id');
        $date        = toDate(gv($params, 'date'));
        $time        = gv($params, 'time');

        if (! dateBetweenSession($date)) {
            throw ValidationException::withMessages(['dates' => trans('reception.not_in_academic_session_range', ['date' => showDate($date)])]);
        }

        if ($type == 'student' && $student_id) {
            $student = $this->student->findorFail($student_id);
        }

        if ($type == 'employee' && $employee_id) {
            $employee = $this->employee->findorFail($employee_id);
        }

        if (strtotime($time) === false) {
            throw ValidationException::withMessages(['message' => trans('reception.invalid_time')]);
        }

        $formatted = [
            'type'        => $type,
            'reason'      => $reason,
            'date'        => $date,
            'time'        => toTime($time),
            'student_id'  => $student_id,
            'employee_id' => $employee_id,
            'options'     => []
        ];

        if (! $gate_pass_id) {
            $formatted['upload_token'] = gv($params, 'upload_token') ? : Str::uuid();
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param GatePass $gate_pass
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(GatePass $gate_pass, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $gate_pass->id, $upload_token);
        } else {
            $this->upload->update($this->module, $gate_pass->id, $upload_token);
        }
    }

    /**
     * Update given gate pass.
     *
     * @param GatePass $gate_pass
     * @param array $params
     *
     * @return GatePass
     */
    public function update(GatePass $gate_pass, $params)
    {
        $gate_pass->forceFill($this->formatParams($params, $gate_pass->id))->save();

        // $this->processUpload($gate_pass, $params, 'update');

        return $gate_pass;
    }

    /**
     * Delete gate pass.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(GatePass $gate_pass)
    {
        return $gate_pass->delete();
    }

    /**
     * Delete multiple gate pass.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->gate_pass->whereIn('id', $ids)->delete();
    }
}