<?php

namespace App\Http\Controllers\Resource;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Resource\Assignment;
use App\Http\Controllers\Controller;
use App\Http\Requests\Resource\AssignmentRequest;
use App\Repositories\Resource\AssignmentRepository;
use App\Repositories\Upload\UploadRepository;

class AssignmentController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'assignment';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        AssignmentRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set')->except('download');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/assignment/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Assignment::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Assignments
     * @get ("/api/assignment")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Assignment::class);

        $assignments = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('assignments', 'filters'));
    }

    /**
     * Used to print all Assignments
     * @post ("/api/assignment/print")
     * @return Response
     */
    public function print()
    {
        $assignments = $this->repo->print(request('filter'));

        return view('print.resource.assignment', compact('assignments'))->render();
    }

    /**
     * Used to generate pdf all Assignments
     * @post ("/api/assignment/pdf")
     * @return Response
     */
    public function pdf()
    {
        $assignments = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.resource.assignment', compact('assignments'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Assignment
     * @post ("/api/assignment")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Assignment"),
     *      @Parameter("date_of_assignment", type="date", required="true", description="Date of Assignment"),
     *      @Parameter("due_date", type="date", required="true", description="Due Date of Assignment"),
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Assignment"),
     *      @Parameter("description", type="text", required="optional", description="Description of Assignment")
     * })
     * @return Response
     */
    public function store(AssignmentRequest $request)
    {
        $this->authorize('create', Assignment::class);

        $assignment = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('resource.assignment_added')]);
    }

    /**
     * Used to get Assignment detail
     * @get ("/api/assignment/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Assignment"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $assignment = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($assignment);

        $attachments = $this->upload->getAttachment($this->module, $assignment->id);

        return $this->success(compact('assignment', 'attachments'));
    }

    /**
     * Used to update Assignment
     * @patch ("/api/assignment/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Assignment"),
     *      @Parameter("title", type="string", required="true", description="Title of Assignment"),
     *      @Parameter("date_of_assignment", type="date", required="true", description="Date of Assignment"),
     *      @Parameter("due_date", type="date", required="true", description="Due Date of Assignment"),
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Assignment"),
     *      @Parameter("description", type="text", required="optional", description="Description of Assignment")
     * })
     * @return Response
     */
    public function update($uuid, AssignmentRequest $request)
    {
        $this->authorize('update', Assignment::class);

        $assignment = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($assignment);

        $assignment = $this->repo->update($assignment, $this->request->all());

        return $this->success(['message' => trans('resource.assignment_updated')]);
    }

    /**
     * Used to delete Assignment
     * @delete ("/api/assignment/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Assignment"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Assignment::class);

        $assignment = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($assignment);

        $this->upload->delete($this->module, $assignment->id);

        $this->repo->delete($assignment);

        return $this->success(['message' => trans('resource.assignment_deleted')]);
    }

    /**
     * Used to download Assignment Attachments
     * @get ("/resource/assignment/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Assignment"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $assignment = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($assignment);

        $attachment = $this->upload->getAttachment($this->module, $assignment->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
