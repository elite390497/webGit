<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Employee\Employee;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\Employee\ExportEmployees;
use App\Http\Requests\Employee\EmployeeRequest;
use App\Http\Requests\Employee\UserLoginRequest;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Employee\EmployeeDetailRequest;

class EmployeeController extends Controller {
	protected $request;
	protected $repo;

	/**
	 * Instantiate a new controller instance.
	 *
	 * @return void
	 */
	public function __construct(
		Request $request,
		EmployeeRepository $repo
	) {
		$this->request = $request;
		$this->repo = $repo;

		$this->middleware('prohibited.test.mode')->only(['updateUserLogin']);
	}

	/**
	 * Used to get pre requisites
	 * @get ("/api/employee/pre-requisite")
	 * @return Response
	 */
	public function preRequisite() {
		$this->authorize('preRequisite', Employee::class);

		return $this->success($this->repo->getPreRequisite());
	}

	/**
	 * Used to get basic pre requisites
	 * @get ("/api/employee/basic/pre-requisite")
	 * @return Response
	 */
	public function basicPreRequisite() {
		$this->authorize('preRequisite', Employee::class);

		return $this->success($this->repo->getBasicPreRequisite());
	}

	/**
	 * Used to get all Employees
	 * @get ("/api/employee")
	 * @return Response
	 */
	public function index() {
		$this->authorize('list', Employee::class);

        if (request('action') == 'excel') {
            $employees = $this->repo->paginate($this->request->all());

            return Excel::download(new ExportEmployees($employees), 'Employees.xlsx');
        }

		$employees = $this->repo->paginate($this->request->all());

		$filters = $this->repo->getFilters();

		return $this->success(compact('employees', 'filters'));
	}

	/**
	 * Used to print all Employees
	 * @post ("/api/employee/print")
	 * @return Response
	 */
	public function print() {
		$employees = $this->repo->print(request('filter'));

		return view('print.employee.employee', compact('employees'))->render();
	}

	/**
	 * Used to generate pdf all Employees
	 * @post ("/api/employee/pdf")
	 * @return Response
	 */
	public function pdf() {
		$employees = $this->repo->print(request('filter'));

		$uuid = Str::uuid();
		$pdf = \PDF::loadView('print.employee.employee', compact('employees'))->save('../storage/app/downloads/' . $uuid . '.pdf');

		return $uuid;
	}

	/**
	 * Used to store Employee
	 * @post ("/api/employee")
	 * @param ({
	 *      @Parameter("first_name", type="string", required="true", description="First Name of Employee"),
	 *      @Parameter("middle_name", type="string", required="optional", description="Middle Name of Employee"),
	 *      @Parameter("last_name", type="string", required="true", description="Last Name of Employee"),
	 *      @Parameter("father_name", type="string", required="true", description="Father's Name of Employee"),
	 *      @Parameter("mother_name", type="string", required="true", description="Mother's Name of Employee"),
	 *      @Parameter("date_of_birth", type="date", required="true", description="Date of Birth of Employee"),
	 *      @Parameter("date_of_joining", type="date", required="true", description="Date of Joining of Employee"),
	 *      @Parameter("contact_number", type="string", required="true", description="Contact Number of Employee"),
	 *      @Parameter("gender", type="string", required="true", description="Gender of Employee"),
	 *      @Parameter("department_id", type="integer", required="true", description="Department of Employee"),
	 *      @Parameter("designation_id", type="integer", required="true", description="Designation of Employee")
	 * })
	 * @return Response
	 */
	public function store(EmployeeRequest $request) {
		$this->authorize('create', Employee::class);

		$employee = $this->repo->create($this->request->all());

		return $this->success(['message' => trans('employee.added')]);
	}

	/**
	 * Used to get Employee detail
	 * @get ("/api/employee/{uuid}")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
	 * })
	 * @return Response
	 */
	public function show($uuid) {
		$employee = $this->repo->findByUuidOrFail($uuid);

		$this->repo->isAccessible($employee, 1);

		$this->authorize('show', Employee::class);

		return $this->ok($employee);
	}

	/**
	 * Used to update employee's detail
	 * @patch ("/api/employee/{uuid}")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee")
	 * })
	 * @return Response
	 */
	public function update(EmployeeDetailRequest $request, $uuid) {
		$this->authorize('update', Employee::class);

		$employee = $this->repo->findByUuidOrFail($uuid);

		$this->repo->isAccessible($employee);

		$employee = $this->repo->update($employee, $this->request->all());

		return $this->success(['message' => trans('employee.updated')]);
	}

