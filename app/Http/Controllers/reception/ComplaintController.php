<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reception\ComplaintRequest;
use App\Models\Reception\Complaint;
use App\Repositories\Reception\ComplaintRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'complaint';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        ComplaintRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/reception/complaint/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Complaint::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Complaints
     * @get ("/api/reception/complaint")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Complaint::class);

        $complaints = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('complaints', 'filters'));
    }

    /**
     * Used to print all Complaints
     * @post ("/api/reception/complaint/print")
     * @return Response
     */
    public function print()
    {
        $complaints = $this->repo->print(request('filter'));

        return view('print.reception.complaint', compact('complaints'))->render();
    }

    /**
     * Used to generate pdf all Complaints
     * @post ("/api/reception/complaint/pdf")
     * @return Response
     */
    public function pdf()
    {
        $complaints = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.reception.complaint', compact('complaints'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Complaint
     * @post ("/api/reception/complaint")
     * @param ({
     *      @Parameter("description", type="text", required="optional", description="Description of Complaint")
     * })
     * @return Response
     */
    public function store(ComplaintRequest $request)
    {
        $this->authorize('create', Complaint::class);

        $complaint = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.complaint_added')]);
    }

    /**
     * Used to get Complaint detail
     * @get ("/api/reception/complaint/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Complaint"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', Complaint::class);

        $complaint = $this->repo->findByUuidOrFail($uuid);

        $attachments = $this->upload->getAttachment($this->module, $complaint->id);

        $selected_employee = ($complaint->employee_id) ? ['id' => $complaint->employee_id, 'name' => $complaint->Employee->name.' ('.$complaint->Employee->contact_number.')'] : [];

        $selected_complaint_type = ($complaint->complaint_type_id) ? ['id' => $complaint->complaint_type_id, 'name' => $complaint->complaintType->name] : [];

        $is_actionable = $complaint->employee->user_id == \Auth::user()->id ? 1 : 0;

        return $this->success(compact('complaint','attachments', 'selected_employee', 'selected_complaint_type', 'is_actionable'));
    }

    /**
     * Used to update Complaint
     * @patch ("/api/reception/complaint/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Complaint"),
     *      @Parameter("dates", type="array", required="true", description="Array of Dates"),
     *      @Parameter("description", type="text", required="optional", description="Description of Complaint")
     * })
     * @return Response
     */
    public function update($uuid, ComplaintRequest $request)
    {
        $this->authorize('update', Complaint::class);

        $complaint = $this->repo->findByUuidOrFail($uuid);

        $complaint = $this->repo->update($complaint, $this->request->all());

        return $this->success(['message' => trans('reception.complaint_updated')]);
    }

    /**
     * Used to delete Complaint
     * @delete ("/api/reception/complaint/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Complaint"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Complaint::class);

        $complaint = $this->repo->findByUuidOrFail($uuid);

        $this->upload->delete($this->module, $complaint->id);

        $this->repo->delete($complaint);

        return $this->success(['message' => trans('reception.complaint_deleted')]);
    }

    /**
     * Used to download Complaint Attachments
     * @get ("/reception/complaint/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Complaint"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $complaint = $this->repo->findByUuidOrFail($uuid);

        $attachment = $this->upload->getAttachment($this->module, $complaint->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}