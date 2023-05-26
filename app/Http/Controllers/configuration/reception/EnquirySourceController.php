<?php

namespace App\Http\Controllers\Configuration\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Reception\EnquirySourceRequest;
use App\Repositories\Configuration\Reception\EnquirySourceRepository;

class EnquirySourceController extends Controller
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
        EnquirySourceRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Enquiry Sources
     * @get ("/api/reception/enquiry/source")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Enquiry Sources
     * @post ("/api/reception/enquiry/source/print")
     * @return Response
     */
    public function print()
    {
        $enquiry_sources = $this->repo->print(request('filter'));

        return view('print.configuration.reception.enquiry-source', compact('enquiry_sources'))->render();
    }

    /**
     * Used to generate pdf all Enquiry Sources
     * @post ("/api/reception/enquiry/source/pdf")
     * @return Response
     */
    public function pdf()
    {
        $enquiry_sources = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.reception.enquiry-source', compact('enquiry_sources'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Enquiry Source
     * @post ("/api/reception/enquiry/source")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Enquiry Source"),
     *      @Parameter("description", type="text", required="optional", description="Description of Enquiry Source")
     * })
     * @return Response
     */
    public function store(EnquirySourceRequest $request)
    {
        $enquiry_source = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.enquiry_source_added')]);
    }

    /**
     * Used to get Enquiry Source detail
     * @get ("/api/reception/enquiry/source/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Enquiry Source"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Enquiry Source
     * @patch ("/api/reception/enquiry/source/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Enquiry Source"),
     *      @Parameter("name", type="string", required="true", description="Name of Enquiry Source"),
     *      @Parameter("description", type="text", required="optional", description="Description of Enquiry Source")
     * })
     * @return Response
     */
    public function update($id, EnquirySourceRequest $request)
    {
        $enquiry_source = $this->repo->findOrFail($id);

        $enquiry_source = $this->repo->update($enquiry_source, $this->request->all());

        return $this->success(['message' => trans('reception.enquiry_source_updated')]);
    }

    /**
     * Used to delete Enquiry Source
     * @delete ("/api/reception/enquiry/source/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Enquiry Source"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $enquiry_source = $this->repo->deletable($id);

        $this->repo->delete($enquiry_source);

        return $this->success(['message' => trans('reception.enquiry_source_deleted')]);
    }
}
