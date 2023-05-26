<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Employee\Employee;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Employee\EmployeeDesignationRequest;
use App\Repositories\Employee\EmployeeDesignationRepository;

class EmployeeDesignationController extends Controller
{
    protected $request;
    protected $repo;
    protected $employee;
    protected $upload;
    protected $module = 'employee_designation';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        EmployeeDesignationRepository $repo,
        EmployeeRepository $employee,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->employee = $employee;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/{uuid}/designation/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('update', Employee::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to store employee designation
     * @post ("/api/employee/{uuid}/designation")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("designation_id", type="integer", required="true", description="Designation of Employee"),
     *      @Parameter("department_id", type="integer", required="optional", description="Department of Employee"),
     *      @Parameter("date_effective", type="date", required="true", description="Effective date of Assignment"),
     *      @Parameter("description", type="text", required="true", description="Description of Assigment")
     * })
     * @return Response
     */
    public function store(EmployeeDesignationRequest $request, $uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_designation = $this->repo->create($employee, $this->request->all());

        return $this->success(['message' => trans('employee.updated')]);
    }

    /**
     * Used to get Employee Designation detail
     * @get ("/api/employee/{uuid}/designation/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Designation"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        // $this->authorize('update', Employee::class);

        $employee_designation = $this->repo->findOrFail($employee->id, $id);

        $attachments = $this->upload->getAttachment($this->module, $employee_designation->id);

        return $this->success(compact('employee_designation', 'attachments'));
    }

    /**
     * Used to update Employee Designation
     * @patch ("/api/employee/{uuid}/designation/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Designation"),
     *      @Parameter("designation_id", type="integer", required="true", description="Designation of Employee"),
     *      @Parameter("department_id", type="integer", required="optional", description="Department of Employee"),
     *      @Parameter("date_effective", type="date", required="true", description="Effective date of Assignment"),
     *      @Parameter("description", type="text", required="true", description="Description of Assigment")
     * })
     * @return Response
     */
    public function update(EmployeeDesignationRequest $request, $uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_designation = $this->repo->editable($employee->id, $id);

        $employee_designation = $this->repo->update($employee_designation, $this->request->all());

        return $this->success(['message' => trans('employee.updated')]);
    }

    /**
     * Used to delete Employee Designation
     * @delete ("/api/employee/{uuid}/designation/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Designation"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_designation = $this->repo->editable($employee->id, $id);

        $this->upload->delete($this->module, $employee_designation->id);

        $this->repo->delete($employee_designation);

        return $this->success(['message' => trans('employee.updated')]);
    }

    /**
     * Used to download Employee Designation
     * @get ("/employee/{uuid}/designation/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Designation"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $id, $attachment_uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_designation = $this->repo->findOrFail($employee->id, $id);

        $attachment = $this->upload->getAttachment($this->module, $employee_designation->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
