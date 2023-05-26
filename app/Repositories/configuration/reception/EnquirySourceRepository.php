<?php
namespace App\Repositories\Configuration\Reception;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Reception\EnquirySource;

class EnquirySourceRepository
{
    protected $enquiry_source;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EnquirySource $enquiry_source
    ) {
        $this->enquiry_source = $enquiry_source;
    }

    /**
     * Get enquiry source query
     *
     * @return EnquirySource query
     */
    public function getQuery()
    {
        return $this->enquiry_source;
    }

    /**
     * Count enquiry source
     *
     * @return integer
     */
    public function count()
    {
        return $this->enquiry_source->count();
    }

    /**
     * List all enquiry sources by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->enquiry_source->all()->pluck('name', 'id')->all();
    }

    /**
     * List all enquiry sources by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->enquiry_source->all(['name', 'id']);
    }

    /**
     * List all enquiry sources by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->enquiry_source->all()->pluck('id')->all();
    }

    /**
     * Get all enquiry sources
     *
     * @return array
     */
    public function getAll()
    {
        return $this->enquiry_source->all();
    }

    /**
     * Find enquiry source with given id.
     *
     * @param integer $id
     * @return EnquirySource
     */
    public function find($id)
    {
        return $this->enquiry_source->find($id);
    }

    /**
     * Find enquiry source with given id or throw an error.
     *
     * @param integer $id
     * @return EnquirySource
     */
    public function findOrFail($id)
    {
        $enquiry_source = $this->enquiry_source->find($id);

        if (! $enquiry_source) {
            throw ValidationException::withMessages(['message' => trans('reception.could_not_find_enquiry_source')]);
        }

        return $enquiry_source;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return EnquirySource
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->enquiry_source->orderBy($sort_by, $order);
    }

    /**
     * Paginate all enquiry source using given params.
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
     * @return EnquirySource
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new enquiry source.
     *
     * @param array $params
     * @return EnquirySource
     */
    public function create($params)
    {
        return $this->enquiry_source->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $enquiry_source_id
     * @return array
     */
    private function formatParams($params, $enquiry_source_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given enquiry source.
     *
     * @param EnquirySource $enquiry_source
     * @param array $params
     *
     * @return EnquirySource
     */
    public function update(EnquirySource $enquiry_source, $params)
    {
        return $enquiry_source->forceFill($this->formatParams($params, $enquiry_source->id))->save();
    }

    /**
     * Find enquiry source & check it can be deleted or not.
     *
     * @param integer $id
     * @return EnquirySource
     */
    public function deletable($id)
    {
        $enquiry_source = $this->findOrFail($id);

        if ($enquiry_source->enquiries()->count()) {
            throw ValidationException::withMessages(['message' => trans('reception.enquiry_source_associated_with_enquiry')]);
        }

        return $enquiry_source;
    }

    /**
     * Delete enquiry source.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EnquirySource $enquiry_source)
    {
        return $enquiry_source->delete();
    }

    /**
     * Delete multiple enquiry sources.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->enquiry_source->whereIn('id', $ids)->delete();
    }
}
