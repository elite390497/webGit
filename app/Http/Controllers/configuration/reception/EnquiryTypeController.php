<?php

namespace App\Http\Controllers\Configuration\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Reception\EnquiryTypeRequest;
use App\Repositories\Configuration\Reception\EnquiryTypeRepository;

class EnquiryTypeController extends Controller
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
        EnquiryTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Enquiry Types
     * @get ("/api/reception/enquiry/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Enquiry Types
     * @post ("/api/reception/enquiry/type/print")
     * @return Response
     */
    public function print()
    {
        $enquiry_types = $this->repo->print(request('filter'));

        return view('print.configuration.reception.enquiry-type', compact('enquiry_types'))->render();
    }

    /**
     * Used to generate pdf all Enquiry Types
     * @post ("/api/reception/enquiry/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $enquiry_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.reception.enquiry-type', compact('enquiry_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Enquiry Type
     * @post ("/api/reception/enquiry/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Enquiry Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Enquiry Type")
     * })
     * @return Response
     */
    public function store(EnquiryTypeRequest $request)
    {
        $enquiry_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.enquiry_type_added')]);
    }

    /**
     * Used to get Enquiry Type detail
     * @get ("/api/reception/enquiry/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Enquiry Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Enquiry Type
     * @patch ("/api/reception/enquiry/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Enquiry Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Enquiry Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Enquiry Type")
     * })
     * @return Response
     */
    public function update($id, EnquiryTypeRequest $request)
    {
        $enquiry_type = $this->repo->findOrFail($id);

        $enquiry_type = $this->repo->update($enquiry_type, $this->request->all());

        return $this->success(['message' => trans('reception.enquiry_type_updated')]);
    }

    /**
     * Used to delete Enquiry Type
     * @delete ("/api/reception/enquiry/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Enquiry Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $enquiry_type = $this->repo->deletable($id);

        $this->repo->delete($enquiry_type);

        return $this->success(['message' => trans('reception.enquiry_type_deleted')]);
    }
}
