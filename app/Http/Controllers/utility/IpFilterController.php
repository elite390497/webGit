<?php

namespace App\Http\Controllers\Utility;

use Illuminate\Http\Request;
use App\Http\Requests\Utility\IpFilterRequest;
use App\Repositories\Utility\IpFilterRepository;
use App\Http\Controllers\Controller;

class IpFilterController extends Controller
{
    protected $request;
    protected $repo;
    protected $module = 'ip_filter';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        IpFilterRepository $repo
    ) {
        $this->request  = $request;
        $this->repo     = $repo;

        $this->middleware('permission:access-configuration');
        $this->middleware('feature.available:ip_filter');
        $this->middleware('prohibited.test.mode')->only(['store','update']);
    }

    /**
     * Used to get all IP filters
     * @get ("/api/ip-filter")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }
    
    /**
     * Used to store IP Filter
     * @post ("/api/ip-filter")
     * @param ({
     *      @Parameter("start_ip", type="ip", required="true", description="Start IP Range"),
     *      @Parameter("end_ip", type="ip", required="true", description="End IP Range"),
     * })
     * @return Response
     */
    public function store(IpFilterRequest $request)
    {
        $ip_filter = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('utility.ip_filter_added')]);
    }

    /**
     * Used to get IP Filter detail
     * @get ("/api/ip-filter/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of IP Filter to be shown"),
     * })
     * @return Response download
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update IP Filter
     * @patch ("/api/ip-filter")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of IP Filter to be updated"),
     *      @Parameter("start_ip", type="ip", required="true", description="Start IP Range"),
     *      @Parameter("end_ip", type="ip", required="true", description="End IP Range"),
     * })
     * @return Response
     */
    public function update(IpFilterRequest $request, $id)
    {
        $ip_filter = $this->repo->findOrFail($id);

        $ip_filter = $this->repo->update($ip_filter, $this->request->all());

        return $this->success(['message' => trans('utility.ip_filter_updated')]);
    }

    /**
     * Used to delete IP Filter
     * @delete ("/api/ip-filter")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of IP Filter to be deleted"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $ip_filter = $this->repo->findOrFail($id);

        $this->repo->delete($ip_filter);

        return $this->success(['message' => trans('utility.ip_filter_deleted')]);
    }
}
