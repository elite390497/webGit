<?php
namespace App\Repositories\Employee;

use App\User;
use Illuminate\Support\Str;
use App\Models\Employee\Employee;
use App\Models\Employee\EmployeeTerm;
use App\Models\Employee\EmployeeDesignation;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\RoleRepository;
use App\Repositories\Configuration\Misc\CasteRepository;
use App\Repositories\Configuration\CustomFieldRepository;
use App\Repositories\Configuration\Misc\CategoryRepository;
use App\Repositories\Configuration\Misc\ReligionRepository;
use App\Repositories\Configuration\Misc\BloodGroupRepository;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Employee\DesignationRepository;
use App\Repositories\Configuration\Employee\EmployeeGroupRepository;
use App\Repositories\Configuration\Academic\IdCardTemplateRepository;

class EmployeeRepository {
	protected $employee;
	protected $designation;
	protected $department;
	protected $employee_term;
	protected $employee_designation;
	protected $caste;
	protected $category;
	protected $religion;
	protected $blood_group;
	protected $user;
	protected $employee_group;
	protected $role;
	protected $id_card_template;
	protected $custom_field;

	/**
	 * Instantiate a new instance.
	 *
	 * @return void
	 */
	public function __construct(
		Employee $employee,
		DesignationRepository $designation,
		DepartmentRepository $department,
		EmployeeTerm $employee_term,
		EmployeeDesignation $employee_designation,
		CasteRepository $caste,
		CategoryRepository $category,
		ReligionRepository $religion,
		BloodGroupRepository $blood_group,
		User $user,
		EmployeeGroupRepository $employee_group,
		RoleRepository $role,
		IdCardTemplateRepository $id_card_template,
		CustomFieldRepository $custom_field
	) {
		$this->employee = $employee;
		$this->designation = $designation;
		$this->department = $department;
		$this->employee_term = $employee_term;
		$this->employee_designation = $employee_designation;
		$this->caste = $caste;
		$this->category = $category;
		$this->religion = $religion;
		$this->blood_group = $blood_group;
		$this->user = $user;
		$this->employee_group = $employee_group;
		$this->role = $role;
		$this->id_card_template = $id_card_template;
		$this->custom_field = $custom_field;
	}

	/**
	 * Get employee query
	 *
	 * @return Employee query
	 */
	public function getQuery() {
		return $this->employee;
	}

	/**
	 * Count employee
	 *
	 * @return integer
	 */
	public function count() {
		return $this->employee->count();
	}

	/**
	 * List all employees by id
	 *
	 * @return array
	 */
	public function listId() {
		return $this->employee->get()->pluck('id')->all();
	}

	/**
	 * Get all employees
	 *
	 * @return array
	 */
	public function getAll() {
		return $this->employee->get();
	}

	/**
	 * List all employees by name & id for select option
	 *
	 * @return array
	 */
	public function selectAll() {
		$employees = $this->employee->all();

		$data = array();
		foreach ($employees as $employee) {
			$data[] = array(
				'name' => $employee->name . ' (' . $employee->contact_number . ')',
				'id' => $employee->id,
			);
		}

		return $data;
	}

	/**
	 * Find employee with given id.
	 *
	 * @param integer $id
	 * @return Employee
	 */
	public function find($id) {
		return $this->employee->info()->filterById($id)->first();
	}

	/**
	 * Find employee with given uuid.
	 *
	 * @param string $uuid
	 * @return Employee
	 */
	public function findByUuid($uuid) {
		return $this->employee->info()->filterByUuid($uuid)->first();
	}

	/**
	 * Find employee with given id or throw an error.
	 *
	 * @param integer $id
	 * @return Employee
	 */
	public function findOrFail($id, $field = 'message') {
		$employee = $this->employee->info()->filterById($id)->first();

		if (!$employee) {
			throw ValidationException::withMessages([$field => trans('employee.could_not_find_employee')]);
		}

		return $employee;
	}

