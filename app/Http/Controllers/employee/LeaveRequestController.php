<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Employee\LeaveRequest;
use App\Http\Requests\Employee\LeaveRequest as LeaveRequestValidation;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Employee\LeaveRequestRepository;

class LeaveRequestController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'leave_request';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        LeaveRequestRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('permission:request-leave');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/leave/request/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', LeaveRequest::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Leave Requests
     * @get ("/api/employee/leave/request")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', LeaveRequest::class);

        $leave_requests = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('leave_requests', 'filters'));
    }

    /**
     * Used to print all Leave Requests
     * @post ("/api/employee/leave/request/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', LeaveRequest::class);

        $leave_requests = $this->repo->print(request('filter'));

        return view('print.employee.leave.request', compact('leave_requests'))->render();
    }

    /**
     * Used to generate pdf all Leave Requests
     * @post ("/api/employee/leave/request/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', LeaveRequest::class);

        $leave_requests = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.employee.leave.request', compact('leave_requests'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Leave Request
     * @post ("/api/employee/leave/request")
     * @param ({
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("leave_type_id", type="integer", required="true", description="Id of Leave Type"),
     *      @Parameter("start_date", type="date", required="true", description="Start Date of leave"),
     *      @Parameter("end_date", type="date", required="true", description="End Date of leave"),
     *      @Parameter("reason", type="text", required="required", description="Reason for Leave Request")
     * })
     * @return Response
     */
    public function store(LeaveRequestValidation $request)
    {
        $this->authorize('create', LeaveRequest::class);

        $leave_request = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.leave_request_submitted')]);
    }

    /**
     * Used to get Leave Request detail
     * @get ("/api/employee/leave/request/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Leave Request"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('show', LeaveRequest::class);
        
        $leave_request = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($leave_request);

        $leave_allocation = $this->repo->getLeaveAllocation($leave_request);

        $attachments = $this->upload->getAttachment($this->module, $leave_request->id);

        return $this->success(compact('leave_request','attachments','leave_allocation'));
    }

    /**
     * Used to update Leave Request
     * @patch ("/api/employee/leave/request/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Leave Request"),
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("leave_type_id", type="integer", required="true", description="Id of Leave Type"),
     *      @Parameter("start_date", type="date", required="true", description="Start Date of leave"),
     *      @Parameter("end_date", type="date", required="true", description="End Date of leave"),
     *      @Parameter("reason", type="text", required="required", description="Reason for Leave Request")
     * })
     * @return Response
     */
    public function update(LeaveRequestValidation $request, $uuid)
    {
        $leave_request = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($leave_request);

        $leave_request = $this->repo->update($leave_request, $this->request->all());

        return $this->success(['message' => trans('employee.leave_request_updated')]);
    }

    /**
     * Used to update Leave Request Status
     * @post ("/api/employee/leave/request/{uuid}/status")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Leave Request"),
     *      @Parameter("status", type="string", required="true", description="Status of Leave Request"),
     *      @Parameter("comment", type="text", required="required", description="Comment for Leave Request")
     * })
     * @return Response
     */
    public function updateSatus($uuid)
    {
        $this->authorize('updateStatus', LeaveRequest::class);

        request()->validate([
            'status' => 'required',
            'comment' => 'required|min:20'
        ]);

        $leave_request = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($leave_request);

        $leave_request = $this->repo->updateSatus($leave_request, $this->request->all());

        return $this->success(['message' => trans('employee.leave_request_updated')]);
    }

    /**
     * Used to delete Leave Request
     * @delete ("/api/employee/leave/request/{uuid}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Unique Id of Leave Request"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $leave_request = $this->repo->deletable($uuid);

        $this->repo->isAccessible($leave_request);

        $this->upload->delete($this->module, $leave_request->id);

        $this->repo->delete($leave_request);

        return $this->success(['message' => trans('employee.leave_request_deleted')]);
    }

    /**
     * Used to download Leave Request Attachments
     * @get ("/employee/leave/request/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Leave Request"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $this->authorize('show', LeaveRequest::class);
        
        $leave_request = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($leave_request);

        $attachment = $this->upload->getAttachment($this->module, $leave_request->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
