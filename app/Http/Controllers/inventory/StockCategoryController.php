<?php

namespace App\Http\Controllers\Inventory;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Inventory\StockCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StockCategoryRequest;
use App\Repositories\Inventory\StockCategoryRepository;

class StockCategoryController extends Controller
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
        StockCategoryRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get all Inventory Stock Categories
     * @get ("/api/stock/category")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', StockCategory::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Inventory Stock Categories
     * @post ("/api/stock/category/print")
     * @return Response
     */
    public function print()
    {
        $stock_categories = $this->repo->print(request('filter'));

        return view('print.inventory.stock-category', compact('stock_categories'))->render();
    }

    /**
     * Used to generate pdf all Inventory Stock Categories
     * @post ("/api/stock/category/pdf")
     * @return Response
     */
    public function pdf()
    {
        $stock_categories = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.inventory.stock-category', compact('stock_categories'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Inventory Stock Category
     * @post ("/api/stock/category")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Stock Category"),
     *      @Parameter("description", type="text", required="true", description="Description of Stock Category"),
     * })
     * @return Response
     */
    public function store(StockCategoryRequest $request)
    {
        $this->authorize('create', StockCategory::class);

        $stock_category = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('inventory.stock_category_added')]);
    }

    /**
     * Used to get Inventory Stock Category detail
     * @get ("/api/stock/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Stock Category"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', StockCategory::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Inventory Stock Category
     * @patch ("/api/stock/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Stock Category"),
     *      @Parameter("name", type="string", required="true", description="Name of Stock Category"),
     *      @Parameter("description", type="text", required="true", description="Description of Stock Category"),
     * })
     * @return Response
     */
    public function update($id, StockCategoryRequest $request)
    {
        $this->authorize('update', StockCategory::class);

        $stock_category = $this->repo->findOrFail($id);

        $stock_category = $this->repo->update($stock_category, $this->request->all());

        return $this->success(['message' => trans('inventory.stock_category_updated')]);
    }

    /**
     * Used to delete Inventory Stock Category
     * @delete ("/api/stock/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Stock Category"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', StockCategory::class);

        $stock_category = $this->repo->deletable($id);

        $this->repo->delete($stock_category);

        return $this->success(['message' => trans('inventory.stock_category_deleted')]);
    }
}