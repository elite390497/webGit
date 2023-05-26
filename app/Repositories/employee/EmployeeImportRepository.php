<?php
namespace App\Repositories\Employee;

use Illuminate\Support\Str;
use App\Models\Employee\Employee;
use App\Models\Employee\EmployeeTerm;
use App\Models\Configuration\Misc\Caste;
use App\Models\Configuration\Misc\Category;
use App\Models\Configuration\Misc\Religion;
use App\Models\Employee\EmployeeDesignation;
use App\Models\Configuration\Misc\BloodGroup;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\Department;
use App\Models\Configuration\Employee\Designation;

class EmployeeImportRepository
{
	protected $employee;
    protected $department;
    protected $designation;
    protected $caste;
    protected $category;
    protected $blood_group;
    protected $religion;
    protected $employee_term;
    protected $employee_designation;
	protected $path = '/uploads/temp/employee-import/';

	public function __construct(
		Employee $employee,
        Department $department,
        Designation $designation,
        Caste $caste,
        Category $category,
        BloodGroup $blood_group,
        Religion $religion,
        EmployeeTerm $employee_term,
        EmployeeDesignation $employee_designation
	) {
		$this->employee = $employee;
        $this->department = $department;
        $this->designation = $designation;
        $this->caste = $caste;
        $this->category = $category;
        $this->blood_group = $blood_group;
        $this->religion = $religion;
        $this->employee_term = $employee_term;
        $this->employee_designation = $employee_designation;
	}

	public function getOptions()
	{
        return array(
            [ 'text' => trans('employee.employee_code_prefix'), 'value' => "code_prefix"],
            [ 'text' => trans('employee.code'), 'value' => "code"],
            [ 'text' => trans('employee.date_of_joining'), 'value' => "date_of_joining"],
			[ 'text' => trans('employee.first_name'), 'value' => "first_name"],
			[ 'text' => trans('employee.middle_name'), 'value' => "middle_name"],
			[ 'text' => trans('employee.last_name'), 'value' => "last_name"],
            [ 'text' => trans('employee.date_of_birth'), 'value' => "date_of_birth"],
			[ 'text' => trans('employee.date_of_anniversary'), 'value' => "date_of_anniversary"],
            [ 'text' => trans('employee.contact_number'), 'value' => "contact_number"],
			[ 'text' => trans('employee.department'), 'value' => "department"],
			[ 'text' => trans('employee.designation'), 'value' => "designation"],
			[ 'text' => trans('employee.father_name'), 'value' => "father_name"],
            [ 'text' => trans('employee.mother_name'), 'value' => "mother_name"],
            [ 'text' => trans('employee.gender'), 'value' => "gender"],
            [ 'text' => trans('employee.nationality'), 'value' => "nationality"],
            [ 'text' => trans('misc.blood_group'), 'value' => "blood_group"],
            [ 'text' => trans('misc.religion'), 'value' => "religion"],
            [ 'text' => trans('misc.category'), 'value' => "category"],
            [ 'text' => trans('misc.caste'), 'value' => "caste"],
            [ 'text' => trans('employee.unique_identification_number'), 'value' => "unique_identification_number"],
            [ 'text' => trans('employee.emergency_contact_name'), 'value' => "emergency_contact_name"],
            [ 'text' => trans('employee.emergency_contact_number'), 'value' => "emergency_contact_number"],
            [ 'text' => trans('employee.address_line_1'), 'value' => "present_address_line_1"],
            [ 'text' => trans('employee.address_line_2'), 'value' => "present_address_line_2"],
            [ 'text' => trans('employee.city'), 'value' => "present_city"],
            [ 'text' => trans('employee.state'), 'value' => "present_state"],
            [ 'text' => trans('employee.zipcode'), 'value' => "present_zipcode"],
            [ 'text' => trans('employee.country'), 'value' => "present_country"]
        );
	}

    /**
     * Upload file for import
     *
     * @param array $params
     * @return null
     */
    public function startImport($params)
    {
        $extension = request()->file('file')->getClientOriginalExtension();

        if ($extension != 'csv') {
            throw ValidationException::withMessages(['message' => trans('employee.import_csv_file_supported')]);
        }

    	$uuid = Str::uuid();
		\Storage::putFileAs($this->path, request()->file('file'), $uuid.'.csv');

        $path = request()->file('file')->getRealPath();
        $items = array_map('str_getcsv', file($path));

        if (count($items) <= 1) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.no_import_data_found')]);
        }

