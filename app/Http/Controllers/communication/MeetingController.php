<?php

namespace App\Http\Controllers\Communication;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Communication\MeetingRequest;
use App\Models\Communication\Meeting;
use App\Repositories\Communication\MeetingRepository;
use App\Repositories\Upload\UploadRepository;

class MeetingController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'meeting';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        MeetingRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set');
        // $this->middleware('prohibited.test.mode')->only(['join', 'leave']);
    }

    /**
     * Used to get pre requisite
     * @get ("/api/meeting/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Meeting::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all meetings
     * @get ("/api/meeting")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Meeting::class);

        $meetings = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('meetings', 'filters'));
    }

    /**
     * Used to store meeting
     * @post ("/api/meeting")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Meeting"),
     *      @Parameter("description", type="text", required="optional", description="Description of Meeting")
     * })
     * @return Response
     */
    public function store(MeetingRequest $request)
    {
        $this->authorize('create', Meeting::class);

        $meeting = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('communication.meeting_added')]);
    }

    /**
     * Used to get my meeting
     * @get ("/api/my-meeting")
     * @return Response
     */
    public function myMeeting()
    {
        return $this->ok($this->repo->myMeeting($this->request->all()));
    }

    /**
     * Used to get meeting detail
     * @get ("/api/meeting/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $meeting = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($meeting);

        $attachments = $this->upload->getAttachment($this->module, $meeting->id);

        $selected_audience = $this->repo->getSelectedAudience($meeting);

        $start_time = [
                'hour' => ($meeting->start_time) ? date('h', strtotime($meeting->start_time)) : '',
                'minute' => ($meeting->start_time) ? date('i', strtotime($meeting->start_time)) : '',
                'meridiem' => ($meeting->start_time) ? date('a', strtotime($meeting->start_time)) : ''
            ];

        $end_time = [
                'hour' => ($meeting->end_time) ? date('h', strtotime($meeting->end_time)) : '',
                'minute' => ($meeting->end_time) ? date('i', strtotime($meeting->end_time)) : '',
                'meridiem' => ($meeting->end_time) ? date('a', strtotime($meeting->end_time)) : ''
            ];

        $is_editable = $this->repo->isEditable($meeting);

        $mobile_description = mobileDescription($meeting->description);

        $individual_audiences = array();

        if (request()->query('individual_audiences')) {
            $individual_audiences = $this->repo->getSelectedIndividualAudience($meeting);
        }

        $ice_servers = [];
        $socket = null;
        if ($meeting->is_live && request('live')) {
            $socket = $this->repo->getSocketUrl();
            $ice_servers = $this->repo->getIceServers();
        }

        return $this->success(compact('meeting', 'attachments', 'selected_audience', 'start_time', 'end_time','is_editable', 'mobile_description', 'individual_audiences', 'ice_servers', 'socket'));
    }

    /**
     * Used to join meeting
     * @post ("/api/meeting/{uuid}/join")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     * })
     * @return Response
     */
    public function join($uuid)
    {
        $this->authorize('list', Meeting::class);

        $meeting = $this->repo->findByUuidOrFail($uuid);

        return $this->ok($this->repo->join($meeting));
    }

    /**
     * Used to share screen during meeting
     * @post ("/api/meeting/{uuid}/share-screen")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     * })
     * @return Response
     */
    public function shareScreen($uuid)
    {
        $this->authorize('list', Meeting::class);

        $meeting = $this->repo->findByUuidOrFail($uuid);

        $can_share_screen = $meeting->user_id === \Auth::user()->id ? true : false;

        return $this->ok(compact('can_share_screen'));
    }

    /**
     * Used to leave meeting
     * @post ("/api/meeting/{uuid}/leave")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     * })
     * @return Response
     */
    public function leave($uuid)
    {
        $this->authorize('list', Meeting::class);

        $meeting = $this->repo->findByUuidOrFail($uuid);

        $this->repo->leave($meeting);

        return $this->ok([]);
    }

    /**
     * Used to add meeting audience
     * @post ("/api/meeting/{uuid}/audience")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     * })
     * @return Response
     */
    public function addAudience($uuid)
    {
        $this->authorize('update', Meeting::class);

        $meeting = $this->repo->findByUuidOrFail($uuid);

        $this->repo->addAudience($meeting, $this->request->all());

        return $this->success(['message' => trans('communication.meeting_updated')]);
    }

    /**
     * Used to delete meeting audience
     * @delete ("/api/meeting/{uuid}/audience")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     *      @Parameter("type", type="string", required="true", description="Type of audience"),
     *      @Parameter("id", type="string", required="true", description="Id of audience"),
     * })
     * @return Response
     */
    public function deleteAudience($uuid, $type, $id)
    {
        $this->authorize('update', Meeting::class);

        $meeting = $this->repo->findByUuidOrFail($uuid);

        $this->repo->deleteAudience($meeting, $type, $id);

        return $this->success(['message' => trans('communication.meeting_updated')]);
    }

    /**
     * Used to update meeting
     * @patch ("/api/meeting/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     *      @Parameter("title", type="string", required="true", description="Title of Meeting"),
     *      @Parameter("description", type="text", required="optional", description="Description of Meeting")
     * })
     * @return Response
     */
    public function update($uuid, MeetingRequest $request)
    {
        $this->authorize('update', Meeting::class);

        $meeting = $this->repo->findByUuidOrFail($uuid);

        $meeting = $this->repo->update($meeting, $this->request->all());

        return $this->success(['message' => trans('communication.meeting_updated')]);
    }

    /**
     * Used to delete meeting
     * @delete ("/api/meeting/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Meeting"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $meeting = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isEditableOrFail($meeting);

        $this->upload->delete($this->module, $meeting->id);

        $this->repo->delete($meeting);

        return $this->success(['message' => trans('communication.meeting_deleted')]);
    }

    /**
     * Used to download Meeting Attachments
     * @get ("/meeting/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Event"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $this->authorize('list', Meeting::class);

        $meeting = $this->repo->findByUuidOrFail($uuid);

        $attachment = $this->upload->getAttachment($this->module, $meeting->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}