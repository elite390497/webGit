<?php

namespace App\Http\Controllers\Configuration\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Academic\InstituteRequest;
use App\Repositories\Configuration\Academic\InstituteRepository;

class InstituteController extends Controller
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
        InstituteRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Institutes
     * @get ("/api/academic/institute")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Institutes
     * @post ("/api/academic/institute/print")
     * @return Response
     */
    public function print()
    {
        $institutes = $this->repo->print(request('filter'));

        return view('print.academic.institute', compact('institutes'))->render();
    }

    /**
     * Used to generate pdf all Institutes
     * @post ("/api/academic/institute/pdf")
     * @return Response
     */
    public function pdf()
    {
        $institutes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.institute', compact('institutes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Institute
     * @post ("/api/academic/institute")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Institute")
     * })
     * @return Response
     */
    public function store(InstituteRequest $request)
    {
        $institute = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.institute_added')]);
    }

    /**
     * Used to get Institute detail
     * @get ("/api/academic/institute/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Institute"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Institute
     * @patch ("/api/academic/institute/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Institute"),
     *      @Parameter("name", type="string", required="true", description="Name of Institute")
     * })
     * @return Response
     */
    public function update($id, InstituteRequest $request)
    {
        $institute = $this->repo->findOrFail($id);

        $institute = $this->repo->update($institute, $this->request->all());

        return $this->success(['message' => trans('academic.institute_updated')]);
    }

    /**
     * Used to delete Institute
     * @delete ("/api/academic/institute/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Institute"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $institute = $this->repo->deletable($id);

        $this->repo->delete($institute);

        return $this->success(['message' => trans('academic.institute_deleted')]);
    }
}