        if (count($items) > 500) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.max_import_limit', ['number' => 500])]);
        }

        $items = array_slice($items, 1, 2);
        $options = $this->getOptions();

        return compact('items','options','uuid');
    }

    private function deleteFile($uuid)
    {
        \Storage::delete($this->path.$uuid.'.csv');
    }

    /**
     * Finish import
     *
     * @param array $params
     * @return null
     */
    public function finishImport($params)
    {
    	$uuid = gv($params, 'uuid');
    	$all_columns = gv($params, 'columns');

    	$columns = array();
    	foreach ($all_columns as $key => $value) {
            $column_value = gv($value, 'name');

            if (! $column_value) {
                throw ValidationException::withMessages(['message' => trans('employee.null_column_found')]);
            }

    		array_push($columns, $column_value);
    	}

    	$options = array();
    	foreach ($this->getOptions() as $key => $value) {
    		array_push($options, gv($value, 'value'));
    	}

    	if (count($columns) != count(array_unique($columns))) {
    		throw ValidationException::withMessages(['message' => trans('employee.column_contains_duplicate_field')]);
    	}

    	if (count(array_diff($options, $columns))) {
    		throw ValidationException::withMessages(['message' => trans('employee.invalid_column_found')]);
    	}

        if (! \Storage::exists($this->path.$uuid.'.csv')) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_import_file')]);
        }

    	$items = array_map('str_getcsv', file(storage_path('app/'.$this->path.$uuid.'.csv')));

        $departments = $this->department->all();
        $designations = $this->designation->all();
        $employees = $this->employee->all();
        $blood_groups = $this->blood_group->all();
        $religions = $this->religion->all();
        $categories = $this->category->all();
        $castes = $this->caste->all();

        $list = getVar('list');
        $genders = isset($list['gender']) ? $list['gender'] : [];

        $existing_codes = [];
        foreach ($employees as $employee){
           array_push($existing_codes, $employee->employee_code);
        }

        $existing_employees = [];
        foreach ($employees as $employee) {
            array_push($existing_employees, $employee->name.' '.$employee->contact_number);
        }

        $employee_names                   = [];
        $codes                            = [];
        $employee_designations            = [];
        $invalid_date_of_birth            = [];
        $invalid_date_of_anniversary      = [];
        $invalid_date_of_joining          = [];
        $date_of_birth_gt_date_of_joining = [];
        $date_of_joining_gt_session_end   = [];
        $missing_father_name              = [];
        $unknown_designations             = [];
        $unknown_departments              = [];
        $duplicate_employee_codes         = [];
        $unknown_blood_groups             = [];
        $unknown_religions                = [];
        $unknown_categories               = [];
        $unknown_castes                   = [];
        $unknown_genders                  = [];

        foreach ($items as $index => $item) {
            if ($index == 0) {
                continue;
            }

            $first_name          = gv($item, array_search('first_name', $columns));
            $middle_name         = gv($item, array_search('middle_name', $columns));
            $last_name           = gv($item, array_search('last_name', $columns));
            $contact_number      = gv($item, array_search('contact_number', $columns));
            $designation         = gv($item, array_search('designation', $columns));
            $department          = gv($item, array_search('department', $columns));
            $date_of_birth       = gv($item, array_search('date_of_birth', $columns));
            $date_of_anniversary = gv($item, array_search('date_of_anniversary', $columns));
            $date_of_joining     = gv($item, array_search('date_of_joining', $columns));
            $father_name         = gv($item, array_search('father_name', $columns));
            $code_prefix         = gv($item, array_search('code_prefix', $columns));
            $code                = gv($item, array_search('code', $columns));
            $blood_group         = gv($item, array_search('blood_group', $columns));
            $religion            = gv($item, array_search('religion', $columns));
            $category            = gv($item, array_search('category', $columns));
            $caste               = gv($item, array_search('caste', $columns));
            $gender              = gv($item, array_search('gender', $columns));

            $name = $first_name.' '.($middle_name ? ($middle_name.' ') : '').$last_name;
            $employee_names[] = $name.' '.$contact_number;

            $code = $code_prefix.str_pad($code, config('config.employee_code_digit'), '0', STR_PAD_LEFT);
            $codes[] = $code;

            if (in_array($code, $existing_codes)) {
                throw ValidationException::withMessages(['message' => trans('employee.existing_employee_code', ['name' => $name])]);
            }

            if (in_array($name.' '.$contact_number, $existing_employees)) {
                $this->deleteFile($uuid);
                throw ValidationException::withMessages(['message' => trans('employee.existing_employee', ['name' => $name])]);
            }

            if (! validateDate($date_of_birth)) {
                array_push($invalid_date_of_birth, $name);
            }

            if ($date_of_anniversary && ! validateDate($date_of_anniversary)) {
                array_push($invalid_date_of_anniversary, $name);
            }

            if (! validateDate($date_of_joining)) {
                array_push($invalid_date_of_joining, $name);
            }

            if (validateDate($date_of_birth) && validateDate($date_of_joining) && toDate($date_of_birth) > toDate($date_of_joining))  {
                array_push($date_of_birth_gt_date_of_joining, $name);
            }

            if (validateDate($date_of_joining) && toDate($date_of_joining) > config('config.default_academic_session.end_date')) {
                array_push($date_of_joining_gt_session_end, $name);
            }

            if (! $father_name) {
                array_push($missing_father_name, $name);
            }

            if (! in_array($designation, $designations->pluck('name')->all())) {
                array_push($unknown_designations, $designation);
            }

            if (! in_array($department, $departments->pluck('name')->all())) {
                array_push($unknown_departments, $department);
            }

            if ($blood_group && ! in_array($blood_group, $blood_groups->pluck('name')->all())) {
                array_push($unknown_blood_groups, $blood_group);
            }

            if ($religion && ! in_array($religion, $religions->pluck('name')->all())) {
                array_push($unknown_religions, $religion);
            }

            if ($category && ! in_array($category, $categories->pluck('name')->all())) {
                array_push($unknown_categories, $category);
            }

            if ($caste && ! in_array($caste, $castes->pluck('name')->all())) {
                array_push($unknown_castes, $caste);
            }

            if ($gender && ! in_array(strtolower($gender), $genders)) {
                array_push($unknown_genders, $gender);
            }
        }

        $emp_names = array_count_values($employee_names);

        $duplicate_records = array();
        foreach($emp_names as $key => $value) {
            if ($value > 1) {
                $duplicate_records[] = $key;
            }
        }

        $emp_codes = array_count_values($codes);
        $duplicate_code_records = array();
        foreach($emp_codes as $key => $value) {
            if ($value > 1) {
                $duplicate_code_records[] = $key;
            }
        }

        if ($unknown_designations) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.unknown_designation', ['attribute' => moreThanErrorMsg($unknown_designations)])]);
        }

        if ($unknown_departments) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.unknown_department', ['attribute' => moreThanErrorMsg($unknown_departments)])]);
        }

        if ($unknown_blood_groups) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.unknown_blood_group', ['attribute' => moreThanErrorMsg($unknown_blood_groups)])]);
        }

        if ($unknown_religions) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.unknown_religion', ['attribute' => moreThanErrorMsg($unknown_religions)])]);
        }

        if ($unknown_categories) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.unknown_category', ['attribute' => moreThanErrorMsg($unknown_categories)])]);
        }

        if ($unknown_castes) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.unknown_caste', ['attribute' => moreThanErrorMsg($unknown_castes)])]);
        }

        if ($unknown_genders) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.unknown_gender', ['attribute' => moreThanErrorMsg($unknown_genders)])]);
        }

        if ($duplicate_records) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.duplicate_record', ['attribute' => moreThanErrorMsg($duplicate_records)])]);
        }

        if ($duplicate_code_records) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.duplicate_employee_codes', ['attribute' => moreThanErrorMsg($duplicate_code_records)])]);
        }

        if ($invalid_date_of_birth) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.invalid_date_of_birth', ['attribute' => moreThanErrorMsg($invalid_date_of_birth)])]);
        }

        if ($invalid_date_of_anniversary) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.invalid_date_of_anniversary', ['attribute' => moreThanErrorMsg($invalid_date_of_anniversary)])]);
        }

        if ($invalid_date_of_joining) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.invalid_date_of_joining_found', ['attribute' => moreThanErrorMsg($invalid_date_of_joining)])]);
        }

        if ($date_of_birth_gt_date_of_joining) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.date_of_birth_gt_date_of_joining', ['attribute' => moreThanErrorMsg($date_of_birth_gt_date_of_joining)])]);
        }

        if ($date_of_joining_gt_session_end) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.date_of_joining_gt_session_end', ['attribute' => moreThanErrorMsg($date_of_joining_gt_session_end)])]);
        }

        if ($missing_father_name) {
            $this->deleteFile($uuid);
            throw ValidationException::withMessages(['message' => trans('employee.missing_father_name', ['attribute' => moreThanErrorMsg($missing_father_name)])]);
        }

        activity()->disableLogging();

        \DB::beginTransaction();

        foreach ($items as $index => $item) {

            if ($index == 0)
                continue;

            $first_name                   = gv($item, array_search('first_name', $columns));
            $middle_name                  = gv($item, array_search('middle_name', $columns));
            $last_name                    = gv($item, array_search('last_name', $columns));
            $contact_number               = gv($item, array_search('contact_number', $columns));
            $designation                  = gv($item, array_search('designation', $columns));
            $department                   = gv($item, array_search('department', $columns));
            $date_of_birth                = gv($item, array_search('date_of_birth', $columns));
            $date_of_anniversary          = gv($item, array_search('date_of_anniversary', $columns));
            $date_of_joining              = gv($item, array_search('date_of_joining', $columns));
            $father_name                  = gv($item, array_search('father_name', $columns));
            $mother_name                  = gv($item, array_search('mother_name', $columns));
            $code_prefix                  = gv($item, array_search('code_prefix', $columns));
            $code                         = gv($item, array_search('code', $columns));
            $gender                       = gv($item, array_search('gender', $columns));
            $nationality                  = gv($item, array_search('nationality', $columns));
            $blood_group                  = gv($item, array_search('blood_group', $columns));
            $religion                     = gv($item, array_search('religion', $columns));
            $category                     = gv($item, array_search('category', $columns));
            $caste                        = gv($item, array_search('caste', $columns));
            $unique_identification_number = gv($item, array_search('unique_identification_number', $columns));
            $emergency_contact_name       = gv($item, array_search('emergency_contact_name', $columns));
            $emergency_contact_number     = gv($item, array_search('emergency_contact_number', $columns));
            $present_address_line_1        = gv($item, array_search('present_address_line_1', $columns));
            $present_address_line_2        = gv($item, array_search('present_address_line_2', $columns));
            $present_city                 = gv($item, array_search('present_city', $columns));
            $present_state                = gv($item, array_search('present_state', $columns));
            $present_zipcode              = gv($item, array_search('present_zipcode', $columns));
            $present_country              = gv($item, array_search('present_country', $columns));

            $designation = $designations->firstWhere('name', $designation);
            $department = $departments->firstWhere('name', $department);

            $employee = $this->employee->forceCreate([
                'uuid'                         => Str::uuid(),
                'prefix'                       => $code_prefix,
                'code'                         => $code,
                'first_name'                   => $first_name,
                'middle_name'                  => $middle_name,
                'last_name'                    => $last_name,
                'father_name'                  => $father_name,
                'mother_name'                  => $mother_name,
                'date_of_birth'                => $date_of_birth ? toDate($date_of_birth) : null,
                'date_of_anniversary'          => $date_of_anniversary ? toDate($date_of_anniversary) : null,
                'contact_number'               => $contact_number,
                'gender'                       => strtolower($gender),
                'nationality'                  => $nationality,
                'blood_group_id'               => optional($blood_groups->firstWhere('name', $blood_group))->id,
                'religion_id'                  => optional($religions->firstWhere('name', $religion))->id,
                'category_id'                  => optional($categories->firstWhere('name', $category))->id,
                'caste_id'                     => optional($castes->firstWhere('name', $caste))->id,
                'unique_identification_number' => $unique_identification_number,
                'emergency_contact_name'       => $emergency_contact_name,
                'emergency_contact_number'     => $emergency_contact_number,
                'present_address_line_1'       => $present_address_line_1,
                'present_address_line_2'       => $present_address_line_2,
                'present_city'                 => $present_city,
                'present_state'                => $present_state,
                'present_zipcode'              => $present_zipcode,
                'present_country'              => $present_country,
                'options'                      => []
            ]);

            $employee_term = $this->employee_term->forceCreate([
                'employee_id' => $employee->id,
                'date_of_joining' => $date_of_joining,
                'upload_token' => Str::uuid(),
                'options' => [],
            ]);

            $this->employee_designation->forceCreate([
                'employee_id' => $employee->id,
                'department_id' => $department->id,
                'designation_id' => $designation->id,
                'date_effective' => $date_of_joining,
                'upload_token' => Str::uuid(),
                'employee_term_id' => $employee_term->id,
                'options' => [],
            ]);
        }

        \DB::commit();

        $this->deleteFile($uuid);
        activity()->enableLogging();
    }
}