<?php

namespace App\Http\Controllers\Calendar;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Calendar\Event;
use App\Http\Controllers\Controller;
use App\Http\Requests\Calendar\EventRequest;
use App\Repositories\Calendar\EventRepository;
use App\Repositories\Upload\UploadRepository;

class EventController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'event';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        EventRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set')->except('download');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/event/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Event::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Events
     * @get ("/api/event")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Event::class);

        $events = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('events', 'filters'));
    }

    /**
     * Used to get upcoming Events
     * @get ("/api/event/upcoming")
     * @return Response
     */
    public function upcoming()
    {
        return $this->success(compact('events'));
    }

    /**
     * Used to print all Events
     * @post ("/api/event/print")
     * @return Response
     */
    public function print()
    {
        $events = $this->repo->print(request('filter'));

        return view('print.calendar.event', compact('events'))->render();
    }

    /**
     * Used to generate pdf all Events
     * @post ("/api/event/pdf")
     * @return Response
     */
    public function pdf()
    {
        $events = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.calendar.event', compact('events'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Event
     * @post ("/api/event")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Event"),
     *      @Parameter("description", type="text", required="optional", description="Description of Event")
     * })
     * @return Response
     */
    public function store(EventRequest $request)
    {
        $this->authorize('create', Event::class);

        $event = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('calendar.event_added')]);
    }

    /**
     * Used to get Event detail
     * @get ("/api/event/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Event"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $event = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('list', Event::class);

        $attachments = $this->upload->getAttachment($this->module, $event->id);

        $selected_audience = $this->repo->getSelectedAudience($event);

        $start_time = [
                'hour' => ($event->start_time) ? date('h', strtotime($event->start_time)) : '',
                'minute' => ($event->start_time) ? date('i', strtotime($event->start_time)) : '',
                'meridiem' => ($event->start_time) ? date('a', strtotime($event->start_time)) : ''
            ];

        $end_time = [
                'hour' => ($event->end_time) ? date('h', strtotime($event->end_time)) : '',
                'minute' => ($event->end_time) ? date('i', strtotime($event->end_time)) : '',
                'meridiem' => ($event->end_time) ? date('a', strtotime($event->end_time)) : ''
            ];

        $is_editable = $this->repo->isEditable($event);

        return $this->success(compact('event', 'attachments', 'selected_audience', 'start_time', 'end_time','is_editable'));
    }

    /**
     * Used to update Event
     * @patch ("/api/event/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Event"),
     *      @Parameter("title", type="string", required="true", description="Title of Event"),
     *      @Parameter("description", type="text", required="optional", description="Description of Event")
     * })
     * @return Response
     */
    public function update($uuid, EventRequest $request)
    {
        $this->authorize('update', Event::class);

        $event = $this->repo->findByUuidOrFail($uuid);

        $event = $this->repo->update($event, $this->request->all());

        return $this->success(['message' => trans('calendar.event_updated')]);
    }

    /**
     * Used to delete Event
     * @delete ("/api/event/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Event"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Event::class);

        $event = $this->repo->findByUuidOrFail($uuid);

        $this->upload->delete($this->module, $event->id);

        $this->repo->delete($event);

        return $this->success(['message' => trans('calendar.event_deleted')]);
    }

    /**
     * Used to download Event Attachments
     * @get ("/post/event/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Event"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $event = $this->repo->findByUuidOrFailWithoutSession($uuid);

        if ($event->audience != 'everyone') {
            $this->authorize('list', Event::class);
        }

        $attachment = $this->upload->getAttachment($this->module, $event->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
