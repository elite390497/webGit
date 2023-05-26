<?php

namespace App\Http\Controllers\Configuration\Misc;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Misc\BloodGroupRequest;
use App\Repositories\Configuration\Misc\BloodGroupRepository;

class BloodGroupController extends Controller
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
        BloodGroupRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Blood Groups
     * @get ("/api/misc/blood/group")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Blood Groups
     * @post ("/api/misc/blood/group/print")
     * @return Response
     */
    public function print()
    {
        $blood_groups = $this->repo->print(request('filter'));

        return view('print.configuration.misc.blood-group', compact('blood_groups'))->render();
    }

    /**
     * Used to generate pdf all Blood Groups
     * @post ("/api/misc/blood/group/pdf")
     * @return Response
     */
    public function pdf()
    {
        $blood_groups = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.misc.blood-group', compact('blood_groups'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Blood Group
     * @post ("/api/misc/blood/group")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Blood Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Blood Group")
     * })
     * @return Response
     */
    public function store(BloodGroupRequest $request)
    {
        $blood_group = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('misc.blood_group_added')]);
    }

    /**
     * Used to get Blood Group detail
     * @get ("/api/misc/blood/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Blood Group"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Blood Group
     * @patch ("/api/misc/blood/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Blood Group"),
     *      @Parameter("name", type="string", required="true", description="Name of Blood Group"),
     *      @Parameter("description", type="text", required="optional", description="Description of Blood Group")
     * })
     * @return Response
     */
    public function update($id, BloodGroupRequest $request)
    {
        $blood_group = $this->repo->findOrFail($id);

        $blood_group = $this->repo->update($blood_group, $this->request->all());

        return $this->success(['message' => trans('misc.blood_group_updated')]);
    }

    /**
     * Used to delete Blood Group
     * @delete ("/api/misc/blood/group/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Blood Group"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $blood_group = $this->repo->findOrFail($id);

        $this->repo->delete($blood_group);

        return $this->success(['message' => trans('misc.blood_group_deleted')]);
    }
}
