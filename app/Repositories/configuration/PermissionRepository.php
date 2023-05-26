<?php
namespace App\Repositories\Configuration;

use Spatie\Permission\Models\Role;
use App\Models\Configuration\Permission;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\RoleRepository;

class PermissionRepository
{
    protected $permission;
    protected $role;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Permission $permission,
        RoleRepository $role
    ) {
        $this->permission = $permission;
        $this->role = $role;
    }

    /**
     * Get all permissions
     *
     * @return Permission
     */
    public function getAll()
    {
        return $this->permission->all();
    }

    /**
     * List all permissions by name
     *
     * @return Permission
     */
    public function listByName($ids = [])
    {
        if (count($ids)) {
            return $this->permission->whereIn('id', $ids)->get()->pluck('name')->all();
        } else {
            return $this->permission->all()->pluck('name')->all();
        }
    }

    /**
     * List all names
     *
     * @return Permission
     */
    public function listName()
    {
        return $this->permission->all()->pluck('name')->all();
    }

    /**
     * Find permission with given id or throw an error.
     *
     * @param integer $id
     * @return Permission
     */
    public function findOrFail($id)
    {
        $permission = $this->permission->find($id);

        if (! $permission) {
            throw ValidationException::withMessages(['message' => trans('configuration.could_not_find_permission')]);
        }

        return $permission;
    }

    /**
     * Get pre requisite for module permission assign
     *
     * @param array $module
     * @return Array
     */
    public function getModulePreRequisite($module)
    {
        $roles = $this->role->getAll();

        $role_and_permission = getVar('role_and_permission');

        $modules = array();
        foreach ($role_and_permission['default_permission'] as $index => $permission_group) {
            $modules[] = $index;
        }

        sort($modules);

        $permissions = isset($role_and_permission['default_permission'][$module]) ? $role_and_permission['default_permission'][$module] : [];
        $permissions = array_keys($permissions);

        $assigned_permissions = array();

        foreach ($roles as $role) {
            $spatie_role = Role::findByName($role->name);
            $assigned_permissions[] = array('role' => $role->name, 'permissions' => $spatie_role->permissions->whereIn('name', $permissions)->pluck('name')->all());
        }

        return compact('roles', 'permissions', 'assigned_permissions', 'modules');
    }

    /**
     * Assign module permission
     *
     * @param array $params
     * @return null
     */
    public function assignModulePermission($params)
    {
        $module = gv($params, 'module');
        $roles = gv($params, 'roles');

        $role_and_permission = getVar('role_and_permission');

        if (! isset($role_and_permission['default_permission'][$module])) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $module_permissions = $role_and_permission['default_permission'][$module];
        $module_permissions = array_keys($module_permissions);

        $role_with_permissions = Role::with('permissions')->get();

        foreach ($roles as $role) {
            $user_role = $role_with_permissions->where('name', gv($role, 'name'))->first();

            $assigned_permissions = $user_role->permissions->whereIn('name', $module_permissions)->pluck('name')->all();

            if ($user_role->name != config('system.default_role.admin')) {
                $user_role->revokePermissionTo($assigned_permissions);
                $user_role->givePermissionTo(gv($role, 'permissions', []));
            }
        }
    }

    /**
     * Get pre requisite for permission assign
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $roles = $this->role->getAll();

        $role_and_permission = getVar('role_and_permission')['default_permission'];

        $permissions = array();
        $modules = array();
        foreach ($role_and_permission as $index => $permission_group) {
            $modules[] = $index;
            foreach ($permission_group as $name => $permission) {
                $permissions[] = $name;
            }
        }

        $assigned_permissions = array();

        foreach ($roles as $role) {
            $spatie_role = Role::findByName($role->name);
            $assigned_permissions[] = array('role' => $role->name, 'permissions' => $spatie_role->permissions->pluck('name')->all());
        }

        sort($modules);

        return compact('roles', 'permissions', 'assigned_permissions', 'modules');
    }

    /**
     * Assign permission
     *
     * @param array $params
     * @return null
     */
    public function assignPermission($params)
    {
        $roles = gv($params, 'roles');

        $role_with_permissions = Role::with('permissions')->get();

        foreach ($roles as $role) {
            $user_role = $role_with_permissions->where('name', gv($role, 'name'))->first();

            if ($user_role->name != config('system.default_role.admin')) {
                $user_role->syncPermissions(gv($role, 'permissions', []));
            }
        }
    }

    /**
     * Paginate all permissions using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->permission->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Delete permission.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Permission $permission)
    {
        return $permission->delete();
    }

    /**
     * Delete multiple permissions.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->permission->whereIn('id', $ids)->delete();
    }
}
