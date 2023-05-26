<?php
namespace App\Repositories\Configuration\Academic;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Academic\CertificateTemplate;

class CertificateTemplateRepository
{
    protected $certificate_template;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CertificateTemplate $certificate_template
    ) {
        $this->certificate_template = $certificate_template;
    }

    /**
     * Get certificate template query
     *
     * @return CertificateTemplate query
     */
    public function getQuery()
    {
        return $this->certificate_template;
    }

    /**
     * Count certificate template
     *
     * @return integer
     */
    public function count()
    {
        return $this->certificate_template->count();
    }

    /**
     * List all certificate templates by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->certificate_template->orderBy('name', 'asc')->get()->pluck('name', 'id')->all();
    }

    /**
     * List all certificate templates by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->certificate_template->orderBy('name', 'asc')->get(['name', 'id']);
    }

    /**
     * List all certificate templates by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->certificate_template->get()->pluck('id')->all();
    }

    /**
     * Get all certificate templates
     *
     * @return array
     */
    public function getAll()
    {
        return $this->certificate_template->all();
    }

    /**
     * Find certificate template with given id.
     *
     * @param integer $id
     * @return CertificateTemplate
     */
    public function find($id)
    {
        return $this->certificate_template->find($id);
    }

    /**
     * Get certificate template pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $student_custom_fields = $this->studentCustomFields();
        $employee_custom_fields = $this->employeeCustomFields();

        return compact('student_custom_fields','employee_custom_fields');
    }

    public function studentCustomFields()
    {
        return [
            'FIRST_NAME',
            'LAST_NAME',
            'NAME',
            'COURSE',
            'BATCH',
            'RELIGION',
            'CASTE',
            'CATEGORY',
            'SESSION',
            'DATE_OF_BIRTH',
            'DATE_OF_ADMISSION',
            'ADMISSION_NUMBER',
            'ROLL_NUMBER',
            'FATHER_NAME',
            'MOTHER_NAME',
            'CURRENT_DATE',
            'CURRENT_TIME',
            'CURRENT_DATE_TIME',
            'PRESENT_ADDRESS',
            'PERMANENT_ADDRESS'
        ];
    }

    public function employeeCustomFields()
    {
        return [
            'FIRST_NAME',
            'LAST_NAME',
            'NAME',
            'FATHER_NAME',
            'MOTHER_NAME',
            'SESSION',
            'RELIGION',
            'CASTE',
            'CATEGORY',
            'DESIGNATION',
            'DATE_OF_BIRTH',
            'DATE_OF_JOINING',
            'EMPLOYEE_CODE',
            'CURRENT_DATE',
            'CURRENT_TIME',
            'CURRENT_DATE_TIME',
            'PRESENT_ADDRESS',
            'PERMANENT_ADDRESS'
        ];
    }

    /**
     * Find certificate template with given id or throw an error.
     *
     * @param integer $id
     * @return CertificateTemplate
     */
    public function findOrFail($id, $field = 'message')
    {
        $certificate_template = $this->certificate_template->find($id);

        if (! $certificate_template) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_certificate_template')]);
        }

        return $certificate_template;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return CertificateTemplate
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $name    = gv($params, 'name');

        return $this->certificate_template->filterByName($name)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all certificate templates using given params.
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
     * @return CertificateTemplate
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new certificate template.
     *
     * @param array $params
     * @return CertificateTemplate
     */
    public function create($params)
    {
        return $this->certificate_template->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $certificate_template_id = null)
    {
        $custom_fields = gv($params, 'custom_fields', []);
        $type = gv($params, 'type');
        $predefined_custom_fields = ($type == 'student') ? $this->studentCustomFields() : $this->employeeCustomFields(); 

        $custom_field_values = array();
        foreach ($custom_fields as $index => $custom_field) {
            $value = gv($custom_field, 'name');

            if (strtoupper($value) !== $value || ! ctype_alpha($value)) {
                throw ValidationException::withMessages([ $index.'_custom_field_name' => trans('academic.certificate_template_custom_field_uppercase_alphabet') ]);
            }

            if (in_array($value, $predefined_custom_fields)) {
                throw ValidationException::withMessages([ $index.'_custom_field_name' => trans('academic.certificate_template_custom_field_name_already_exists')]);
            }

            $custom_field_values[] = $value;
        }

        if (count(array_unique($custom_field_values)) != count($custom_field_values)) {
            throw ValidationException::withMessages(['message' => trans('academic.certificate_template_custom_field_duplicate')]);
        }

        $formatted = [
			'name' => gv($params, 'name'),
			'type' => gv($params, 'type'),
            'body' => clean(gv($params, 'body'))
        ];
        
        $formatted['options'] = ['custom_fields' => $custom_field_values];

        return $formatted;
    }

    /**
     * Update given certificate template.
     *
     * @param CertificateTemplate $certificate_template
     * @param array $params
     *
     * @return CertificateTemplate
     */
    public function update(CertificateTemplate $certificate_template, $params)
    {
        if ($certificate_template->certificates()->count() && $certificate_template->type != gv($params, 'type')) {
            throw ValidationException::withMessages(['message' => trans('academic.certificate_template_associated_with_student')]);
        }

        return $certificate_template->forceFill($this->formatParams($params, $certificate_template->id))->save();
    }

    /**
     * Find certificate template & check it can be deleted or not.
     *
     * @param integer $id
     * @return CertificateTemplate
     */
    public function deletable($id)
    {
        $certificate_template = $this->findOrFail($id);

        if ($certificate_template->certificates()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.certificate_template_associated_with_student')]);
        }

        return $certificate_template;
    }

    /**
     * Delete certificate template.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(CertificateTemplate $certificate_template)
    {
        return $certificate_template->delete();
    }

    /**
     * Delete multiple certificate templates.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->certificate_template->whereIn('id', $ids)->delete();
    }
}
