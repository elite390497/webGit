<?php

namespace App\Http\Controllers\Configuration\Calendar;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Calendar\EventTypeRequest;
use App\Repositories\Configuration\Calendar\EventTypeRepository;

class EventTypeController extends Controller
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
        EventTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Event Types
     * @get ("/api/calendar/event/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Event Types
     * @post ("/api/calendar/event/type/print")
     * @return Response
     */
    public function print()
    {
        $event_types = $this->repo->print(request('filter'));

        return view('print.configuration.calendar.event-type', compact('event_types'))->render();
    }

    /**
     * Used to generate pdf all Event Types
     * @post ("/api/calendar/event/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $event_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.calendar.event-type', compact('event_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Event Type
     * @post ("/api/calendar/event/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Event Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Event Type")
     * })
     * @return Response
     */
    public function store(EventTypeRequest $request)
    {
        $event_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('calendar.event_type_added')]);
    }

    /**
     * Used to get Event Type detail
     * @get ("/api/calendar/event/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Event Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Event Type
     * @patch ("/api/calendar/event/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Event Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Event Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Event Type")
     * })
     * @return Response
     */
    public function update($id, EventTypeRequest $request)
    {
        $event_type = $this->repo->findOrFail($id);

        $event_type = $this->repo->update($event_type, $this->request->all());

        return $this->success(['message' => trans('calendar.event_type_updated')]);
    }

    /**
     * Used to delete Event Type
     * @delete ("/api/calendar/event/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Event Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $event_type = $this->repo->deletable($id);

        $this->repo->delete($event_type);

        return $this->success(['message' => trans('calendar.event_type_deleted')]);
    }
}