	/**
	 * Find employee with given uuid or throw an error.
	 *
	 * @param string $uuid
	 * @return Employee
	 */
	public function findByUuidOrFail($uuid, $field = 'message') {
		$employee = $this->employee->info()->filterByUuid($uuid)->first();

		if (!$employee) {
			throw ValidationException::withMessages([$field => trans('employee.could_not_find_employee')]);
		}

		return $employee;
	}

	/**
	 * Get all filtered data
	 *
	 * @param array $params
	 * @return Employee
	 */
	public function getData($params) {
		$sort_by = gv($params, 'sort_by', 'first_name');
		$order = gv($params, 'order', 'asc');
		$first_name = gv($params, 'first_name');
		$middle_name = gv($params, 'middle_name');
		$last_name = gv($params, 'last_name');
		$father_name = gv($params, 'father_name');
		$status = gv($params, 'status');
		$designation_id = gv($params, 'designation_id');
		$department_id = gv($params, 'department_id');
		$employee_category_id = gv($params, 'employee_category_id');
		$employee_group_id = gv($params, 'employee_group_id');
		$self = gv($params, 'self', 1);
		$date = toDate(gv($params, 'date', date('Y-m-d')));

		$this->employee->whereNull('prefix')->update(['prefix' => config('config.employee_code_prefix')]);

		$designation_id = is_array($designation_id) ? $designation_id : ($designation_id ? explode(',', $designation_id) : []);
		$department_id = is_array($department_id) ? $department_id : ($department_id ? explode(',', $department_id) : []);
		$employee_group_id = is_array($employee_group_id) ? $employee_group_id : ($employee_group_id ? explode(',', $employee_group_id) : []);
		$employee_category_id = is_array($employee_category_id) ? $employee_category_id : ($employee_category_id ? explode(',', $employee_category_id) : []);

		$system_admins = $this->employee->whereHas('user', function ($q) {
			$q->role(config('system.default_role.admin'));
		})->get()->pluck('id')->all();

		$query = $this->employee->whereNotNull('id');

		if (gbv($params, 'summary')) {
			$query->summary();
		} else {
			$query->info();
		}

		$employee_ids = $this->getAccessibleEmployeeId();

		if ($self) {
			array_push($employee_ids, \Auth::user()->Employee->id);
			$employee_ids = array_unique($employee_ids);
		}

		$query->whereNotIn('id', $system_admins)->whereIn('id', $employee_ids)->filterByFirstName($first_name)->filterByMiddleName($middle_name)->filterByLastName($last_name)->filterByFatherName($father_name);

		if (count($designation_id)) {
			$query->whereHas('employeeDesignations', function ($q) use ($designation_id, $date) {
				$q->where('date_effective', '<=', $date)->where(function ($q1) use ($date) {
					$q1->where('date_end', '=', null)->orWhere(function ($q2) use ($date) {
						$q2->where('date_end', '!=', null)->where('date_end', '>=', $date);
					});
				})->whereIn('designation_id', $designation_id);
			});
		}

		if (count($employee_category_id)) {
			$query->whereHas('employeeDesignations', function ($q) use ($employee_category_id, $date) {
				$q->where('date_effective', '<=', $date)->where(function ($q1) use ($date) {
					$q1->where('date_end', '=', null)->orWhere(function ($q2) use ($date) {
						$q2->where('date_end', '!=', null)->where('date_end', '>=', $date);
					});
				})->whereHas('designation', function ($q) use ($employee_category_id) {
					$q->whereHas('employeeCategory', function ($q1) use ($employee_category_id) {
						$q1->whereIn('employee_category_id', $employee_category_id);
					});
				});
			});
		}

		if (count($department_id)) {
			$query->whereHas('employeeDesignations', function ($q) use ($department_id, $date) {
				$q->where('date_effective', '<=', $date)->where(function ($q1) use ($date) {
					$q1->where('date_end', '=', null)->orWhere(function ($q2) use ($date) {
						$q2->where('date_end', '!=', null)->where('date_end', '>=', $date);
					});
				})->whereIn('department_id', $department_id);
			});
		}

		if (count($employee_group_id)) {
			$query->whereHas('employeeGroups', function ($q) use ($employee_group_id) {
				$q->whereIn('employee_group_id', $employee_group_id);
			});
		}

		if ($status == 'active') {
			$query->whereHas('employeeTerms', function ($q) use ($date) {
				$q->where(function ($q1) use ($date) {
					$q1->whereNull('date_of_leaving')->where('date_of_joining', '<=', $date);
				})->orWhere(function ($q2) use ($date) {
					$q2->whereNotNull('date_of_leaving')->where('date_of_joining', '<=', $date)->where('date_of_leaving', '>=', $date);
				});
			});
		} elseif ($status == 'inactive') {
			$query->whereHas('employeeTerms', function ($q) use ($date) {
				$q->Where(function ($q1) use ($date) {
					$q1->whereNotNull('date_of_leaving')->where('date_of_leaving', '<', $date);
				});
			});
		}

		return $query->orderBy($sort_by, $order);
	}

