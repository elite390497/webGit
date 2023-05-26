<?php
namespace App\Repositories\Configuration\Misc;

use App\Models\Configuration\Misc\BloodGroup;
use Illuminate\Validation\ValidationException;

class BloodGroupRepository
{
    protected $blood_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        BloodGroup $blood_group
    ) {
        $this->blood_group = $blood_group;
    }

    /**
     * Get blood group query
     *
     * @return BloodGroup query
     */
    public function getQuery()
    {
        return $this->blood_group;
    }

    /**
     * Count blood group
     *
     * @return integer
     */
    public function count()
    {
        return $this->blood_group->count();
    }

    /**
     * List all blood groups by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->blood_group->all()->pluck('name', 'id')->all();
    }

    /**
     * List all blood groups by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->blood_group->all(['name', 'id']);
    }

    /**
     * List all blood groups by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->blood_group->all()->pluck('id')->all();
    }

    /**
     * Get all blood groups
     *
     * @return array
     */
    public function getAll()
    {
        return $this->blood_group->all();
    }

    /**
     * Find blood group with given id.
     *
     * @param integer $id
     * @return BloodGroup
     */
    public function find($id)
    {
        return $this->blood_group->find($id);
    }

    /**
     * Find blood group with given id or throw an error.
     *
     * @param integer $id
     * @return BloodGroup
     */
    public function findOrFail($id)
    {
        $blood_group = $this->blood_group->find($id);

        if (! $blood_group) {
            throw ValidationException::withMessages(['message' => trans('misc.could_not_find_blood_group')]);
        }

        return $blood_group;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return BloodGroup
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->blood_group->orderBy($sort_by, $order);
    }

    /**
     * Paginate all blood groups using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return BloodGroup
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new blood group.
     *
     * @param array $params
     * @return BloodGroup
     */
    public function create($params)
    {
        return $this->blood_group->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $blood_group_id
     * @return array
     */
    private function formatParams($params, $blood_group_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given blood group.
     *
     * @param BloodGroup $blood_group
     * @param array $params
     *
     * @return BloodGroup
     */
    public function update(BloodGroup $blood_group, $params)
    {
        return $blood_group->forceFill($this->formatParams($params, $blood_group->id))->save();
    }

    /**
     * Delete blood group.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(BloodGroup $blood_group)
    {
        return $blood_group->delete();
    }

    /**
     * Delete multiple blood groups.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->blood_group->whereIn('id', $ids)->delete();
    }
}
