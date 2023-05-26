<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Frontend\Menu;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\MenuRequest;
use App\Repositories\Frontend\MenuRepository;

class MenuController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        MenuRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('frontend.website.enabled');
        $this->middleware('permission:configure-frontend');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/frontend/menu/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Menus
     * @get ("/api/frontend/menu")
     * @return Response
     */
    public function index()
    {
        $menus = $this->repo->get($this->request->all());

        return $this->success(compact('menus'));
    }

    /**
     * Used to reorder all Menus
     * @frontend ("/api/frontend/menu/reorder")
     * @return Response
     */
    public function reorder()
    {
        $this->repo->reorder($this->request->all());

        return $this->success(['message' => trans('frontend.menu_updated')]);
    }

    /**
     * Used to reorder sub menu
     * @frontend ("/api/frontend/menu/{id}/reorder")
     * @return Response
     */
    public function reorderSubMenu($id)
    {
        $menu = $this->repo->findOrFail($id);

        $this->repo->reorderSubMenu($menu, $this->request->all());

        return $this->success(['message' => trans('frontend.menu_updated')]);
    }

    /**
     * Used to print all Menus
     * @frontend ("/api/frontend/menu/print")
     * @return Response
     */
    public function print()
    {
        $menus = $this->repo->print();

        return view('print.frontend.menu', compact('menus'))->render();
    }

    /**
     * Used to generate pdf all Menus
     * @frontend ("/api/frontend/menu/pdf")
     * @return Response
     */
    public function pdf()
    {
        $menus = $this->repo->print();

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.frontend.menu', compact('menus'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Menu
     * @frontend ("/api/frontend/menu")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Menu"),
     *      @Parameter("type", type="string", required="true", description="Type of Menu")
     * })
     * @return Response
     */
    public function store(MenuRequest $request)
    {
        $menu = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('frontend.menu_added')]);
    }

    /**
     * Used to get Menu detail
     * @get ("/api/frontend/menu/{id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Id of Menu"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $menu = $this->repo->findOrFail($id);

        return $this->success(compact('menu'));
    }

    /**
     * Used to update Menu
     * @patch ("/api/frontend/menu/{id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Id of Menu"),
     *      @Parameter("name", type="string", required="true", description="Name of Menu"),
     *      @Parameter("type", type="string", required="true", description="Type of Menu")
     * })
     * @return Response
     */
    public function update($id, MenuRequest $request)
    {
        $menu = $this->repo->findOrFail($id);

        $menu = $this->repo->update($menu, $this->request->all());

        return $this->success(['message' => trans('frontend.menu_updated')]);
    }

    /**
     * Used to delete Menu
     * @delete ("/api/frontend/menu/{id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Id of Menu"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $menu = $this->repo->findOrFail($id);

        $this->repo->delete($menu);

        return $this->success(['message' => trans('frontend.menu_deleted')]);
    }
}