	/**
	 * Paginate all employees using given params.
	 *
	 * @param array $params
	 * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
	 */
	public function paginate($params) {
		$page_length = gv($params, 'page_length', config('config.page_length'));

        $query = $this->getData($params);

        if (request('action') == 'excel') {
            return $this->exportExcel($query->get());
        }

        return $query->paginate($page_length);
	}

    /**
     * Export employee data
     * @param  array  $employees
     * @return array
     */
    private function exportExcel($employees = array())
    {
        $data = array();
        $data[] = array(
                trans('employee.code'),
                trans('employee.name'),
                trans('employee.status'),
                trans('employee.father_name'),
                trans('employee.date_of_birth'),
                trans('employee.contact_number'),
                trans('employee.department'),
                trans('employee.designation'),
                trans('employee.date_of_joining')
        );
        foreach ($employees as $employee) {
			$employee_term = $employee->EmployeeTerms->first();
            if($employee_term && $employee_term->date_of_joining <= date('Y-m-d') && (! $employee_term->date_of_leaving || $employee->date_of_leaving >= date('Y-m-d'))) {
                $status = trans('employee.status_active');
            } else {
                $status = trans('employee.status_inactive');
            }
            $employee_designation = $employee->EmployeeDesignations->first();
            if($employee_designation && $employee_designation->department_id) {
                $department = $employee_designation->Department->name;
            } else {
            	$department = '-';
            }
            if($employee_designation && $employee_designation->designation_id) {
                $designation = $employee_designation->Designation->designation_with_category;
            } else {
            	$designation = '-';
            }

            $date_of_joining = ($employee_term) ? showDate($employee_term->date_of_joining) : '-';

            $data[] = array(
                $employee->employee_code,
                $employee->name,
                $status,
                $employee->father_name,
                showDate($employee->date_of_birth),
                $employee->contact_number,
                $department,
                $designation,
                $date_of_joining
            );
        }

        return $data;
    }

	/**
	 * Get all filtered data for printing
	 *
	 * @param array $params
	 * @return Employee
	 */
	public function print($params) {
		return $this->getData($params)->get();
	}

	/**
	 * Get employee filters.
	 *
	 * @return Array
	 */
	public function getFilters() {
		$departments = $this->department->selectAll();
		$designations = $this->designation->getDesignationOption();
		$employee_groups = $this->employee_group->selectAll();

		return compact('departments', 'designations', 'employee_groups');
	}

	/**
	 * Get id card pre requisite.
	 *
	 * @return Array
	 */
	public function getIdCardPreRequisite() {
		$departments = $this->department->selectAll();

		$id_card_templates = $this->id_card_template->selectAllByType('employee');

		return compact('departments', 'id_card_templates');
	}

	/**
	 * Validate Id card template
	 * @param  integer $id_card_template_id
	 * @return IdCardTemplate
	 */
	public function validateIdCardTemplate($id_card_template_id) {
		$id_card_template = $this->id_card_template->findOrFail($id_card_template_id);

		if ($id_card_template->type != 'employee') {
			throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
		}

		return $id_card_template;
	}

