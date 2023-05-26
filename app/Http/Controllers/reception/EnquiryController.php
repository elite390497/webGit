<?php

namespace App\Http\Controllers\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Reception\Enquiry;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reception\EnquiryRequest;
use App\Repositories\Reception\EnquiryRepository;
use App\Http\Requests\Reception\EnquiryFollowUpRequest;

class EnquiryController extends Controller
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
        EnquiryRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/enquiry/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Enquiry::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Enquiries
     * @get ("/api/enquiry")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Enquiry::class);

        $enquiries = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('enquiries', 'filters'));
    }

    /**
     * Used to print all Enquiries
     * @post ("/api/enquiry/print")
     * @return Response
     */
    public function print()
    {
        $enquiries = $this->repo->print(request('filter'));

        return view('print.reception.enquiry', compact('enquiries'))->render();
    }

    /**
     * Used to generate pdf all Enquiries
     * @post ("/api/enquiry/pdf")
     * @return Response
     */
    public function pdf()
    {
        $enquiries = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.reception.enquiry', compact('enquiries'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Enquiry
     * @post ("/api/enquiry")
     * @param ({
     *      @Parameter("first_guardian_name", type="string", required="required", description="First Guardian Name of Student"),
     *      @Parameter("second_guardian_name", type="string", required="optional", description="Second Guardian Name of Student"),
     *      @Parameter("guardian_name", type="string", required="optional", description="Guardian Name of Student"),
     *      @Parameter("email", type="string", required="optional", description="Email of Student"),
     *      @Parameter("contact_number", type="number", required="required", description="Contact Number of Student"),
     *      @Parameter("alternate_contact_number", type="string", required="optional", description="Alternate Contact Number of Student"),
     *      @Parameter("date_of_enquiry", type="date", required="required", description="Date of Enquiry"),
     *      @Parameter("enquiry_type_id", type="integer", required="required", description="Type of Enquiry"),
     *      @Parameter("enquiry_source_id", type="integer", required="required", description="Source of Enquiry"),
     *      @Parameter("remarks", type="text", required="required", description="Remarks")
     * })
     * @return Response
     */
    public function store(EnquiryRequest $request)
    {
        $this->authorize('create', Enquiry::class);

        $enquiry = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.enquiry_added')]);
    }

    /**
     * Used to store Enquiry follow up
     * @post ("/api/enquiry/{uuid}/follow/up")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Enquiry"),
     * })
     * @return Response
     */
    public function followUp(EnquiryFollowUpRequest $request, $uuid)
    {
        $this->authorize('update', Enquiry::class);

        $enquiry = $this->repo->findByUuidOrFail($uuid);

        $enquiry = $this->repo->followUp($enquiry, $this->request->all());

        return $this->success(['message' => trans('reception.enquiry_updated')]);
    }

    /**
     * Used to get Enquiry detail
     * @get ("/api/enquiry/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Enquiry"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', Enquiry::class);

        $enquiry = $this->repo->findByUuidOrFail($uuid);

        return $this->success(compact('enquiry'));
    }

    /**
     * Used to update Enquiry
     * @patch ("/api/enquiry/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Enquiry")
     *      @Parameter("first_guardian_name", type="string", required="required", description="First Guardian Name of Student"),
     *      @Parameter("second_guardian_name", type="string", required="optional", description="Second Guardian Name of Student"),
     *      @Parameter("guardian_name", type="string", required="optional", description="Guardian Name of Student"),
     *      @Parameter("email", type="string", required="optional", description="Email of Student"),
     *      @Parameter("contact_number", type="number", required="required", description="Contact Number of Student"),
     *      @Parameter("alternate_contact_number", type="string", required="optional", description="Alternate Contact Number of Student"),
     *      @Parameter("date_of_enquiry", type="date", required="required", description="Date of Enquiry"),
     *      @Parameter("enquiry_type_id", type="integer", required="required", description="Type of Enquiry"),
     *      @Parameter("enquiry_source_id", type="integer", required="required", description="Source of Enquiry"),
     *      @Parameter("remarks", type="text", required="required", description="Remarks")
     * })
     * @return Response
     */
    public function update($uuid, EnquiryRequest $request)
    {
        $this->authorize('update', Enquiry::class);

        $enquiry = $this->repo->findByUuidOrFail($uuid);

        $enquiry = $this->repo->update($enquiry, $this->request->all());

        return $this->success(['message' => trans('reception.enquiry_updated')]);
    }

    /**
     * Used to delete Enquiry
     * @delete ("/api/enquiry/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Enquiry"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Enquiry::class);

        $enquiry = $this->repo->findByUuidOrFail($uuid);

        $this->repo->delete($enquiry);

        return $this->success(['message' => trans('reception.enquiry_deleted')]);
    }

    /**
     * Used to delete Enquiry follow up
     * @delete ("/api/enquiry/{uuid}/follow/up/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Enquiry"),
     *      @Parameter("id", type="integer", required="true", description="Id of Follow Up"),
     * })
     * @return Response
     */
    public function destroyFollowUp($uuid, $id)
    {
        $this->authorize('update', Enquiry::class);

        $enquiry = $this->repo->findByUuidOrFail($uuid);

        $this->repo->deleteFollowUp($enquiry, $id);

        return $this->success(['message' => trans('reception.follow_up_deleted')]);
    }
}
