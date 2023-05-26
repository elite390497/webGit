<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Academic\Certificate;
use App\Http\Requests\Academic\CertificateRequest;
use App\Repositories\Academic\CertificateRepository;

class CertificateController extends Controller
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
        CertificateRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/certificate/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Certificates
     * @get ("/api/certificate")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Certificate::class);

        $certificates = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('certificates', 'filters'));
    }

    /**
     * Used to print all Certificatess
     * @post ("/api/certificate/print")
     * @return Response
     */
    public function print()
    {
        $certificates = $this->repo->print(request('filter'));

        return view('print.academic.certificate', compact('certificates'))->render();
    }

    /**
     * Used to generate pdf all Certificatess
     * @post ("/api/certificate/pdf")
     * @return Response
     */
    public function pdf()
    {
        $certificates = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.certificate', compact('certificates'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Certificate
     * @post ("/api/certificate")
     * @param ({
     *      @Parameter("certificate_template_id", type="integer", required="true", description="Id of Certificate Template"),
     *      @Parameter("student_record_id", type="integer", required="true", description="Id of Student Record"),
     *      @Parameter("employee_id", type="integer", required="true", description="Id of Employee"),
     *      @Parameter("body", type="text", required="true", description="Body of Certificate"),
     *      @Parameter("custom_fields", type="array", required="optional", description="Custom Fields")
     * })
     * @return Response
     */
    public function store(CertificateRequest $request)
    {
        $this->authorize('create', Certificate::class);

        $certificate = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.certificate_added')]);
    }

    /**
     * Used to print Certificate detail
     * @get ("/academic/certificate/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Certificate"),
     * })
     * @return Response
     */
    public function printCertificate($uuid)
    {
        $this->authorize('list', Certificate::class);

        $certificate = $this->repo->findByUuidOrFail($uuid);

        return view('print.academic.selected-certificate',compact('certificate'));
    }

    /**
     * Used to get Certificate detail
     * @get ("/api/certificate/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Certificate"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', Certificate::class);

        $certificate = $this->repo->findByUuidOrFail($uuid);

        return $this->success(compact('certificate'));
    }

    /**
     * Used to update Certificate
     * @patch ("/api/certificate/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Certificate"),
     *      @Parameter("title", type="string", required="true", description="Title of Certificate"),
     *      @Parameter("date_of_certificate", type="date", required="true", description="Date of Certificate"),
     *      @Parameter("description", type="text", required="optional", description="Description of Certificate")
     * })
     * @return Response
     */
    public function update($uuid, CertificateRequest $request)
    {
        $this->authorize('update', Certificate::class);

        $certificate = $this->repo->findByUuidOrFail($uuid);

        $certificate = $this->repo->update($certificate, $this->request->all());

        return $this->success(['message' => trans('academic.certificate_updated')]);
    }

    /**
     * Used to delete Certificate
     * @delete ("/api/certificate/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Certificate"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Certificate::class);

        $certificate = $this->repo->findByUuidOrFail($uuid);

        $this->repo->delete($certificate);

        return $this->success(['message' => trans('academic.certificate_deleted')]);
    }
}