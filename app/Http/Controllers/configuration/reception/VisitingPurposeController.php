<?php

namespace App\Http\Controllers\Configuration\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Reception\VisitingPurposeRequest;
use App\Repositories\Configuration\Reception\VisitingPurposeRepository;

class VisitingPurposeController extends Controller
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
        VisitingPurposeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Visiting Purposes
     * @get ("/api/reception/visiting/purpose")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Visiting Purposes
     * @post ("/api/reception/visiting/purpose/print")
     * @return Response
     */
    public function print()
    {
        $visiting_purposes = $this->repo->print(request('filter'));

        return view('print.configuration.reception.visiting-purpose', compact('visiting_purposes'))->render();
    }

    /**
     * Used to generate pdf all Visiting Purposes
     * @post ("/api/reception/visiting/purpose/pdf")
     * @return Response
     */
    public function pdf()
    {
        $visiting_purposes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.reception.visiting-purpose', compact('visiting_purposes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Visiting Purpose
     * @post ("/api/reception/visiting/purpose")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Visiting Purpose"),
     *      @Parameter("description", type="text", required="optional", description="Description of Visiting Purpose")
     * })
     * @return Response
     */
    public function store(VisitingPurposeRequest $request)
    {
        $visiting_purpose = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.visiting_purpose_added')]);
    }

    /**
     * Used to get Visiting Purpose detail
     * @get ("/api/reception/visiting/purpose/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Visiting Purpose"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Visiting Purpose
     * @patch ("/api/reception/visiting/purpose/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Visiting Purpose"),
     *      @Parameter("name", type="string", required="true", description="Name of Visiting Purpose"),
     *      @Parameter("description", type="text", required="optional", description="Description of Visiting Purpose")
     * })
     * @return Response
     */
    public function update($id, VisitingPurposeRequest $request)
    {
        $visiting_purpose = $this->repo->findOrFail($id);

        $visiting_purpose = $this->repo->update($visiting_purpose, $this->request->all());

        return $this->success(['message' => trans('reception.visiting_purpose_updated')]);
    }

    /**
     * Used to delete Visiting Purpose
     * @delete ("/api/reception/visiting/purpose/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Visiting Purpose"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $visiting_purpose = $this->repo->deletable($id);

        $this->repo->delete($visiting_purpose);

        return $this->success(['message' => trans('reception.visiting_purpose_deleted')]);
    }
}
