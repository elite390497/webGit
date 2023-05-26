<?php

namespace App\Http\Controllers\Institute;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Models\Institute\InstituteDocument;
use App\Http\Requests\Institute\InstituteDocumentRequest;
use App\Repositories\Institute\InstituteDocumentRepository;

class InstituteDocumentController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'institute_document';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        InstituteDocumentRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/institute/document/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', InstituteDocument::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Institute Documents
     * @get ("/api/institute/document")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', InstituteDocument::class);

        $institute_documents = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('institute_documents', 'filters'));
    }

    /**
     * Used to print all Institute Documents
     * @post ("/api/institute/document/print")
     * @return Response
     */
    public function print()
    {
        $institute_documents = $this->repo->print(request('filter'));

        return view('print.institute.document', compact('institute_documents'))->render();
    }

    /**
     * Used to generate pdf all Institute Documents
     * @post ("/api/institute/document/pdf")
     * @return Response
     */
    public function pdf()
    {
        $institute_documents = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.institute.document', compact('institute_documents'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Institute Document
     * @post ("/api/institute/document")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Institute Document"),
     *      @Parameter("date_of_expiry", type="date", required="optional", description="Date of Expiry of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Institute Document")
     * })
     * @return Response
     */
    public function store(InstituteDocumentRequest $request)
    {
        $this->authorize('create', InstituteDocument::class);

        $institute_document = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('institute.document_added')]);
    }

    /**
     * Used to get Institute Document detail
     * @get ("/api/institute/document/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Institute Document"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', InstituteDocument::class);

        $institute_document = $this->repo->findOrFail($id);

        $documents = $this->upload->getAttachment($this->module, $institute_document->id);

        return $this->success(compact('institute_document', 'documents'));
    }

    /**
     * Used to update Institute Document
     * @patch ("/api/institute/document/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Institute Document"),
     *      @Parameter("title", type="string", required="true", description="Title of Institute Document"),
     *      @Parameter("date_of_expiry", type="date", required="optional", description="Date of Expiry of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Institute Document")
     * })
     * @return Response
     */
    public function update($id, InstituteDocumentRequest $request)
    {
        $this->authorize('update', InstituteDocument::class);

        $institute_document = $this->repo->findOrFail($id);

        $institute_document = $this->repo->update($institute_document, $this->request->all());

        return $this->success(['message' => trans('institute.document_updated')]);
    }

    /**
     * Used to delete Institute Document
     * @delete ("/api/institute/document/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', InstituteDocument::class);

        $institute_document = $this->repo->deletable($id);

        $this->upload->delete($this->module, $institute_document->id);

        $this->repo->delete($institute_document);

        return $this->success(['message' => trans('institute.document_deleted')]);
    }

    /**
     * Used to download Institute Documents
     * @get ("/institute/document/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Institute Document"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($id, $attachment_uuid)
    {
        $this->authorize('list', InstituteDocument::class);

        $institute_document = $this->repo->findOrFail($id);

        $attachment = $this->upload->getAttachment($this->module, $institute_document->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}