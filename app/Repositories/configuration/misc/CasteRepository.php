<?php
namespace App\Repositories\Configuration\Misc;

use App\Models\Configuration\Misc\Caste;
use Illuminate\Validation\ValidationException;

class CasteRepository
{
    protected $caste;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Caste $caste
    ) {
        $this->caste = $caste;
    }

    /**
     * Get caste query
     *
     * @return Caste query
     */
    public function getQuery()
    {
        return $this->caste;
    }

    /**
     * Count caste
     *
     * @return integer
     */
    public function count()
    {
        return $this->caste->count();
    }

    /**
     * List all castes by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->caste->all()->pluck('name', 'id')->all();
    }

    /**
     * List all castes by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->caste->all(['name', 'id']);
    }

    /**
     * List all castes by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->caste->all()->pluck('id')->all();
    }

    /**
     * Get all castes
     *
     * @return array
     */
    public function getAll()
    {
        return $this->caste->all();
    }

    /**
     * Find caste with given id.
     *
     * @param integer $id
     * @return Caste
     */
    public function find($id)
    {
        return $this->caste->find($id);
    }

    /**
     * Find caste with given id or throw an error.
     *
     * @param integer $id
     * @return Caste
     */
    public function findOrFail($id)
    {
        $caste = $this->caste->find($id);

        if (! $caste) {
            throw ValidationException::withMessages(['message' => trans('misc.could_not_find_caste')]);
        }

        return $caste;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Caste
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->caste->orderBy($sort_by, $order);
    }

    /**
     * Paginate all castes using given params.
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
     * @return Caste
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new caste.
     *
     * @param array $params
     * @return Caste
     */
    public function create($params)
    {
        return $this->caste->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $caste_id
     * @return array
     */
    private function formatParams($params, $caste_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given caste.
     *
     * @param Caste $caste
     * @param array $params
     *
     * @return Caste
     */
    public function update(Caste $caste, $params)
    {
        return $caste->forceFill($this->formatParams($params, $caste->id))->save();
    }

    /**
     * Delete caste.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Caste $caste)
    {
        return $caste->delete();
    }

    /**
     * Delete multiple castes.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->caste->whereIn('id', $ids)->delete();
    }
}
