<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Employee\Employee;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Employee\EmployeeTermRequest;
use App\Repositories\Employee\EmployeeTermRepository;

class EmployeeTermController extends Controller
{
    protected $request;
    protected $repo;
    protected $employee;
    protected $upload;
    protected $module = 'employee_term';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        EmployeeTermRepository $repo,
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
     * @get ("/api/employee/{uuid}/term/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('update', Employee::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to store employee term
     * @post ("/api/employee/{uuid}/term")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("date_of_joining", type="date", required="true", description="Date of joining of Employee"),
     *      @Parameter("joining_remarks", type="text", required="true", description="Joining Remarks")
     * })
     * @return Response
     */
    public function store(EmployeeTermRequest $request, $uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_term = $this->repo->create($employee, $this->request->all());

        return $this->success(['message' => trans('employee.updated')]);
    }

    /**
     * Used to get Employee Term detail
     * @get ("/api/employee/{uuid}/term/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Term"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        // $this->authorize('update', Employee::class);

        $employee_term = $this->repo->findOrFail($employee->id, $id);

        $attachments = $this->upload->getAttachment($this->module, $employee_term->id);

        return $this->success(compact('employee_term', 'attachments'));
    }

    /**
     * Used to update Employee Term
     * @patch ("/api/employee/{uuid}/term/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Term"),
     *      @Parameter("date_of_leaving", type="date", required="true", description="Date of leaving of Employee"),
     *      @Parameter("leaving_remarks", type="text", required="true", description="Leaving Remarks")
     * })
     * @return Response
     */
    public function update(EmployeeTermRequest $request, $uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_term = $this->repo->editable($employee->id, $id);

        $employee_term = $this->repo->update($employee_term, $this->request->all());

        return $this->success(['message' => trans('employee.updated')]);
    }

    /**
     * Used to delete Employee Term
     * @delete ("/api/employee/{uuid}/term/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Term"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_term = $this->repo->editable($employee->id, $id);

        $this->upload->delete($this->module, $employee_term->id);

        $this->repo->delete($employee_term);

        return $this->success(['message' => trans('employee.updated')]);
    }

    /**
     * Used to download Employee Term
     * @get ("/employee/{uuid}/term/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Term"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $id, $attachment_uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_term = $this->repo->findOrFail($employee->id, $id);

        $attachment = $this->upload->getAttachment($this->module, $employee_term->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
