<?php
namespace App\Repositories\Reception;

use Illuminate\Support\Str;
use App\Models\Reception\CallLog;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Reception\CallingPurposeRepository;

class CallLogRepository
{
    protected $call_log;
    protected $upload;
    protected $calling_purpose;
    protected $module = 'call_log';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CallLog $call_log,
        UploadRepository $upload,
        CallingPurposeRepository $calling_purpose
    ) {
        $this->call_log = $call_log;
        $this->upload = $upload;
        $this->calling_purpose = $calling_purpose;
    }

    /**
     * Get call log query
     *
     * @return CallLog query
     */
    public function getQuery()
    {
        return $this->call_log;
    }

    /**
     * Count CallLog
     *
     * @return integer
     */
    public function count()
    {
        return $this->call_log->filterBySession()->count();
    }

    /**
     * Get all call logs
     *
     * @return array
     */
    public function getAll()
    {
        return $this->call_log->all();
    }

    /**
     * Find call log with given id.
     *
     * @param integer $id
     * @return CallLog
     */
    public function find($id)
    {
        return $this->call_log->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find call log with given id or throw an error.
     *
     * @param integer $id
     * @return CallLog
     */
    public function findOrFail($id, $field = 'message')
    {
        $call_log = $this->call_log->info()->filterBySession()->filterById($id)->first();

        if (! $call_log) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_call_log')]);
        }

        return $call_log;
    }

    /**
     * Find call log with given uuid.
     *
     * @param string $uuid
     * @return CallLog
     */
    public function findByUuid($uuid)
    {
        return $this->call_log->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find call log with given uuid or throw an error.
     *
     * @param string $uuid
     * @return CallLog
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $call_log = $this->call_log->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $call_log) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_call_log')]);
        }

        return $call_log;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return CallLog
     */
    public function getData($params)
    {
        $sort_by            = gv($params, 'sort_by', 'created_at');
        $order              = gv($params, 'order', 'desc');
        $calling_purpose_id = gv($params, 'calling_purpose_id', []);
        $type               = gv($params, 'type');

        $calling_purpose_id = is_array($calling_purpose_id) ? $calling_purpose_id : ($calling_purpose_id ? explode(',', $calling_purpose_id) : []);

        $date_start_date = gv($params, 'date_start_date');
        $date_end_date   = gv($params, 'date_end_date');

        $query = $this->call_log->info()->filterBySession()->filterByType($type)->dateOfCallBetween([
            'start_date' => $date_start_date,
            'end_date' => $date_end_date
        ]);

        if (count($calling_purpose_id)) {
            $query->whereIn('calling_purpose_id', $calling_purpose_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all call logs using given params.
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
     * @return CallLog
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get call log filters.
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
        $calling_purposes = $this->calling_purpose->selectAll();

        return compact('calling_purposes');
    }

    /**
     * Create a new call log.
     *
     * @param array $params
     * @return CallLog
     */
    public function create($params)
    {
        $call_log = $this->call_log->forceCreate($this->formatParams($params));

        // $this->processUpload($call_log, $params);

        return $call_log;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $call_log_id = null)
    {
        $type               = gv($params, 'type');
        $calling_purpose_id = gv($params, 'calling_purpose_id');
        $name               = gv($params, 'name');
        $incoming_number    = gv($params, 'incoming_number');
        $outgoing_number    = gv($params, 'outgoing_number');
        $date               = toDate(gv($params, 'date'));
        $start_time         = gv($params, 'start_time');
        $end_time           = gv($params, 'end_time');
        $description        = gv($params, 'description');

        if (! dateBetweenSession($date)) {
            throw ValidationException::withMessages(['dates' => trans('reception.not_in_academic_session_range', ['date' => showDate($date)])]);
        }

        $calling_purpose = $this->calling_purpose->findOrFail($calling_purpose_id);

        if (strtotime($start_time) === false) {
            throw ValidationException::withMessages(['message' => trans('reception.invalid_start_time')]);
        }

        if ($end_time && strtotime($end_time) === false) {
            throw ValidationException::withMessages(['message' => trans('reception.invalid_end_time')]);
        }

        if ($end_time && toTime($start_time) > toTime($end_time)) {
            throw ValidationException::withMessages(['message' => trans('reception.start_time_greater_than_end_time')]);
        }

        $formatted = [
            'type'               => $type,
            'calling_purpose_id' => $calling_purpose_id,
            'name'               => $name,
            'incoming_number'    => $incoming_number,
            'outgoing_number'    => $outgoing_number,
            'date'               => toDate($date),
            'start_time'         => toTime($start_time),
            'end_time'           => toTime($end_time),
            'description'        => $description,
            'options'            => []
        ];

        if (! $call_log_id) {
            $formatted['upload_token'] = gv($params, 'upload_token') ? : Str::uuid();
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param CallLog $call_log
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(CallLog $call_log, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $call_log->id, $upload_token);
        } else {
            $this->upload->update($this->module, $call_log->id, $upload_token);
        }
    }

    /**
     * Update given call log.
     *
     * @param CallLog $call_log
     * @param array $params
     *
     * @return CallLog
     */
    public function update(CallLog $call_log, $params)
    {
        $call_log->forceFill($this->formatParams($params, $call_log->id))->save();

        // $this->processUpload($call_log, $params, 'update');

        return $call_log;
    }

    /**
     * Delete call log.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(CallLog $call_log)
    {
        return $call_log->delete();
    }

    /**
     * Delete multiple call log.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->call_log->whereIn('id', $ids)->delete();
    }
}