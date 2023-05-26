<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Academic\Timetable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\TimetableRequest;
use App\Repositories\Academic\TimetableRepository;

class TimetableController extends Controller
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
        TimetableRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/timetable/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Timetable::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Timetable
     * @get ("/api/academic/timetable")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Timetable::class);

        $timetables = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('timetables', 'filters'));
    }

    /**
     * Used to print all Timetables
     * @post ("/api/timetable/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', Timetable::class);

        $timetables = $this->repo->print(request('filter'));

        return view('print.academic.timetable', compact('timetables'))->render();
    }

    /**
     * Used to generate pdf all Timetables
     * @post ("/api/timetable/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', Timetable::class);

        $timetables = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.timetable', compact('timetables'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to print given Timetables
     * @post ("/api/timetable/print/batch")
     * @return Response
     */
    public function printBatchTimetable()
    {
        $this->authorize('list', Timetable::class);

        $timetable = $this->repo->findByUuidOrFail(request('uuid'));

        $timetable->max_session = $this->repo->getMaxSessionOfTimetable($timetable);

        $filter = request('filter');

        return view('print.academic.batch-timetable', compact('timetable', 'filter'))->render();
    }

    /**
     * Used to print given Timetables
     * @post ("/academic/timetable/batch/{uuid}/batch")
     * @return Response
     */
    public function printIndividualBatchTimetable($uuid)
    {
        $this->authorize('list', Timetable::class);

        $timetable = $this->repo->findByUuidOrFail($uuid);

        $timetable->max_session = $this->repo->getMaxSessionOfTimetable($timetable);

        return view('print.academic.batch-timetable', compact('timetable'));
    }

    /**
     * Used to generate pdf of given Timetables
     * @post ("/api/timetable/pdf/print")
     * @return Response
     */
    public function pdfBatchTimetable()
    {
        $this->authorize('list', Timetable::class);

        $timetable = $this->repo->findByUuidOrFail(request('uuid'));

        $timetable->max_session = $this->repo->getMaxSessionOfTimetable($timetable);

        $filter = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.batch-timetable', compact('timetable', 'filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to print selected batch Timetables
     * @post ("/api/timetable/print/selected")
     * @return Response
     */
    public function printSelectedBatchTimetable()
    {
        $this->authorize('list', Timetable::class);

        $batches = $this->repo->getAllBatchesTimetable(request('filter'));

        $filter = request('filter');

        return view('print.academic.selected-batch-timetable', compact('batches', 'filter'))->render();
    }

    /**
     * Used to store Timetable
     * @post ("/api/timetable")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Batch of Timetable"),
     *      @Parameter("date_effective", type="date", required="true", description="Effective date of Timetable"),
     *      @Parameter("description", type="string", required="optional", description="Description of Timetable")
     * })
     * @return Response
     */
    public function store(TimetableRequest $request)
    {
        $this->authorize('create', Timetable::class);

        $timetable = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.timetable_added')]);
    }

    /**
     * Used to show Timetable
     * @get ("/api/timetable/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Timetable")
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $timetable = $this->repo->findByUuidOrFail($uuid);

        $subjects = $this->repo->getAllotmentPreRequisite($timetable);

        return  $this->success(compact('timetable', 'subjects'));
    }

    /**
     * Used to allocation Timetable
     * @post ("/api/timetable/{uuid}/allocation")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Timetable")
     * })
     * @return Response
     */
    public function allocation($uuid)
    {
        $this->authorize('create', Timetable::class);

        $timetable = $this->repo->findByUuidOrFail($uuid);

        $this->repo->allocation($timetable, $this->request->all());

        return $this->success(['message' => trans('academic.timetable_allocated')]);
    }

    /**
     * Used to update Timetable
     * @patch ("/api/timetable/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Timetable"),
     *      @Parameter("batch_id", type="integer", required="true", description="Batch of Timetable"),
     *      @Parameter("date_effective", type="date", required="true", description="Effective date of Timetable"),
     *      @Parameter("description", type="string", required="optional", description="Description of Timetable")
     * })
     * @return Response
     */
    public function update($uuid, TimetableRequest $request)
    {
        $this->authorize('update', Timetable::class);

        $timetable = $this->repo->findByUuidOrFail($uuid);

        $timetable = $this->repo->update($timetable, $this->request->all());

        return $this->success(['message' => trans('academic.timetable_updated')]);
    }

    /**
     * Used to delete Timetable
     * @delete ("/api/timetable/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="integer", required="true", description="Unique Id of Timetable"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Timetable::class);

        $timetable = $this->repo->deletable($uuid);

        $this->repo->delete($timetable);

        return $this->success(['message' => trans('academic.timetable_deleted')]);
    }
}
