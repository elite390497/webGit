<?php
namespace App\Repositories\Configuration\Asset;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Asset\Building;

class BuildingRepository
{
    protected $building;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Building $building
    ) {
        $this->building = $building;
    }

    /**
     * Get building query
     *
     * @return Building query
     */
    public function getQuery()
    {
        return $this->building;
    }

    /**
     * Count building
     *
     * @return integer
     */
    public function count()
    {
        return $this->building->count();
    }

    /**
     * List all buildings by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->building->get()->pluck('name', 'id')->all();
    }

    /**
     * List all buildings by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->building->get(['name', 'id']);
    }

    /**
     * List all buildings by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->building->get()->pluck('id')->all();
    }

    /**
     * Get all buildings
     *
     * @return array
     */
    public function getAll()
    {
        return $this->building->info()->get();
    }

    /**
     * Find building with given id.
     *
     * @param integer $id
     * @return Building
     */
    public function find($id)
    {
        return $this->building->info()->find($id);
    }

    /**
     * Find building with given id or throw an error.
     *
     * @param integer $id
     * @return Building
     */
    public function findOrFail($id, $field = 'message')
    {
        $building = $this->building->info()->find($id);

        if (! $building) {
            throw ValidationException::withMessages([$field => trans('asset.could_not_find_building')]);
        }

        return $building;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Building
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'position');
        $order       = gv($params, 'order', 'asc');

        return $this->building->info()->orderBy($sort_by, $order);
    }

    /**
     * Paginate all buildings using given params.
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
     * @return Building
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new building.
     *
     * @param array $params
     * @return Building
     */
    public function create($params)
    {
        return $this->building->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $building_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];
        
        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given building.
     *
     * @param Building $building
     * @param array $params
     *
     * @return Building
     */
    public function update(Building $building, $params)
    {
        return $building->forceFill($this->formatParams($params, $building->id))->save();
    }

    /**
     * Find building & check it can be deleted or not.
     *
     * @param integer $id
     * @return Building
     */
    public function deletable($id)
    {
        $building = $this->findOrFail($id);

        return $building;
    }

    /**
     * Delete building.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Building $building)
    {
        return $building->delete();
    }

    /**
     * Delete multiple buildings.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->building->whereIn('id', $ids)->delete();
    }
}