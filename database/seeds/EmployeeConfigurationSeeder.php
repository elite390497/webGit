<?php

use Illuminate\Database\Seeder;
use App\Models\Configuration\Employee\Designation;
use App\Models\Configuration\Employee\EmployeeCategory;

class EmployeeConfigurationSeeder extends Seeder
{
	protected $employee_category;
	protected $designation;

	public function __construct(
		EmployeeCategory $employee_category,
		Designation $designation
	) {
		$this->employee_category = $employee_category;
		$this->designation = $designation;
	}

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $employee_configurations = getSeedVar('employee_config');

        foreach ($employee_configurations as $key => $employee_configuration) {

        	if ($key == 'employee_categories')
        		$this->populateCategories($employee_configuration);
        	else if ($key == 'hierarchy')
        		$this->makeHierarchy($employee_configuration);
        }
    }

    public function populateCategories($params = array())
    {
    	foreach ($params as $param) {
    		$employee_category = $this->populateCategory($param);
    		$designations = $param['designations'];
    		$this->populateDesignations($designations, $employee_category->id);
    	}
    }

    public function populateCategory($params = array())
    {
    	return $this->employee_category->forceCreate([
			'name'        => gv($params, 'name'),
			'description' => gv($params, 'description'),
			'options'     => gv($params, 'options',[])
    	]);
    }

    public function populateDesignations($params = array(), $employee_category_id)
    {
    	foreach ($params as $param) {
    		$this->populateDesignation($param, $employee_category_id);
    	}
    }

    public function populateDesignation($params = array(), $employee_category_id)
    {
    	$this->designation->forceCreate([
			'employee_category_id' => $employee_category_id,
			'is_teaching_employee' => gbv($params, 'is_teaching_employee'),
			'name'                 => gv($params, 'name'),
			'top_designation_id'   => null,
			'description'          => gv($params, 'description'),
			'options'              => gv($params, 'options',[])
    	]);
    }

    public function makeHierarchy($params = array())
    {
    	foreach ($params as $param) {
    		$designation = $this->designation->filterByName(gv($param, 'name'),1)->first();
    		if ($designation) {
    			$this->designation->whereIn('name', gv($param, 'sub_designations', []))->update(['top_designation_id' => $designation->id]);
    		}
    	}
    }
}
