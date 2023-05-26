<?php
namespace App\Repositories\Finance\Fee;

use App\Models\Finance\Fee\FeeConcession;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Fee\FeeConcessionDetail;
use App\Repositories\Finance\Fee\FeeHeadRepository;

class FeeConcessionRepository
{
    protected $fee_concession;
    protected $fee_head;
    protected $fee_concession_detail;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        FeeConcession $fee_concession,
        FeeHeadRepository $fee_head,
        FeeConcessionDetail $fee_concession_detail
    ) {
        $this->fee_concession = $fee_concession;
        $this->fee_head = $fee_head;
        $this->fee_concession_detail = $fee_concession_detail;
    }

    /**
     * Get fee concession query
     *
     * @return FeeConcession query
     */
    public function getQuery()
    {
        return $this->fee_concession;
    }

    /**
     * Count fee concession
     *
     * @return integer
     */
    public function count()
    {
        return $this->fee_concession->filterBySession()->count();
    }

    /**
     * List all fee concessions by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->fee_concession->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all fee concessions by name & id for select option
     *
     * @return array
     */

    public function selectAll($session_id = null)
    {
        return $this->fee_concession->filterBySession($session_id)->get(['name', 'id']);
    }

    /**
     * List all fee concessions by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->fee_concession->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all fee concessions
     *
     * @return array
     */
    public function getAll()
    {
        return $this->fee_concession->filterBySession()->get();
    }

    /**
     * Find fee concession with given id.
     *
     * @param integer $id
     * @return FeeConcession
     */
    public function find($id)
    {
        return $this->fee_concession->filterBySession()->filterById($id)->first();
    }

    /**
     * Find fee concession with given id or throw an error.
     *
     * @param integer $id
     * @return FeeConcession
     */
    public function findOrFail($id, $field = 'message')
    {
        $fee_concession = $this->fee_concession->with('feeConcessionDetails')->filterBySession()->filterById($id)->first();

        if (! $fee_concession) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_fee_concession')]);
        }

        return $fee_concession;
    }

    /**
     * Find fee concession with given id and session or throw an error.
     *
     * @param integer $id
     * @return FeeConcession
     */
    public function findWithSessionOrFail($id, $session_id = null, $field = 'message')
    {
        $fee_concession = $this->fee_concession->with('feeConcessionDetails')->filterBySession($session_id)->filterById($id)->first();

        if (! $fee_concession) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_fee_concession')]);
        }

        return $fee_concession;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return FeeConcession
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $name    = gv($params, 'name');

        $query = $this->fee_concession->with('feeConcessionDetails', 'feeConcessionDetails.feeHead', 'feeConcessionDetails.feeHead.feeGroup')->filterBySession()->filterByName($name);

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all fee concessions using given params.
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
     * @return FeeConcession
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get fee concession pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->fee_head->getAll();
    }

    /**
     * Create a new fee concession.
     *
     * @param array $params
     * @return FeeConcession
     */
    public function create($params)
    {
        $fee_concession = $this->fee_concession->forceCreate($this->formatParams($params));

        $this->updateFeeConcessionDetail($fee_concession, $params);

        return $fee_concession;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $fee_concession = null)
    {
        $name = gv($params, 'name');
        $description = gv($params, 'description');

        $fee_concession_exist_query = (! $fee_concession) ? $this->fee_concession : $this->fee_concession->where('id', '!=', $fee_concession->id);

        $fee_concession_exists = $fee_concession_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($fee_concession_exists) {
            throw ValidationException::withMessages(['name' => trans('finance.fee_concession_exists')]);
        }

        $this->validateFeeHead($params);

        $formatted = [
            'name'        => $name,
            'description' => $description
        ];

        if (! $fee_concession) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Validate fee heads
     *
     * @param array $params
     * @return void
     */
    public function validateFeeHead($params = array())
    {
        $fee_heads = gv($params, 'fee_heads', []);

        $fee_head_ids = $this->fee_head->listId();

        $zero_concession = 0;

        foreach ($fee_heads as $fee_head) {
            $fee_head_id = gv($fee_head, 'fee_head_id');

            if (! in_array($fee_head_id, $fee_head_ids)) {
                throw ValidationException::withMessages(['discount_'.$fee_head_id => trans('finance.could_not_find_fee_head')]);
            }

            $amount = gv($fee_head, 'amount', 0);

            if (! isInteger($amount)) {
                throw ValidationException::withMessages(['discount_'.$fee_head_id => trans('validation.integer', ['attribute' => trans('finance.fee')])]);
            }

            if ($amount < 0) {
                throw ValidationException::withMessages(['discount_'.$fee_head_id => trans('validation.min.numeric', ['attribute' => trans('finance.fee'), 'min' => 0])]);
            }

            if ($amount > 100 && !gbv($fee_head, 'type')) {
                throw ValidationException::withMessages(['discount_'.$fee_head_id => trans('validation.max.numeric', ['attribute' => trans('finance.fee'), 'max' => 100])]);
            }

            if (! $amount) {
                $zero_concession++;
            }
        }

        if ($zero_concession == count($fee_heads)) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_concession_min_one_fee_head_discount')]);
        }
    }

    /**
     * Update fee concession details
     *
     * @param FeeConcession $fee_concession
     * @param array $params
     * @return void
     */
    public function updateFeeConcessionDetail(FeeConcession $fee_concession, $params)
    {
        $fee_heads = gv($params, 'fee_heads', []);

        foreach ($fee_heads as $fee_head) {
            $fee_head_id = gv($fee_head, 'fee_head_id');

            $fee_concession_detail = $this->fee_concession_detail->firstOrNew(['fee_concession_id' => $fee_concession->id, 'fee_head_id' => $fee_head_id]);
            $amount = gv($fee_head, 'amount', 0);
            
            if (! $amount) {
                $this->fee_concession_detail->filterByFeeConcessionId($fee_concession->id)->filterByFeeHeadId($fee_head_id)->delete();
            } else {
                $fee_concession_detail->amount = $amount;
                $fee_concession_detail->type = gbv($fee_head, 'type') ? 'amount' : 'percent';
                $fee_concession_detail->save();
            }
        }
    }

    /**
     * Update given fee concession.
     *
     * @param FeeConcession $fee_concession
     * @param array $params
     *
     * @return FeeConcession
     */
    public function update(FeeConcession $fee_concession, $params)
    {
        if ($fee_concession->StudentFeeRecords->where('status', '!=', 'unpaid')->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.concession_already_applied_to_student_fee_record')]);
        }

        $fee_concession->forceFill($this->formatParams($params, $fee_concession))->save();

        $this->updateFeeConcessionDetail($fee_concession, $params);

        return $fee_concession;
    }

    /**
     * Find fee concession & check it can be deleted or not.
     *
     * @param integer $id
     * @return FeeConcession
     */
    public function deletable($id)
    {
        $fee_concession = $this->findOrFail($id);

        if ($fee_concession->studentFeeRecords()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.concession_already_applied_to_student_fee_record')]);
        }

        return $fee_concession;
    }

    /**
     * Delete fee concession.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(FeeConcession $fee_concession)
    {
        return $fee_concession->delete();
    }

    /**
     * Delete multiple fee concessions.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->fee_concession->whereIn('id', $ids)->delete();
    }
}
