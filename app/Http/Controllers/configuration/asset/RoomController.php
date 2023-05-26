<?php

namespace App\Http\Controllers\Configuration\Asset;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Asset\RoomRequest;
use App\Repositories\Configuration\Asset\RoomRepository;

class RoomController extends Controller
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
        RoomRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/asset/room/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Asset Rooms
     * @get ("/api/asset/room")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Asset Rooms
     * @post ("/api/asset/room/print")
     * @return Response
     */
    public function print()
    {
        $rooms = $this->repo->print(request('filter'));

        return view('print.configuration.asset.room', compact('rooms'))->render();
    }

    /**
     * Used to generate pdf all Asset Rooms
     * @post ("/api/asset/room/pdf")
     * @return Response
     */
    public function pdf()
    {
        $rooms = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.asset.room', compact('rooms'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Asset Room
     * @post ("/api/asset/room")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Asset Room"),
     *      @Parameter("description", type="text", required="optional", description="Description of Asset Room")
     * })
     * @return Response
     */
    public function store(RoomRequest $request)
    {
        $room = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('asset.room_added')]);
    }

    /**
     * Used to get Asset Room detail
     * @get ("/api/asset/room/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Room"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $room = $this->repo->findOrFail($id);
        $selected_building = ['id' => $room->building_id, 'name' => $room->building->name];
        return $this->success(compact('room', 'selected_building'));
    }

    /**
     * Used to update Asset Room
     * @patch ("/api/asset/room/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Asset Room"),
     *      @Parameter("name", type="string", required="true", description="Name of Asset Room"),
     *      @Parameter("description", type="text", required="optional", description="Description of Asset Room")
     * })
     * @return Response
     */
    public function update($id, RoomRequest $request)
    {
        $room = $this->repo->findOrFail($id);

        $room = $this->repo->update($room, $this->request->all());

        return $this->success(['message' => trans('asset.room_updated')]);
    }

    /**
     * Used to delete Asset Room
     * @delete ("/api/asset/room/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Asset Room"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $room = $this->repo->deletable($id);

        $this->repo->delete($room);

        return $this->success(['message' => trans('asset.room_deleted')]);
    }
}