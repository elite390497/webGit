<?php

namespace App\Http\Controllers\Student;

use Illuminate\Http\Request;
use App\Models\Student\Student;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Student\StudentRepository;
use App\Http\Requests\Student\StudentDocumentRequest;
use App\Repositories\Student\StudentDocumentRepository;

class StudentDocumentController extends Controller
{
    protected $request;
    protected $repo;
    protected $student;
    protected $upload;
    protected $module = 'student_document';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        StudentDocumentRepository $repo,
        StudentRepository $student,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->student = $student;
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/student/{uuid}/document/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('update', Student::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all student documents
     * @get ("/api/student/{uuid}/document")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     * })
     * @return Response
     */
    public function index($uuid)
    {
        $this->authorize('list', Student::class);

        $student = $this->student->findByUuidOrFail($uuid);

        return $this->ok($this->repo->paginate($student->id, $this->request->all()));
    }

    /**
     * Used to store student document
     * @post ("/api/student/{uuid}/document")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("title", type="string", required="true", description="Title of Document"),
     *      @Parameter("student_document_type_id", type="integer", required="true", description="Title of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Document")
     * })
     * @return Response
     */
    public function store(StudentDocumentRequest $request, $uuid)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_document = $this->repo->create($student->id, $this->request->all());

        return $this->success(['message' => trans('student.document_added')]);
    }

    /**
     * Used to get Student Document detail
     * @get ("/api/student/{uuid}/document/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_document = $this->repo->findOrFail($student->id, $id);

        $documents = $this->upload->getAttachment($this->module, $student_document->id);

        return $this->success(compact('student_document', 'documents'));
    }

    /**
     * Used to update Student Document
     * @patch ("/api/student/{uuid}/document/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     *      @Parameter("title", type="string", required="true", description="Title of Document"),
     *      @Parameter("student_document_type_id", type="integer", required="true", description="Title of Document"),
     *      @Parameter("description", type="text", required="optional", description="Description of Document")
     * })
     * @return Response
     */
    public function update(StudentDocumentRequest $request, $uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_document = $this->repo->findOrFail($student->id, $id);

        $student_document = $this->repo->update($student_document, $this->request->all());

        return $this->success(['message' => trans('student.document_updated')]);
    }

    /**
     * Used to delete Student Document
     * @delete ("/api/student/{uuid}/document/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_document = $this->repo->findOrFail($student->id, $id);

        $this->upload->delete($this->module, $student_document->id);

        $this->repo->delete($student_document);

        return $this->success(['message' => trans('student.document_deleted')]);
    }

    /**
     * Used to download Student Document
     * @get ("/student/{uuid}/download/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $id, $attachment_uuid)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_document = $this->repo->findOrFail($student->id, $id);

        $attachment = $this->upload->getAttachment($this->module, $student_document->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
