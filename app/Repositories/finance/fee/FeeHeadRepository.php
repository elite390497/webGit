<?php
namespace App\Repositories\Finance\Fee;

use App\Models\Finance\Fee\FeeHead;
use App\Models\Finance\Fee\FeeAllocation;
use Illuminate\Validation\ValidationException;
use App\Repositories\Finance\Fee\FeeGroupRepository;

class FeeHeadRepository
{
    protected $fee_head;
    protected $fee_group;
    protected $fee_allocation;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        FeeHead $fee_head,
        FeeGroupRepository $fee_group,
        FeeAllocation $fee_allocation
    ) {
        $this->fee_head = $fee_head;
        $this->fee_group = $fee_group;
        $this->fee_allocation = $fee_allocation;
    }

    /**
     * Get fee head query
     *
     * @return FeeHead query
     */
    public function getQuery()
    {
        return $this->fee_head;
    }

    /**
     * Count fee head
     *
     * @return integer
     */
    public function count()
    {
        return $this->fee_head->filterBySession()->count();
    }

    /**
     * List all fee heads by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->fee_head->filterBySession()->get()->pluck('head_with_group', 'id')->all();
    }

    /**
     * List all fee heads by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return generateSelectOption($this->fee_head->filterBySession()->get()->pluck('head_with_group', 'id')->all());
    }

    /**
     * List all fee heads by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->fee_head->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all fee heads
     *
     * @return array
     */
    public function getAll()
    {
        return $this->fee_head->with('feeGroup')->filterBySession()->get();
    }

    /**
     * Find fee head with given id.
     *
     * @param integer $id
     * @return FeeHead
     */
    public function find($id)
    {
        return $this->fee_head->with('feeGroup')->filterBySession()->filterById($id)->first();
    }

    /**
     * Find fee head with given id or throw an error.
     *
     * @param integer $id
     * @return FeeHead
     */
    public function findOrFail($id)
    {
        $fee_head = $this->fee_head->with('feeGroup')->filterBySession()->filterById($id)->first();

        if (! $fee_head) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_head')]);
        }

        return $fee_head;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return FeeHead
     */
    public function getData($params)
    {
        $sort_by      = gv($params, 'sort_by', 'name');
        $order        = gv($params, 'order', 'asc');
        $fee_group_id = gv($params, 'fee_group_id');

        $fee_group_id = is_array($fee_group_id) ? $fee_group_id : ($fee_group_id ? explode(',', $fee_group_id) : []);

        $query = $this->fee_head->with('feeGroup')->filterBySession();

        if (count($fee_group_id)) {
            $query->whereIn('fee_group_id', $fee_group_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all fee heads using given params.
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
     * @return FeeHead
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get fee head pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->fee_group->selectAll();
    }

    /**
     * Get fee head filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $fee_groups = $this->fee_group->selectAll();
        return compact('fee_groups');
    }

    /**
     * Create a new fee head.
     *
     * @param array $params
     * @return FeeHead
     */
    public function create($params)
    {
        return $this->fee_head->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $fee_head_id = null)
    {
        $name         = gv($params, 'name');
        $fee_group_id = gv($params, 'fee_group_id');

        $fee_group_ids = $this->fee_group->listId();

        if (! in_array($fee_group_id, $fee_group_ids)) {
            throw ValidationException::withMessages(['fee_group_id' => trans('finance.could_not_find_fee_group')]);
        }

        $fee_head_exist_query = (! $fee_head_id) ? $this->fee_head : $this->fee_head->where('id', '!=', $fee_head_id);

        $fee_head_exists = $fee_head_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($this->fee_allocation->filterBySession()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.no_update_after_fee_allocation')]);
        }
        
        if ($fee_head_exists) {
            throw ValidationException::withMessages(['name' => trans('finance.fee_head_exists')]);
        }

        $formatted = [
            'name'         => $name,
            'fee_group_id' => $fee_group_id,
            'description'  => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given fee head.
     *
     * @param FeeHead $fee_head
     * @param array $params
     *
     * @return FeeHead
     */
    public function update(FeeHead $fee_head, $params)
    {
        if ($fee_head->feeInstallmentDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.no_update_after_fee_allocation')]);
        }

        return $fee_head->forceFill($this->formatParams($params, $fee_head->id))->save();
    }

    /**
     * Find fee head & check it can be deleted or not.
     *
     * @param integer $id
     * @return FeeHead
     */
    public function deletable($id)
    {
        $fee_head = $this->findOrFail($id);

        if ($fee_head->feeInstallmentDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_head_associated_with_fee_allocation')]);
        }

        if ($fee_head->feeConcessionDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_head_associated_with_fee_concession')]);
        }

        if ($fee_head->studentFeeRecordDetails()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_head_associated_with_student_fee_record')]);
        }

        return $fee_head;
    }

    /**
     * Delete fee head.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(FeeHead $fee_head)
    {
        return $fee_head->delete();
    }

    /**
     * Delete multiple fee heads.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->fee_head->whereIn('id', $ids)->delete();
    }
}
