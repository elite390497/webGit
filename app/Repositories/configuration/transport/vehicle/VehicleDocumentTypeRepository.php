<?php
namespace App\Repositories\Configuration\Transport\Vehicle;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Transport\Vehicle\VehicleDocumentType;

class VehicleDocumentTypeRepository
{
    protected $vehicle_document_type;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleDocumentType $vehicle_document_type
    ) {
        $this->vehicle_document_type = $vehicle_document_type;
    }

    /**
     * Get vehicle document type query
     *
     * @return VehicleDocumentType query
     */
    public function getQuery()
    {
        return $this->vehicle_document_type;
    }

    /**
     * Count vehicle document type
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_document_type->count();
    }

    /**
     * List all vehicle document types by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->vehicle_document_type->all()->pluck('name', 'id')->all();
    }

    /**
     * List all vehicle document types by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->vehicle_document_type->all(['name', 'id']);
    }

    /**
     * List all vehicle document types by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->vehicle_document_type->all()->pluck('id')->all();
    }

    /**
     * Get all vehicle document types
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_document_type->all();
    }

    /**
     * Find vehicle document type with given id.
     *
     * @param integer $id
     * @return VehicleDocumentType
     */
    public function find($id)
    {
        return $this->vehicle_document_type->find($id);
    }

    /**
     * Find vehicle document type with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleDocumentType
     */
    public function findOrFail($id)
    {
        $vehicle_document_type = $this->vehicle_document_type->find($id);

        if (! $vehicle_document_type) {
            throw ValidationException::withMessages(['message' => trans('transport.could_not_find_vehicle_document_type')]);
        }

        return $vehicle_document_type;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehicleDocumentType
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->vehicle_document_type->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle document type using given params.
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
     * @return VehicleDocumentType
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new vehicle document type.
     *
     * @param array $params
     * @return VehicleDocumentType
     */
    public function create($params)
    {
        return $this->vehicle_document_type->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $vehicle_document_type_id
     * @return array
     */
    private function formatParams($params, $vehicle_document_type_id = null)
    {
        $formatted = [
            'name'                  => gv($params, 'name'),
            'has_expiry_date'       => gbv($params, 'has_expiry_date'),
            'is_insurance_document' => gbv($params, 'is_insurance_document'),
            'description'           => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given vehicle document type.
     *
     * @param VehicleDocumentType $vehicle_document_type
     * @param array $params
     *
     * @return VehicleDocumentType
     */
    public function update(VehicleDocumentType $vehicle_document_type, $params)
    {
        return $vehicle_document_type->forceFill($this->formatParams($params, $vehicle_document_type->id))->save();
    }

    /**
     * Find vehicle document type & check it can be deleted or not.
     *
     * @param integer $id
     * @return VehicleDocumentType
     */
    public function deletable($id)
    {
        $vehicle_document_type = $this->findOrFail($id);

        if ($vehicle_document_type->vehicleDocuments()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.vehicle_document_type_associated_with_vehicle_document')]);
        }

        return $vehicle_document_type;
    }

    /**
     * Delete vehicle document type.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(VehicleDocumentType $vehicle_document_type)
    {
        return $vehicle_document_type->delete();
    }

    /**
     * Delete multiple vehicle document types.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_document_type->whereIn('id', $ids)->delete();
    }
}
