<?php
namespace App\Repositories\Configuration\Reception;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Reception\ComplaintType;

class ComplaintTypeRepository
{
    protected $complaint_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        ComplaintType $complaint_type
    ) {
        $this->complaint_type = $complaint_type;
    }

    /**
     * Get complaint type query
     *
     * @return ComplaintType query
     */
    public function getQuery()
    {
        return $this->complaint_type;
    }

    /**
     * Count complaint type
     *
     * @return integer
     */
    public function count()
    {
        return $this->complaint_type->count();
    }

    /**
     * List all complaint types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->complaint_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all complaint types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->complaint_type->all(['name', 'id']);
    }

    /**
     * List all complaint types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->complaint_type->all()->pluck('id')->all();
    }

    /**
     * Get all complaint types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->complaint_type->all();
    }

    /**
     * Find complaint type with given id.
     *
     * @param integer $id
     * @return ComplaintType
     */
    public function find($id)
    {
        return $this->complaint_type->find($id);
    }

    /**
     * Find complaint type with given id or throw an error.
     *
     * @param integer $id
     * @return ComplaintType
     */
    public function findOrFail($id)
    {
        $complaint_type = $this->complaint_type->find($id);

        if (! $complaint_type) {
            throw ValidationException::withMessages(['message' => trans('reception.could_not_find_complaint_type')]);
        }

        return $complaint_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return ComplaintType
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->complaint_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all complaint type using given params.
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
     * @return ComplaintType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new complaint type.
     *
     * @param array $params
     * @return ComplaintType
     */
    public function create($params)
    {
        return $this->complaint_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $complaint_type_id
     * @return array
     */
    private function formatParams($params, $complaint_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given complaint type.
     *
     * @param ComplaintType $complaint_type
     * @param array $params
     *
     * @return ComplaintType
     */
    public function update(ComplaintType $complaint_type, $params)
    {
        return $complaint_type->forceFill($this->formatParams($params, $complaint_type->id))->save();
    }

    /**
     * Find complaint type & check it can be deleted or not.
     *
     * @param integer $id
     * @return ComplaintType
     */
    public function deletable($id)
    {
        $complaint_type = $this->findOrFail($id);

        if ($complaint_type->complaints()->count()) {
            throw ValidationException::withMessages(['message' => trans('reception.complaint_type_associated_with_complaint')]);
        }

        return $complaint_type;
    }

    /**
     * Delete complaint type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(ComplaintType $complaint_type)
    {
        return $complaint_type->delete();
    }

    /**
     * Delete multiple complaint types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->complaint_type->whereIn('id', $ids)->delete();
    }
}