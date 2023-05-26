<?php

namespace App\Http\Controllers\Calendar;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Calendar\Holiday;
use App\Http\Controllers\Controller;
use App\Http\Requests\Calendar\HolidayRequest;
use App\Repositories\Calendar\HolidayRepository;

class HolidayController extends Controller
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
        HolidayRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get all Holidays
     * @get ("/api/holiday")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Holiday::class);

        $existing_holidays = $this->repo->getExistingHolidays();

        $holidays = $this->repo->paginate($this->request->all());

        return $this->success(compact('holidays', 'existing_holidays'));
    }

    /**
     * Used to print all Holidays
     * @post ("/api/holiday/print")
     * @return Response
     */
    public function print()
    {
        $holidays = $this->repo->print(request('filter'));

        return view('print.calendar.holiday', compact('holidays'))->render();
    }

    /**
     * Used to generate pdf all Holidays
     * @post ("/api/holiday/pdf")
     * @return Response
     */
    public function pdf()
    {
        $holidays = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.calendar.holiday', compact('holidays'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Holiday
     * @post ("/api/holiday")
     * @param ({
     *      @Parameter("dates", type="array", required="true", description="Array of Dates"),
     *      @Parameter("description", type="text", required="optional", description="Description of Holiday")
     * })
     * @return Response
     */
    public function store(HolidayRequest $request)
    {
        $this->authorize('create', Holiday::class);

        $holiday = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('calendar.holiday_added')]);
    }

    /**
     * Used to get Holiday detail
     * @get ("/api/holiday/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Holiday"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Holiday::class);

        $holiday = $this->repo->findOrFail($id);

        $existing_holidays = $this->repo->getExistingHolidays();

        return $this->success(compact('holiday', 'existing_holidays'));
    }

    /**
     * Used to update Holiday
     * @patch ("/api/holiday/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Holiday"),
     *      @Parameter("dates", type="array", required="true", description="Array of Dates"),
     *      @Parameter("description", type="text", required="optional", description="Description of Holiday")
     * })
     * @return Response
     */
    public function update($id, HolidayRequest $request)
    {
        $this->authorize('update', Holiday::class);

        $holiday = $this->repo->findOrFail($id);

        $holiday = $this->repo->update($holiday, $this->request->all());

        return $this->success(['message' => trans('calendar.holiday_updated')]);
    }

    /**
     * Used to delete Holiday
     * @delete ("/api/holiday/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Holiday"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Holiday::class);

        $holiday = $this->repo->findOrFail($id);

        $this->repo->delete($holiday);

        return $this->success(['message' => trans('calendar.holiday_deleted')]);
    }
}
