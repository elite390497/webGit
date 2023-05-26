<?php
namespace App\Repositories\Configuration\Academic;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Academic\Institute;

class InstituteRepository
{
    protected $institute;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Institute $institute
    ) {
        $this->institute = $institute;
    }

    /**
     * Get institute query
     *
     * @return Institute query
     */
    public function getQuery()
    {
        return $this->institute;
    }

    /**
     * Count institute
     *
     * @return integer
     */
    public function count()
    {
        return $this->institute->count();
    }

    /**
     * List all institutes by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->institute->orderBy('name', 'asc')->get()->pluck('name', 'id')->all();
    }

    /**
     * List all institutes by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->institute->orderBy('name', 'asc')->get(['name', 'id']);
    }

    /**
     * List all institutes by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->institute->get()->pluck('id')->all();
    }

    /**
     * Get all institutes
     *
     * @return array
     */
    public function getAll()
    {
        return $this->institute->all();
    }

    /**
     * Find institute with given id.
     *
     * @param integer $id
     * @return Institute
     */
    public function find($id)
    {
        return $this->institute->find($id);
    }

    /**
     * Find institute with given id or throw an error.
     *
     * @param integer $id
     * @return Institute
     */
    public function findOrFail($id, $field = 'message')
    {
        $institute = $this->institute->find($id);

        if (! $institute) {
            throw ValidationException::withMessages([$field => trans('academic.could_not_find_institute')]);
        }

        return $institute;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Institute
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $name    = gv($params, 'name');

        return $this->institute->filterByName($name)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all institutes using given params.
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
     * @return Institute
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new institute.
     *
     * @param array $params
     * @return Institute
     */
    public function create($params)
    {
        return $this->institute->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $institute_id = null)
    {
        $formatted = [
            'name'                     => gv($params, 'name'),
            'contact_number'           => gv($params, 'contact_number'),
            'alternate_contact_number' => gv($params, 'alternate_contact_number'),
            'principal_name'           => gv($params, 'principal_name'),
            'website'                  => gv($params, 'website'),
            'address'                  => gv($params, 'address'),
            'remarks'                  => gv($params, 'remarks')
        ];
        
        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given institute.
     *
     * @param Institute $institute
     * @param array $params
     *
     * @return Institute
     */
    public function update(Institute $institute, $params)
    {
        return $institute->forceFill($this->formatParams($params, $institute->id))->save();
    }

    /**
     * Find institute & check it can be deleted or not.
     *
     * @param integer $id
     * @return Institute
     */
    public function deletable($id)
    {
        $institute = $this->findOrFail($id);

        if ($institute->registrations()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.institute_associated_with_student')]);
        }

        if ($institute->enquiryDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('academic.institute_associated_with_enquiry')]);
        }

        return $institute;
    }

    /**
     * Delete institute.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Institute $institute)
    {
        return $institute->delete();
    }

    /**
     * Delete multiple institutes.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->institute->whereIn('id', $ids)->delete();
    }
}
