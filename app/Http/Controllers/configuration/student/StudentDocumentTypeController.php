<?php

namespace App\Http\Controllers\Configuration\Student;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Student\StudentDocumentTypeRequest;
use App\Repositories\Configuration\Student\StudentDocumentTypeRepository;

class StudentDocumentTypeController extends Controller
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
        StudentDocumentTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Student Document Types
     * @get ("/api/student/document/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Student Document Types
     * @post ("/api/student/document/type/print")
     * @return Response
     */
    public function print()
    {
        $student_document_types = $this->repo->print(request('filter'));

        return view('print.configuration.student.document-type', compact('student_document_types'))->render();
    }

    /**
     * Used to generate pdf all Student Document Types
     * @post ("/api/student/document/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $student_document_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.student.document-type', compact('student_document_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Student Document Type
     * @post ("/api/student/document/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Student Document Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Student Document Type")
     * })
     * @return Response
     */
    public function store(StudentDocumentTypeRequest $request)
    {
        $student_document_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('student.document_type_added')]);
    }

    /**
     * Used to get Student Document Type detail
     * @get ("/api/student/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Student Document Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Student Document Type
     * @patch ("/api/student/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Student Document Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Student Document Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Student Document Type")
     * })
     * @return Response
     */
    public function update($id, StudentDocumentTypeRequest $request)
    {
        $student_document_type = $this->repo->findOrFail($id);

        $student_document_type = $this->repo->update($student_document_type, $this->request->all());

        return $this->success(['message' => trans('student.document_type_updated')]);
    }

    /**
     * Used to delete Student Document Type
     * @delete ("/api/student/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Student Document Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $student_document_type = $this->repo->deletable($id);

        $this->repo->delete($student_document_type);

        return $this->success(['message' => trans('student.document_type_deleted')]);
    }
}
