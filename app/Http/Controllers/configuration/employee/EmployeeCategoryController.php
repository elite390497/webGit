<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\EmployeeCategoryRequest;
use App\Repositories\Configuration\Employee\EmployeeCategoryRepository;

class EmployeeCategoryController extends Controller
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
        EmployeeCategoryRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Employee Categories
     * @get ("/api/employee/category")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Employee Categories
     * @post ("/api/employee/category/print")
     * @return Response
     */
    public function print()
    {
        $employee_categories = $this->repo->print(request('filter'));

        return view('print.configuration.employee.category', compact('employee_categories'))->render();
    }

    /**
     * Used to generate pdf all Employee Categories
     * @post ("/api/employee/category/pdf")
     * @return Response
     */
    public function pdf()
    {
        $employee_categories = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.category', compact('employee_categories'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Employee Category
     * @post ("/api/employee/category")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Employee Category"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Category")
     * })
     * @return Response
     */
    public function store(EmployeeCategoryRequest $request)
    {
        $employee_category = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.category_added')]);
    }

    /**
     * Used to get Employee Category detail
     * @get ("/api/employee/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Category"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Employee Category
     * @patch ("/api/employee/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Category"),
     *      @Parameter("name", type="string", required="true", description="Name of Employee Category"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Category")
     * })
     * @return Response
     */
    public function update($id, EmployeeCategoryRequest $request)
    {
        $employee_category = $this->repo->findOrFail($id);

        $employee_category = $this->repo->update($employee_category, $this->request->all());

        return $this->success(['message' => trans('employee.category_updated')]);
    }

    /**
     * Used to delete Employee Category
     * @delete ("/api/employee/category/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Category"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $employee_category = $this->repo->deletable($id);

        $this->repo->delete($employee_category);

        return $this->success(['message' => trans('employee.category_deleted')]);
    }
}