	/**
	 * Fetch department wise employee
	 * @param  array  $params
	 * @return array
	 */
	public function fetchDepartmentWiseEmployee($params = array()) {
		$department_id = gv($params, 'department_id');
		$date = toDate(gv($params, 'date', date('Y-m-d')));

		$department = $this->department->findOrFail($department_id);

		$employee_ids = $this->getAccessibleEmployeeId();

		$system_admins = $this->employee->whereHas('user', function ($q) {
			$q->role(config('system.default_role.admin'));
		})->get()->pluck('id')->all();

		$query = $this->employee->info()->whereNotIn('id', $system_admins)->whereIn('id', $employee_ids);

		$employees = $query->whereHas('employeeDesignations', function ($q) use ($department_id, $date) {
			$q->where('date_effective', '<=', $date)->where(function ($q1) use ($date) {
				$q1->where('date_end', '=', null)->orWhere(function ($q2) use ($date) {
					$q2->where('date_end', '!=', null)->where('date_end', '>=', $date);
				});
			})->where('department_id', $department_id);
		})->get();

		return compact('employees', 'department');
	}

	/**
	 * Get employee pre requisite.
	 *
	 * @return Array
	 */
	public function getPreRequisite() {
		$departments = $this->department->selectAll();
		$designations = $this->designation->getDesignationOption();
		$list = getVar('list');
		$genders = generateTranslatedSelectOption(isset($list['gender']) ? $list['gender'] : []);
		$codes = $this->employee->groupBy('prefix')->get(['prefix', \DB::raw('MAX(code) as code')]);

		return compact('departments', 'genders', 'designations', 'codes');
	}

	/**
	 * Get employee basic pre requisite.
	 *
	 * @return Array
	 */
	public function getBasicPreRequisite() {
		$castes = $this->caste->selectAll();
		$categories = $this->category->selectAll();
		$religions = $this->religion->selectAll();
		$blood_groups = $this->blood_group->selectAll();
		$list = getVar('list');
		$genders = generateTranslatedSelectOption(isset($list['gender']) ? $list['gender'] : []);
		$marital_statuses = generateTranslatedSelectOption(isset($list['marital_status']) ? $list['marital_status'] : []);

        $form_type = in_array(request('form_type'), ['employee_basic', 'employee_contact']) ? request('form_type') : 'employee_basic';

        $custom_fields = $this->custom_field->listAllByForm($form_type);

		return compact('castes', 'categories', 'religions', 'blood_groups', 'genders', 'marital_statuses','custom_fields');
	}

	/**
	 * Create a new employee.
	 *
	 * @param array $params
	 * @return Employee
	 */
	public function create($params) {
		$this->validateInput($params);

		$employee = $this->employee->forceCreate($this->formatParams($params));

		$employee_term = $this->createEmployeeTerm($employee, $params);

		$this->createEmployeeDesignation($employee, $params, $employee_term->id);

		return $employee;
	}

	/**
	 * Validate all input.
	 *
	 * @param array $params
	 */
	public function validateInput($params = array()) {
		$date_of_joining = toDate(gv($params, 'date_of_joining'));
		$gender = gv($params, 'gender');
		$department_id = gv($params, 'department_id');
		$designation_id = gv($params, 'designation_id');

		if ($department_id) {
			$this->department->findOrFail($department_id, 'department_id');
		}

		$designation = $this->designation->findOrFail($designation_id, 'designation_id');

		if ($designation->name == config('config.system_admin_designation')) {
			throw ValidationException::withMessages(['designation_id' => trans('employee.could_not_find_designation')]);
		}

		$list = getVar('list');
		$genders = isset($list['gender']) ? $list['gender'] : [];
		if (!in_array($gender, $genders)) {
			throw ValidationException::withMessages(['gender' => trans('employee.could_not_find_gender')]);
		}

		if (!config('config.allow_employee_date_of_joining_out_of_session') && !dateBetweenSession($date_of_joining)) {
			throw ValidationException::withMessages(['date_of_joining' => trans('academic.invalid_session_date_range')]);
		}
	}

