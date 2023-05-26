<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\DesignationRequest;
use App\Repositories\Configuration\Employee\DesignationRepository;

class DesignationController extends Controller
{
    protected $request;
    protected $repo;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        DesignationRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/designation/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Designations
     * @get ("/api/employee/designation")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Designations
     * @post ("/api/employee/designation/print")
     * @return Response
     */
    public function print()
    {
        $designations = $this->repo->print(request('filter'));

        return view('print.configuration.employee.designation', compact('designations'))->render();
    }

    /**
     * Used to generate pdf all Designations
     * @post ("/api/employee/designation/pdf")
     * @return Response
     */
    public function pdf()
    {
        $designations = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.designation', compact('designations'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Designation
     * @post ("/api/employee/designation")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Designation"),
     *      @Parameter("description", type="text", required="optional", description="Description of Designation")
     * })
     * @return Response
     */
    public function store(DesignationRequest $request)
    {
        $designation = $this->repo->create($this->request->all());

        $new_designation = ['id' => $designation->id, 'name' => $designation->designation_with_category];

        return $this->success(['message' => trans('employee.designation_added'),'new_designation' => $new_designation]);
    }

    /**
     * Used to get Designation detail
     * @get ("/api/employee/designation/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Designation"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $designation = $this->repo->findOrFail($id);

        $selected_employee_category = $designation->employee_category_id ? ['id' => $designation->employee_category_id, 'name' => $designation->EmployeeCategory->name] : [];

        $selected_top_designation = $designation->top_designation_id ? ['id' => $designation->top_designation_id, 'name' => $designation->TopDesignation->designation_with_category] : [];

        return $this->success(compact('designation', 'selected_top_designation', 'selected_employee_category'));
    }

    /**
     * Used to update Designation
     * @patch ("/api/employee/designation/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Designation"),
     *      @Parameter("name", type="string", required="true", description="Name of Designation"),
     *      @Parameter("description", type="text", required="optional", description="Description of Designation")
     * })
     * @return Response
     */
    public function update($id, DesignationRequest $request)
    {
        $designation = $this->repo->findOrFail($id);

        $designation = $this->repo->update($designation, $this->request->all());

        return $this->success(['message' => trans('employee.designation_updated')]);
    }

    /**
     * Used to delete Designation
     * @delete ("/api/employee/designation/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Designation"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $designation = $this->repo->deletable($id);

        $this->repo->delete($designation);

        return $this->success(['message' => trans('employee.designation_deleted')]);
    }
}
