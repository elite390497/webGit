<?php
namespace App\Repositories\Employee;

use App\Traits\Evaluator;
use Illuminate\Support\Str;
use App\Models\Employee\PayrollTemplate;
use App\Models\Employee\PayrollTemplateDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Employee\PayHeadRepository;
use App\Repositories\Configuration\Employee\AttendanceTypeRepository;

class PayrollTemplateRepository
{
    use Evaluator;
    protected $payroll_template;
    protected $payroll_template_detail;
    protected $pay_head;
    protected $attendance_type;


    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        PayrollTemplate $payroll_template,
        PayrollTemplateDetail $payroll_template_detail,
        PayHeadRepository $pay_head,
        AttendanceTypeRepository $attendance_type
    ) {
        $this->payroll_template = $payroll_template;
        $this->payroll_template_detail = $payroll_template_detail;
        $this->pay_head = $pay_head;
        $this->attendance_type = $attendance_type;
    }

    /**
     * Get all payroll templates
     *
     * @return array
     */

    public function getAll()
    {
        return $this->payroll_template->all();
    }

    /**
     * Get all payroll templates with detail
     *
     * @return array
     */

    public function getAllWithDetail()
    {
        return $this->payroll_template->info()->get();
    }

    /**
     * List all payroll templates by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->payroll_template->all(['name', 'id']);
    }

    /**
     * Find payroll template with given id or throw an error.
     *
     * @param integer $id
     * @return PayrollTemplate
     */

    public function findOrFail($id)
    {
        $payroll_template = $this->payroll_template->info()->filterById($id)->first();

        if (! $payroll_template) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_payroll_template')]);
        }

        return $payroll_template;
    }

    /**
     * Find payroll template with given uuid or throw an error.
     *
     * @param string $uuid
     * @return PayrollTemplate
     */
    public function findByUuidOrFail($uuid)
    {
        $payroll_template = $this->payroll_template->info()->whereUuid($uuid)->first();

        if (! $payroll_template) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_payroll_template')]);
        }

        return $payroll_template;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return PayrollTemplate
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'created_at');
        $order   = gv($params, 'order', 'desc');
        $name    = gv($params, 'name');

        $query = $this->payroll_template->info()->filterByName($name);

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all payroll templates using given params.
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
     * @return PayrollTemplate
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get payroll template filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $pay_heads = $this->pay_head->getAll();
        $attendance_types = $this->attendance_type->getAllProductionBased();
        
        return compact('pay_heads','attendance_types');
    }

    /**
     * Get payroll template pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->getFilters();
    }

    /**
     * Create a new payroll template.
     *
     * @param array $params
     * @return void
     */
    public function create($params = array())
    {
        $payroll_template = $this->payroll_template->forceCreate($this->formatParams($params));

        $this->updatePayrollTemplateDetail($payroll_template, $params);

        return $payroll_template;
    }

    /**
     * Update Payroll template details
     *
     * @param PayrollTemplate $payroll_template
     * @param array $params
     * @return void
     */
    private function updatePayrollTemplateDetail(PayrollTemplate $payroll_template, $params)
    {
        $pay_heads = gv($params, 'pay_heads', []);

        $payroll_template_details = $payroll_template->PayrollTemplateDetails;

        foreach ($pay_heads as $index => $pay_head) {

            $payroll_template_detail = $this->payroll_template_detail->firstOrCreate([
                'payroll_template_id' => $payroll_template->id,
                'pay_head_id' => gv($pay_head, 'id')
            ]);

            $payroll_template_detail->category = gv($pay_head, 'category');
            $payroll_template_detail->position = $index;
            $payroll_template_detail->computation = (gv($pay_head, 'category') == 'computation') ? gv($pay_head, 'computation') : null;
            $payroll_template_detail->employee_attendance_type_id = (gv($pay_head, 'category') == 'production') ? gv($pay_head, 'attendance_type_id') : null;
            $payroll_template_detail->save();
        }
    }

    private function validateComputation($params = array())
    {
        $category = gv($params, 'category');

        if ($category != 'computation') {
            return;
        }

        $name        = gv($params, 'name');
        $variables   = gv($params, 'variables', []);
        $computation = gv($params, 'computation');

        if (! preg_match("/^[a-zA-Z\s\d\.\+\-\/\*\(\)]+$/", $computation)) {
            throw ValidationException::withMessages(['message' => trans('employee.pay_head_computation_contains_invalid_variable', ['name' => $name])]);
        }

        foreach ($variables as $variable) {
            $computation = str_replace($variable, 1, $computation);
        }

        if (preg_match("/[a-zA-Z]/i", $computation)) {
            throw ValidationException::withMessages(['message' => trans('employee.pay_head_computation_contains_invalid_variable', ['name' => $name])]);
        }

        if ($this->evaluate($computation) === 'invalid') {
            throw ValidationException::withMessages(['message' => trans('employee.pay_head_computation_contains_invalid_expression', ['name' => $name])]);
        }
    }

    private function validatePayHeads($params = array())
    {
        $pay_heads = gv($params, 'pay_heads', []);

        $attendance_types = $this->attendance_type->listProductionBasedId();

        $ids = array();
        $variables = [];
        foreach ($pay_heads as $index => $pay_head) {
            $id                 = gv($pay_head, 'id');
            $name               = gv($pay_head, 'name');
            $alias              = gv($pay_head, 'alias');
            $type               = gv($pay_head, 'type');
            $category           = gv($pay_head, 'category');
            $computation        = gv($pay_head, 'computation');
            $attendance_type_id = gv($pay_head, 'attendance_type_id');

            $ids[] = $id;

            if (! in_array($category, ['not_applicable','attendance', 'flat_rate', 'user_defined', 'computation', 'production'])) {
                throw ValidationException::withMessages(['pay_head_category_'.$index => trans('employee.invalid_pay_head_category', ['name' => trans('employee.pay_head_category')])]);
            }

            if ($category == 'computation' && ! $computation) {
                throw ValidationException::withMessages(['pay_head_computation_'.$index => trans('validation.required', ['attribute' => trans('employee.pay_head_computation')])]);
            }

            if ($category == 'production' && ! $attendance_type_id) {
                throw ValidationException::withMessages(['attendance_type_'.$index => trans('validation.required', ['attribute' => trans('employee.attendance_type')])]);
            }

            if ($category == 'production' && ! in_array($attendance_type_id, $attendance_types)) {
                throw ValidationException::withMessages(['attendance_type_'.$index => trans('employee.could_not_find_attendance_type')]);
            }

            $this->validateComputation([
                'category' => $category,
                'name' => $name,
                'computation' => $computation,
                'variables' => $variables
            ]);

            $variables[] = $alias;
        }

        if (count($pay_heads) != count(array_unique($ids))) {
            throw ValidationException::withMessages(['employee.payroll_template_duplicate_pay_head']);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $payroll_template_id = null)
    {
        $this->validatePayHeads($params);

        $formatted = [
            'name'        => gv($params, 'name'),
            'is_active'   => gbv($params, 'is_active'),
            'description' => gv($params, 'description'),
            'options'     => []
        ];

        if (! $payroll_template_id) {
            $formatted['uuid'] = Str::uuid();
        }

        return $formatted;
    }

    /**
     * Update given payroll template.
     *
     * @param PayrollTemplate $payroll_template
     * @param array $params
     *
     * @return PayrollTemplate
     */

    public function update(PayrollTemplate $payroll_template, $params)
    {
        if ($payroll_template->salaries()->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_template_associated_with_salary')]);
        }

        $payroll_template->forceFill($this->formatParams($params, $payroll_template->id))->save();

        $this->updatePayrollTemplateDetail($payroll_template, $params);

        return $payroll_template;
    }

    /**
     * Find payroll template is deletable or not.
     *
     * @param string $uuid
     * @return bool|null
     */
    public function deletable($uuid)
    {
        $payroll_template = $this->findByUuidOrFail($uuid);

        if ($payroll_template->salaries()->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_template_associated_with_salary')]);
        }

        return $payroll_template;
    }

    /**
     * Delete payroll template.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(PayrollTemplate $payroll_template)
    {
        return $payroll_template->delete();
    }

    /**
     * Delete multiple payroll templates.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->payroll_template->whereIn('id', $ids)->delete();
    }
}