	/**
	 * Prepare given params for inserting into database.
	 *
	 * @param array $params
	 * @param string $type
	 * @return array
	 */
	private function formatParams($params) {
		$code = ltrim(gv($params, 'code'), '0');

		if (!isInteger($code)) {
			throw ValidationException::withMessages(['code' => trans('validation.integer', ['attribute' => trans('employee.code')])]);
		}

		$prefix = gv($params, 'prefix');

		if ($this->employee->filterByCode($code)->filterByPrefix($prefix)->count()) {
			throw ValidationException::withMessages(['code' => trans('employee.code_exists')]);
		}

		$formatted = [
			'first_name' => gv($params, 'first_name'),
			'middle_name' => gv($params, 'middle_name'),
			'last_name' => gv($params, 'last_name'),
			'father_name' => gv($params, 'father_name'),
			'mother_name' => gv($params, 'mother_name'),
			'contact_number' => gv($params, 'contact_number'),
			'date_of_birth' => toDate(gv($params, 'date_of_birth')),
			'gender' => gv($params, 'gender'),
			'code' => gv($params, 'code'),
			'prefix' => gv($params, 'prefix'),
			'uuid' => Str::uuid(),
		];

		$formatted['options'] = [];

		return $formatted;
	}

	/**
	 * Create new employee designation
	 *
	 * @param Employee $employee
	 * @param array $params
	 */
	public function createEmployeeDesignation(Employee $employee, $params = array(), $employee_term_id) {
		$this->employee_designation->forceCreate([
			'employee_id' => $employee->id,
			'department_id' => gv($params, 'department_id'),
			'designation_id' => gv($params, 'designation_id'),
			'date_effective' => toDate(gv($params, 'date_of_joining')),
			'upload_token' => Str::uuid(),
			'employee_term_id' => $employee_term_id,
			'options' => [],
		]);
	}

	/**
	 * Create new employee term
	 *
	 * @param Employee $employee
	 * @param array $params
	 */
	public function createEmployeeTerm(Employee $employee, $params = array()) {
		return $this->employee_term->forceCreate([
			'employee_id' => $employee->id,
			'date_of_joining' => toDate(gv($params, 'date_of_joining')),
			'upload_token' => Str::uuid(),
			'options' => [],
		]);
	}

	/**
	 * Get employee query who are accessible for given user
	 *
	 * @param User $user
	 * @param boolean $self (Pass 1 to include given user id)
	 * @return Query
	 */
	public function getAccessibleEmployee($user = null, $self = 0) {
		$user = ($user) ?: \Auth::user();

		$self = $user->hasRole(config('system.default_role.admin')) ? 0 : 0;

		$system_admins = $this->employee->whereHas('user', function ($q) {
			$q->role(config('system.default_role.admin'));
		})->get()->pluck('id')->all();

		$query = $this->employee->whereNotIn('id', $system_admins);

		if ($user->hasRole(config('system.default_role.admin'))) {
			return $query;
		}

		$subordinate_ids = $this->designation->getSubordinateId($user);

		$employees = $this->employee->with('employeeDesignations')->get();

		$accessible_employees = array();
		foreach ($employees as $employee) {
			if (in_array(getEmployeeDesignationId($employee), $subordinate_ids)) {
				$accessible_employees[] = $employee->id;
			}
		}

		if ($self) {
			$accessible_employees[] = $user->Employee->id;
		}

		return $query->whereIn('id', $accessible_employees);
	}

	/**
	 * Get all employee's id who are accessible for given user id
	 *
	 * @param User $user
	 * @param boolean $self (Pass 1 to include given user id)
	 * @return array
	 */
	public function getAccessibleEmployeeId($user = null, $self = 0) {
		return $this->getAccessibleEmployee($user, $self)->get()->pluck('id')->all();
	}

	/**
	 * Get all employee's list who are accessible for given user id
	 *
	 * @param User $user
	 * @param boolean $self (Pass 1 to include given user id)
	 * @return array
	 */
	public function getAccessibleEmployeeList($user = null, $self = 0) {
		return generateSelectOption($this->getAccessibleEmployee($user, $self)->orderBy('first_name', 'asc')->orderBy('last_name', 'asc')->get()->pluck('name_with_code', 'id')->all());
	}

