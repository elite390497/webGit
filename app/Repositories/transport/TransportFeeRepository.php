<?php
namespace App\Repositories\Transport;

use App\Models\Transport\TransportFee;
use App\Models\Transport\TransportFeeDetail;
use Illuminate\Validation\ValidationException;
use App\Repositories\Transport\TransportCircleRepository;

class TransportFeeRepository
{
    protected $transport_fee;
    protected $transport_circle;
    protected $transport_fee_detail;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        TransportFee $transport_fee,
        TransportCircleRepository $transport_circle,
        TransportFeeDetail $transport_fee_detail
    ) {
        $this->transport_fee = $transport_fee;
        $this->transport_circle = $transport_circle;
        $this->transport_fee_detail = $transport_fee_detail;
    }

    /**
     * Get transport fee query
     *
     * @return TransportFee query
     */
    public function getQuery()
    {
        return $this->transport_fee;
    }

    /**
     * Count transport fee
     *
     * @return integer
     */
    public function count()
    {
        return $this->transport_fee->filterBySession()->count();
    }

    /**
     * List all transport fees by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->transport_fee->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all transport fees by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->transport_fee->filterBySession()->get(['name', 'id']);
    }

    /**
     * List all transport fees by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->transport_fee->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all transport fees
     *
     * @return array
     */
    public function getAll()
    {
        return $this->transport_fee->filterBySession()->get();
    }

    /**
     * Find transport fee with given id.
     *
     * @param integer $id
     * @return TransportFee
     */
    public function find($id)
    {
        return $this->transport_fee->filterBySession()->filterById($id)->first();
    }

    /**
     * Find transport fee with given id or throw an error.
     *
     * @param integer $id
     * @return TransportFee
     */
    public function findOrFail($id, $field = 'message')
    {
        $transport_fee = $this->transport_fee->with('transportFeeDetails')->filterBySession()->filterById($id)->first();

        if (! $transport_fee) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_fee')]);
        }

        return $transport_fee;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return TransportFee
     */
    public function getData($params)
    {
        $sort_by             = gv($params, 'sort_by', 'name');
        $order               = gv($params, 'order', 'asc');
        $name                = gv($params, 'name');

        $query = $this->transport_fee->with('transportFeeDetails', 'transportFeeDetails.transportCircle')->filterBySession();

        if ($name) {
            $query->filterByName($name);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all transport fees using given params.
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
     * @return TransportFee
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get transport fee pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        return $this->transport_circle->getAll();
    }

    /**
     * Create a new transport fee.
     *
     * @param array $params
     * @return TransportFee
     */
    public function create($params)
    {
        $transport_fee = $this->transport_fee->forceCreate($this->formatParams($params));

        $this->updateTransportFeeDetail($transport_fee, $params);

        return $transport_fee;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $transport_fee = null)
    {
        $name = gv($params, 'name');
        $description = gv($params, 'description');

        $transport_fee_exist_query = (! $transport_fee) ? $this->transport_fee : $this->transport_fee->where('id', '!=', $transport_fee->id);

        $transport_fee_exists = $transport_fee_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($transport_fee_exists) {
            throw ValidationException::withMessages(['name' => trans('transport.fee_exists')]);
        }

        $this->validateTransportCircle($params);

        $formatted = [
            'name'        => $name,
            'description' => $description
        ];

        if (! $transport_fee) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Validate transport circles
     *
     * @param array $params
     * @return void
     */
    public function validateTransportCircle($params = array())
    {
        $transport_circles = gv($params, 'transport_circles', []);

        if (! $transport_circles) {
            throw ValidationException::withMessages(['message' => trans('transport.could_not_find_any_circle')]);
        }

        $transport_circle_ids = $this->transport_circle->listId();

        foreach ($transport_circles as $transport_circle) {
            $transport_circle_id = gv($transport_circle, 'transport_circle_id');

            if (! in_array($transport_circle_id, $transport_circle_ids)) {
                throw ValidationException::withMessages(['amount_'.$transport_circle_id => trans('transport.could_not_find_circle')]);
            }

            $amount = gv($transport_circle, 'amount', 0);

            if (! is_numeric($amount)) {
                throw ValidationException::withMessages(['amount_'.$transport_circle_id => trans('validation.numeric', ['attribute' => trans('transport.fee')])]);
            }

            if ($amount < 0) {
                throw ValidationException::withMessages(['amount_'.$transport_circle_id => trans('validation.min.numeric', ['attribute' => trans('transport.fee'), 'min' => 0])]);
            }
        }
    }

    /**
     * Update transport fee details
     *
     * @param TransportFee $transport_fee
     * @param array $params
     * @return void
     */
    public function updateTransportFeeDetail(TransportFee $transport_fee, $params)
    {
        $transport_circles = gv($params, 'transport_circles', []);

        foreach ($transport_circles as $transport_circle) {
            $transport_circle_id = gv($transport_circle, 'transport_circle_id');

            $transport_fee_detail = $this->transport_fee_detail->firstOrNew(['transport_fee_id' => $transport_fee->id, 'transport_circle_id' => $transport_circle_id]);
            $transport_fee_detail->amount = gv($transport_circle, 'amount', 0);
            $transport_fee_detail->save();
        }
    }

    /**
     * Update given transport fee.
     *
     * @param TransportFee $transport_fee
     * @param array $params
     *
     * @return TransportFee
     */
    public function update(TransportFee $transport_fee, $params)
    {
        $transport_fee->forceFill($this->formatParams($params, $transport_fee))->save();

        $this->updateTransportFeeDetail($transport_fee, $params);

        return $transport_fee;
    }

    /**
     * Find transport fee & check it can be deleted or not.
     *
     * @param integer $id
     * @return TransportFee
     */
    public function deletable($id)
    {
        $transport_fee = $this->findOrFail($id);

        if ($transport_fee->feeInstallments()->count()) {
            throw ValidationException::withMessages(['message' => trans('transport.fee_associated_with_installment')]);
        }

        return $transport_fee;
    }

    /**
     * Delete transport fee.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(TransportFee $transport_fee)
    {
        return $transport_fee->delete();
    }

    /**
     * Delete multiple transport fees.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->transport_fee->whereIn('id', $ids)->delete();
    }
}
