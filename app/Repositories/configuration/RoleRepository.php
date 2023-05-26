<?php
namespace App\Repositories\Configuration;

use App\Models\Configuration\Role;
use Illuminate\Validation\ValidationException;

class RoleRepository
{
    protected $role;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Role $role
    ) {
        $this->role = $role;
    }

    /**
     * Get all roles
     *
     * @return Role
     */

    public function getAll()
    {
        return $this->role->all();
    }

    /**
     * List all roles by name & id
     *
     * @return Role
     */

    public function list()
    {
        $query = $this->role->all()->pluck('detail', 'id')->all();
    }

    /**
     * List roles for employees
     *
     * @return Role
     */

    public function employeeRoleList()
    {
        $exclude = array(
            config('system.default_role.admin'),
            config('system.default_role.student'),
            config('system.default_role.parent')
        );

        if (! \Auth::user()->hasRole(config('system.default_role.admin'))) {
            array_push($exclude, config('system.default_role.manager'));
            array_push($exclude, config('system.default_role.principal'));
        }

        return $this->role->whereNotIn('name', $exclude)->get()->pluck('detail', 'id')->all();
    }

    /**
     * Get role by name
     *
     * @return Role
     */

    public function findByName($name = null)
    {
        return $this->role->filterByName($name)->first();
    }

    /**
     * List (name,id) all roles by name where given name is not included
     *
     * @return Role
     */

    public function listExceptName($names = array())
    {
        return $this->role->whereNotIn('name', $names)->get()->pluck('name', 'id')->all();
    }

    /**
     * List (name) all roles by id
     *
     * @return Role
     */

    public function listNameById($ids = array())
    {
        $ids = is_array($ids) ? $ids : (($ids) ? [$ids] : []);

        return $this->role->whereIn('id', $ids)->get()->pluck('name')->all();
    }

    /**
     * List all names
     *
     * @return Role
     */

    public function listName()
    {
        return $this->role->all()->pluck('name')->all();
    }

    /**
     * Find role with given id or throw an error.
     *
     * @param integer $id
     * @return Role
     */

    public function findOrFail($id)
    {
        $role = $this->role->find($id);

        if (! $role) {
            throw ValidationException::withMessages(['message' => trans('configuration.could_not_find_role')]);
        }

        return $role;
    }

    /**
     * Paginate all roles using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */

    public function paginate($params)
    {
        $sort_by     = gv($params, 'sort_by', 'name');
        $order       = gv($params, 'order', 'asc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->role->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Find role & check it can be deleted or not.
     *
     * @param integer $id
     * @return Locale
     */
    public function deletable($id)
    {
        $role = $this->findOrFail($id);

        if (in_array($role->name, config('system.default_role'))) {
            throw ValidationException::withMessages(['message' => trans('configuration.default_role_cannot_be_deleted')]);
        }
        
        return $role;
    }

    /**
     * Delete role.
     *
     * @param integer $id
     * @return bool|null
     */

    public function delete(Role $role)
    {
        return $role->delete();
    }

    /**
     * Delete multiple roles.
     *
     * @param array $ids
     * @return bool|null
     */

    public function deleteMultiple($ids = array())
    {
        return $this->role->whereIn('id', $ids)->delete();
    }
}
