<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\EmployeeDocumentTypeRequest;
use App\Repositories\Configuration\Employee\EmployeeDocumentTypeRepository;

class EmployeeDocumentTypeController extends Controller
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
        EmployeeDocumentTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Employee Document Types
     * @get ("/api/employee/document/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Employee Document Types
     * @post ("/api/employee/document/type/print")
     * @return Response
     */
    public function print()
    {
        $employee_document_types = $this->repo->print(request('filter'));

        return view('print.configuration.employee.document-type', compact('employee_document_types'))->render();
    }

    /**
     * Used to generate pdf all Employee Document Types
     * @post ("/api/employee/document/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $employee_document_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.document-type', compact('employee_document_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Employee Document Type
     * @post ("/api/employee/document/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Employee Document Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Document Type")
     * })
     * @return Response
     */
    public function store(EmployeeDocumentTypeRequest $request)
    {
        $employee_document_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.document_type_added')]);
    }

    /**
     * Used to get Employee Document Type detail
     * @get ("/api/employee/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Document Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Employee Document Type
     * @patch ("/api/employee/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Document Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Employee Document Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Document Type")
     * })
     * @return Response
     */
    public function update($id, EmployeeDocumentTypeRequest $request)
    {
        $employee_document_type = $this->repo->findOrFail($id);

        $employee_document_type = $this->repo->update($employee_document_type, $this->request->all());

        return $this->success(['message' => trans('employee.document_type_updated')]);
    }

    /**
     * Used to delete Employee Document Type
     * @delete ("/api/employee/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Document Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $employee_document_type = $this->repo->deletable($id);

        $this->repo->delete($employee_document_type);

        return $this->success(['message' => trans('employee.document_type_deleted')]);
    }
}
