<?php

namespace App\Http\Controllers\Configuration\Exam;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Exam\ObservationRequest;
use App\Repositories\Configuration\Exam\ObservationRepository;

class ObservationController extends Controller
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
        ObservationRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Exam Observations
     * @get ("/api/exam/observation")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Exam Observations
     * @post ("/api/exam/observation/print")
     * @return Response
     */
    public function print()
    {
        $exam_observations = $this->repo->print(request('filter'));

        return view('print.configuration.exam.observation', compact('exam_observations'))->render();
    }

    /**
     * Used to generate pdf all Exam Observations
     * @post ("/api/exam/observation/pdf")
     * @return Response
     */
    public function pdf()
    {
        $exam_observations = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.exam.observation', compact('exam_observations'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Exam Observation
     * @post ("/api/exam/observation")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Exam Observation"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Observation")
     * })
     * @return Response
     */
    public function store(ObservationRequest $request)
    {
        $exam_observation = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('exam.observation_added')]);
    }

    /**
     * Used to get Exam Observation detail
     * @get ("/api/exam/observation/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Observation"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Exam Observation
     * @patch ("/api/exam/observation/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Observation"),
     *      @Parameter("name", type="string", required="true", description="Name of Exam Observation"),
     *      @Parameter("description", type="text", required="optional", description="Description of Exam Observation")
     * })
     * @return Response
     */
    public function update($id, ObservationRequest $request)
    {
        $exam_observation = $this->repo->findOrFail($id);

        $exam_observation = $this->repo->update($exam_observation, $this->request->all());

        return $this->success(['message' => trans('exam.observation_updated')]);
    }
 
     /**
     * Used to reorder all Details of observation
     * @frontend ("/api/exam/observation/{id}/reorder")
     * @return Response
     */
    public function reorder($id)
    {
        $exam_observation = $this->repo->findOrFail($id);

        $this->repo->reorder($exam_observation, $this->request->all());
    
        return $this->success(['message' => trans('exam.observation_updated')]);
    }

    /**
     * Used to delete Exam Observation
     * @delete ("/api/exam/observation/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Exam Observation"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $exam_observation = $this->repo->deletable($id);

        $this->repo->delete($exam_observation);

        return $this->success(['message' => trans('exam.observation_deleted')]);
    }
}