	/**
	 * Check whether employee is accessible for authenticated user
	 *
	 * @param Employee $employee
	 * @return boolean
	 */
	public function isAccessible($employee, $self = 0) {
		$auth_user = \Auth::user();
		if ($auth_user->hasRole(config('system.default_role.admin'))) {
			return true;
		}

		if ($self && $employee->id == $auth_user->Employee->id) {
			return true;
		}

		if (!in_array($employee->id, $this->getAccessibleEmployeeId())) {
			throw ValidationException::withMessages(['message' => trans('employee.not_accessible')]);
		}
	}

	/**
	 * Check whether user is accessible for authenticated user
	 *
	 * @param Employee $employee
	 * @return boolean
	 */
	public function userAccessible($employee, $self = 0) {
		$auth_user = \Auth::user();
		if ($self && $employee->id == $auth_user->Employee->id) {
			return true;
		}

		return in_array($employee->id, $this->getAccessibleEmployeeId()) ? true : false;
	}

	/**
	 * Update given employee.
	 *
	 * @param Employee $employee
	 * @param array $params
	 *
	 * @return Employee
	 */
	public function update(Employee $employee, $params) {
		$type = gv($params, 'type', 'basic');

		if ($type == 'basic') {
			$custom_values = $this->custom_field->validateCustomValues('employee_basic', gv($params, 'custom_values', []));

			$employee->forceFill($this->updateBasic($employee, $params))->save();

            $options = $employee->options;
            $options['custom_values'] = mergeByKey($employee->getOption('custom_values'), $custom_values);
            $employee->options = $options;
            $employee->save();

		} elseif ($type == 'contact') {
			$custom_values = $this->custom_field->validateCustomValues('employee_contact', gv($params, 'custom_values', []));

			$employee->forceFill($this->updateContact($employee, $params))->save();

            $options = $employee->options;
            $options['custom_values'] = mergeByKey($employee->getOption('custom_values'), $custom_values);
            $employee->options = $options;
            $employee->save();
		}
		
		return $employee;
	}

	/**
	 * Prepare basic params for inserting into database.
	 *
	 * @param Employee $employee
	 * @param array $params
	 * @return array
	 */
	private function updateBasic(Employee $employee, $params) {
		if (request('caste_id')) {
			$this->caste->findOrFail(request('caste_id'));
		}

		if (request('category_id')) {
			$this->category->findOrFail(request('category_id'));
		}

		if (request('religion_id')) {
			$this->religion->findOrFail(request('religion_id'));
		}

		if (request('blood_group_id')) {
			$this->blood_group->findOrFail(request('blood_group_id'));
		}

		return [
			'first_name' => gv($params, 'first_name'),
			'last_name' => gv($params, 'last_name'),
			'date_of_birth' => toDate(gv($params, 'date_of_birth')),
			'date_of_anniversary' => toDate(gv($params, 'date_of_anniversary')),
			'marital_status' => gv($params, 'marital_status'),
			'middle_name' => gv($params, 'middle_name'),
			'father_name' => gv($params, 'father_name'),
			'mother_name' => gv($params, 'mother_name'),
			'gender' => gv($params, 'gender'),
			'mother_tongue' => gv($params, 'mother_tongue'),
			'unique_identification_number' => gv($params, 'unique_identification_number'),
			'nationality' => gv($params, 'nationality'),
			'caste_id' => gv($params, 'caste_id'),
			'category_id' => gv($params, 'category_id'),
			'religion_id' => gv($params, 'religion_id'),
			'blood_group_id' => gv($params, 'blood_group_id'),
		];
	}

