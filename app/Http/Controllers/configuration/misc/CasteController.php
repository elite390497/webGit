<?php

namespace App\Http\Controllers\Configuration\Misc;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Misc\CasteRequest;
use App\Repositories\Configuration\Misc\CasteRepository;

class CasteController extends Controller
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
        CasteRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Castes
     * @get ("/api/misc/caste")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Castes
     * @post ("/api/misc/caste/print")
     * @return Response
     */
    public function print()
    {
        $castes = $this->repo->print(request('filter'));

        return view('print.configuration.misc.caste', compact('castes'))->render();
    }

    /**
     * Used to generate pdf all Castes
     * @post ("/api/misc/caste/pdf")
     * @return Response
     */
    public function pdf()
    {
        $castes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.misc.caste', compact('castes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Caste
     * @post ("/api/misc/caste")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Caste"),
     *      @Parameter("description", type="text", required="optional", description="Description of Caste")
     * })
     * @return Response
     */
    public function store(CasteRequest $request)
    {
        $caste = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('misc.caste_added')]);
    }

    /**
     * Used to get Caste detail
     * @get ("/api/misc/caste/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Caste"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Caste
     * @patch ("/api/misc/caste/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Caste"),
     *      @Parameter("name", type="string", required="true", description="Name of Caste"),
     *      @Parameter("description", type="text", required="optional", description="Description of Caste")
     * })
     * @return Response
     */
    public function update($id, CasteRequest $request)
    {
        $caste = $this->repo->findOrFail($id);

        $caste = $this->repo->update($caste, $this->request->all());

        return $this->success(['message' => trans('misc.caste_updated')]);
    }

    /**
     * Used to delete Caste
     * @delete ("/api/misc/caste/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Caste"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $caste = $this->repo->findOrFail($id);

        $this->repo->delete($caste);

        return $this->success(['message' => trans('misc.caste_deleted')]);
    }
}
