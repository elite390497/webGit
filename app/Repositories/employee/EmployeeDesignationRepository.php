<?php
namespace App\Repositories\Employee;

use Carbon\Carbon;
use App\Models\Employee\Employee;
use App\Models\Employee\EmployeeDesignation;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Employee\DesignationRepository;

class EmployeeDesignationRepository
{
    protected $employee_designation;
    protected $department;
    protected $designation;
    protected $upload;
    protected $module = 'employee_designation';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeDesignation $employee_designation,
        DepartmentRepository $department,
        DesignationRepository $designation,
        UploadRepository $upload
    ) {
        $this->employee_designation = $employee_designation;
        $this->department = $department;
        $this->designation = $designation;
        $this->upload = $upload;
    }

    /**
     * Find employee designation with given id.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeDesignation
     */
    public function find($employee_id, $id)
    {
        return $this->employee_designation->with('employee', 'designation', 'designation.employeeCategory', 'department')->filterByEmployeeId($employee_id)->filterById($id)->first();
    }

    /**
     * Find employee designation with given id or throw an error.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeDesignation
     */
    public function findOrFail($employee_id, $id, $field = 'message')
    {
        $employee_designation = $this->employee_designation->with('employee', 'designation', 'designation.employeeCategory', 'department')->filterByEmployeeId($employee_id)->filterById($id)->first();

        if (! $employee_designation) {
            throw ValidationException::withMessages([$field => trans('employee.could_not_find_designation')]);
        }

        return $employee_designation;
    }

    /**
     * Get employee designation pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $designations = $this->designation->getDesignationOption();
        $departments = $this->department->selectAll();

        return compact('designations', 'departments');
    }

    /**
     * Create a new employee designation.
     *
     * @param Employee $employee
     * @param array $params
     * @return EmployeeDesignation
     */
    public function create(Employee $employee, $params)
    {
        $this->validateInput($employee, $params);

        $date_effective = toDate(gv($params, 'date_effective'));

        $employee_designations = $employee->EmployeeDesignations;

        $last_designation = $employee_designations->sortByDesc('date_effective')->first();

        if ($last_designation && $date_effective <= toDate($last_designation->date_effective)) {
            throw ValidationException::withMessages(['date_effective' => trans('employee.cannot_assign_designation_before_previous_designation', ['date' => showDate($last_designation->date_effective)])]);
        }

        $employee_term = $employee->EmployeeTerms->where('date_of_leaving', '=', null)->first();

        if (! $employee_term) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_term')]);
        }

        $last_designation->date_end = Carbon::parse(gv($params, 'date_effective'))->subDays(1)->toDateString();
        $last_designation->save();

        $employee_designation = $this->employee_designation->forceCreate($this->formatParams($params, $employee->id));
        $employee_designation->employee_term_id = $employee_term->id;
        $employee_designation->save();

        $this->processUpload($employee_designation, $params);

        return $employee_designation;
    }

    /**
     * Validate data of designation.
     *
     * @param Employee $employee
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput(Employee $employee, $params, $id = null)
    {
        $designation_id = gv($params, 'designation_id');
        $department_id = gv($params, 'department_id');
        $date_effective = toDate(gv($params, 'date_effective'));

        $designation = $this->designation->findOrFail($designation_id);

        if (! in_array($designation->id, $this->designation->getSubordinateId())) {
            throw ValidationException::withMessages(['designation_id' => trans('employee.top_designation_cannot_become_child')]);
        }

        if ($department_id) {
            $department = $this->department->findOrFail($department_id);
        }

        if (! dateBetweenSession($date_effective)) {
            throw ValidationException::withMessages(['date_effective' => trans('academic.invalid_session_date_range')]);
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
            'designation_id' => gv($params, 'designation_id'),
            'department_id'  => gv($params, 'department_id'),
            'date_effective' => toDate(gv($params, 'date_effective')),
            'remarks'        => gv($params, 'remarks')
        ];

        if ($action === 'create') {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['employee_id'] = $employee_id;
            $formatted['options']     = [];
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param EmployeeDesignation $employee_designation
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(EmployeeDesignation $employee_designation, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $employee_designation->id, $upload_token);
        } else {
            $this->upload->update($this->module, $employee_designation->id, $upload_token);
        }
    }

    /**
     * Update given employee designation.
     *
     * @param EmployeeDesignation $employee_designation
     * @param array $params
     *
     * @return EmployeeDesignation
     */
    public function update(EmployeeDesignation $employee_designation, $params)
    {
        $date_effective = toDate(gv($params, 'date_effective'));

        $this->validateInput($employee_designation->Employee, $params, $employee_designation->id);

        $employee_term = $employee_designation->EmployeeTerm;

        if ($employee_term->date_of_joining == toDate($employee_designation->date_effective) && $date_effective != toDate($employee_designation->date_effective)) {
            throw ValidationException::withMessages(['date_effective' => trans('employee.first_designation_date_should_be_date_of_joining', ['date' => showDate($employee_term->date_of_joining)])]);
        }

        if ($date_effective < toDate($employee_term->date_of_joining) || ($employee_term->date_of_leaving && $date_effective > toDate($employee_term->date_of_leaving))) {
            throw ValidationException::withMessages(['date_effective' => trans('employee.date_not_in_term_range', ['start_date' => showDate($employee_term->date_of_joining), 'end_date' => $employee_term->date_of_leaving ? showDate($employee_term->date_of_leaving) : showDate(date('Y-m-d')) ]) ]);
        }

        $employee_designation->forceFill($this->formatParams($params, null, 'update'))->save();

        $last_designation = $employee_designation->Employee->EmployeeDesignations->where('id', '!=', $employee_designation->id)->sortByDesc('date_effective')->first();

        if ($last_designation) {
            $last_designation->date_end = Carbon::parse(gv($params, 'date_effective'))->subDays(1)->toDateString();
            $last_designation->save();
        }

        $this->processUpload($employee_designation, $params, 'update');

        return $employee_designation;
    }

    /**
     * Find employee designation editable or not.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return bool|null
     */
    public function editable($employee_id, $id)
    {
        $employee_designation = $this->findOrFail($employee_id, $id);

        $employee_designations = $employee_designation->Employee->EmployeeDesignations;

        if ($employee_designations->where('id', '!=', $id)->where('date_effective', '>', toDate($employee_designation->date_effective))->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.only_last_designation_is_editable')]);
        }

        return $employee_designation;
    }

    /**
     * Delete employee designation.
     *
     * @param EmployeeDesignation $employee_designation
     * @return bool|null
     */
    public function delete(EmployeeDesignation $employee_designation)
    {
        if ($employee_designation->EmployeeTerm->date_of_leaving) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_delete_after_term_end')]);
        }

        return $employee_designation->delete();
    }

    /**
     * Delete multiple employee designations.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->employee_designation->whereIn('id', $ids)->delete();
    }
}
