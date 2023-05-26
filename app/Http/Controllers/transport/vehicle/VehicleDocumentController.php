<?php

namespace App\Http\Controllers\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Models\Transport\Vehicle\VehicleDocument;
use App\Http\Requests\Transport\Vehicle\VehicleDocumentRequest;
use App\Repositories\Transport\Vehicle\VehicleDocumentRepository;

class VehicleDocumentController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'vehicle_document';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        VehicleDocumentRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/vehicle/document/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', VehicleDocument::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Vehicle Documents
     * @get ("/api/vehicle/document")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', VehicleDocument::class);

        $vehicle_documents = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('vehicle_documents', 'filters'));
    }

    /**
     * Used to print all Vehicle Documents
     * @post ("/api/vehicle/document/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_documents = $this->repo->print(request('filter'));

        return view('print.transport.vehicle.document', compact('vehicle_documents'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Documents
     * @post ("/api/vehicle/document/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_documents = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.transport.vehicle.document', compact('vehicle_documents'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Document
     * @post ("/api/vehicle/document")
     * @param ({
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("title", type="string", required="true", description="Title of Vehicle Document"),
     *      @Parameter("vehicle_document_type_id", type="integer", required="true", description="Document Type Id"),
     *      @Parameter("date_of_expiry", type="date", required="optional", description="Date of Expiry of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Document")
     * })
     * @return Response
     */
    public function store(VehicleDocumentRequest $request)
    {
        $this->authorize('create', VehicleDocument::class);

        $vehicle_document = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_document_added')]);
    }

    /**
     * Used to get Vehicle Document detail
     * @get ("/api/vehicle/document/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Document"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', VehicleDocument::class);

        $vehicle_document = $this->repo->findOrFail($id);

        $documents = $this->upload->getAttachment($this->module, $vehicle_document->id);

        return $this->success(compact('vehicle_document', 'documents'));
    }

    /**
     * Used to update Vehicle Document
     * @patch ("/api/vehicle/document/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Document"),
     *      @Parameter("vehicle_id", type="integer", required="true", description="Id of Vehicle"),
     *      @Parameter("title", type="string", required="true", description="Title of Vehicle Document"),
     *      @Parameter("vehicle_document_type_id", type="integer", required="true", description="Document Type Id"),
     *      @Parameter("date_of_expiry", type="date", required="optional", description="Date of Expiry of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Document")
     * })
     * @return Response
     */
    public function update($id, VehicleDocumentRequest $request)
    {
        $this->authorize('update', VehicleDocument::class);

        $vehicle_document = $this->repo->findOrFail($id);

        $vehicle_document = $this->repo->update($vehicle_document, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_document_updated')]);
    }

    /**
     * Used to delete Vehicle Document
     * @delete ("/api/vehicle/document/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', VehicleDocument::class);

        $vehicle_document = $this->repo->deletable($id);

        $this->upload->delete($this->module, $vehicle_document->id);

        $this->repo->delete($vehicle_document);

        return $this->success(['message' => trans('transport.vehicle_document_deleted')]);
    }

    /**
     * Used to download Vehicle Documents
     * @get ("/finance/transport/vehicle/document/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Document"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($id, $attachment_uuid)
    {
        $this->authorize('list', VehicleDocument::class);

        $vehicle_document = $this->repo->findOrFail($id);

        $attachment = $this->upload->getAttachment($this->module, $vehicle_document->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
