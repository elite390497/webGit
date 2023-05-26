<?php

namespace App\Http\Controllers\Configuration\Misc;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Misc\CategoryRequest;
use App\Repositories\Configuration\Misc\CategoryRepository;

class CategoryController extends Controller
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
        CategoryRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Categories
     * @get ("/api/category")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Categories
     * @post ("/api/misc/category/print")
     * @return Response
     */
    public function print()
    {
        $categories = $this->repo->print(request('filter'));

        return view('print.configuration.misc.category', compact('categories'))->render();
    }

    /**
     * Used to generate pdf all Categories
     * @post ("/api/misc/category/pdf")
     * @return Response
     */
    public function pdf()
    {
        $categories = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.misc.category', compact('categories'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Category
     * @post ("/api/category")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Category"),
     *      @Parameter("description", type="text", required="optional", description="Description of Category")
     * })
     * @return Response
     */
    public function store(CategoryRequest $request)
    {
        $category = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('misc.category_added')]);
    }

    /**
     * Used to get Category detail
     * @get ("/api/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Category"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Category
     * @patch ("/api/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Category"),
     *      @Parameter("name", type="string", required="true", description="Name of Category"),
     *      @Parameter("description", type="text", required="optional", description="Description of Category")
     * })
     * @return Response
     */
    public function update($id, CategoryRequest $request)
    {
        $category = $this->repo->findOrFail($id);

        $category = $this->repo->update($category, $this->request->all());

        return $this->success(['message' => trans('misc.category_updated')]);
    }

    /**
     * Used to delete Category
     * @delete ("/api/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Category"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $category = $this->repo->findOrFail($id);

        $this->repo->delete($category);

        return $this->success(['message' => trans('misc.category_deleted')]);
    }
}
