<?php
namespace App\Repositories\Student;

use App\Models\Student\StudentRecord;
use App\Models\Student\StudentFeeRecord;
use App\Models\Finance\Fee\FeeAllocation;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Academic\AcademicSessionRepository;
use App\Repositories\Finance\Fee\FeeConcessionRepository;
use App\Repositories\Transport\TransportCircleRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class PromotionRepository
{
    protected $academic_session;
    protected $transport_circle;
    protected $fee_concession;
    protected $student_record;
    protected $course_group;
    protected $batch;
    protected $fee_allocation;
    protected $student_fee_record;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        AcademicSessionRepository $academic_session,
        TransportCircleRepository $transport_circle,
        FeeConcessionRepository $fee_concession,
        StudentRecord $student_record,
        CourseGroupRepository $course_group,
        BatchRepository $batch,
        FeeAllocation $fee_allocation,
        StudentFeeRecord $student_fee_record
    ) {
        $this->academic_session = $academic_session;
        $this->transport_circle = $transport_circle;
        $this->fee_concession = $fee_concession;
        $this->student_record = $student_record;
        $this->course_group = $course_group;
        $this->batch = $batch;
        $this->fee_allocation = $fee_allocation;
        $this->student_fee_record = $student_fee_record;
    }

    /**
     * Get promotion pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $next_session = $this->getNextSession();

        if (!$next_session) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_next_session')]);
        }

        $next_session_batches = $this->getNextSessionBatches($next_session);
        $next_session_transport_circles = $this->getNextSessionTransportCircles($next_session);
        $next_session_fee_concessions = $this->getNextSessionFeeConcessions($next_session);
        $filters = $this->getFilters();

        return compact('next_session', 'next_session_batches', 'next_session_transport_circles', 'next_session_fee_concessions', 'filters');
    }

    /**
     * Get awaiting prommotion student's filtered data
     *
     * @param array $params
     * @return StudentRecord
     */
    public function getData($params)
    {
        $sort_by              = gv($params, 'sort_by', 'created_at');
        $order                = gv($params, 'order', 'desc');
        $batch_id             = gv($params, 'batch_id');
        $first_name           = gv($params, 'first_name');
        $last_name            = gv($params, 'last_name');
        $first_guardian_name  = gv($params, 'first_guardian_name');
        $second_guardian_name = gv($params, 'second_guardian_name');

        if (! $batch_id) {
            throw ValidationException::withMessages(['message' => trans('academic.could_not_find_batch')]);
        }

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->student_record->with('student', 'student.parent', 'admission', 'batch', 'batch.course')->filterBySession()->whereIsPromoted(0)->whereNull('date_of_exit')->filterByBatchesId($batch_id)->whereHas('student', function ($q) use ($first_name, $last_name, $first_guardian_name, $second_guardian_name) {
            $q->filterByFirstName($first_name)->filterByLastName($last_name);

            if ($first_guardian_name || $second_guardian_name) {
                $q->whereHas('parent', function ($q1) use ($first_guardian_name, $second_guardian_name) {
                    $q1->filterByFirstGuardianName($first_guardian_name)->filterBySecondGuardianName($second_guardian_name);
                });
            }
        });

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate awaiting promotion student records using given params.
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
     * Get awaiting promotion filtered data for printing
     *
     * @param array $params
     * @return StudentRecord
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get promotion filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $batches = $this->course_group->getBatchOption();

        return compact('batches');
    }

    /**
     * Get next session
     *
     * @return Array
     */
    public function getNextSession()
    {
        return $this->academic_session->getNextSession();
    }

    /**
     * Get next session batches
     *
     * @return Array
     */
    public function getNextSessionBatches($session)
    {
        return $this->course_group->getBatchOption($session->id);
    }

    /**
     * Get next session transport circles
     *
     * @return Array
     */
    public function getNextSessionTransportCircles($session)
    {
        return $this->transport_circle->selectAll($session->id);
    }

    /**
     * Get next session fee concessions
     *
     * @return Array
     */
    public function getNextSessionFeeConcessions($session)
    {
        return $this->fee_concession->selectAll($session->id);
    }

    /**
     * Promote multiple student.
     *
     * @param array $params
     */
    public function store($params)
    {
        $ids                 = gv($params, 'ids', []);
        $batch_id            = gv($params, 'next_session_batch_id');
        $transport_circle_id = gv($params, 'next_session_transport_circle_id');
        $fee_concession_id   = gv($params, 'next_session_fee_concession_id');

        $next_session = $this->getNextSession();

        if (! count($ids)) {
            throw ValidationException::withMessages(['message' => trans('general.please_select_atleast_one_row')]);
        }

        $batch = $this->batch->findWithSessionOrFail($batch_id, $next_session->id, 'next_session_batch_id');

        if ($transport_circle_id) {
            $transport_circle = $this->transport_circle->findWithSessionOrFail($transport_circle_id, $next_session->id, 'next_session_transport_circle_id');
        }

        if ($fee_concession_id) {
            $fee_concession = $this->fee_concession->findWithSessionOrFail($fee_concession_id, $next_session->id, 'next_session_fee_concession_id');
        }

        $fee_allocation = $this->fee_allocation->with('feeAllocationGroups', 'feeAllocationGroups.feeInstallments')->where(function ($q) use ($batch) {
            $q->where('batch_id', $batch->id)->orWhere('course_id', $batch->course_id);
        })->first();

        if (! $fee_allocation) {
            throw ValidationException::withMessages(['next_session_batch_id' => trans('finance.no_fee_allocated')]);
        }

        $student_record_ids = $this->student_record->filterBySession()->whereIsPromoted(0)->whereNull('date_of_exit')->get()->pluck('id')->all();

        $invalid_id = array_first($ids, function ($value, $key) use ($student_record_ids) {
            return ! in_array($value, $student_record_ids);
        });

        if ($invalid_id) {
            $student_record = $this->student_record->with('student')->find($invalid_id);

            if ($student_record) {
                throw ValidationException::withMessages(['message' => trans('student.could_not_find_student')]);
            } else {
                throw ValidationException::withMessages(['message' => trans('student.student_cannot_be_promoted', ['name' => $student_record->Student->name])]);
            }
        }

        $student_records = $this->student_record->whereIn('id', $ids)->get();

        foreach ($ids as $id) {
            $student_record = $student_records->firstWhere('id', $id);
            $student_record->is_promoted = 1;
            $student_record->save();

            $new_student_record = $this->student_record->create([
                'academic_session_id' => $next_session->id,
                'student_id' => $student_record->student_id,
                'admission_id' => $student_record->admission_id,
                'fee_allocation_id' => $fee_allocation->id,
                'batch_id' => $batch->id,
                'date_of_entry' => date('Y-m-d'),
                'entry_remarks' => gv($params, 'promotion_remarks'),
                'options' => []
            ]);

            $installments = array();
            foreach ($fee_allocation->FeeAllocationGroups as $fee_allocation_group) {
                foreach ($fee_allocation_group->FeeInstallments as $fee_installment) {
                    $installments[] = array(
                        'student_record_id'  => $new_student_record->id,
                        'fee_installment_id' => $fee_installment->id,
                        'transport_circle_id' => $transport_circle_id,
                        'fee_concession_id' => $fee_concession_id,
                        'status' => 'unpaid'
                    );
                }
            }

            $this->student_fee_record->insert($installments);
        }
    }
}
