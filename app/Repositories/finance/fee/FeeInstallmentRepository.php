<?php
namespace App\Repositories\Finance\Fee;

use App\Models\Finance\Fee\FeeInstallment;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Fee\FeeInstallmentDetail;
use App\Repositories\Transport\TransportFeeRepository;

class FeeInstallmentRepository
{
    protected $fee_installment;
    protected $transport_fee;
    protected $fee_installment_detail;


    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        FeeInstallment $fee_installment,
        TransportFeeRepository $transport_fee,
        FeeInstallmentDetail $fee_installment_detail
    ) {
        $this->fee_installment = $fee_installment;
        $this->transport_fee = $transport_fee;
        $this->fee_installment_detail = $fee_installment_detail;
    }

    /**
     * Get fee installment pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $late_fee_frequencies = getLateFeeFrequencies();
        $transport_fees = $this->transport_fee->selectAll();

        return compact('late_fee_frequencies', 'transport_fees');
    }

    /**
     * Find fee installment with given uuid or throw an error.
     *
     * @param string $uuid
     * @return FeeInstallment
     */

    public function findByUuidOrFail($uuid)
    {
        $fee_installment = $this->fee_installment->with('transportFee', 'feeInstallmentDetails', 'feeInstallmentDetails.feeHead', 'transportFee', 'feeAllocationGroup', 'feeAllocationGroup.feeGroup')->withCount([
            'studentFeeRecords as paid_installment' => function ($q) {
                $q->where('status', 'paid');
            }])->whereUuid($uuid)->first();

        if (! $fee_installment) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_installment')]);
        }

        return $fee_installment;
    }

    /**
     * Store fee allocation.
     *
     * @param FeeInstallment $fee_installment
     * @param array $params
     * @return void
     */
    private function save(FeeInstallment $fee_installment, $params = array())
    {
        $late_fee_applicable = gbv($params, 'late_fee_applicable');

        $fee_installment->due_date = toDate(gv($params, 'due_date'));
        $fee_installment->late_fee_applicable = $late_fee_applicable;
        $fee_installment->late_fee_frequency = $late_fee_applicable ? gv($params, 'late_fee_frequency', 0) : 0;
        $fee_installment->late_fee = $late_fee_applicable ? gv($params, 'late_fee', 0) : 0;

        if ($fee_installment->paid_installment) {
            $fee_installment->save();
            return $fee_installment;
        }
       
        $fee_installment->title = gv($params, 'title');
        $fee_installment->transport_fee_id = gv($params, 'transport_fee_id');
        $fee_installment->save();

        $fee_heads = gv($params, 'fee_heads', []);

        foreach ($fee_heads as $fee_head) {
            $fee_installment_detail = $this->fee_installment_detail->firstOrCreate([
                'fee_installment_id' => $fee_installment->id,
                'fee_head_id' => gv($fee_head, 'id')
            ]);

            $fee_installment_detail->amount = gv($fee_head, 'amount', 0);
            $fee_installment_detail->is_optional = gbv($fee_head, 'is_optional');
            $fee_installment_detail->save();
        }

        return $fee_installment;
    }

    /**
     * Validate fee installment input.
     *
     * @param array $params
     * @param FeeInstallment $fee_installment
     * @return FeeInstallment
     */
    private function validateInput($params = array(), FeeInstallment $fee_installment)
    {
        $paid_installment = $fee_installment->paid_installment;
        $fee_group = $fee_installment->FeeAllocationGroup->FeeGroup;

        $previous_due_date_query = $this->fee_installment->whereFeeAllocationGroupId($fee_installment->fee_allocation_group_id)->where('due_date', '<', toDate($fee_installment->due_date))->orderBy('due_date', 'desc')->first();

        $previous_due_date = ($previous_due_date_query) ? toDate($previous_due_date_query->due_date) : config('config.default_academic_session.start_date');

        $next_due_date_query = $this->fee_installment->whereFeeAllocationGroupId($fee_installment->fee_allocation_group_id)->where('due_date', '>', toDate($fee_installment->due_date))->orderBy('due_date', 'asc')->first();

        $next_due_date = ($next_due_date_query) ? toDate($next_due_date_query->due_date) : config('config.default_academic_session.end_date');

        $due_date = gv($params, 'due_date');

        if ($due_date <= $previous_due_date || $due_date >= $next_due_date) {
            throw ValidationException::withMessages(['due_date' => trans('finance.fee_installment_due_date_range', ['start_date' => showDate($previous_due_date), 'end_date' => showDate($next_due_date)])]);
        }

        if ($paid_installment) {
            return;
        }

        $fee_heads = gv($params, 'fee_heads', []);

        if (! $fee_heads) {
            throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => $fee_group->name.' '.trans('finance.fee_head')])]);
        }
        
        $all_transport_fee_ids = $this->transport_fee->listId();

        if ($fee_group->getOption('has_transport') && ! in_array(gv($params, 'transport_fee_id'), $all_transport_fee_ids)) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_transport_fee_for_selected_group')]);
        }

        foreach ($fee_heads as $fee_head) {
            $fee_amount  = gv($fee_head, 'amount', 0);
            $fee_name    = gv($fee_head, 'name');
            $fee_head_id = gv($fee_head, 'id');

            // validate all fee head ids
            if (! in_array($fee_head_id, $fee_group->feeHeads()->pluck('id')->all())) {
                throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_head')]);
            }

            if (! is_numeric($fee_amount)) {
                throw ValidationException::withMessages([$index.'_'.$fee_head_id.'_fee' => trans('validation.numeric', ['attribute' => $fee_name])]);
            }

            if ($fee_amount < 0) {
                throw ValidationException::withMessages([$index.'_'.$fee_head_id.'_fee' => trans('validation.min.numeric', ['attribute' => $fee_name, 'min' => 0])]);
            }
        }
    }

    /**
     * Update given fee installment.
     *
     * @param FeeInstallment $fee_installment
     * @param array $params
     *
     * @return FeeInstallment
     */

    public function update(FeeInstallment $fee_installment, $params)
    {
        $this->validateInput($params, $fee_installment);

        $fee_installment = $this->save($fee_installment, $params);

        return $fee_installment;
    }
}
