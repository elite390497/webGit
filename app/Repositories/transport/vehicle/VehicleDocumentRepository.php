<?php
namespace App\Repositories\Transport\Vehicle;

use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Transport\Vehicle\VehicleDocument;
use App\Repositories\Transport\Vehicle\VehicleRepository;
use App\Repositories\Configuration\Transport\Vehicle\VehicleDocumentTypeRepository;

class VehicleDocumentRepository
{
    protected $vehicle_document;
    protected $vehicle;
    protected $vehicle_document_type;
    protected $upload;
    protected $module = 'vehicle_document';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VehicleDocument $vehicle_document,
        VehicleRepository $vehicle,
        VehicleDocumentTypeRepository $vehicle_document_type,
        UploadRepository $upload
    ) {
        $this->vehicle_document = $vehicle_document;
        $this->vehicle = $vehicle;
        $this->vehicle_document_type = $vehicle_document_type;
        $this->upload = $upload;
    }

    /**
     * Get vehicle document query
     *
     * @return VehicleDocument query
     */
    public function getQuery()
    {
        return $this->vehicle_document;
    }

    /**
     * Count vehicle document
     *
     * @return integer
     */
    public function count()
    {
        return $this->vehicle_document->count();
    }

    /**
     * Get all vehicle documents
     *
     * @return array
     */
    public function getAll()
    {
        return $this->vehicle_document->all();
    }

    /**
     * Find vehicle document with given id.
     *
     * @param integer $id
     * @return VehicleDocument
     */
    public function find($id)
    {
        return $this->vehicle_document->info()->find($id);
    }

    /**
     * Find vehicle document with given id or throw an error.
     *
     * @param integer $id
     * @return VehicleDocument
     */
    public function findOrFail($id, $field = 'message')
    {
        $vehicle_document = $this->vehicle_document->info()->find($id);

        if (! $vehicle_document) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_vehicle_document')]);
        }

        return $vehicle_document;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return VehicleDocument
     */
    public function getData($params)
    {
        $sort_by                  = gv($params, 'sort_by', 'date_of_document');
        $order                    = gv($params, 'order', 'desc');
        $vehicle_id               = gv($params, 'vehicle_id');
        $vehicle_document_type_id = gv($params, 'vehicle_document_type_id');
        $expired                  = gbv($params, 'expired');
        $expiring_in              = gv($params, 'expiring_in');

        $expiring_date = date('Y-m-d', strtotime('+'.$expiring_in.' day', strtotime(date('Y-m-d'))));

        $vehicle_id = is_array($vehicle_id) ? $vehicle_id : ($vehicle_id ? explode(',', $vehicle_id) : []);
        $vehicle_document_type_id = is_array($vehicle_document_type_id) ? $vehicle_document_type_id : ($vehicle_document_type_id ? explode(',', $vehicle_document_type_id) : []);

        $query = $this->vehicle_document->info();

        if (count($vehicle_id)) {
            $query->whereIn('vehicle_id', $vehicle_id);
        }

        if (count($vehicle_document_type_id)) {
            $query->whereIn('vehicle_document_type_id', $vehicle_document_type_id);
        }

        if ($expired) {
            $query->where('date_of_expiry', '<', date('Y-m-d'));
        } elseif (! $expired && $expiring_in) {
            $query->where('date_of_expiry', '<', $expiring_date);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all vehicle documents using given params.
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
     * @return VehicleDocument
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get vehicle document pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $vehicles = $this->vehicle->selectAllActive();

        $vehicle_document_types = $this->vehicle_document_type->selectAll();

        $vehicle_document_type_details = $this->vehicle_document_type->getAll();

        return compact('vehicles', 'vehicle_document_types', 'vehicle_document_type_details');
    }

    /**
     * Get vehicle document filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $vehicles = $this->vehicle->selectAll();

        $vehicle_document_types = $this->vehicle_document_type->selectAll();

        return compact('vehicles', 'vehicle_document_types');
    }

    /**
     * Create a new vehicle document.
     *
     * @param array $params
     * @return VehicleDocument
     */
    public function create($params)
    {
        $this->upload->validateUpload($params, $this->module);

        $vehicle_document = $this->vehicle_document->forceCreate($this->formatParams($params));

        $this->processUpload($vehicle_document, $params);

        return $vehicle_document;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $vehicle_document_id
     * @return array
     */
    private function formatParams($params, $vehicle_document_id = null)
    {
        $vehicle_id               = gv($params, 'vehicle_id');
        $vehicle_document_type_id = gv($params, 'vehicle_document_type_id');
        $title                    = gv($params, 'title');
        $date_of_expiry           = toDate(gv($params, 'date_of_expiry'));
        $description              = gv($params, 'description');

        if (! $this->vehicle->findActive($vehicle_id)) {
            throw ValidationException::withMessages(['vehicle_id' => trans('transport.could_not_find_vehicle')]);
        }

        $vehicle_document_type = $this->vehicle_document_type->findOrFail($vehicle_document_type_id);

        $date_of_expiry = ($vehicle_document_type->has_expiry_date) ? $date_of_expiry : null;

        if ($vehicle_document_type->has_expiry_date && (! $date_of_expiry || ! validateDate($date_of_expiry))) {
            throw ValidationException::withMessages(['date_of_expiry' => trans('validation.required', ['attribute' => trans('transport.date_of_expiry')])]);
        }

        $query = ($vehicle_document_id) ? $this->vehicle_document->where('id', '!=', $vehicle_document_id) : $this->vehicle_document;

        if ($query->filterByVehicleId($vehicle_id)->filterByTitle($title, 1)->count()) {
            throw ValidationException::withMessages(['title' => trans('transport.vehicle_document_title_exists')]);
        }

        $formatted = [
            'vehicle_id'               => $vehicle_id,
            'vehicle_document_type_id' => $vehicle_document_type_id,
            'title'                    => $title,
            'date_of_expiry'           => toDate($date_of_expiry),
            'description'              => $description
        ];

        $options['insurance'] = array(
            'policy_number'                  => gv($params, 'policy_number'),
            'insurance_date'                 => gv($params, 'insurance_date'),
            'insurance_amount'               => gv($params, 'insurance_amount'),
            'insured_amount'                 => gv($params, 'insured_amount'),
            'insurance_company_name'         => gv($params, 'insurance_company_name'),
            'insurance_agent_name'           => gv($params, 'insurance_agent_name'),
            'insurance_agent_contact_number' => gv($params, 'insurance_agent_contact_number')
        );

        if (! $vehicle_document_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
        }

        $formatted['options'] = $options;
        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param VehicleDocument $vehicle_document
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(VehicleDocument $vehicle_document, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $vehicle_document->id, $upload_token);
        } else {
            $this->upload->update($this->module, $vehicle_document->id, $upload_token);
        }
    }

    /**
     * Update given vehicle document.
     *
     * @param VehicleDocument $vehicle_document
     * @param array $params
     *
     * @return VehicleDocument
     */
    public function update(VehicleDocument $vehicle_document, $params)
    {
        $this->upload->validateUpload($params, $this->module, $vehicle_document->id);

        $vehicle_document->forceFill($this->formatParams($params, $vehicle_document->id))->save();

        $this->processUpload($vehicle_document, $params, 'update');

        return $vehicle_document;
    }

    /**
     * Find whether vehicle document is deletable or not.
     *
     * @param integer $id
     * @return VehicleDocument $vehicle_document
     */
    public function deletable($id)
    {
        $vehicle_document = $this->findOrFail($id);

        if ($this->vehicle_document->filterByVehicleId($vehicle_document->vehicle_id)->filterByVehicleDocumentTypeId($vehicle_document->vehicle_document_type_id)->where('id', '>', $id)->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.intermediate_vehicle_document_cannot_be_deleted')]);
        }

        return $vehicle_document;
    }

    /**
     * Delete vehicle document.
     *
     * @param VehicleDocument $vehicle_document
     * @return bool|null
     */
    public function delete(VehicleDocument $vehicle_document)
    {
        return $vehicle_document->delete();
    }

    /**
     * Delete multiple vehicle documentss.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->vehicle_document->whereIn('id', $ids)->delete();
    }
}
