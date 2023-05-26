<?php

namespace App\Http\Controllers\Configuration\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Reception\CallingPurposeRequest;
use App\Repositories\Configuration\Reception\CallingPurposeRepository;

class CallingPurposeController extends Controller
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
        CallingPurposeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Calling Purposes
     * @get ("/api/reception/calling/purpose")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Calling Purposes
     * @post ("/api/reception/calling/purpose/print")
     * @return Response
     */
    public function print()
    {
        $calling_purposes = $this->repo->print(request('filter'));

        return view('print.configuration.reception.calling-purpose', compact('calling_purposes'))->render();
    }

    /**
     * Used to generate pdf all Calling Purposes
     * @post ("/api/reception/calling/purpose/pdf")
     * @return Response
     */
    public function pdf()
    {
        $calling_purposes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.reception.calling-purpose', compact('calling_purposes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Calling Purpose
     * @post ("/api/reception/calling/purpose")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Calling Purpose"),
     *      @Parameter("description", type="text", required="optional", description="Description of Calling Purpose")
     * })
     * @return Response
     */
    public function store(CallingPurposeRequest $request)
    {
        $calling_purpose = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.calling_purpose_added')]);
    }

    /**
     * Used to get Calling Purpose detail
     * @get ("/api/reception/calling/purpose/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Calling Purpose"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Calling Purpose
     * @patch ("/api/reception/calling/purpose/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Calling Purpose"),
     *      @Parameter("name", type="string", required="true", description="Name of Calling Purpose"),
     *      @Parameter("description", type="text", required="optional", description="Description of Calling Purpose")
     * })
     * @return Response
     */
    public function update($id, CallingPurposeRequest $request)
    {
        $calling_purpose = $this->repo->findOrFail($id);

        $calling_purpose = $this->repo->update($calling_purpose, $this->request->all());

        return $this->success(['message' => trans('reception.calling_purpose_updated')]);
    }

    /**
     * Used to delete Calling Purpose
     * @delete ("/api/reception/calling/purpose/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Calling Purpose"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $calling_purpose = $this->repo->deletable($id);

        $this->repo->delete($calling_purpose);

        return $this->success(['message' => trans('reception.calling_purpose_deleted')]);
    }
}