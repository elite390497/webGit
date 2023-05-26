<?php
namespace App\Repositories\Employee;

use App\Traits\Evaluator;
use Illuminate\Support\Str;
use App\Models\Employee\Salary;
use App\Models\Employee\SalaryDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Employee\PayrollTemplateRepository;
use App\Repositories\Configuration\Employee\PayHeadRepository;

class SalaryRepository
{
    use Evaluator;

    protected $salary;
    protected $salary_detail;
    protected $payroll_template;
    protected $employee;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Salary $salary,
        SalaryDetail $salary_detail,
        PayrollTemplateRepository $payroll_template,
        EmployeeRepository $employee
    ) {
        $this->salary           = $salary;
        $this->salary_detail    = $salary_detail;
        $this->payroll_template = $payroll_template;
        $this->employee = $employee;
    }

    /**
     * Find salary with given id or throw an error.
     *
     * @param integer $id
     * @return Salary
     */

    public function findOrFail($id)
    {
        $salary = $this->salary->info()->filterById($id)->first();

        if (! $salary) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_salary_structure')]);
        }

        return $salary;
    }

    /**
     * Find salary with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Salary
     */
    public function findByUuidOrFail($uuid)
    {
        $salary = $this->salary->info()->whereUuid($uuid)->first();

        if (! $salary) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_salary_structure')]);
        }

        return $salary;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Salary
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $employee_id = gv($params, 'employee_id');

        $employee_id = is_array($employee_id) ? $employee_id : ($employee_id ? explode(',', $employee_id) : []);

        $query = $this->salary->info();
        
        if (count($employee_id)) {
            $query->whereIn('employee_id', $employee_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all salarys using given params.
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
     * @return Salary
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get salary filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $payroll_templates = $this->payroll_template->selectAll();
        $payroll_template_with_details = $this->payroll_template->getAllWithDetail();
        $employees = $this->employee->getAccessibleEmployeeList();
        
        return compact('payroll_templates','payroll_template_with_details','employees');
    }

    /**
     * Get salary pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->getFilters();
    }

    /**
     * Get computed salary
     *
     * @param Salary $salary salary
     * @return Array
     */
    public function compute(Salary $salary)
    {
        $payroll_template = $salary->payrollTemplate;
        $salary_details = $salary->salaryDetails;

        $heads = array();
        foreach ($payroll_template->payrollTemplateDetails->sortBy('position')->all() as $payroll_template_detail) {
            if ($payroll_template_detail->category == 'attendance' || $payroll_template_detail->category == 'flat_rate') {

                $salary_detail = $salary_details->firstWhere('payroll_template_detail_id', $payroll_template_detail->id);
                $heads[$payroll_template_detail->payHead->alias] = ($salary_detail) ? currency($salary_detail->amount) : 0;

            } else if ($payroll_template_detail->category == 'computation') {

                $formula = $payroll_template_detail->computation;

                foreach ($heads as $head => $value) {
                    $formula = str_replace($head, $value, $formula);
                }

                $value = $this->evaluate($formula);

                if ($value === 'invalid') {
                    throw ValidationException::withMessages(['message' => trans('employee.salatry_structure_contains_invalid_computation')]);
                }

                $heads[$payroll_template_detail->payHead->alias] = currency($value);
            }
        }

        $earning = $deduction = 0;
        foreach($payroll_template->PayrollTemplateDetails->sortBy('position')->all() as $payroll_template_detail) {
            $head = $payroll_template_detail->payHead->alias;
            $value = array_key_exists($head, $heads) ? $heads[$head] : '';
            $payroll_template_detail->value = $value;

            if ($payroll_template_detail->payHead->type == 'earning' && $value) {
                $earning += $value;
            } else if ($payroll_template_detail->payHead->type == 'deduction' && $value) {
                $deduction += $value;
            }
        }

        $net = $earning - $deduction;
        $salary->net_salary = $net;
        $salary->save();

        $salary->earning = $earning;
        $salary->deduction = $deduction;
        $salary->net_salary = $net;

        return $salary;
    }

    /**
     * Create a new salary.
     *
     * @param array $params
     * @return void
     */
    public function create($params = array())
    {
        beginTransaction();

        $salary = $this->salary->forceCreate($this->formatParams($params));

        $this->updateSalaryDetail($salary, $params);

        commitTransaction();

        return $salary;
    }

    /**
     * Update Payroll template details
     *
     * @param Salary $salary
     * @param array $params
     * @return void
     */
    private function updateSalaryDetail(Salary $salary, $params)
    {
        $payroll_template_details = gv($params, 'payroll_template_details', []);

        $payroll_detail_ids = [];
        foreach ($payroll_template_details as $index => $payroll_template_detail) {
            $payroll_template_detail_id = gv($payroll_template_detail, 'id');
            $salary_detail = $this->salary_detail->firstOrCreate([
                'employee_salary_id'         => $salary->id,
                'payroll_template_detail_id' => $payroll_template_detail_id
            ]);

            $payroll_detail_ids[] = $payroll_template_detail_id;
            $salary_detail->amount = gv($payroll_template_detail, 'amount', 0);
            $salary_detail->save();
        }

        $salary_details = $salary->SalaryDetails;

        foreach ($salary_details as $salary_detail) {
            if (! in_array($salary_detail->payroll_template_detail_id, $payroll_detail_ids)) {
                $salary_detail->delete();
            }
        }

        $salary = $this->salary->info()->find($salary->id);

        $salary = $this->compute($salary);
    }

    private function validatePayrollTemplateDetails($params = array(), $payroll_template)
    {
        $payroll_template_details = gv($params, 'payroll_template_details', []);

        $payroll_details = $payroll_template->PayrollTemplateDetails;

        $id = array();
        $variables = [];
        foreach ($payroll_template_details as $index => $payroll_template_detail) {
            $amount = gv($payroll_template_detail, 'amount', 0);

            if (! is_numeric($amount)) {
                throw ValidationException::withMessages(['amount_'.$index => trans('validation.required', ['attribute' => trans('employee.salary_structure_amount')])]);
            }

            if ($amount < 0) {
                throw ValidationException::withMessages(['amount_'.$index => trans('validation.min.numeric', ['attribute' => trans('employee.salary_structure_amount'), 'min' => 0])]);
            }
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $salary_id = null)
    {
        $employee = $this->employee->findOrFail(gv($params, 'employee_id'), 'employee_id');
        $payroll_template = $this->payroll_template->findOrFail(gv($params, 'payroll_template_id'), 'payroll_template_id');

        $this->validatePayrollTemplateDetails($params, $payroll_template);

        if (! dateBetweenSession(gv($params, 'date_effective'))) {
            throw ValidationException::withMessages(['date_effective' => trans('academic.invalid_session_date_range')]);
        }
        
        $previous_salary_query = (!$salary_id) ? $this->salary : $this->salary->where('id','!=',$salary_id);

        $previous_salary = $previous_salary_query->filterByEmployeeId($employee->id)->filterbyPayrollTemplateId($payroll_template->id)->where('date_effective','>=', toDate(gv($params, 'date_effective')))->count();

        if ($previous_salary) {
            throw ValidationException::withMessages(['message' => trans('employee.salary_already_defined_on_previous_date')]);
        }

        $formatted = [
            'employee_id'         => gv($params, 'employee_id'),
            'payroll_template_id' => gv($params, 'payroll_template_id'),
            'date_effective'      => toDate(gv($params, 'date_effective')),
            'description'         => gv($params, 'description'),
            'options'             => []
        ];

        if (! $salary_id) {
            $formatted['uuid'] = Str::uuid();
        }

        return $formatted;
    }

    /**
     * Update given salary.
     *
     * @param Salary $salary
     * @param array $params
     *
     * @return Salary
     */

    public function update(Salary $salary, $params)
    {
        if ($salary->payrolls_count) {
            throw ValidationException::withMessages(['message' => trans('employee.salary_structure_associated_with_payroll')]);
        }

        $salary->forceFill($this->formatParams($params, $salary->id))->save();

        $this->updateSalaryDetail($salary, $params);

        return $salary;
    }

    /**
     * Find salary is deletable or not.
     *
     * @param string $uuid
     * @return bool|null
     */
    public function deletable($uuid)
    {
        $salary = $this->findByUuidOrFail($uuid);

        if ($salary->payrolls_count) {
            throw ValidationException::withMessages(['message' => trans('employee.salary_structure_associated_with_payroll')]);
        }
        
        return $salary;
    }

    /**
     * Delete salary.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Salary $salary)
    {
        return $salary->delete();
    }

    /**
     * Delete multiple salarys.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->salary->whereIn('id', $ids)->delete();
    }
}