	/**
	 * Used to update photo
	 * @post ("/api/employee/{uuid}/photo")
	 * @param ({
	 *      @Parameter("uuid", type="integer", required="true", description="Unique Id of User"),
	 *      @Parameter("image", type="file", required="true", description="Image File to be uploaded"),
	 * })
	 * @return Response
	 */
	public function uploadPhoto($uuid) {
		$this->authorize('update', Employee::class);

		$employee = $this->repo->findByUuidOrFail($uuid);

		$this->repo->isAccessible($employee);

		$image = $employee->photo;
		$image = str_replace('storage/', '', $image);

		if ($image && \Storage::disk('public')->exists($image)) {
			\Storage::disk('public')->delete($image);
		}

		$file = \Storage::disk('public')->putFile('employee-photo', request()->file('image'));
		$img = \Image::make(\Storage::disk('public')->get($file));
		$img->resize(null, 200, function ($constraint) {
			$constraint->aspectRatio();
		})->stream();
		\Storage::disk('public')->put($file, $img);

		$employee->photo = 'storage/' . $file;
		$employee->save();

		return $this->success(['message' => trans('employee.photo_uploaded'), 'image' => 'storage/' . $file]);
	}

	/**
	 * Used to remove photo
	 * @delete ("/api/employee/{uuid}/photo/remove")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of User"),
	 * })
	 * @return Response
	 */
	public function removePhoto($uuid) {
		$this->authorize('update', Employee::class);

		$employee = $this->repo->findByUuidOrFail($uuid);

		$this->repo->isAccessible($employee);

		$image = $employee->photo;
		$image = str_replace('storage/', '', $image);

		if (!$image) {
			return $this->error(['message' => trans('employee.no_photo_uploaded')]);
		}

		if (\Storage::disk('public')->exists($image)) {
			\Storage::disk('public')->delete($image);
		}

		$employee->photo = null;
		$employee->save();

		return $this->success(['message' => trans('employee.photo_removed')]);
	}

	/**
	 * Used to search employee by name
	 * @post ("/api/employee/search/name")
	 * @param ({
	 *      @Parameter("name", type="string", required="true", description="Name of Employee"),
	 * })
	 * @return Response
	 */
	public function searchByName() {
		$this->authorize('search', Employee::class);

		return $this->ok($this->repo->searchByName($this->request->all()));
	}

	/**
	 * Used to update user login for employee
	 * @patch ("/api/employee/{uuid}/user/login")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of User"),
	 * })
	 * @return Response
	 */
	public function updateUserLogin(UserLoginRequest $request, $uuid) {
		$this->authorize('update', Employee::class);

		$employee = $this->repo->findByUuidOrFail($uuid);

		$this->repo->isAccessible($employee);

		$employee = $this->repo->updateUserLogin($employee, $this->request->all());

		return $this->success(['message' => trans('employee.updated')]);
	}

	/**
	 * Used to perform group action on employees
	 * @post ("/api/employee/group")
	 * @param ({
	 *      @Parameter("ids", type="array", required="true", description="Id of Employees"),
	 *      @Parameter("employee_group_id", type="integer", required="true", description="Id of Employee Group"),
	 *      @Parameter("action", type="string", required="true", description="Action to Perform"),
	 * })
	 * @return Response
	 */
	public function groupAction() {
		$this->authorize('update', Employee::class);

		$employee = $this->repo->updateGroup($this->request->all());

		return $this->success(['message' => trans('employee.updated')]);
	}

	/**
	 * Used to get id card pre requisite
	 * @get ("/api/employee/id-card/pre-requisite")
	 * @return Response
	 */
	public function idCardPreRequisite() {
		$this->authorize('idCard', Employee::class);

		return $this->success($this->repo->getIdCardPreRequisite());
	}

	/**
	 * Used to generate id card
	 * @get ("/employee/id-card/{department_id}")
	 * @return Response
	 */
	public function generateIdCard() {
		$this->authorize('idCard', Employee::class);

		if (!request('id_card_template_id') || !request('department_id')) {
			return $this->error(['message' => trans('general.missing_parameter')]);
		}

		$data = $this->repo->fetchDepartmentWiseEmployee(['department_id' => request('department_id')]);

		$id_card_template = $this->repo->validateIdCardTemplate(request('id_card_template_id'));

		$data['id_card_template'] = $id_card_template;

		return view()->first(['custom-print.employee.id-card', 'print.employee.id-card'], $data);
	}
}
