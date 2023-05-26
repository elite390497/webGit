<?php

namespace App\Http\Controllers\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Reception\VisitorLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reception\VisitorLogRequest;
use App\Repositories\Reception\VisitorLogRepository;

class VisitorLogController extends Controller
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
        VisitorLogRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/visitor/log/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', VisitorLog::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Visitor Logs
     * @get ("/api/visitor/log")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', VisitorLog::class);

        $visitor_logs = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('visitor_logs', 'filters'));
    }

    /**
     * Used to print all Visitor Logs
     * @post ("/api/visitor/log/print")
     * @return Response
     */
    public function print()
    {
        $visitor_logs = $this->repo->print(request('filter'));

        return view('print.reception.visitor-log', compact('visitor_logs'))->render();
    }

    /**
     * Used to generate pdf all Visitor Logs
     * @post ("/api/visitor/log/pdf")
     * @return Response
     */
    public function pdf()
    {
        $visitor_logs = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.reception.visitor-log', compact('visitor_logs'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to print Gate Pass
     * @post ("/reception/visitor/log/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Visitor Log"),
     * })
     * @return Response
     */
    public function printDetail($uuid)
    {
        $this->authorize('list', VisitorLog::class);

        $visitor_log = $this->repo->findByUuidOrFail($uuid);

        return view()->first(['custom-print.reception.visitor-pass', 'print.reception.visitor-pass'], compact('visitor_log'));
    }

    /**
     * Used to store Visitor Log
     * @post ("/api/visitor/log")
     * @param ({
     *      @Parameter("description", type="text", required="optional", description="Description of Visitor Log")
     * })
     * @return Response
     */
    public function store(VisitorLogRequest $request)
    {
        $this->authorize('create', VisitorLog::class);

        $visitor_log = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.visitor_log_added')]);
    }

    /**
     * Used to get Visitor Log detail
     * @get ("/api/visitor/log/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Visitor Log"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', VisitorLog::class);

        $visitor_log = $this->repo->findByUuidOrFail($uuid);

        $selected_student = ($visitor_log->student_id) ? ['id' => $visitor_log->student_id, 'name' => $visitor_log->Student->name.' ('.$visitor_log->Student->Parent->first_guardian_name.' '.$visitor_log->Student->contact_number.')'] : [];

        $selected_employee = ($visitor_log->employee_id) ? ['id' => $visitor_log->employee_id, 'name' => $visitor_log->Employee->name.' ('.$visitor_log->Employee->contact_number.')'] : [];

        $selected_visiting_purpose = ($visitor_log->visiting_purpose_id) ? ['id' => $visitor_log->visiting_purpose_id, 'name' => $visitor_log->VisitingPurpose->name] : [];

        $entry_time = [
                'hour' => date('h', strtotime($visitor_log->entry_time)),
                'minute' => date('i', strtotime($visitor_log->entry_time)),
                'meridiem' => date('a', strtotime($visitor_log->entry_time))
            ];

        $exit_time = $visitor_log->exit_time ? [
            'hour' => date('h', strtotime($visitor_log->exit_time)),
            'minute' => date('i', strtotime($visitor_log->exit_time)),
            'meridiem' => date('a', strtotime($visitor_log->exit_time))
        ] : [];

        return $this->success(compact('visitor_log', 'selected_student', 'selected_employee', 'selected_visiting_purpose', 'entry_time', 'exit_time'));
    }

    /**
     * Used to update Visitor Log
     * @patch ("/api/visitor/log/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Visitor Log"),
     *      @Parameter("dates", type="array", required="true", description="Array of Dates"),
     *      @Parameter("description", type="text", required="optional", description="Description of Visitor Log")
     * })
     * @return Response
     */
    public function update($uuid, VisitorLogRequest $request)
    {
        $this->authorize('update', VisitorLog::class);

        $visitor_log = $this->repo->findByUuidOrFail($uuid);

        $visitor_log = $this->repo->update($visitor_log, $this->request->all());

        return $this->success(['message' => trans('reception.visitor_log_updated')]);
    }

    /**
     * Used to delete Visitor Log
     * @delete ("/api/visitor/log/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Visitor Log"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', VisitorLog::class);

        $visitor_log = $this->repo->findByUuidOrFail($uuid);

        $this->repo->delete($visitor_log);

        return $this->success(['message' => trans('reception.visitor_log_deleted')]);
    }
}
