<?php

namespace App\Http\Controllers\Configuration\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Academic\CertificateTemplateRequest;
use App\Repositories\Configuration\Academic\CertificateTemplateRepository;

class CertificateTemplateController extends Controller
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
        CertificateTemplateRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/academic/certificate/template/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Certificate Templates
     * @get ("/api/academic/certificate/template")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Certificate Templates
     * @post ("/api/academic/certificate/template/print")
     * @return Response
     */
    public function print()
    {
        $certificate_templates = $this->repo->print(request('filter'));

        return view('print.academic.certificate-template', compact('certificate_templates'))->render();
    }

    /**
     * Used to generate pdf all Certificate Templates
     * @post ("/api/academic/certificate/template/pdf")
     * @return Response
     */
    public function pdf()
    {
        $certificate_templates = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.certificate-template', compact('certificate_templates'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Certificate Template
     * @post ("/api/academic/certificate/template")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Certificate Template"),
     *      @Parameter("type", type="string", required="true", description="Type of Certificate Template"),
     *      @Parameter("body", type="string", required="true", description="Body of Certificate Template")
     * })
     * @return Response
     */
    public function store(CertificateTemplateRequest $request)
    {
        $certificate_template = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.certificate_template_added')]);
    }

    /**
     * Used to get Certificate Template detail
     * @get ("/api/academic/certificate/template/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Certificate Template"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Certificate Template
     * @patch ("/api/academic/certificate/template/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Certificate Template"),
     *      @Parameter("name", type="string", required="true", description="Name of Certificate Template"),
     *      @Parameter("type", type="string", required="true", description="Type of Certificate Template"),
     *      @Parameter("body", type="string", required="true", description="Body of Certificate Template")
     * })
     * @return Response
     */
    public function update($id, CertificateTemplateRequest $request)
    {
        $certificate_template = $this->repo->findOrFail($id);

        $certificate_template = $this->repo->update($certificate_template, $this->request->all());

        return $this->success(['message' => trans('academic.certificate_template_updated')]);
    }

    /**
     * Used to delete Certificate Template
     * @delete ("/api/academic/certificate/template/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Certificate Template"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $certificate_template = $this->repo->deletable($id);

        $this->repo->delete($certificate_template);

        return $this->success(['message' => trans('academic.certificate_template_deleted')]);
    }
}