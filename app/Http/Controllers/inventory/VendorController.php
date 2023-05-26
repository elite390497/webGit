<?php

namespace App\Http\Controllers\Inventory;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Inventory\Vendor;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\VendorRequest;
use App\Repositories\Inventory\VendorRepository;

class VendorController extends Controller
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
        VendorRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get all Inventory Vendors
     * @get ("/api/vendor")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Vendor::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Inventory Vendors
     * @post ("/api/vendor/print")
     * @return Response
     */
    public function print()
    {
        $vendors = $this->repo->print(request('filter'));

        return view('print.inventory.vendor', compact('vendors'))->render();
    }

    /**
     * Used to generate pdf all Inventory Vendors
     * @post ("/api/vendor/pdf")
     * @return Response
     */
    public function pdf()
    {
        $vendors = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.inventory.vendor', compact('vendors'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Inventory Vendor
     * @post ("/api/vendor")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Vendor"),
     *      @Parameter("description", type="text", required="true", description="Description of Vendor"),
     * })
     * @return Response
     */
    public function store(VendorRequest $request)
    {
        $this->authorize('create', Vendor::class);

        $vendor = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('inventory.vendor_added')]);
    }

    /**
     * Used to get Inventory Vendor detail
     * @get ("/api/vendor/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Vendor"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Vendor::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Inventory Vendor
     * @patch ("/api/vendor/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Vendor"),
     *      @Parameter("name", type="string", required="true", description="Name of Vendor"),
     *      @Parameter("description", type="text", required="true", description="Description of Vendor"),
     * })
     * @return Response
     */
    public function update($id, VendorRequest $request)
    {
        $this->authorize('update', Vendor::class);

        $vendor = $this->repo->findOrFail($id);

        $vendor = $this->repo->update($vendor, $this->request->all());

        return $this->success(['message' => trans('inventory.vendor_updated')]);
    }

    /**
     * Used to delete Inventory Vendor
     * @delete ("/api/vendor/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Vendor"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Vendor::class);

        $vendor = $this->repo->deletable($id);

        $this->repo->delete($vendor);

        return $this->success(['message' => trans('inventory.vendor_deleted')]);
    }
}