<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Academic\ClassTiming;
use App\Http\Requests\Academic\ClassTimingRequest;
use App\Repositories\Academic\ClassTimingRepository;

class ClassTimingController extends Controller
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
        ClassTimingRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get all Class Timings
     * @get ("/api/academic/class/timing")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', ClassTiming::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Class Timings
     * @post ("/api/class/timing/print")
     * @return Response
     */
    public function print()
    {
        $class_timings = $this->repo->print(request('filter'));

        $filter = request('filter');

        return view('print.academic.class-timing', compact('class_timings', 'filter'))->render();
    }

    /**
     * Used to generate pdf all Class Timings
     * @post ("/api/class/timing/pdf")
     * @return Response
     */
    public function pdf()
    {
        $class_timings = $this->repo->print(request('filter'));

        $filter = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.academic.class-timing', compact('class_timings', 'filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Class Timing
     * @post ("/api/class/timing")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of ClassTiming"),
     *      @Parameter("description", type="text", required="optional", description="Description of ClassTiming")
     * })
     * @return Response
     */
    public function store(ClassTimingRequest $request)
    {
        $this->authorize('create', ClassTiming::class);

        $class_timing = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('academic.class_timing_added')]);
    }

    /**
     * Used to get Class Timing detail
     * @get ("/api/class/timing/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Class Timing"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', ClassTiming::class);

        return $this->ok($this->repo->findByUuidOrFail($uuid));
    }

    /**
     * Used to update Class Timing
     * @patch ("/api/class/timing/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Class Timing"),
     *      @Parameter("name", type="string", required="true", description="Name of ClassTiming"),
     *      @Parameter("description", type="text", required="optional", description="Description of ClassTiming")
     * })
     * @return Response
     */
    public function update($uuid, ClassTimingRequest $request)
    {
        $this->authorize('update', ClassTiming::class);

        $class_timing = $this->repo->findByUuidOrFail($uuid);

        $class_timing = $this->repo->update($class_timing, $this->request->all());

        return $this->success(['message' => trans('academic.class_timing_updated')]);
    }

    /**
     * Used to delete Class Timing
     * @delete ("/api/class/timing/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Class Timing"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', ClassTiming::class);

        $class_timing = $this->repo->deletable($uuid);

        $this->repo->delete($class_timing);

        return $this->success(['message' => trans('academic.class_timing_deleted')]);
    }
}
