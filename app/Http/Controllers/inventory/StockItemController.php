<?php

namespace App\Http\Controllers\Inventory;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Inventory\StockItem;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StockItemRequest;
use App\Repositories\Inventory\StockItemRepository;

class StockItemController extends Controller
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
        StockItemRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/stock/item/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Inventory Stock Items
     * @get ("/api/stock/item")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', StockItem::class);

        $stock_items = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('stock_items', 'filters'));
    }

    /**
     * Used to print all Inventory Stock Items
     * @post ("/api/stock/item/print")
     * @return Response
     */
    public function print()
    {
        $stock_items = $this->repo->print(request('filter'));

        return view('print.inventory.stock-item', compact('stock_items'))->render();
    }

    /**
     * Used to generate pdf all Inventory Stock Items
     * @post ("/api/stock/item/pdf")
     * @return Response
     */
    public function pdf()
    {
        $stock_items = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.inventory.stock-item', compact('stock_items'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Inventory Stock Item
     * @post ("/api/stock/item")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Stock Item"),
     *      @Parameter("description", type="text", required="true", description="Description of Stock Item"),
     * })
     * @return Response
     */
    public function store(StockItemRequest $request)
    {
        $this->authorize('create', StockItem::class);

        $stock_item = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('inventory.stock_item_added')]);
    }

    /**
     * Used to get Inventory Stock Item detail
     * @get ("/api/stock/item/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Stock Item"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', StockItem::class);

        $stock_item = $this->repo->findOrFail($id);

        $selected_stock_category = ['id' => $stock_item->stock_category_id, 'name' => $stock_item->category->name];

        return $this->success(compact('stock_item','selected_stock_category'));
    }

    /**
     * Used to update Inventory Stock Item
     * @patch ("/api/stock/item/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Stock Item"),
     *      @Parameter("name", type="string", required="true", description="Name of Stock Item"),
     *      @Parameter("description", type="text", required="true", description="Description of Stock Item"),
     * })
     * @return Response
     */
    public function update($id, StockItemRequest $request)
    {
        $this->authorize('update', StockItem::class);

        $stock_item = $this->repo->findOrFail($id);

        $stock_item = $this->repo->update($stock_item, $this->request->all());

        return $this->success(['message' => trans('inventory.stock_item_updated')]);
    }

    /**
     * Used to delete Inventory Stock Item
     * @delete ("/api/stock/item/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Inventory Stock Item"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', StockItem::class);

        $stock_item = $this->repo->deletable($id);

        $this->repo->delete($stock_item);

        return $this->success(['message' => trans('inventory.stock_item_deleted')]);
    }
}