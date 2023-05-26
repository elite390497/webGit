<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Requests\Configuration\RoleRequest;
use Spatie\Permission\Models\Role;
use App\Repositories\Configuration\RoleRepository;
use App\Http\Requests\Configuration\PermissionRequest;
use App\Http\Controllers\Controller;

class RoleController extends Controller
{
    protected $request;
    protected $repo;
    protected $module = 'role';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        RoleRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('role:'.config('system.default_role.admin'), ['except' => ['list']]);
    }

    /**
     * Used to get all Roles
     * @get ("/api/role")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * List all roles
     * @get ("/api/role/employee/list")
     * @return Response
     */
    public function employeeRoleList()
    {
        return $this->ok(generateSelectOption($this->repo->employeeRoleList()));
    }

    /**
     * Used to store Role
     * @post ("/api/role")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Role"),
     * })
     * @return Response
     */
    public function store(RoleRequest $request)
    {
        $role = Role::create(['name' => strtolower(request('name'))]);

        activity('role')->on($role)->withProperties(['attributes' => ['id' => $role->id, 'name' => $role->name]])->log('created');

        return $this->success(['message' => trans('configuration.role_added')]);
    }

    /**
     * Used to get Role detail
     * @post ("/api/role/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Role"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to delete role
     * @delete ("/api/role")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Role to be deleted"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $role = $this->repo->deletable($id);

        activity('role')->on($role)->withProperties(['attributes' => ['id' => $role->id, 'name' => $role->name]])->log('deleted');
        
        $this->repo->delete($role);

        return $this->success(['message' => trans('configuration.role_deleted')]);
    }
}
