<?php

namespace App\Http\Controllers\Configuration\Transport\Vehicle;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Transport\Vehicle\VehicleDocumentTypeRequest;
use App\Repositories\Configuration\Transport\Vehicle\VehicleDocumentTypeRepository;

class VehicleDocumentTypeController extends Controller
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
        VehicleDocumentTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Vehicle Document Types
     * @get ("/api/transport/vehicle/document/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Vehicle Document Types
     * @post ("/api/transport/vehicle/document/type/print")
     * @return Response
     */
    public function print()
    {
        $vehicle_document_types = $this->repo->print(request('filter'));

        return view('print.configuration.transport.vehicle.document-type', compact('vehicle_document_types'))->render();
    }

    /**
     * Used to generate pdf all Vehicle Document Types
     * @post ("/api/transport/vehicle/document/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vehicle_document_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.transport.vehicle.document-type', compact('vehicle_document_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Vehicle Document Type
     * @post ("/api/transport/vehicle/document/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle Document Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Document Type")
     * })
     * @return Response
     */
    public function store(VehicleDocumentTypeRequest $request)
    {
        $vehicle_document_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('transport.vehicle_document_type_added')]);
    }

    /**
     * Used to get Vehicle Document Type detail
     * @get ("/api/transport/vehicle/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Document Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Vehicle Document Type
     * @patch ("/api/transport/vehicle/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Document Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Vehicle Document Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Vehicle Document Type")
     * })
     * @return Response
     */
    public function update($id, VehicleDocumentTypeRequest $request)
    {
        $vehicle_document_type = $this->repo->findOrFail($id);

        $vehicle_document_type = $this->repo->update($vehicle_document_type, $this->request->all());

        return $this->success(['message' => trans('transport.vehicle_document_type_updated')]);
    }

    /**
     * Used to delete Vehicle Document Type
     * @delete ("/api/transport/vehicle/document/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Vehicle Document Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $vehicle_document_type = $this->repo->deletable($id);

        $this->repo->delete($vehicle_document_type);

        return $this->success(['message' => trans('transport.vehicle_document_type_deleted')]);
    }
}
