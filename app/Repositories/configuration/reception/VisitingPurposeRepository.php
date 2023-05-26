<?php
namespace App\Repositories\Configuration\Reception;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Reception\VisitingPurpose;

class VisitingPurposeRepository
{
    protected $visiting_purpose;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VisitingPurpose $visiting_purpose
    ) {
        $this->visiting_purpose = $visiting_purpose;
    }

    /**
     * Get visiting purpose query
     *
     * @return VisitingPurpose query
     */
    public function getQuery()
    {
        return $this->visiting_purpose;
    }

    /**
     * Count visiting purpose
     *
     * @return integer
     */
    public function count()
    {
        return $this->visiting_purpose->count();
    }

    /**
     * List all visiting purposes by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->visiting_purpose->all()->pluck('name', 'id')->all();
    }

    /**
     * List all visiting purposes by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->visiting_purpose->all(['name', 'id']);
    }

    /**
     * List all visiting purposes by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->visiting_purpose->all()->pluck('id')->all();
    }

    /**
     * Get all visiting purposes
     *
     * @return array
     */
    public function getAll()
    {
        return $this->visiting_purpose->all();
    }

    /**
     * Find visiting purpose with given id.
     *
     * @param integer $id
     * @return VisitingPurpose
     */
    public function find($id)
    {
        return $this->visiting_purpose->find($id);
    }

    /**
     * Find visiting purpose with given id or throw an error.
     *
     * @param integer $id
     * @return VisitingPurpose
     */
    public function findOrFail($id)
    {
        $visiting_purpose = $this->visiting_purpose->find($id);

        if (! $visiting_purpose) {
            throw ValidationException::withMessages(['message' => trans('reception.could_not_find_visiting_purpose')]);
        }

        return $visiting_purpose;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VisitingPurpose
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->visiting_purpose->orderBy($sort_by, $order);
    }

    /**
     * Paginate all visiting purpose using given params.
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
     * @return VisitingPurpose
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new visiting purpose.
     *
     * @param array $params
     * @return VisitingPurpose
     */
    public function create($params)
    {
        return $this->visiting_purpose->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $visiting_purpose_id
     * @return array
     */
    private function formatParams($params, $visiting_purpose_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given visiting purpose.
     *
     * @param VisitingPurpose $visiting_purpose
     * @param array $params
     *
     * @return VisitingPurpose
     */
    public function update(VisitingPurpose $visiting_purpose, $params)
    {
        return $visiting_purpose->forceFill($this->formatParams($params, $visiting_purpose->id))->save();
    }

    /**
     * Find visiting purpose & check it can be deleted or not.
     *
     * @param integer $id
     * @return VisitingPurpose
     */
    public function deletable($id)
    {
        $visiting_purpose = $this->findOrFail($id);

        if ($visiting_purpose->visitorLogs()->count()) {
            throw ValidationException::withMessages(['message' => trans('reception.visiting_purpose_associated_with_visitor_log')]);
        }

        return $visiting_purpose;
    }

    /**
     * Delete visiting purpose.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(VisitingPurpose $visiting_purpose)
    {
        return $visiting_purpose->delete();
    }

    /**
     * Delete multiple visiting purposes.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->visiting_purpose->whereIn('id', $ids)->delete();
    }
}
