<?php
namespace App\Repositories\Inventory;

use Illuminate\Validation\ValidationException;
use App\Models\Inventory\Vendor;

class VendorRepository
{
    protected $vendor;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Vendor $vendor
    ) {
        $this->vendor = $vendor;
    }

    /**
     * Get vendor query
     *
     * @return Vendor query
     */
    public function getQuery()
    {
        return $this->vendor;
    }

    /**
     * Count vendor
     *
     * @return integer
     */
    public function count()
    {
        return $this->vendor->count();
    }

    /**
     * Get all vendor
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vendor->all();
    }

    /**
     * List all vendor by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->vendor->get(['name', 'id']);
    }

    /**
     * Find vendor with given id.
     *
     * @param integer $id
     * @return Vendor
     */
    public function find($id)
    {
        return $this->vendor->info()->find($id);
    }

    /**
     * Find vendor with given id or throw an error.
     *
     * @param integer $id
     * @return Vendor
     */
    public function findOrFail($id, $field = 'message')
    {
        $vendor = $this->vendor->info()->find($id);

        if (! $vendor) {
            throw ValidationException::withMessages([$field => trans('inventory.could_not_find_vendor')]);
        }

        return $vendor;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Vendor
     */
    public function getData($params)
    {
        $sort_by        = gv($params, 'sort_by', 'name');
        $order          = gv($params, 'order', 'desc');
        $name           = gv($params, 'name');
        $contact_person = gv($params, 'contact_person');

        return $this->vendor->info()->filterByName($name)->filterbyContactPerson($contact_person)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vendor using given params.
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
     * @return Vendor
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get vendor pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return [];
    }

    /**
     * Get vendor filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return [];
    }

    /**
     * Create a new vendor.
     *
     * @param array $params
     * @return Vendor
     */
    public function create($params)
    {
        $vendor = $this->vendor->forceCreate($this->formatParams($params));

        return $vendor;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $vendor_id
     * @return array
     */
    private function formatParams($params, $vendor_id = null)
    {
        $formatted = [
            'name'                 => gv($params, 'name'),
            'phone'                => gv($params, 'phone'),
            'alternate_phone'      => gv($params, 'alternate_phone'),
            'email'                => gv($params, 'email'),
            'tax_id'               => gv($params, 'tax_id'),
            'contact_person'       => gv($params, 'contact_person'),
            'contact_person_phone' => gv($params, 'contact_person_phone'),
            'contact_person_email' => gv($params, 'contact_person_email'),
            'address_line_1'       => gv($params, 'address_line_1'),
            'address_line_2'       => gv($params, 'address_line_2'),
            'city'                 => gv($params, 'city'),
            'state'                => gv($params, 'state'),
            'zipcode'              => gv($params, 'zipcode'),
            'country'              => gv($params, 'country'),
        ];

        $options = array();

        $formatted['options'] = $options;
        return $formatted;
    }

    /**
     * Update given vendor.
     *
     * @param Vendor $vendor
     * @param array $params
     *
     * @return Vendor
     */
    public function update(Vendor $vendor, $params)
    {
        $vendor->forceFill($this->formatParams($params, $vendor->id))->save();

        return $vendor;
    }

    /**
     * Find whether vendor is deletable or not.
     *
     * @param integer $id
     * @return Vendor $vendor
     */
    public function deletable($id)
    {
        $vendor = $this->findOrFail($id);
        
        // if ($this->vendor->items()->count()) {
        //     throw ValidationException::withMessages(['message' => trans('inventory.vendor_associated_with_item')]);
        // }

        return $vendor;
    }

    /**
     * Delete vendor.
     *
     * @param Vendor $vendor
     * @return bool|null
     */
    public function delete(Vendor $vendor)
    {
        return $vendor->delete();
    }

    /**
     * Delete multiple vendor.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vendor->whereIn('id', $ids)->delete();
    }
}