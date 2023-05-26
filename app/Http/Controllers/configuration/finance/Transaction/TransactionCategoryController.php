<?php

namespace App\Http\Controllers\Configuration\Finance\Transaction;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Finance\Transaction\TransactionCategoryRequest;
use App\Repositories\Configuration\Finance\Transaction\TransactionCategoryRepository;

class TransactionCategoryController extends Controller
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
        TransactionCategoryRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Transaction Types
     * @get ("/api/finance/transaction/category")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Transaction Categories
     * @post ("/api/finance/transaction/category/print")
     * @return Response
     */
    public function print()
    {
        $transaction_categories = $this->repo->print(request('filter'));

        return view('print.configuration.finance.transaction.transaction-category', compact('transaction_categories'))->render();
    }

    /**
     * Used to generate pdf all Transaction Categories
     * @post ("/api/finance/transaction/category/pdf")
     * @return Response
     */
    public function pdf()
    {
        $transaction_categories = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.finance.transaction.transaction-category', compact('transaction_categories'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Transaction Category
     * @post ("/api/finance/transaction/category")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Transaction Category"),
     *      @Parameter("type", type="string", required="true", description="Type of Transaction Category"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transaction Category")
     * })
     * @return Response
     */
    public function store(TransactionCategoryRequest $request)
    {
        $transaction_category = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.transaction_category_added')]);
    }

    /**
     * Used to get Transaction Category detail
     * @get ("/api/finance/transaction/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transaction Category"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Transaction Category
     * @patch ("/api/finance/transaction/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transaction Category"),
     *      @Parameter("name", type="string", required="true", description="Name of Transaction Category"),
     *      @Parameter("type", type="string", required="true", description="Type of Transaction Category"),
     *      @Parameter("description", type="text", required="optional", description="Description of Transaction Category")
     * })
     * @return Response
     */
    public function update($id, TransactionCategoryRequest $request)
    {
        $transaction_category = $this->repo->findOrFail($id);

        $transaction_category = $this->repo->update($transaction_category, $this->request->all());

        return $this->success(['message' => trans('finance.transaction_category_updated')]);
    }

    /**
     * Used to delete Transaction Category
     * @delete ("/api/finance/transaction/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Transaction Category"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $transaction_category = $this->repo->deletable($id);

        $this->repo->delete($transaction_category);

        return $this->success(['message' => trans('finance.transaction_category_deleted')]);
    }
}
