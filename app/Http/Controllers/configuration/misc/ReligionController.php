<?php

namespace App\Http\Controllers\Configuration\Misc;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Misc\ReligionRequest;
use App\Repositories\Configuration\Misc\ReligionRepository;

class ReligionController extends Controller
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
        ReligionRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Religions
     * @get ("/api/religion")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Religions
     * @post ("/api/misc/religion/print")
     * @return Response
     */
    public function print()
    {
        $religions = $this->repo->print(request('filter'));

        return view('print.configuration.misc.religion', compact('religions'))->render();
    }

    /**
     * Used to generate pdf all Religions
     * @post ("/api/misc/religion/pdf")
     * @return Response
     */
    public function pdf()
    {
        $religions = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.misc.religion', compact('religions'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Religion
     * @post ("/api/religion")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Religion"),
     *      @Parameter("description", type="text", required="optional", description="Description of Religion")
     * })
     * @return Response
     */
    public function store(ReligionRequest $request)
    {
        $religion = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('misc.religion_added')]);
    }

    /**
     * Used to get Religion detail
     * @get ("/api/religion/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Religion"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Religion
     * @patch ("/api/religion/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Religion"),
     *      @Parameter("name", type="string", required="true", description="Name of Religion"),
     *      @Parameter("description", type="text", required="optional", description="Description of Religion")
     * })
     * @return Response
     */
    public function update($id, ReligionRequest $request)
    {
        $religion = $this->repo->findOrFail($id);

        $religion = $this->repo->update($religion, $this->request->all());

        return $this->success(['message' => trans('misc.religion_updated')]);
    }

    /**
     * Used to delete Religion
     * @delete ("/api/religion/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Religion"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $religion = $this->repo->findOrFail($id);

        $this->repo->delete($religion);

        return $this->success(['message' => trans('misc.religion_deleted')]);
    }
}
