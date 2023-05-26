<?php
namespace App\Repositories\Reception;

use Illuminate\Support\Str;
use App\Models\Reception\VisitorLog;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Configuration\Reception\VisitingPurposeRepository;

class VisitorLogRepository
{
    protected $visitor_log;
    protected $upload;
    protected $student;
    protected $visiting_purpose;
    protected $employee;
    protected $module = 'visitor_log';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VisitorLog $visitor_log,
        UploadRepository $upload,
        StudentRepository $student,
        VisitingPurposeRepository $visiting_purpose,
        EmployeeRepository $employee
    ) {
        $this->visitor_log = $visitor_log;
        $this->upload = $upload;
        $this->student = $student;
        $this->visiting_purpose = $visiting_purpose;
        $this->employee = $employee;
    }

    /**
     * Get visitor log query
     *
     * @return VisitorLog query
     */
    public function getQuery()
    {
        return $this->visitor_log;
    }

    /**
     * Count VisitorLog
     *
     * @return integer
     */
    public function count()
    {
        return $this->visitor_log->filterBySession()->count();
    }

    /**
     * Get all visitor logs
     *
     * @return array
     */
    public function getAll()
    {
        return $this->visitor_log->all();
    }

    /**
     * Find visitor log with given id.
     *
     * @param integer $id
     * @return VisitorLog
     */
    public function find($id)
    {
        return $this->visitor_log->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find visitor log with given id or throw an error.
     *
     * @param integer $id
     * @return VisitorLog
     */
    public function findOrFail($id, $field = 'message')
    {
        $visitor_log = $this->visitor_log->info()->filterBySession()->filterById($id)->first();

        if (! $visitor_log) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_visitor_log')]);
        }

        return $visitor_log;
    }

    /**
     * Find visitor log with given uuid.
     *
     * @param string $uuid
     * @return VisitorLog
     */
    public function findByUuid($uuid)
    {
        return $this->visitor_log->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find visitor log with given uuid or throw an error.
     *
     * @param string $uuid
     * @return VisitorLog
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $visitor_log = $this->visitor_log->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $visitor_log) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_visitor_log')]);
        }

        return $visitor_log;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VisitorLog
     */
    public function getData($params)
    {
        $sort_by             = gv($params, 'sort_by', 'entry_time');
        $order               = gv($params, 'order', 'desc');
        $student_id          = gv($params, 'student_id', []);
        $employee_id         = gv($params, 'employee_id', []);
        $visiting_purpose_id = gv($params, 'visiting_purpose_id', []);
        $type                = gv($params, 'type');

        $student_id = is_array($student_id) ? $student_id : ($student_id ? explode(',', $student_id) : []);
        $employee_id = is_array($employee_id) ? $employee_id : ($employee_id ? explode(',', $employee_id) : []);
        $visiting_purpose_id = is_array($visiting_purpose_id) ? $visiting_purpose_id : ($visiting_purpose_id ? explode(',', $visiting_purpose_id) : []);

        $date_of_visit_start_date = gv($params, 'date_of_visit_start_date');
        $date_of_visit_end_date   = gv($params, 'date_of_visit_end_date');

        $query = $this->visitor_log->info()->filterBySession()->filterByType($type)->dateOfVisitBetween([
            'start_date' => $date_of_visit_start_date,
            'end_date' => $date_of_visit_end_date
        ]);

        if (count($student_id)) {
            $query->whereIn('student_id', $student_id);
        }

        if (count($employee_id)) {
            $query->whereIn('employee_id', $employee_id);
        }

        if (count($visiting_purpose_id)) {
            $query->whereIn('visiting_purpose_id', $visiting_purpose_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all visitor logs using given params.
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
     * @return VisitorLog
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get visitor log filters.
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
        $visiting_purposes = $this->visiting_purpose->selectAll();
        $students = $this->student->selectAll();
        $employees = $this->employee->selectAll();

        return compact('visiting_purposes', 'students', 'employees');
    }

    /**
     * Create a new visitor log.
     *
     * @param array $params
     * @return VisitorLog
     */
    public function create($params)
    {
        $visitor_log = $this->visitor_log->forceCreate($this->formatParams($params));

        // $this->processUpload($visitor_log, $params);

        return $visitor_log;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $visitor_log_id = null)
    {
        $type                  = gv($params, 'type');
        $visiting_purpose_id   = gv($params, 'visiting_purpose_id');
        $name                  = gv($params, 'name');
        $company_name          = gv($params, 'company_name');
        $contact_number        = gv($params, 'contact_number');
        $address               = gv($params, 'address');
        $relation_with_student = gv($params, 'relation_with_student');
        $visitor_count         = gv($params, 'visitor_count');
        $student_id            = gv($params, 'student_id');
        $employee_id           = gv($params, 'employee_id');
        $date_of_visit         = toDate(gv($params, 'date_of_visit'));
        $entry_time            = gv($params, 'entry_time');
        $exit_time             = gv($params, 'exit_time');
        $remarks               = gv($params, 'remarks');

        if (! dateBetweenSession($date_of_visit)) {
            throw ValidationException::withMessages(['dates' => trans('reception.not_in_academic_session_range', ['date' => showDate($date_of_visit)])]);
        }

        $visiting_purpose = $this->visiting_purpose->findOrFail($visiting_purpose_id);

        if ($student_id) {
            $student = $this->student->findorFail($student_id);
        }

        if ($employee_id) {
            $employee = $this->employee->findorFail($employee_id);
        }

        if (strtotime($entry_time) === false) {
            throw ValidationException::withMessages(['message' => trans('reception.invalid_entry_time')]);
        }

        if ($exit_time && strtotime($exit_time) === false) {
            throw ValidationException::withMessages(['message' => trans('reception.invalid_exit_time')]);
        }

        if ($exit_time && toTime($entry_time) > toTime($exit_time)) {
            throw ValidationException::withMessages(['message' => trans('reception.entry_time_greater_than_exit_time')]);
        }

        $formatted = [
            'type'                  => $type,
            'visiting_purpose_id'   => $visiting_purpose_id,
            'name'                  => $name,
            'relation_with_student' => ($student_id) ? $relation_with_student : null,
            'company_name'          => (! $student_id) ? $company_name : null,
            'contact_number'        => (! $student_id) ? $contact_number : null,
            'address'               => (! $student_id) ? $address : null,
            'visitor_count'         => $visitor_count,
            'date_of_visit'         => $date_of_visit,
            'entry_time'            => toTime($entry_time),
            'student_id'            => $student_id,
            'employee_id'           => $employee_id,
            'remarks'               => $remarks,
            'options'               => []
        ];

        if (! $visitor_log_id) {
            $formatted['upload_token'] = gv($params, 'upload_token') ? : Str::uuid();
            $formatted['uuid'] = Str::uuid();
        } else {
            $formatted['exit_time'] = $exit_time ? toTime($exit_time) : null;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param VisitorLog $visitor_log
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(VisitorLog $visitor_log, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $visitor_log->id, $upload_token);
        } else {
            $this->upload->update($this->module, $visitor_log->id, $upload_token);
        }
    }

    /**
     * Update given visitor log.
     *
     * @param VisitorLog $visitor_log
     * @param array $params
     *
     * @return VisitorLog
     */
    public function update(VisitorLog $visitor_log, $params)
    {
        $visitor_log->forceFill($this->formatParams($params, $visitor_log->id))->save();

        // $this->processUpload($visitor_log, $params, 'update');

        return $visitor_log;
    }

    /**
     * Delete visitor log.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(VisitorLog $visitor_log)
    {
        return $visitor_log->delete();
    }

    /**
     * Delete multiple visitor log.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->visitor_log->whereIn('id', $ids)->delete();
    }
}
