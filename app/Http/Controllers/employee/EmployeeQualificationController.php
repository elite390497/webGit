<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Http\Request;
use App\Models\Employee\Employee;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Employee\EmployeeQualificationRequest;
use App\Repositories\Employee\EmployeeQualificationRepository;

class EmployeeQualificationController extends Controller
{
    protected $request;
    protected $repo;
    protected $employee;
    protected $upload;
    protected $module = 'employee_qualification';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        EmployeeQualificationRepository $repo,
        EmployeeRepository $employee,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->employee = $employee;
        $this->upload = $upload;
    }

    /**
     * Used to get all employee qualifications
     * @get ("/api/employee/{uuid}/qualification")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     * })
     * @return Response
     */
    public function index($uuid)
    {
        $this->authorize('list', Employee::class);

        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        return $this->ok($this->repo->paginate($employee->id, $this->request->all()));
    }

    /**
     * Used to store employee qualification
     * @post ("/api/employee/{uuid}/qualification")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("standard", type="string", required="true", description="Standard of Qualification"),
     *      @Parameter("institute_name", type="string", required="true", description="Institute Name of Qualification"),
     *      @Parameter("board_name", type="string", required="optional", description="Board Name of Qualification"),
     *      @Parameter("start_period", type="year-month", required="true", description="Start Period of Qualification"),
     *      @Parameter("end_period", type="year-month", required="true", description="End Period of Qualification"),
     *      @Parameter("result", type="string", required="true", description="Result of Qualification"),
     *      @Parameter("description", type="text", required="optional", description="Description of Qualification")
     * })
     * @return Response
     */
    public function store(EmployeeQualificationRequest $request, $uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_qualification = $this->repo->create($employee->id, $this->request->all());

        return $this->success(['message' => trans('employee.qualification_added')]);
    }

    /**
     * Used to get Employee Qualification detail
     * @get ("/api/employee/{uuid}/qualification/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        $this->authorize('update', Employee::class);

        $employee_qualification = $this->repo->findOrFail($employee->id, $id);

        $attachments = $this->upload->getAttachment($this->module, $employee_qualification->id);

        return $this->success(compact('employee_qualification', 'attachments'));
    }

    /**
     * Used to update Employee Qualification
     * @patch ("/api/employee/{uuid}/qualification/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     *      @Parameter("standard", type="string", required="true", description="Standard of Qualification"),
     *      @Parameter("institute_name", type="string", required="true", description="Institute Name of Qualification"),
     *      @Parameter("board_name", type="string", required="optional", description="Board Name of Qualification"),
     *      @Parameter("start_period", type="year-month", required="true", description="Start Period of Qualification"),
     *      @Parameter("end_period", type="year-month", required="true", description="End Period of Qualification"),
     *      @Parameter("result", type="string", required="true", description="Result of Qualification"),
     *      @Parameter("description", type="text", required="optional", description="Description of Qualification")
     * })
     * @return Response
     */
    public function update(EmployeeQualificationRequest $request, $uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_qualification = $this->repo->findOrFail($employee->id, $id);

        $employee_qualification = $this->repo->update($employee_qualification, $this->request->all());

        return $this->success(['message' => trans('employee.qualification_updated')]);
    }

    /**
     * Used to delete Employee Qualification
     * @delete ("/api/employee/{uuid}/qualification/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_qualification = $this->repo->findOrFail($employee->id, $id);

        $this->upload->delete($this->module, $employee_qualification->id);

        $this->repo->delete($employee_qualification);

        return $this->success(['message' => trans('employee.qualification_deleted')]);
    }

    /**
     * Used to download Employee Qualification
     * @get ("/employee/{uuid}/download/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $id, $attachment_uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_qualification = $this->repo->findOrFail($employee->id, $id);

        $attachment = $this->upload->getAttachment($this->module, $employee_qualification->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
