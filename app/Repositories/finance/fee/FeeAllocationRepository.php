<?php
namespace App\Repositories\Finance\Fee;

use Illuminate\Support\Str;
use App\Models\Student\StudentFeeRecord;
use App\Models\Transport\TransportCircle;
use App\Models\Finance\Fee\FeeAllocation;
use App\Models\Finance\Fee\FeeConcession;
use App\Models\Finance\Fee\FeeInstallment;
use App\Models\Transport\TransportFeeDetail;
use App\Models\Finance\Fee\FeeAllocationGroup;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Fee\FeeConcessionDetail;
use App\Models\Finance\Fee\FeeInstallmentDetail;
use App\Models\Configuration\Academic\CourseGroup;
use App\Repositories\Finance\Fee\FeeHeadRepository;
use App\Repositories\Finance\Fee\FeeGroupRepository;
use App\Repositories\Transport\TransportFeeRepository;

class FeeAllocationRepository
{
    protected $fee_allocation;
    protected $fee_head;
    protected $fee_group;
    protected $batch;
    protected $fee_installment;
    protected $fee_installment_detail;
    protected $transport_fee;
    protected $student_fee_record;
    protected $fee_allocation_group;
    protected $fee_concession;
    protected $transport_circle;
    protected $transport_fee_detail;
    protected $fee_concession_detail;
    protected $course_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        FeeAllocation $fee_allocation,
        FeeHeadRepository $fee_head,
        FeeGroupRepository $fee_group,
        BatchRepository $batch,
        FeeInstallment $fee_installment,
        FeeInstallmentDetail $fee_installment_detail,
        TransportFeeRepository $transport_fee,
        StudentFeeRecord $student_fee_record,
        FeeAllocationGroup $fee_allocation_group,
        FeeConcession $fee_concession,
        TransportCircle $transport_circle,
        TransportFeeDetail $transport_fee_detail,
        FeeConcessionDetail $fee_concession_detail,
        CourseGroup $course_group
    ) {
        $this->fee_allocation = $fee_allocation;
        $this->fee_head = $fee_head;
        $this->fee_group = $fee_group;
        $this->batch = $batch;
        $this->fee_installment = $fee_installment;
        $this->fee_installment_detail = $fee_installment_detail;
        $this->transport_fee = $transport_fee;
        $this->student_fee_record = $student_fee_record;
        $this->fee_allocation_group = $fee_allocation_group;
        $this->fee_concession = $fee_concession;
        $this->transport_circle = $transport_circle;
        $this->transport_fee_detail = $transport_fee_detail;
        $this->fee_concession_detail = $fee_concession_detail;
        $this->course_group = $course_group;
    }

    /**
     * Find fee allocation with given id or throw an error.
     *
     * @param integer $id
     * @return FeeAllocation
     */

    public function findOrFail($id)
    {
        $fee_allocation = $this->fee_allocation->info()->filterBySession()->filterById($id)->first();

        if (! $fee_allocation) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_allocation')]);
        }

        return $fee_allocation;
    }

    /**
     * Find fee allocation with given uuid or throw an error.
     *
     * @param string $uuid
     * @return FeeAllocation
     */

    public function findByUuidOrFail($uuid)
    {
        $fee_allocation = $this->fee_allocation->info()->filterBySession()->whereUuid($uuid)->first();

        if (! $fee_allocation) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_allocation')]);
        }

        return $fee_allocation;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return FeeAllocation
     */
    public function getData($params)
    {
        $sort_by  = gv($params, 'sort_by', 'created_at');
        $order    = gv($params, 'order', 'desc');
        $batch_id = gv($params, 'batch_id');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->fee_allocation->info()->filterBySession();

        if (count($batch_id)) {
            $query->whereIn('batch_id', $batch_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all fee allocations using given params.
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
     * @return FeeAllocation
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get fee allocation filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $batches = $this->getBatchOption();

        return compact('batches');
    }

    private function getBatchOption()
    {
        $course_groups = $this->course_group->with(['courses','courses.batches'])->filterBySession()->get();

        $batches = array();
        foreach ($course_groups as $course_group) {
            $batch_data = array();
            foreach ($course_group->Courses as $course) {
                $course_batches = $course->Batches->sortBy('name')->values()->all();
                foreach ($course_batches as $batch) {
                    $batch_data[] = array(
                        'id' => $batch->id,
                        'name' => $batch->batch_with_course
                    );
                }
            }

            $batches[] = array(
                'course_group' => $course_group->name,
                'batches' => $batch_data
            );
        }

        return $batches;
    }

    /**
     * Get fee allocation pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $existing_fee_allocations = $this->fee_allocation->filterBySession()->get();

        $existing_fee_allocation_batch_ids = array();
        foreach ($existing_fee_allocations as $fee_allocation) {
            if ($fee_allocation->course_id) {
                $existing_fee_allocation_batch_ids = array_merge($existing_fee_allocation_batch_ids, $fee_allocation->Course->batches()->pluck('id')->all());
            } else {
                $existing_fee_allocation_batch_ids[] = $fee_allocation->batch_id;
            }
        }

        $course_groups = $this->course_group->with(['courses','courses.batches'])->filterBySession()->get();

        $batches = array();
        foreach ($course_groups as $course_group) {
            $batch_data = array();
            foreach ($course_group->Courses as $course) {
                $course_batches = $course->Batches->sortBy('name')->values()->all();
                foreach ($course_batches as $batch) {
                    if (! in_array($batch->id, $existing_fee_allocation_batch_ids)) {
                        $batch_data[] = array(
                        'id' => $batch->id,
                        'name' => $batch->batch_with_course
                    );
                    }
                }
            }

            $batches[] = array(
                'course_group' => $course_group->name,
                'batches' => $batch_data
            );
        }

        $fee_groups = $this->fee_group->getAll();
        $fee_heads = $this->fee_head->getAll();
        $transport_fees = $this->transport_fee->selectAll();
        $late_fee_frequencies = getLateFeeFrequencies();

        return compact('fee_groups', 'fee_heads', 'batches', 'late_fee_frequencies', 'transport_fees');
    }

    /**
     * Get show fee allocation pre requisite.
     *
     * @return Array
     */
    public function getShowPreRequisite()
    {
        $fee_concessions = $this->fee_concession->filterBySession()->get(['name', 'id']);
        $transport_circles = $this->transport_circle->filterBySession()->get(['name', 'id']);
        $transport_fee_details = $this->transport_fee_detail->whereIn('transport_circle_id', $this->transport_circle->filterBySession()->get()->pluck('id')->all())->get();
        $fee_concession_details = $this->fee_concession_detail->whereIn('fee_concession_id', $this->fee_concession->filterBySession()->get()->pluck('id')->all())->get();

        return compact('fee_concessions', 'transport_circles', 'transport_fee_details', 'fee_concession_details');
    }


    /**
     * Create a new fee allocation.
     *
     * @param array $params
     * @return void
     */
    public function create($params = array())
    {
        $this->validateInput($params);

        $fee_allocation = $this->save($params);

        if (gv($params, 'is_course_fee')) {
            $fee_allocation->course_id = $fee_allocation->Batch->course_id;
            $fee_allocation->save();
        }

        return $fee_allocation;
    }

    /**
     * Find batches for copying fee allocation.
     *
     * @param FeeAllocation $fee_allocation
     * @param array $params
     * @return void
     */
    public function copyBatchFee(FeeAllocation $fee_allocation, $params)
    {
        $copy_batch_fee = gbv($params, 'copy_batch_fee');

        if ($fee_allocation->course_id) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_copy_course_level_fee')]);
        }

        if (! $copy_batch_fee) {
            return;
        }

        $fee_allocated_batches = $this->fee_allocation->whereHas('batch', function ($q) use ($fee_allocation) {
            $q->whereHas('course', function ($q1) use ($fee_allocation) {
                $q1->where('id', $fee_allocation->Batch->course_id);
            });
        })->get()->pluck('batch_id')->all();

        $batches = $this->batch->listIdOfCourseExceptIds($fee_allocation->Batch->course_id, $fee_allocated_batches);

        foreach ($batches as $batch) {
            $this->copy($fee_allocation, $batch);
        }
    }

    /**
     * Copy Fee Allocation for given batch
     *
     * @param FeeAllocation $fee_allocation
     * @param integer $batch_id
     * @return void
     */
    public function copy(FeeAllocation $fee_allocation, $batch_id)
    {
        $new_fee_allocation = $this->fee_allocation->firstOrNew([
            'batch_id' => $batch_id
        ]);

        if ($new_fee_allocation->uuid) {
            return;
        }

        if (! $new_fee_allocation->uuid) {
            $new_fee_allocation->uuid = Str::uuid();
            $new_fee_allocation->save();
        }

        foreach ($fee_allocation->FeeAllocationGroups as $group) {
            $new_fee_allocation_group = $group->replicate();
            $new_fee_allocation_group->fee_allocation_id = $new_fee_allocation->id;
            $new_fee_allocation_group->save();

            foreach ($group->FeeInstallments as $installment) {
                $new_installment = $installment->replicate();
                $new_installment->uuid = Str::uuid();
                $new_installment->fee_allocation_group_id = $new_fee_allocation_group->id;
                $new_installment->save();

                foreach ($installment->FeeInstallmentDetails as $installment_detail) {
                    $new_installment_detail = $installment_detail->replicate();
                    $new_installment_detail->fee_installment_id = $new_installment->id;
                    $new_installment_detail->save();
                }
            }
        }
    }

    /**
     * Store fee allocation.
     *
     * @param array $params
     * @return void
     */
    private function save($params = array())
    {
        $fee_allocation = $this->fee_allocation->firstOrNew([
            'batch_id' => gv($params, 'batch_id')
        ]);

        if (! $fee_allocation->uuid) {
            $fee_allocation->uuid = Str::uuid();
            $fee_allocation->save();
        }

        foreach (gv($params, 'fee_groups') as $fee_group) {
            $fee_allocation_group = $this->fee_allocation_group->firstOrCreate([
                'fee_allocation_id' => $fee_allocation->id,
                'fee_group_id' => $fee_group['fee_group_id']
            ]);

            if (! $fee_group['installments']) {
                $fee_allocation_group->delete();
            } else {
                $installment_uuid = array();
                foreach ($fee_group['installments'] as $installment) {
                    $installment_uuid[] = $installment['uuid'];
                }

                $previous_installments = $fee_allocation_group->FeeInstallments->pluck('uuid')->all();
                foreach ($previous_installments as $previous_installment) {
                    if (!in_array($previous_installment, $installment_uuid)) {
                        $this->fee_installment->filterByUuid($previous_installment)->delete();
                    }
                }
            }

            foreach ($fee_group['installments'] as $installment) {
                $fee_installment = $this->fee_installment->firstOrCreate([
                    'fee_allocation_group_id' => $fee_allocation_group->id,
                    'uuid' => $installment['uuid']
                ]);

                $late_fee_applicable = gbv($installment, 'late_fee_applicable');
                $fee_installment->title = $installment['title'];
                $fee_installment->due_date = toDate($installment['due_date']);
                $fee_installment->late_fee_applicable = $late_fee_applicable;
                $fee_installment->late_fee_frequency = $late_fee_applicable ? gv($installment, 'late_fee_frequency', 0) : 0;
                $fee_installment->late_fee = $late_fee_applicable ? gv($installment, 'late_fee', 0) : 0;
                $fee_installment->transport_fee_id = gv($installment, 'transport_fee_id');
                $fee_installment->save();

                foreach ($installment['fee_heads'] as $fee_head) {
                    $fee_installment_detail = $this->fee_installment_detail->firstOrCreate([
                        'fee_installment_id' => $fee_installment->id,
                        'fee_head_id' => gv($fee_head, 'id')
                    ]);
                    $fee_installment_detail->is_optional = gbv($fee_head, 'is_optional');
                    $fee_installment_detail->amount = $fee_head['amount'] ? : 0;
                    $fee_installment_detail->save();
                }
            }
        }
        return $fee_allocation;
    }

    /**
     * Validate fee installment input.
     *
     * @param array $params
     * @return FeeInstallment
     */
    private function validateInput($params = array(), $id = null)
    {
        $batch = $this->batch->findOrFail(gv($params, 'batch_id'));

        if (! $id && $this->fee_allocation->filterByCourseId($batch->course_id)->count()) {
            throw ValidationException::withMessages(['batch_id' => trans('finance.course_level_fee_allocation')]);
        }

        if (gv($params, 'is_course_fee')) {
            if ($this->fee_allocation->whereIn('batch_id', $batch->Course->batches->where('id','!=',$batch->id)->pluck('id')->all())->count()) {
                throw ValidationException::withMessages(['batch_id' => trans('finance.some_batch_fee_already_allocated_cannot_enable_course_fee')]);
            }
        }

        $query = $this->fee_allocation->whereNotNull('id');

        if ($id) {
            $query->where('id', '!=', $id);
        }

        if ($query->filterByBatchId(gv($params, 'batch_id'))->count()) {
            throw ValidationException::withMessages(['batch_id' => trans('finance.fee_allocation_exists')]);
        }

        $fee_groups = gv($params, 'fee_groups', []);

        if (! $fee_groups) {
            throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => trans('finance.fee_group')])]);
        }

        $all_fee_groups = \App\Models\Finance\Fee\FeeGroup::with('feeHeads')->filterBySession()->get();
        $all_transport_fee_ids = \App\Models\Transport\TransportFee::filterBySession()->get()->pluck('id')->all();

        $empty_installments = 0;
        foreach ($fee_groups as $fee_group) {
            $installments   = gv($fee_group, 'installments', []);

            if (! count($installments)) {
                $empty_installments++;
            }
        }

        if ($empty_installments == count($fee_groups)) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_allocation_atleast_one_installment_required')]);
        }

        foreach ($fee_groups as $fee_group) {
            $fee_group_id   = gv($fee_group, 'fee_group_id');
            $fee_group_name = gv($fee_group, 'fee_group_name', trans('finance.fee_group'));
            $installments   = gv($fee_group, 'installments', []);

            // validate all fee group id
            if (! in_array($fee_group_id, $all_fee_groups->pluck('id')->all())) {
                throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_group')]);
            }

            foreach ($installments as $index => $installment) {
                $title    = gv($installment, 'title');
                $uuid     = gv($installment, 'uuid');
                $due_date = gv($installment, 'due_date') ? toDate(gv($installment, 'due_date')) : null;
                $transport_fee_id = gv($installment, 'transport_fee_id');

                // Validate all transport ids
                if ($transport_fee_id && ! in_array($transport_fee_id, $all_transport_fee_ids)) {
                    throw ValidationException::withMessages(['message' => trans('transport.could_not_find_fee')]);
                }

                // Validate if group has transport fee or not
                if ($transport_fee_id && ! $all_fee_groups->where('id', $fee_group_id)->first()->getOption('has_transport')) {
                    throw ValidationException::withMessages(['message' => trans('finance.could_not_find_transport_fee_for_selected_group')]);
                }

                if (! $uuid) {
                    throw ValidationException::withMessages(['message' => trans('general.something_wrong')]);
                }

                if (! trim($title)) {
                    throw ValidationException::withMessages([$fee_group_id.'_'.$index.'_title' => trans('validation.required', ['attribute' => trans('finance.fee_installment_title')])]);
                }

                if (! $due_date || ! validateDate($due_date)) {
                    throw ValidationException::withMessages([$fee_group_id.'_'.$index.'_due_date' => trans('validation.required', ['attribute' => trans('finance.fee_installment_due_date')])]);
                }

                $fee_heads = gv($installment, 'fee_heads', []);

                if (! $fee_heads && ! $transport_fee_id) {
                    throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => $fee_group_name.' '.trans('finance.fee_head')])]);
                }

                foreach ($fee_heads as $fee_head) {
                    $fee_amount  = gv($fee_head, 'amount', 0);
                    $fee_name    = gv($fee_head, 'name');
                    $fee_head_id = gv($fee_head, 'id');

                    // validate all fee head ids
                    if (! in_array($fee_head_id, $all_fee_groups->where('id', $fee_group_id)->first()->feeHeads()->pluck('id')->all())) {
                        throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_head')]);
                    }

                    if (! is_numeric($fee_amount)) {
                        throw ValidationException::withMessages([$fee_group_id.'_'.$index.'_'.$fee_head_id.'_fee' => trans('validation.integer', ['attribute' => $fee_name])]);
                    }

                    if ($fee_amount < 0) {
                        throw ValidationException::withMessages([$fee_group_id.'_'.$index.'_'.$fee_head_id.'_fee' => trans('validation.min.numeric', ['attribute' => $fee_name, 'min' => 0])]);
                    }
                }

                $late_fee_applicable = gbv($installment, 'late_fee_applicable');
                $late_fee_frequency  = gv($installment, 'late_fee_frequency', 0);
                $late_fee            = gv($installment, 'late_fee', 0);

                if ($late_fee_applicable && ! $late_fee_frequency) {
                    throw ValidationException::withMessages([$fee_group_id.'_'.$index.'_late_fee_frequency' => trans('validation.numeric', ['attribute' => trans('finance.late_fee_frequency')])]);
                }

                if ($late_fee_applicable && (! $late_fee || $late_fee < 0)) {
                    throw ValidationException::withMessages([$fee_group_id.'_'.$index.'late_fee' => trans('validation.numeric', ['attribute' => trans('finance.late_fee')])]);
                }
            }

            $uuids = array();
            foreach ($installments as $index => $installment) {
                $uuids[] = $installment['uuid'];
            }
            if (count($installments) > count(array_unique($uuids))) {
                throw ValidationException::withMessages(['message' => trans('general.something_wrong')]);
            }

            $titles = array();
            foreach ($installments as $index => $installment) {
                $titles[] = $installment['title'];
            }
            if (count($installments) > count(array_unique($titles))) {
                throw ValidationException::withMessages(['message' => trans('finance.fee_installment_title_unique', ['attribute' => $fee_group_name])]);
            }

            $due_dates = array();
            foreach ($installments as $index => $installment) {
                $due_dates[] = toDate($installment['due_date']);
            }

            if (count($installments) > count(array_unique($due_dates))) {
                throw ValidationException::withMessages(['message' => trans('finance.fee_installment_due_date_unique', ['attribute' => $fee_group_name])]);
            }

            $previous_due_date = null;
            foreach ($installments as $index => $installment) {
                if ($previous_due_date && $previous_due_date > toDate($installment['due_date'])) {
                    throw ValidationException::withMessages([$fee_group_id.'_'.$index.'_due_date' => trans('validation.after', ['attribute' => trans('finance.due_date'), 'date' => showDate($previous_due_date)])]);
                }
                $previous_due_date = toDate($installment['due_date']);
            }

            foreach ($installments as $index => $installment) {
                if (! dateLessThanSessionEnd($installment['due_date'])) {
                    throw ValidationException::withMessages([$fee_group_id.'_'.$index.'_due_date' => trans('academic.date_less_than_session_end')]);
                }
            }
        }
    }

    /**
     * Update given fee allocation.
     *
     * @param FeeAllocation $fee_allocation
     * @param array $params
     *
     * @return FeeAllocation
     */

    public function update(FeeAllocation $fee_allocation, $params)
    {
        if ($fee_allocation->paid_count) {
            throw ValidationException::withMessages(['message' => trans('finance.cannot_modify_fee_allocation')]);
        }

        if ($fee_allocation->batch_id != gv($params, 'batch_id')) {
            throw ValidationException::withMessages(['batch_id' => trans('finance.fee_allocation_batch_cannot_change')]);
        }

        $this->validateInput($params, $fee_allocation->id);

        $fee_allocation = $this->save($params);

        return $fee_allocation;
    }

    /**
     * Find fee allocation is deletable or not.
     *
     * @param string $uuid
     * @return bool|null
     */
    public function deletable($uuid)
    {
        $fee_allocation = $this->findByUuidOrFail($uuid);

        $fee_installment_ids = array();

        foreach($fee_allocation->FeeAllocationGroups as $fee_allocation_group) {
            foreach ($fee_allocation_group->FeeInstallments as $fee_installment) {
                $fee_installment_ids[] = $fee_installment->id;
            };
        }

        if ($this->student_fee_record->whereIn('fee_installment_id', $fee_installment_ids)->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_allocation_associated_with_students')]);
        }

        if ($fee_allocation->studentRecords()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.fee_allocation_associated_with_students')]);
        }

        return $fee_allocation;
    }

    /**
     * Delete fee allocation.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(FeeAllocation $fee_allocation)
    {
        return $fee_allocation->delete();
    }

    /**
     * Delete multiple fee allocations.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->fee_allocation->whereIn('id', $ids)->delete();
    }
}
