<?php
namespace App\Repositories\Academic;

use Illuminate\Support\Str;
use App\Models\Employee\Employee;
use App\Models\Academic\Certificate;
use App\Models\Student\StudentRecord;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Academic\CertificateTemplateRepository;

class CertificateRepository
{
    protected $certificate;
    protected $certificate_template;
    protected $student_record;
	protected $employee;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Certificate $certificate,
        CertificateTemplateRepository $certificate_template,
        StudentRecord $student_record,
		Employee $employee
    ) {
        $this->certificate = $certificate;
        $this->certificate_template = $certificate_template;
        $this->student_record = $student_record;
		$this->employee = $employee;
    }

    /**
     * Get certificate query
     *
     * @return Certificate query
     */
    public function getQuery()
    {
        return $this->certificate;
    }

    /**
     * Count Certificate
     *
     * @return integer
     */
    public function count()
    {
        return $this->certificate->filterBySession()->count();
    }

    /**
     * Get all certificates
     *
     * @return array
     */
    public function getAll()
    {
        return $this->certificate->all();
    }

    /**
     * Find certificate with given id.
     *
     * @param integer $id
     * @return Certificate
     */
    public function find($id)
    {
        return $this->certificate->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find certificate with given id or throw an error.
     *
     * @param integer $id
     * @return Certificate
     */
    public function findOrFail($id, $field = 'message')
    {
        $certificate = $this->certificate->info()->filterBySession()->filterById($id)->first();

        if (! $certificate) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_certificate')]);
        }

        return $certificate;
    }

    /**
     * Find certificate with given uuid.
     *
     * @param string $uuid
     * @return Certificate
     */
    public function findByUuid($uuid)
    {
        return $this->certificate->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find certificate with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Certificate
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $certificate = $this->certificate->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $certificate) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_certificate')]);
        }

        return $certificate;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Certificate
     */
    public function getData($params)
    {
        $sort_by                 = gv($params, 'sort_by', 'date_of_certificate');
        $order                   = gv($params, 'order', 'desc');
        $certificate_template_id = gv($params, 'certificate_template_id');
        $type                    = gv($params, 'type');

        $certificate_template_id = is_array($certificate_template_id) ? $certificate_template_id : ($certificate_template_id ? explode(',', $certificate_template_id) : []);

        $date_of_certificate_start_date = gv($params, 'date_of_certificate_start_date');
        $date_of_certificate_end_date   = gv($params, 'date_of_certificate_end_date');

        $query = $this->certificate->info()->filterBySession()->dateOfCertificateBetween([
                'start_date' => $date_of_certificate_start_date,
                'end_date' => $date_of_certificate_end_date
            ]);

        if ($type) {
            $query->whereHas('certificateTemplate', function($q) use($type) {
                $q->where('type', $type);
            });
        }

        if (count($certificate_template_id)) {
            $query->whereIn('certificate_template_id', $certificate_template_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all certificate using given params.
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
     * @return Certificate
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $certificate_template_details = $this->certificate_template->getAll();

        $certificate_templates = array();

        foreach ($certificate_template_details as $certificate_template_detail) {
        	$certificate_templates[] = array(
        		'id' => $certificate_template_detail->id,
        		'name' => $certificate_template_detail->name
        	);
        }

        return compact('certificate_template_details','certificate_templates');
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Create a new certificate.
     *
     * @param array $params
     * @return Certificate
     */
    public function create($params)
    {
        return $this->certificate->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $certificate_id = null)
    {
        $certificate_template_id = gv($params, 'certificate_template_id');

        $certificate_template = $this->certificate_template->findOrFail($certificate_template_id);

        $student_record_id = gv($params, 'student_record_id');
        $employee_id = gv($params, 'employee_id');

        if ($certificate_template->type == 'student') {

            if (! $student_record_id) {
                throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => trans('student.student')])]);
            }

            $student_record = $this->student_record->filterbyId($student_record_id)->first();

            if (! $student_record) {
                throw ValidationException::withMessages(['message' => trans('student.could_not_find_student')]);
            }
        }

        if ($certificate_template->type == 'employee') {

            if (! $employee_id) {
                throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => trans('employee.employee')])]);
            }

            $employee = $this->employee->filterbyId($employee_id)->first();

            if (! $employee) {
                throw ValidationException::withMessages(['message' => trans('employee.could_not_find_employee')]);
            }
        }

        $body = clean(gv($params, 'body'));

        $formatted = [
            'certificate_template_id' => $certificate_template_id,
            'date_of_certificate'     => date('Y-m-d'),
            'body'                    => $body,
            'student_record_id'       => $certificate_template->type == 'student' ? $student_record->id : null,
            'employee_id'             => $certificate_template->type == 'employee' ? $employee->id : null
        ];

        $fields = gv($params, 'custom_fields', []);

        $custom_fields = array();
        foreach ($fields as $field) {
            $custom_fields[] = array('name' => gv($field, 'name'), 'value' => gv($field, 'value'));
        }

        $options['custom_fields'] = $custom_fields;
        $formatted['options'] = $options;

        if (! $certificate_id) {
            $formatted['uuid'] = Str::uuid();
        }

        return $formatted;
    }

    /**
     * Update given certificate.
     *
     * @param Certificate $certificate
     * @param array $params
     *
     * @return Certificate
     */
    public function update(Certificate $certificate, $params)
    {
        $certificate->forceFill($this->formatParams($params, $certificate->id))->save();

        return $certificate;
    }

    /**
     * Delete certificate.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Certificate $certificate)
    {
        return $certificate->delete();
    }

    /**
     * Delete multiple certificate.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->certificate->whereIn('id', $ids)->delete();
    }
}