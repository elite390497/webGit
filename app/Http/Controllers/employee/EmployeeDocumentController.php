<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Http\Request;
use App\Models\Employee\Employee;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Employee\EmployeeDocumentRequest;
use App\Repositories\Employee\EmployeeDocumentRepository;

class EmployeeDocumentController extends Controller
{
    protected $request;
    protected $repo;
    protected $employee;
    protected $upload;
    protected $module = 'employee_document';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        EmployeeDocumentRepository $repo,
        EmployeeRepository $employee,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->employee = $employee;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/employee/{uuid}/document/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('update', Employee::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all employee documents
     * @get ("/api/employee/{uuid}/document")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     * })
     * @return Response
     */
    public function index($uuid)
    {
        $this->authorize('list', Employee::class);

        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        return $this->ok($this->repo->paginate($employee->id, $this->request->all()));
    }

    /**
     * Used to store employee document
     * @post ("/api/employee/{uuid}/document")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("title", type="string", required="true", description="Title of Document"),
     *      @Parameter("employee_document_type_id", type="integer", required="true", description="Title of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Document")
     * })
     * @return Response
     */
    public function store(EmployeeDocumentRequest $request, $uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_document = $this->repo->create($employee->id, $this->request->all());

        return $this->success(['message' => trans('employee.document_added')]);
    }

    /**
     * Used to get Employee Document detail
     * @get ("/api/employee/{uuid}/document/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee, 1);

        $this->authorize('update', Employee::class);

        $employee_document = $this->repo->findOrFail($employee->id, $id);

        $documents = $this->upload->getAttachment($this->module, $employee_document->id);

        return $this->success(compact('employee_document', 'documents'));
    }

    /**
     * Used to update Employee Document
     * @patch ("/api/employee/{uuid}/document/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     *      @Parameter("title", type="string", required="true", description="Title of Document"),
     *      @Parameter("employee_document_type_id", type="integer", required="true", description="Title of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Document")
     * })
     * @return Response
     */
    public function update(EmployeeDocumentRequest $request, $uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_document = $this->repo->findOrFail($employee->id, $id);

        $employee_document = $this->repo->update($employee_document, $this->request->all());

        return $this->success(['message' => trans('employee.document_updated')]);
    }

    /**
     * Used to delete Employee Document
     * @delete ("/api/employee/{uuid}/document/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_document = $this->repo->findOrFail($employee->id, $id);

        $this->upload->delete($this->module, $employee_document->id);

        $this->repo->delete($employee_document);

        return $this->success(['message' => trans('employee.document_deleted')]);
    }

    /**
     * Used to download Employee Document
     * @get ("/employee/{uuid}/download/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Employee"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $id, $attachment_uuid)
    {
        $employee = $this->employee->findByUuidOrFail($uuid);

        $this->employee->isAccessible($employee);

        $this->authorize('update', Employee::class);

        $employee_document = $this->repo->findOrFail($employee->id, $id);

        $attachment = $this->upload->getAttachment($this->module, $employee_document->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
