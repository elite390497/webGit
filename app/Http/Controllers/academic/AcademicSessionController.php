<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Academic\AcademicSession;
use App\Http\Requests\Academic\AcademicSessionRequest;
use App\Repositories\Academic\AcademicSessionRepository;

class AcademicSessionController extends Controller
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
        AcademicSessionRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/academic/session/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', AcademicSession::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Academic Sessions
     * @get ("/api/academic/session")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', AcademicSession::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Academic Sessions
     * @post ("/api/academic/session/print")
     * @return Response
     */
    public function print()
    {
        $academic_sessions = $this->repo->print(request('filter'));

        return view('print.academic.session', compact('academic_sessions'))->render();
    }

    /**
     * Used to generate pdf all Academic Sessions
     * @post ("/api/academic/session/pdf")
     * @return Response
     */
    public function pdf()
    {
        $academic_sessions = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.session', compact('academic_sessions'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to import data from academic session
     * @post ("/api/academic/session/import")
     * @return Response
     */
    public function import()
    {
        $this->authorize('importPreviousSessionData', AcademicSession::class);

        $this->repo->import($this->request->all());

        return $this->success(['message' => trans('academic.data_imported')]);
    }

    /**
     * Used to store Academic Session
     * @post ("/api/academic/session")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Academic Session"),
     *      @Parameter("description", type="text", required="optional", description="Description of Academic Session"),
     *      @Parameter("start_date", type="date", required="true", description="Start date of Academic Session"),
     *      @Parameter("end_date", type="date", required="true", description="End date of Academic Session"),
     *      @Parameter("is_default", type="boolean", required="true", description="Is academic session default?"),
     * })
     * @return Response
     */
    public function store(AcademicSessionRequest $request)
    {
        $this->authorize('create', AcademicSession::class);

        $academic_session = $this->repo->create($this->request->all());

        $academic_sessions = $this->repo->getAll();

        return $this->success(['message' => trans('academic.session_added'), 'academic_sessions' => $academic_sessions]);
    }

    /**
     * Used to get Academic Session detail
     * @get ("/api/academic/session/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Academic Session"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', AcademicSession::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to make Academic Session default for particular user
     * @post ("/api/academic/session/{id}/user/default")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Academic Session"),
     * })
     * @return Response
     */

    public function userDefault($id)
    {
        $academic_session = $this->repo->setUserDefault($this->repo->findOrFail($id));

        return $this->success();
    }

    /**
     * Used to update Academic Session
     * @patch ("/api/academic/session/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Academic Session"),
     *      @Parameter("name", type="string", required="true", description="Name of Academic Session"),
     *      @Parameter("description", type="text", required="optional", description="Description of Academic Session"),
     *      @Parameter("start_date", type="date", required="true", description="Start date of Academic Session"),
     *      @Parameter("end_date", type="date", required="true", description="End date of Academic Session"),
     *      @Parameter("is_default", type="boolean", required="true", description="Is academic session default?")
     * })
     * @return Response
     */
    public function update($id, AcademicSessionRequest $request)
    {
        $this->authorize('update', AcademicSession::class);

        $academic_session = $this->repo->findOrFail($id);

        $academic_session = $this->repo->update($academic_session, $this->request->all());

        return $this->success(['message' => trans('academic.session_updated')]);
    }

    /**
     * Used to delete Academic Session
     * @delete ("/api/academic/session/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Academic Session"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', AcademicSession::class);

        $academic_session = $this->repo->deletable($id);

        $this->repo->delete($academic_session);

        $academic_sessions = $this->repo->getAll();

        return $this->success(['message' => trans('academic.session_deleted'), 'academic_sessions' => $academic_sessions]);
    }
}
