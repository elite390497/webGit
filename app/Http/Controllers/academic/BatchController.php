<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Academic\Batch;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\BatchRequest;
use App\Repositories\Academic\BatchRepository;

class BatchController extends Controller
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
        BatchRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/batch/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Batch::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Batches
     * @get ("/api/batch")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Batch::class);

        $batches = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('batches', 'filters'));
    }

    /**
     * Used to print all Batches
     * @post ("/api/batch/print")
     * @return Response
     */
    public function print()
    {
        $batches = $this->repo->print(request('filter'));

        return view('print.academic.batch', compact('batches'))->render();
    }

    /**
     * Used to generate pdf all Batches
     * @post ("/api/batch/pdf")
     * @return Response
     */
    public function pdf()
    {
        $batches = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.batch', compact('batches'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Batch
     * @post ("/api/batch")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Batch"),
     *      @Parameter("course_id", type="integer", required="true", description="Id of Course"),
     *      @Parameter("description", type="text", required="optional", description="Description of Batch")
     * })
     * @return Response
     */
    public function store(BatchRequest $request)
    {
        $this->authorize('create', Batch::class);

        $batch = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.batch_added')]);
    }

    /**
     * Used to get Batch detail
     * @get ("/api/batch/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Batch"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Batch::class);

        $batch = $this->repo->findOrFail($id);

        $selected_course = ($batch->course_id) ? ['id' => $batch->course_id,'name' => $batch->Course->name] : [];

        return $this->success(compact('batch', 'selected_course'));
    }

    /**
     * Used to update Batch
     * @patch ("/api/batch/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Batch"),
     *      @Parameter("name", type="string", required="true", description="Name of Batch"),
     *      @Parameter("course_id", type="integer", required="true", description="Id of Course"),
     *      @Parameter("description", type="text", required="optional", description="Description of Batch")
     * })
     * @return Response
     */
    public function update($id, BatchRequest $request)
    {
        $this->authorize('update', Batch::class);

        $batch = $this->repo->findOrFail($id);

        $batch = $this->repo->update($batch, $this->request->all());

        return $this->success(['message' => trans('academic.batch_updated')]);
    }
 
     /**
     * Used to reorder all Subjects of batch
     * @frontend ("/api/batch/{id}/subject/reorder")
     * @return Response
     */
    public function subjectReorder($id)
    {
        $this->authorize('update', Batch::class);

        $batch = $this->repo->findOrFail($id);

        $this->repo->subjectReorder($batch, $this->request->all());
    
        return $this->success(['message' => trans('academic.subject_updated')]);
    }

    /**
     * Used to delete Batch
     * @delete ("/api/batch/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Batch"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Batch::class);

        $batch = $this->repo->deletable($id);

        $this->repo->delete($batch);

        return $this->success(['message' => trans('academic.batch_deleted')]);
    }

    /**
     * Used to fetch batch strength
     * @get ("/api/batch/{id}/strength")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch"),
     * })
     * @return Response
     */
    public function fetchStrength($id)
    {
        return $this->ok($this->repo->fetchStrength($id));
    }

    /**
     * Used to fetch batch subjects
     * @get ("/api/batch/{id}/subjects")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch"),
     * })
     * @return Response
     */
    public function fetchSubjects($id)
    {
        return $this->success($this->repo->fetchSubjects($id));
    }
}