	/**
	 * Prepare basic params for inserting into database.
	 *
	 * @param Employee $employee
	 * @param array $params
	 * @return array
	 */
	private function updateContact(Employee $employee, $params) {
		$same_as_present_address = gbv($params, 'same_as_present_address');

		return [
			'contact_number' => gv($params, 'contact_number'),
			'alternate_contact_number' => gv($params, 'alternate_contact_number'),
			'email' => gv($params, 'email'),
			'alternate_email' => gv($params, 'alternate_email'),
			'emergency_contact_number' => gv($params, 'emergency_contact_number'),
			'emergency_contact_name' => gv($params, 'emergency_contact_name'),
			'present_address_line_1' => gv($params, 'present_address_line_1'),
			'present_address_line_2' => gv($params, 'present_address_line_2'),
			'present_city' => gv($params, 'present_city'),
			'present_state' => gv($params, 'present_state'),
			'present_zipcode' => gv($params, 'present_zipcode'),
			'present_country' => gv($params, 'present_country'),
			'same_as_present_address' => $same_as_present_address,
			'permanent_address_line_1' => !$same_as_present_address ? gv($params, 'permanent_address_line_1') : '',
			'permanent_address_line_2' => !$same_as_present_address ? gv($params, 'permanent_address_line_2') : '',
			'permanent_city' => !$same_as_present_address ? gv($params, 'permanent_city') : '',
			'permanent_state' => !$same_as_present_address ? gv($params, 'permanent_state') : '',
			'permanent_zipcode' => !$same_as_present_address ? gv($params, 'permanent_zipcode') : '',
			'permanent_country' => !$same_as_present_address ? gv($params, 'permanent_country') : '',
		];
	}

	/**
	 * Update user login
	 *
	 * @param Employee $employee
	 * @param array $params
	 * @return Employee
	 */
	public function updateUserLogin(Employee $employee, $params) {
		$enable_employee_login = gbv($params, 'enable_employee_login');
		$change_employee_password = gbv($params, 'change_employee_password');
		$employee_email = gv($params, 'employee_email');
		$employee_username = gv($params, 'employee_username');
		$employee_password = gv($params, 'employee_password');
		$role = gv($params, 'role');

		$employee_user = $employee->User;

		$available_roles = $this->role->employeeRoleList();

		if ($enable_employee_login && !in_array($role, $available_roles)) {
			throw ValidationException::withMessages(['message' => trans('employee.role_not_available')]);
		}

		if ($enable_employee_login && !$employee_user) {
			if (!$employee_password) {
				throw ValidationException::withMessages(['employee_password' => trans('validation.required', ['attribute' => trans('employee.employee_password')])]);
			}

			if (!$employee_username && !$employee_email) {
				throw ValidationException::withMessages(['message' => trans('auth.username_or_email_required')]);
			}

			if ($employee_email && $this->user->whereEmail($employee_email)->count()) {
				throw ValidationException::withMessages(['message' => trans('auth.email_already_exists')]);
			}

			if ($employee_username && $this->user->whereUsername($employee_username)->count()) {
				throw ValidationException::withMessages(['message' => trans('auth.username_already_exists')]);
			}

			$employee_user = $this->user->forceCreate([
				'email' => $employee_email,
				'username' => $employee_username,
				'password' => bcrypt($employee_password),
				'status' => 'activated',
				'uuid' => Str::uuid(),
				'activation_token' => Str::uuid(),
			]);

			$employee->user_id = $employee_user->id;
			$employee->save();
		}

		if ($enable_employee_login) {
			$employee_user->syncRoles([$role]);
			if (!$change_employee_password) {
				$employee_user->status = 'activated';
				$employee_user->email = $employee_email;
				$employee_user->username = $employee_username;
				$employee_user->save();
			} else {
				$employee_user->password = bcrypt($employee_password);
				$employee_user->save();
			}
		} else {
			$employee_user->status = 'banned';
			$employee_user->save();
		}

		return $employee;
	}

	/**
	 * Search employee by name
	 *
	 * @param array $params
	 * @return Employee
	 */
	public function searchByName($params) {
		$name = gv($params, 'name');
		$array_of_name = explode(' ', $name);
		$first_name = gv($array_of_name, 0);
		$middle_name = (str_word_count($name) > 2) ? gv($array_of_name, 1) : '';
		$last_name = gv($array_of_name, (str_word_count($name) > 2) ? 2 : 1);

		$page_length = gv($params, 'page_length', config('config.page_length'));

		return $this->employee->with('employeeTerms', 'employeeDesignations', 'employeeDesignations.designation', 'employeeDesignations.designation.employeeCategory', 'caste','category', 'religion')->filterByFirstName($first_name)->filterByMiddleName($middle_name)->filterByLastName($last_name)->orderBy('first_name', 'asc')->orderBy('last_name', 'asc')->paginate($page_length);
	}

