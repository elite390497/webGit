<?php
namespace App\Repositories\Configuration\Finance\Transaction;

use App\Models\Configuration\Finance\Transaction\PaymentMethod;
use Illuminate\Validation\ValidationException;

class PaymentMethodRepository
{
    protected $payment_method;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        PaymentMethod $payment_method
    ) {
        $this->payment_method = $payment_method;
    }

    /**
     * Get payment method query
     *
     * @return PaymentMethod query
     */
    public function getQuery()
    {
        return $this->payment_method;
    }

    /**
     * Count payment method
     *
     * @return integer
     */
    public function count()
    {
        return $this->payment_method->count();
    }

    /**
     * List all payment methods by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->payment_method->all()->pluck('name', 'id')->all();
    }

    /**
     * List all payment methods by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->payment_method->all(['name', 'id']);
    }

    /**
     * List all payment methods by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->payment_method->all()->pluck('id')->all();
    }

    /**
     * Get all payment methods
     *
     * @return array
     */
    public function getAll()
    {
        return $this->payment_method->all();
    }

    /**
     * Find payment method with given id.
     *
     * @param integer $id
     * @return PaymentMethod
     */
    public function find($id)
    {
        return $this->payment_method->find($id);
    }

    /**
     * Find payment method with given id or throw an error.
     *
     * @param integer $id
     * @return PaymentMethod
     */
    public function findOrFail($id, $field = 'message')
    {
        $payment_method = $this->payment_method->find($id);

        if (! $payment_method) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_payment_method')]);
        }

        return $payment_method;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return PaymentMethod
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');

        return $this->payment_method->orderBy($sort_by, $order);
    }

    /**
     * Paginate all payment method using given params.
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
     * @return PaymentMethod
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new payment method.
     *
     * @param array $params
     * @return PaymentMethod
     */
    public function create($params)
    {
        return $this->payment_method->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $payment_method_id
     * @return array
     */
    private function formatParams($params, $payment_method_id = null)
    {
        $is_default = gbv($params, 'is_default');

        if ($is_default) {
            if ($payment_method_id) {
                $this->payment_method->where('id', '!=', $payment_method_id)->update(['is_default' => 0]);
            } else {
                $this->payment_method->whereNotNull('id')->update(['is_default' => 0]);
            }
        }

        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description'),
            'is_default'  => $is_default,
        ];

        $options['requires_instrument_number']        = gbv($params, 'requires_instrument_number');
        $options['requires_instrument_date']          = gbv($params, 'requires_instrument_date');
        $options['requires_instrument_clearing_date'] = gbv($params, 'requires_instrument_clearing_date');
        $options['requires_instrument_bank_detail']   = gbv($params, 'requires_instrument_bank_detail');
        $options['requires_reference_number']         = gbv($params, 'requires_reference_number');

        $formatted['options'] = $options;

        return $formatted;
    }

    /**
     * Update given payment method.
     *
     * @param PaymentMethod $payment_method
     * @param array $params
     *
     * @return PaymentMethod
     */
    public function update(PaymentMethod $payment_method, $params)
    {
        return $payment_method->forceFill($this->formatParams($params, $payment_method->id))->save();
    }

    /**
     * Find transaction category & check it can be deleted or not.
     *
     * @param integer $id
     * @return PaymentMethod
     */
    public function deletable($id)
    {
        $payment_method = $this->findOrFail($id);

        if ($payment_method->transactions()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.payment_method_associated_with_transaction')]);
        }

        return $payment_method;
    }

    /**
     * Delete payment method.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(PaymentMethod $payment_method)
    {
        return $payment_method->delete();
    }

    /**
     * Delete multiple payment methods.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->payment_method->whereIn('id', $ids)->delete();
    }
}
