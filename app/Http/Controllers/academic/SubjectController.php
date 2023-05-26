<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Academic\Subject;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\SubjectRequest;
use App\Repositories\Academic\SubjectRepository;

class SubjectController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        SubjectRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/subject/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Subject::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Subjects
     * @get ("/api/subject")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Subject::class);

        $batches = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('batches', 'filters'));
    }

    /**
     * Used to print all Subjects
     * @post ("/api/subject/print")
     * @return Response
     */
    public function print()
    {
        $data = $this->repo->print(request('filter'));

        $data['filter'] = request('filter');
        
        return view('print.academic.subject', $data)->render();
    }

    /**
     * Used to generate pdf all Subjects
     * @post ("/api/subject/pdf")
     * @return Response
     */
    public function pdf()
    {
        $data = $this->repo->print(request('filter'));

        $data['filter'] = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.subject', $data)->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Subject
     * @post ("/api/subject")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch")
     * })
     * @return Response
     */
    public function store(SubjectRequest $request)
    {
        $this->authorize('create', Subject::class);

        $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.subject_added')]);
    }

    /**
     * Used to get Subject detail
     * @get ("/api/subject/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Subject"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Subject::class);

        $subject = $this->repo->findOrFail($id);

        $selected_batch = ['id' => $subject->batch_id, 'name' => $subject->Batch->batch_with_course];

        return $this->success(compact('subject', 'selected_batch'));
    }

    /**
     * Used to update Subject
     * @patch ("/api/subject/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Subject"),
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch")
     * })
     * @return Response
     */
    public function update($id, SubjectRequest $request)
    {
        $this->authorize('update', Subject::class);

        $subject = $this->repo->findOrFail($id);

        $subject = $this->repo->update($subject, $this->request->all());

        return $this->success(['message' => trans('academic.subject_updated')]);
    }

    /**
     * Used to delete Subject
     * @delete ("/api/subject/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Subject"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Subject::class);

        $subject = $this->repo->deletable($id);

        $this->repo->delete($subject);

        return $this->success(['message' => trans('academic.subject_deleted')]);
    }

    /**
     * Used to copy Subject to other batches of this course
     * @post ("/api/subject/{batch_id}/copy")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch")
     * })
     * @return Response
     */
    public function copy($batch_id)
    {
        $this->authorize('create', Subject::class);

        $this->repo->copy($batch_id);

        return $this->success(['message' => trans('academic.subject_copied')]);
    }

    /**
     * Used to delete Subjects of given batch
     * @delete ("/api/subject/{batch_id}/delete")
     * @param ({
     *      @Parameter("batch_id", type="integer", required="true", description="Id of Batch")
     * })
     * @return Response
     */
    public function destroyBatch($batch_id)
    {
        $this->authorize('delete', Subject::class);

        $this->repo->batchDelete($batch_id);

        return $this->success(['message' => trans('academic.subject_deleted')]);
    }
}
