<?php
namespace App\Repositories\Configuration\Reception;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Reception\EnquiryType;

class EnquiryTypeRepository
{
    protected $enquiry_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EnquiryType $enquiry_type
    ) {
        $this->enquiry_type = $enquiry_type;
    }

    /**
     * Get enquiry type query
     *
     * @return EnquiryType query
     */
    public function getQuery()
    {
        return $this->enquiry_type;
    }

    /**
     * Count enquiry type
     *
     * @return integer
     */
    public function count()
    {
        return $this->enquiry_type->count();
    }

    /**
     * List all enquiry types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->enquiry_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all enquiry types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->enquiry_type->all(['name', 'id']);
    }

    /**
     * List all enquiry types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->enquiry_type->all()->pluck('id')->all();
    }

    /**
     * Get all enquiry types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->enquiry_type->all();
    }

    /**
     * Find enquiry type with given id.
     *
     * @param integer $id
     * @return EnquiryType
     */
    public function find($id)
    {
        return $this->enquiry_type->find($id);
    }

    /**
     * Find enquiry type with given id or throw an error.
     *
     * @param integer $id
     * @return EnquiryType
     */
    public function findOrFail($id)
    {
        $enquiry_type = $this->enquiry_type->find($id);

        if (! $enquiry_type) {
            throw ValidationException::withMessages(['message' => trans('reception.could_not_find_enquiry_type')]);
        }

        return $enquiry_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return EnquiryType
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->enquiry_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all enquiry type using given params.
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
     * @return EnquiryType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new enquiry type.
     *
     * @param array $params
     * @return EnquiryType
     */
    public function create($params)
    {
        return $this->enquiry_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $enquiry_type_id
     * @return array
     */
    private function formatParams($params, $enquiry_type_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given enquiry type.
     *
     * @param EnquiryType $enquiry_type
     * @param array $params
     *
     * @return EnquiryType
     */
    public function update(EnquiryType $enquiry_type, $params)
    {
        return $enquiry_type->forceFill($this->formatParams($params, $enquiry_type->id))->save();
    }

    /**
     * Find enquiry type & check it can be deleted or not.
     *
     * @param integer $id
     * @return EnquiryType
     */
    public function deletable($id)
    {
        $enquiry_type = $this->findOrFail($id);

        if ($enquiry_type->enquiries()->count()) {
            throw ValidationException::withMessages(['message' => trans('reception.enquiry_type_associated_with_enquiry')]);
        }

        return $enquiry_type;
    }

    /**
     * Delete enquiry type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EnquiryType $enquiry_type)
    {
        return $enquiry_type->delete();
    }

    /**
     * Delete multiple enquiry types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->enquiry_type->whereIn('id', $ids)->delete();
    }
}
