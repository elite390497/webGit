<?php
namespace App\Repositories\Employee;

use Illuminate\Support\Str;
use App\Models\Employee\Employee;
use App\Models\Employee\EmployeeTerm;
use App\Models\Employee\EmployeeDesignation;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Employee\DesignationRepository;

class EmployeeTermRepository
{
    protected $employee_term;
    protected $upload;
    protected $designation;
    protected $department;
    protected $employee_designation;
    protected $module = 'employee_term';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeTerm $employee_term,
        UploadRepository $upload,
        DesignationRepository $designation,
        DepartmentRepository $department,
        EmployeeDesignation $employee_designation
    ) {
        $this->employee_term = $employee_term;
        $this->upload = $upload;
        $this->designation = $designation;
        $this->department = $department;
        $this->employee_designation = $employee_designation;
    }

    /**
     * Find employee term with given id.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeTerm
     */
    public function find($employee_id, $id)
    {
        return $this->employee_term->with('employee')->filterByEmployeeId($employee_id)->filterById($id)->first();
    }

    /**
     * Find employee term with given id or throw an error.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeTerm
     */
    public function findOrFail($employee_id, $id, $field = 'message')
    {
        $employee_term = $this->employee_term->with('employee')->filterByEmployeeId($employee_id)->filterById($id)->first();

        if (! $employee_term) {
            throw ValidationException::withMessages([$field => trans('employee.could_not_find_term')]);
        }

        return $employee_term;
    }

    /**
     * Get employee term pre requisite.
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
     * Create a new employee term.
     *
     * @param Employee $employee
     * @param array $params
     * @return EmployeeTerm
     */
    public function create(Employee $employee, $params)
    {
        $designation_id  = gv($params, 'designation_id');
        $department_id   = gv($params, 'department_id');
        $date_of_joining = toDate(gv($params, 'date_of_joining'));
        $joining_remarks = gv($params, 'joining_remarks');

        $employee_terms = $employee->EmployeeTerms;

        $previous_term = $employee_terms->where('date_of_leaving', '=', null)->first();

        if ($previous_term) {
            throw ValidationException::withMessages(['message' => trans('employee.previous_term_not_ended', ['date' => showDate($previous_term->date_of_joining)])]);
        }

        $previous_term = $employee_terms->where('date_of_leaving', '>=', $date_of_joining)->first();

        if ($previous_term) {
            throw ValidationException::withMessages(['message' => trans('employee.date_of_joining_less_than_previous_term_date_of_leaving', ['date' => showDate($previous_term->date_of_leaving)])]);
        }

        $designation = $this->designation->findOrFail($designation_id);

        if (! dateBetweenSession($date_of_joining)) {
            throw ValidationException::withMessages(['date_of_joining' => trans('academic.invalid_session_date_range')]);
        }

        if (! in_array($designation->id, $this->designation->getSubordinateId())) {
            throw ValidationException::withMessages(['designation_id' => trans('employee.top_designation_cannot_become_child')]);
        }

        if ($department_id) {
            $department = $this->department->findOrFail($department_id);
        }

        $employee_term = $this->employee_term->forceCreate([
            'employee_id' => $employee->id,
            'date_of_joining' => toDate($date_of_joining),
            'joining_remarks' => $joining_remarks,
            'upload_token' => gv($params, 'upload_token')
        ]);

        $employee_designation = $this->employee_designation->create([
            'employee_id' => $employee->id,
            'employee_term_id' => $employee_term->id,
            'designation_id' => $designation_id,
            'department_id' => $department_id,
            'date_effective' => toDate($date_of_joining),
            'upload_token' => Str::uuid()
        ]);

        $this->processUpload($employee_term, $params);
    }

    /**
     * Upload attachment
     *
     * @param EmployeeTerm $employee_term
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(EmployeeTerm $employee_term, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $employee_term->id, $upload_token);
        } else {
            $this->upload->update($this->module, $employee_term->id, $upload_token);
        }
    }

    /**
     * Update given employee term.
     *
     * @param EmployeeTerm $employee_term
     * @param array $params
     *
     * @return EmployeeTerm
     */
    public function update(EmployeeTerm $employee_term, $params)
    {
        $is_leaving = gbv($params, 'is_leaving');

        if ($is_leaving) {
            $date_of_leaving = toDate(gv($params, 'date_of_leaving'));
            $leaving_remarks = gv($params, 'leaving_remarks');

            if ($date_of_leaving <= toDate($employee_term->date_of_joining)) {
                throw ValidationException::withMessages(['date_of_leaving' => trans('employee.date_of_leaving_lesser_than_date_of_joining')]);
            }

            $last_designation = $employee_term->EmployeeDesignations->sortByDesc('date_effective')->first();

            if ($last_designation && $date_of_leaving <= toDate($last_designation->date_effective)) {
                throw ValidationException::withMessages(['date_of_leaving' => trans('employee.date_of_leaving_lesser_than_last_designation_date', ['date' => showDate($last_designation->date_effective)]) ]);
            }

            $employee_term->date_of_leaving = toDate($date_of_leaving);
            $employee_term->leaving_remarks = $leaving_remarks;
            $employee_term->save();

            $last_employee_designation = $employee_term->EmployeeDesignations->last();

            if ($last_employee_designation) {
                $last_employee_designation->date_end = toDate($date_of_leaving);
                $last_employee_designation->save();
            }
        } else {
            $employee_term->date_of_leaving = null;
            $employee_term->leaving_remarks = null;
            $employee_term->save();

            $last_employee_designation = $employee_term->EmployeeDesignations->last();

            if ($last_employee_designation) {
                $last_employee_designation->date_end = null;
                $last_employee_designation->save();
            }
        }
        
        $this->processUpload($employee_term, $params, 'update');

        return $employee_term;
    }

    /**
     * Find employee term editable or not.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return bool|null
     */
    public function editable($employee_id, $id)
    {
        $employee_term = $this->findOrFail($employee_id, $id);

        $employee_terms = $employee_term->Employee->EmployeeTerms;

        if ($employee_terms->where('id', '!=', $id)->where('date_of_joining', '>', toDate($employee_term->date_of_joining))->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.only_last_term_is_editable')]);
        }

        return $employee_term;
    }

    /**
     * Delete employee term.
     *
     * @param EmployeeTerm $employee_term
     * @return bool|null
     */
    public function delete(EmployeeTerm $employee_term)
    {
        if ($employee_term->Employee->EmployeeTerms->count() == 1) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_delete_first_term')]);
        }

        return $employee_term->delete();
    }

    /**
     * Delete multiple employee terms.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->employee_term->whereIn('id', $ids)->delete();
    }
}