	/**
	 * Search employee
	 *
	 * @param array $params
	 * @return Employee
	 */
	public function search($q) {
		if (!\Auth::user()->can('list-employee')) {
			return [];
		}

		$system_admins = $this->employee->whereHas('user', function ($q) {
			$q->role(config('system.default_role.admin'));
		})->get()->pluck('id')->all();

		return $this->employee->select('id', 'uuid', 'first_name', 'middle_name', 'last_name', 'code', 'contact_number','date_of_birth','prefix', 'gender')
			->with('employeeTerms:id,employee_id,date_of_joining,date_of_leaving', 'employeeDesignations:id,employee_id,designation_id,date_effective,date_end', 'employeeDesignations.designation:id,name,employee_category_id', 'employeeDesignations.designation.employeeCategory:id,name')
			->whereNotIn('id', $system_admins)
			->whereIn('id', $this->getAccessibleEmployeeId())
			->where(function ($q1) use ($q) {
				$q1->where(\DB::raw('(SELECT concat_ws(" ", first_name,middle_name,last_name))'), 'LIKE', '%' . $q . '%')
					->orWhere(\DB::raw('concat_ws(prefix," ",LPAD(code, ' . config('config.employee_code_digit') . ', 0))'), 'LIKE', '%' . $q . '%');
			})->take(10)->get();
	}

	/**
	 * Validate employee
	 *
	 * @param integer $employee_id
	 * @return Employee
	 */
	public function validateEmployeeOrFail($employee_id) {
		$employee = $this->employee->with(['employeeTerms' => function ($q) {
			$q->whereNull('date_of_leaving')->orderBy('date_of_joining', 'desc');
		}])->filterById($employee_id)->whereHas('employeeTerms', function ($q) {
			$q->whereNull('date_of_leaving');
		})->first();

		if (!$employee) {
			throw ValidationException::withMessages(['message' => trans('employee.could_not_find_employee')]);
		}

		return $employee;
	}

	/**
	 * Validate employee on a date
	 *
	 * @param integer $employee_id
	 * @param date $date
	 * @return Employee
	 */
	public function validateEmployeeWithDateOrFail($employee_id, $date) {
		$employee = $this->employee->with(['employeeTerms' => function ($q) {
			$q->whereNull('date_of_leaving')->orderBy('date_of_joining', 'desc');
		}])->filterById($employee_id)->whereHas('employeeTerms', function ($q) use ($date) {
			$q->where('date_of_joining', '<=', $date)->whereNull('date_of_leaving');
		})->first();

		if (!$employee) {
			throw ValidationException::withMessages(['message' => trans('employee.invalid_record_for_given_date', ['date' => showDate($date)])]);
		}

		return $employee;
	}

	/**
	 * Update employee group
	 *
	 * @param array $params
	 * @return null
	 */
	public function updateGroup($params) {
		$employee_group_id = gv($params, 'employee_group_id');
		$action = gv($params, 'action');
		$ids = gv($params, 'ids', []);

		if (!in_array($action, ['attach', 'detach'])) {
			throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
		}

		if (!count($ids)) {
			throw ValidationException::withMessages(['message' => trans('employee.could_not_find_employee')]);
		}

		$accessible_employee_ids = $this->getAccessibleEmployeeId();

		if (count(array_diff($ids, $accessible_employee_ids))) {
			throw ValidationException::withMessages(['message' => trans('employee.could_not_find_some_employee')]);
		}

		$employees = $this->employee->whereIn('id', $ids)->get();

		foreach ($employees as $employee) {
			if ($action == 'attach') {
				$employee->employeeGroups()->attach($employee_group_id);
			} else {
				$employee->employeeGroups()->detach($employee_group_id);
			}
		}
	}
}
