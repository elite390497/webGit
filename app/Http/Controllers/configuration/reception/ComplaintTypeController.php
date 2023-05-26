<?php

namespace App\Http\Controllers\Configuration\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Reception\ComplaintTypeRequest;
use App\Repositories\Configuration\Reception\ComplaintTypeRepository;

class ComplaintTypeController extends Controller
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
        ComplaintTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Complaint Types
     * @get ("/api/reception/complaint/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Complaint Types
     * @post ("/api/reception/complaint/type/print")
     * @return Response
     */
    public function print()
    {
        $complaint_types = $this->repo->print(request('filter'));

        return view('print.configuration.reception.complaint-type', compact('complaint_types'))->render();
    }

    /**
     * Used to generate pdf all Complaint Types
     * @post ("/api/reception/complaint/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $complaint_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.reception.complaint-type', compact('complaint_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Complaint Type
     * @post ("/api/reception/complaint/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Complaint Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Complaint Type")
     * })
     * @return Response
     */
    public function store(ComplaintTypeRequest $request)
    {
        $complaint_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.complaint_type_added')]);
    }

    /**
     * Used to get Complaint Type detail
     * @get ("/api/reception/complaint/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Complaint Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Complaint Type
     * @patch ("/api/reception/complaint/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Complaint Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Complaint Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Complaint Type")
     * })
     * @return Response
     */
    public function update($id, ComplaintTypeRequest $request)
    {
        $complaint_type = $this->repo->findOrFail($id);

        $complaint_type = $this->repo->update($complaint_type, $this->request->all());

        return $this->success(['message' => trans('reception.complaint_type_updated')]);
    }

    /**
     * Used to delete Complaint Type
     * @delete ("/api/reception/complaint/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Complaint Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $complaint_type = $this->repo->deletable($id);

        $this->repo->delete($complaint_type);

        return $this->success(['message' => trans('reception.complaint_type_deleted')]);
    }
}