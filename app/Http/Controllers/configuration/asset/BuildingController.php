<?php

namespace App\Http\Controllers\Configuration\Asset;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Asset\BuildingRequest;
use App\Repositories\Configuration\Asset\BuildingRepository;

class BuildingController extends Controller
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
        BuildingRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Asset Buildings
     * @get ("/api/asset/building")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Asset Buildings
     * @post ("/api/asset/building/print")
     * @return Response
     */
    public function print()
    {
        $buildings = $this->repo->print(request('filter'));

        return view('print.configuration.asset.building', compact('buildings'))->render();
    }

    /**
     * Used to generate pdf all Asset Buildings
     * @post ("/api/asset/building/pdf")
     * @return Response
     */
    public function pdf()
    {
        $buildings = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.asset.building', compact('buildings'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Asset Building
     * @post ("/api/asset/building")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Asset Building"),
     *      @Parameter("description", type="text", required="optional", description="Description of Asset Building")
     * })
     * @return Response
     */
    public function store(BuildingRequest $request)
    {
        $building = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('asset.building_added')]);
    }

    /**
     * Used to get Asset Building detail
     * @get ("/api/asset/building/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Building"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Asset Building
     * @patch ("/api/asset/building/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Asset Building"),
     *      @Parameter("name", type="string", required="true", description="Name of Asset Building"),
     *      @Parameter("description", type="text", required="optional", description="Description of Asset Building")
     * })
     * @return Response
     */
    public function update($id, BuildingRequest $request)
    {
        $building = $this->repo->findOrFail($id);

        $building = $this->repo->update($building, $this->request->all());

        return $this->success(['message' => trans('asset.building_updated')]);
    }

    /**
     * Used to delete Asset Building
     * @delete ("/api/asset/building/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Asset Building"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $building = $this->repo->deletable($id);

        $this->repo->delete($building);

        return $this->success(['message' => trans('asset.building_deleted')]);
    }
}