<?php
namespace App\Repositories\Finance\Fee;

use App\Models\Finance\Fee\FeeGroup;
use App\Models\Finance\Fee\FeeAllocation;
use Illuminate\Validation\ValidationException;

class FeeGroupRepository
{
    protected $fee_group;
    protected $fee_allocation;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        FeeGroup $fee_group,
        FeeAllocation $fee_allocation
    ) {
        $this->fee_group = $fee_group;
        $this->fee_allocation = $fee_allocation;
    }

    /**
     * Get fee group query
     *
     * @return FeeGroup query
     */
    public function getQuery()
    {
        return $this->fee_group;
    }

    /**
     * Count fee group
     *
     * @return integer
     */
    public function count()
    {
        return $this->fee_group->filterBySession()->count();
    }

    /**
     * List all fee groups by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->fee_group->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all fee groups by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->fee_group->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all fee groups by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->fee_group->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all fee groups
     *
     * @return array
     */
    public function getAll()
    {
        return $this->fee_group->filterBySession()->get();
    }

    /**
     * Find fee group with given id.
     *
     * @param integer $id
     * @return FeeGroup
     */
    public function find($id)
    {
        return $this->fee_group->filterBySession()->filterById($id)->first();
    }

    /**
     * Find fee group with given id or throw an error.
     *
     * @param integer $id
     * @return FeeGroup
     */
    public function findOrFail($id, $field = 'message')
    {
        $fee_group = $this->fee_group->filterBySession()->filterById($id)->first();

        if (! $fee_group) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_fee_group')]);
        }

        return $fee_group;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return FeeGroup
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $name    = gv($params, 'name');

        $query = $this->fee_group->with('feeHeads')->filterBySession()->filterByName($name);

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all fee groups using given params.
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
     * @return FeeGroup
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new fee group.
     *
     * @param array $params
     * @return FeeGroup
     */
    public function create($params)
    {
        return $this->fee_group->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $fee_group_id = null)
    {
        $name = gv($params, 'name');
        $description = gv($params, 'description');
        $has_transport = gbv($params, 'has_transport');

        $fee_group_exist_query = (! $fee_group_id) ? $this->fee_group : $this->fee_group->where('id', '!=', $fee_group_id);

        $fee_group_exists = $fee_group_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($fee_group_exists) {
            throw ValidationException::withMessages(['name' => trans('finance.fee_group_exists')]);
        }

        if ($this->fee_allocation->filterBySession()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.no_update_after_fee_allocation')]);
        }

        if ($has_transport) {
            foreach ($this->fee_group->filterBySession()->get() as $group) {
                if ($group->getOption('has_transport')) {
                    $options = $group->options;
                    $options['has_transport'] = 0;
                    $group->options = $options;
                    $group->save();
                }
            }
        }

        $options['has_transport'] = $has_transport;

        $formatted = [
            'name'        => $name,
            'description' => $description,
            'options'     => $options
        ];

        if (! $fee_group_id) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Update given fee group.
     *
     * @param FeeGroup $fee_group
     * @param array $params
     *
     * @return FeeGroup
     */
    public function update(FeeGroup $fee_group, $params)
    {
        return $fee_group->forceFill($this->formatParams($params, $fee_group->id))->save();
    }

    /**
     * Find fee group & check it can be deleted or not.
     *
     * @param integer $id
     * @return FeeGroup
     */
    public function deletable($id)
    {
        $fee_group = $this->findOrFail($id);

        if ($fee_group->feeAllocationGroups()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_group_associated_with_fee_allocation')]);
        }

        if ($fee_group->feeHeads()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_group_associated_with_fee_head')]);
        }

        return $fee_group;
    }

    /**
     * Delete fee group.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(FeeGroup $fee_group)
    {
        return $fee_group->delete();
    }

    /**
     * Delete multiple fee groups.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->fee_group->whereIn('id', $ids)->delete();
    }
}
