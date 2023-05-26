<?php

namespace App\Http\Controllers\Finance;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Finance\Account;
use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\AccountRequest;
use App\Repositories\Finance\AccountRepository;

class AccountController extends Controller
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
        AccountRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get all Accounts
     * @get ("/api/account")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Account::class);

        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Accounts
     * @post ("/api/account/print")
     * @return Response
     */
    public function print()
    {
        $accounts = $this->repo->print(request('filter'));

        return view('print.finance.account', compact('accounts'))->render();
    }

    /**
     * Used to generate pdf all Accounts
     * @post ("/api/account/pdf")
     * @return Response
     */
    public function pdf()
    {
        $accounts = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.finance.account', compact('accounts'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Account
     * @post ("/api/account")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Account"),
     *      @Parameter("type", type="text", required="true", description="Type of Account, can be cash or bank"),
     *      @Parameter("opening_balance", type="numeric", required="true", description="Opening Balance of Account"),
     *      @Parameter("bank_name", type="string", required="true", description="Bank name of Account"),
     *      @Parameter("branch_name", type="string", required="true", description="Branch name of Account"),
     *      @Parameter("bank_identification_code", type="string", required="true", description="Bank code of Account"),
     *      @Parameter("account_number", type="string", required="true", description="Account Number")
     * })
     * @return Response
     */
    public function store(AccountRequest $request)
    {
        $this->authorize('create', Account::class);

        $account = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('finance.account_added')]);
    }

    /**
     * Used to get Account detail
     * @get ("/api/account/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', Account::class);

        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Account
     * @patch ("/api/account/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
     *      @Parameter("name", type="string", required="true", description="Name of Account"),
     *      @Parameter("type", type="text", required="true", description="Type of Account, can be cash or bank"),
     *      @Parameter("opening_balance", type="numeric", required="true", description="Opening Balance of Account"),
     *      @Parameter("bank_name", type="string", required="true", description="Bank name of Account"),
     *      @Parameter("branch_name", type="string", required="true", description="Branch name of Account"),
     *      @Parameter("bank_identification_code", type="string", required="true", description="Bank code of Account"),
     *      @Parameter("account_number", type="string", required="true", description="Account Number")
     * })
     * @return Response
     */
    public function update($id, AccountRequest $request)
    {
        $this->authorize('update', Account::class);

        $account = $this->repo->findOrFail($id);

        $account = $this->repo->update($account, $this->request->all());

        return $this->success(['message' => trans('finance.account_updated')]);
    }

    /**
     * Used to delete Account
     * @delete ("/api/account/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Account"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', Account::class);

        $account = $this->repo->deletable($id);

        $this->repo->delete($account);

        return $this->success(['message' => trans('finance.account_deleted')]);
    }
}
