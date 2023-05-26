<?php
namespace App\Repositories\Configuration\Misc;

use App\Models\Configuration\Misc\Religion;
use Illuminate\Validation\ValidationException;

class ReligionRepository
{
    protected $religion;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Religion $religion
    ) {
        $this->religion = $religion;
    }

    /**
     * Get religion query
     *
     * @return Religion query
     */
    public function getQuery()
    {
        return $this->religion;
    }

    /**
     * Count religion
     *
     * @return integer
     */
    public function count()
    {
        return $this->religion->count();
    }

    /**
     * List all religions by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->religion->all()->pluck('name', 'id')->all();
    }

    /**
     * List all religions by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->religion->all(['name', 'id']);
    }

    /**
     * List all religions by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->religion->all()->pluck('id')->all();
    }

    /**
     * Get all religions
     *
     * @return array
     */
    public function getAll()
    {
        return $this->religion->all();
    }

    /**
     * Find religion with given id.
     *
     * @param integer $id
     * @return Religion
     */
    public function find($id)
    {
        return $this->religion->find($id);
    }

    /**
     * Find religion with given id or throw an error.
     *
     * @param integer $id
     * @return Religion
     */
    public function findOrFail($id)
    {
        $religion = $this->religion->find($id);

        if (! $religion) {
            throw ValidationException::withMessages(['message' => trans('misc.could_not_find_religion')]);
        }

        return $religion;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Religion
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->religion->orderBy($sort_by, $order);
    }

    /**
     * Paginate all religions using given params.
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
     * @return Religion
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new religion.
     *
     * @param array $params
     * @return Religion
     */
    public function create($params)
    {
        return $this->religion->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $religion_id
     * @return array
     */
    private function formatParams($params, $religion_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given religion.
     *
     * @param Religion $religion
     * @param array $params
     *
     * @return Religion
     */
    public function update(Religion $religion, $params)
    {
        return $religion->forceFill($this->formatParams($params, $religion->id))->save();
    }

    /**
     * Delete religion.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Religion $religion)
    {
        return $religion->delete();
    }

    /**
     * Delete multiple religions.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->religion->whereIn('id', $ids)->delete();
    }
}
