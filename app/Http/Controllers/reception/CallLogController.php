<?php

namespace App\Http\Controllers\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Reception\CallLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reception\CallLogRequest;
use App\Repositories\Reception\CallLogRepository;

class CallLogController extends Controller
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
        CallLogRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/call/log/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', CallLog::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Call Logs
     * @get ("/api/call/log")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', CallLog::class);

        $call_logs = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('call_logs', 'filters'));
    }

    /**
     * Used to print all Call Logs
     * @post ("/api/call/log/print")
     * @return Response
     */
    public function print()
    {
        $call_logs = $this->repo->print(request('filter'));

        return view('print.reception.call-log', compact('call_logs'))->render();
    }

    /**
     * Used to generate pdf all Call Logs
     * @post ("/api/call/log/pdf")
     * @return Response
     */
    public function pdf()
    {
        $call_logs = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.reception.call-log', compact('call_logs'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Call Log
     * @post ("/api/call/log")
     * @param ({
     *      @Parameter("description", type="text", required="optional", description="Description of Call Log")
     * })
     * @return Response
     */
    public function store(CallLogRequest $request)
    {
        $this->authorize('create', CallLog::class);

        $call_log = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.call_log_added')]);
    }

    /**
     * Used to get Call Log detail
     * @get ("/api/call/log/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Call Log"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', CallLog::class);

        $call_log = $this->repo->findByUuidOrFail($uuid);

        $selected_calling_purpose = ($call_log->calling_purpose_id) ? ['id' => $call_log->calling_purpose_id, 'name' => $call_log->CallingPurpose->name] : [];

        $start_time = [
                'hour' => date('h', strtotime($call_log->start_time)),
                'minute' => date('i', strtotime($call_log->start_time)),
                'second' => date('s', strtotime($call_log->start_time)),
                'meridiem' => date('a', strtotime($call_log->start_time))
            ];

        $end_time = $call_log->end_time ? [
            'hour' => date('h', strtotime($call_log->end_time)),
            'minute' => date('i', strtotime($call_log->end_time)),
            'second' => date('s', strtotime($call_log->end_time)),
            'meridiem' => date('a', strtotime($call_log->end_time))
        ] : [];

        return $this->success(compact('call_log', 'selected_calling_purpose', 'start_time', 'end_time'));
    }

    /**
     * Used to update Call Log
     * @patch ("/api/call/log/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Call Log"),
     *      @Parameter("dates", type="array", required="true", description="Array of Dates"),
     *      @Parameter("description", type="text", required="optional", description="Description of Call Log")
     * })
     * @return Response
     */
    public function update($uuid, CallLogRequest $request)
    {
        $this->authorize('update', CallLog::class);

        $call_log = $this->repo->findByUuidOrFail($uuid);

        $call_log = $this->repo->update($call_log, $this->request->all());

        return $this->success(['message' => trans('reception.call_log_updated')]);
    }

    /**
     * Used to delete Call Log
     * @delete ("/api/call/log/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Call Log"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', CallLog::class);

        $call_log = $this->repo->findByUuidOrFail($uuid);

        $this->repo->delete($call_log);

        return $this->success(['message' => trans('reception.call_log_deleted')]);
    }
}