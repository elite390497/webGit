<?php
namespace App\Repositories\Reception;

use App\Models\Reception\Complaint;
use App\Repositories\Configuration\Reception\ComplaintTypeRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ComplaintRepository
{
    protected $complaint;
    protected $upload;
    protected $complaint_type;
    protected $employee;
    protected $module = 'complaint';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Complaint $complaint,
        UploadRepository $upload,
        ComplaintTypeRepository $complaint_type,
        EmployeeRepository $employee
    ) {
        $this->complaint = $complaint;
        $this->upload = $upload;
        $this->complaint_type = $complaint_type;
        $this->employee = $employee;
    }

    /**
     * Get complaint query
     *
     * @return Complaint query
     */
    public function getQuery()
    {
        return $this->complaint;
    }

    /**
     * Count Complaint
     *
     * @return integer
     */
    public function count()
    {
        return $this->complaint->filterBySession()->count();
    }

    /**
     * Get all complaints
     *
     * @return array
     */
    public function getAll()
    {
        return $this->complaint->all();
    }

    /**
     * Find complaint with given id.
     *
     * @param integer $id
     * @return Complaint
     */
    public function find($id)
    {
        return $this->complaint->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find complaint with given id or throw an error.
     *
     * @param integer $id
     * @return Complaint
     */
    public function findOrFail($id, $field = 'message')
    {
        $complaint = $this->complaint->info()->filterBySession()->filterById($id)->first();

        if (! $complaint) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_complaint')]);
        }

        return $complaint;
    }

    /**
     * Find complaint with given uuid.
     *
     * @param string $uuid
     * @return Complaint
     */
    public function findByUuid($uuid)
    {
        return $this->complaint->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find complaint with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Complaint
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $complaint = $this->complaint->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $complaint) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_complaint')]);
        }

        return $complaint;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Complaint
     */
    public function getData($params)
    {
        $sort_by           = gv($params, 'sort_by', 'created_at');
        $order             = gv($params, 'order', 'desc');
        $complaint_type_id = gv($params, 'complaint_type_id', []);
        $complainant_name  = gv($params, 'complainant_name');

        $date_of_complaint_start_date = gv($params, 'date_of_complaint_start_date');
        $date_of_complaint_end_date   = gv($params, 'date_of_complaint_end_date');

        $query = $this->complaint->info()->filterBySession()->filterByComplainantName($complainant_name)->dateOfComplaintBetween([
            'start_date' => $date_of_complaint_start_date,
            'end_date' => $date_of_complaint_end_date
        ]);

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all complaints using given params.
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
     * @return Complaint
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get complaint filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $complaint_types = $this->complaint_type->selectAll();
        $employees = $this->employee->selectAll();

        return compact('complaint_types','employees');
    }

    /**
     * Create a new complaint.
     *
     * @param array $params
     * @return Complaint
     */
    public function create($params)
    {
        $complaint = $this->complaint->forceCreate($this->formatParams($params));

        $this->processUpload($complaint, $params);

        return $complaint;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $complaint_id = null)
    {
        $date_of_complaint = toDate(gv($params, 'date_of_complaint'));

        if (! dateBetweenSession($date_of_complaint)) {
            throw ValidationException::withMessages(['dates' => trans('reception.not_in_academic_session_range', ['date_of_complaint' => showDate($date_of_complaint)])]);
        }

        $complaint_type_id = gv($params, 'complaint_type_id');
        $employee_id = gv($params, 'employee_id');

        $complaint_type = $this->complaint_type->findOrFail($complaint_type_id);

        $employee = $this->employee->findorFail($employee_id);

        $formatted = [
            'complaint_type_id'          => gv($params, 'complaint_type_id'),
            'complainant_name'           => gv($params, 'complainant_name'),
            'complainant_contact_number' => gv($params, 'complainant_contact_number'),
            'complainant_address'        => gv($params, 'complainant_address'),
            'description'                => gv($params, 'description'),
            'remarks'                    => gv($params, 'remarks'),
            'date_of_complaint'          => toDate(gv($params, 'date_of_complaint')),
            'employee_id'                => gv($params, 'employee_id'),
            'options'                    => []
        ];

        if (! $complaint_id) {
            $formatted['upload_token'] = gv($params, 'upload_token') ? : Str::uuid();
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Complaint $complaint
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Complaint $complaint, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $complaint->id, $upload_token);
        } else {
            $this->upload->update($this->module, $complaint->id, $upload_token);
        }
    }

    /**
     * Update given complaint.
     *
     * @param Complaint $complaint
     * @param array $params
     *
     * @return Complaint
     */
    public function update(Complaint $complaint, $params)
    {
        $complaint->forceFill($this->formatParams($params, $complaint->id))->save();

        $this->processUpload($complaint, $params, 'update');

        $this->updateAction($complaint, $params);

        return $complaint;
    }

    private function updateAction(Complaint $complaint, $params)
    {
        if ($complaint->employee->user_id != \Auth::user()->id) {
            return;
        }

        $complaint->date_of_resolution = gv($params, 'date_of_resolution') ? toDate(gv($params, 'date_of_resolution')) : null;
        $complaint->action = gv($params, 'action');
        $complaint->save();
    }

    /**
     * Delete complaint.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Complaint $complaint)
    {
        return $complaint->delete();
    }

    /**
     * Delete multiple complaint.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->complaint->whereIn('id', $ids)->delete();
    }
}