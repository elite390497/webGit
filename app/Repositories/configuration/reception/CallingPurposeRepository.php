<?php
namespace App\Repositories\Configuration\Reception;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Reception\CallingPurpose;

class CallingPurposeRepository
{
    protected $calling_purpose;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CallingPurpose $calling_purpose
    ) {
        $this->calling_purpose = $calling_purpose;
    }

    /**
     * Get calling purpose query
     *
     * @return CallingPurpose query
     */
    public function getQuery()
    {
        return $this->calling_purpose;
    }

    /**
     * Count calling purpose
     *
     * @return integer
     */
    public function count()
    {
        return $this->calling_purpose->count();
    }

    /**
     * List all calling purposes by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->calling_purpose->all()->pluck('name', 'id')->all();
    }

    /**
     * List all calling purposes by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->calling_purpose->all(['name', 'id']);
    }

    /**
     * List all calling purposes by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->calling_purpose->all()->pluck('id')->all();
    }

    /**
     * Get all calling purposes
     *
     * @return array
     */
    public function getAll()
    {
        return $this->calling_purpose->all();
    }

    /**
     * Find calling purpose with given id.
     *
     * @param integer $id
     * @return CallingPurpose
     */
    public function find($id)
    {
        return $this->calling_purpose->find($id);
    }

    /**
     * Find calling purpose with given id or throw an error.
     *
     * @param integer $id
     * @return CallingPurpose
     */
    public function findOrFail($id)
    {
        $calling_purpose = $this->calling_purpose->find($id);

        if (! $calling_purpose) {
            throw ValidationException::withMessages(['message' => trans('reception.could_not_find_calling_purpose')]);
        }

        return $calling_purpose;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return CallingPurpose
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->calling_purpose->orderBy($sort_by, $order);
    }

    /**
     * Paginate all calling purpose using given params.
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
     * @return CallingPurpose
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new calling purpose.
     *
     * @param array $params
     * @return CallingPurpose
     */
    public function create($params)
    {
        return $this->calling_purpose->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $calling_purpose_id
     * @return array
     */
    private function formatParams($params, $calling_purpose_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given calling purpose.
     *
     * @param CallingPurpose $calling_purpose
     * @param array $params
     *
     * @return CallingPurpose
     */
    public function update(CallingPurpose $calling_purpose, $params)
    {
        return $calling_purpose->forceFill($this->formatParams($params, $calling_purpose->id))->save();
    }

    /**
     * Find calling purpose & check it can be deleted or not.
     *
     * @param integer $id
     * @return CallingPurpose
     */
    public function deletable($id)
    {
        $calling_purpose = $this->findOrFail($id);

        if ($calling_purpose->callLogs()->count()) {
            throw ValidationException::withMessages(['message' => trans('reception.calling_purpose_associated_with_call_log')]);
        }

        return $calling_purpose;
    }

    /**
     * Delete calling purpose.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(CallingPurpose $calling_purpose)
    {
        return $calling_purpose->delete();
    }

    /**
     * Delete multiple calling purposes.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->calling_purpose->whereIn('id', $ids)->delete();
    }
}