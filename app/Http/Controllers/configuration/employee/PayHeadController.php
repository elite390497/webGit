<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\PayHeadRequest;
use App\Repositories\Configuration\Employee\PayHeadRepository;

class PayHeadController extends Controller
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
        PayHeadRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Employee Pay Heads
     * @get ("/api/employee/pay/head")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Employee Pay Heads
     * @post ("/api/employee/pay/head/print")
     * @return Response
     */
    public function print()
    {
        $pay_heads = $this->repo->print(request('filter'));

        return view('print.configuration.employee.pay-head', compact('pay_heads'))->render();
    }

    /**
     * Used to generate pdf all Employee Pay Heads
     * @post ("/api/employee/pay/head/pdf")
     * @return Response
     */
    public function pdf()
    {
        $pay_heads = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.pay-head', compact('pay_heads'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Employee Pay Head
     * @post ("/api/employee/pay/head")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Employee Pay Head"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Pay Head")
     * })
     * @return Response
     */
    public function store(PayHeadRequest $request)
    {
        $pay_head = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.pay_head_added')]);
    }

    /**
     * Used to get Employee Pay Head detail
     * @get ("/api/employee/pay/head/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Pay Head"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Employee Pay Head
     * @patch ("/api/employee/pay/head/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Pay Head"),
     *      @Parameter("name", type="string", required="true", description="Name of Employee Pay Head"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Pay Head")
     * })
     * @return Response
     */
    public function update($id, PayHeadRequest $request)
    {
        $pay_head = $this->repo->findOrFail($id);

        $pay_head = $this->repo->update($pay_head, $this->request->all());

        return $this->success(['message' => trans('employee.pay_head_updated')]);
    }

    /**
     * Used to delete Employee Pay Head
     * @delete ("/api/employee/pay/head/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Pay Head"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $pay_head = $this->repo->deletable($id);

        $this->repo->delete($pay_head);

        return $this->success(['message' => trans('employee.pay_head_deleted')]);
    }
}
