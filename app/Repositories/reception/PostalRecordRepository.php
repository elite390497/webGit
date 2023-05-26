<?php
namespace App\Repositories\Reception;

use Illuminate\Support\Str;
use App\Models\Reception\PostalRecord;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;

class PostalRecordRepository
{
    protected $postal_record;
    protected $upload;
    protected $module = 'postal_record';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        PostalRecord $postal_record,
        UploadRepository $upload
    ) {
        $this->postal_record = $postal_record;
        $this->upload = $upload;
    }

    /**
     * Get postal record query
     *
     * @return PostalRecord query
     */
    public function getQuery()
    {
        return $this->postal_record;
    }

    /**
     * Count PostalRecord
     *
     * @return integer
     */
    public function count()
    {
        return $this->postal_record->filterBySession()->count();
    }

    /**
     * Get all postal records
     *
     * @return array
     */
    public function getAll()
    {
        return $this->postal_record->all();
    }

    /**
     * Find postal record with given id.
     *
     * @param integer $id
     * @return PostalRecord
     */
    public function find($id)
    {
        return $this->postal_record->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find postal record with given id or throw an error.
     *
     * @param integer $id
     * @return PostalRecord
     */
    public function findOrFail($id, $field = 'message')
    {
        $postal_record = $this->postal_record->info()->filterBySession()->filterById($id)->first();

        if (! $postal_record) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_postal_record')]);
        }

        return $postal_record;
    }

    /**
     * Find postal record with given uuid.
     *
     * @param string $uuid
     * @return PostalRecord
     */
    public function findByUuid($uuid)
    {
        return $this->postal_record->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find postal record with given uuid or throw an error.
     *
     * @param string $uuid
     * @return PostalRecord
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $postal_record = $this->postal_record->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $postal_record) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_postal_record')]);
        }

        return $postal_record;
    }

    /**
     * Is postal record accessible
     * @param  PostalRecord $postal_record
     * @return void
     */
    public function isAccessible(PostalRecord $postal_record)
    {
        if ($postal_record->is_confidential && $postal_record->user_id != \Auth::user()->id) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return PostalRecord
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'created_at');
        $order    = gv($params, 'order', 'desc');
        $type     = gv($params, 'type');
        $sender   = gv($params, 'sender');
        $receiver = gv($params, 'receiver');

        $date_start_date = gv($params, 'date_start_date');
        $date_end_date   = gv($params, 'date_end_date');

        $query = $this->postal_record->info()->filterBySession()->filterByType($type)->filterBySender($sender)->filterByReceiver($receiver)->dateBetween([
            'start_date' => $date_start_date,
            'end_date' => $date_end_date
        ])->where(function($q) {
            $q->whereIsConfidential(0)->orWhere(function($q1) {
                $q1->whereIsConfidential(1)->whereUserId(\Auth::user()->id);
            });
        });

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all postal records using given params.
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
     * @return PostalRecord
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get postal record filters.
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
        return [];
    }

    /**
     * Create a new postal record.
     *
     * @param array $params
     * @return PostalRecord
     */
    public function create($params)
    {
        $postal_record = $this->postal_record->forceCreate($this->formatParams($params));

        $this->processUpload($postal_record, $params);

        return $postal_record;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $postal_record_id = null)
    {
        $date = toDate(gv($params, 'date'));

        if (! dateBetweenSession($date)) {
            throw ValidationException::withMessages(['dates' => trans('reception.not_in_academic_session_range', ['date' => showDate($date)])]);
        }

        $formatted = [
            'type'             => gv($params, 'type'),
            'sender_title'     => gv($params, 'sender_title'),
            'sender_address'   => gv($params, 'sender_address'),
            'receiver_title'   => gv($params, 'receiver_title'),
            'receiver_address' => gv($params, 'receiver_address'),
            'reference_number' => gv($params, 'reference_number'),
            'is_confidential'  => gbv($params, 'is_confidential'),
            'description'      => gv($params, 'description'),
            'date'             => toDate(gv($params, 'date')),
            'options'          => []
        ];

        if (! $postal_record_id) {
            $formatted['upload_token'] = gv($params, 'upload_token') ? : Str::uuid();
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param PostalRecord $postal_record
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(PostalRecord $postal_record, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $postal_record->id, $upload_token);
        } else {
            $this->upload->update($this->module, $postal_record->id, $upload_token);
        }
    }

    /**
     * Update given postal record.
     *
     * @param PostalRecord $postal_record
     * @param array $params
     *
     * @return PostalRecord
     */
    public function update(PostalRecord $postal_record, $params)
    {
        $this->isAccessible($postal_record);

        $postal_record->forceFill($this->formatParams($params, $postal_record->id))->save();

        $this->processUpload($postal_record, $params, 'update');

        return $postal_record;
    }

    /**
     * Delete postal record.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(PostalRecord $postal_record)
    {
        $this->isAccessible($postal_record);
        
        return $postal_record->delete();
    }

    /**
     * Delete multiple postal record.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->postal_record->whereIn('id', $ids)->delete();
    }
}