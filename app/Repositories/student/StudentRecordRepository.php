<?php
namespace App\Repositories\Student;

use App\Models\Finance\Fee\FeeAllocation;
use App\Models\Finance\Fee\FeeConcession;
use App\Models\Finance\Fee\FeeInstallment;
use App\Models\Finance\Fee\FeeInstallmentDetail;
use App\Models\Finance\Transaction\Transaction;
use App\Models\Student\Admission;
use App\Models\Student\StudentFeeRecord;
use App\Models\Student\StudentFeeRecordDetail;
use App\Models\Student\StudentOptionalFeeRecord;
use App\Models\Student\StudentRecord;
use App\Models\Transport\TransportCircle;
use App\Repositories\Academic\BatchRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Academic\IdCardTemplateRepository;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Finance\AccountRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StudentRecordRepository {
	protected $student_record;
	protected $student_fee_record;
	protected $transport_circle;
	protected $fee_concession;
	protected $student_optional_fee_record;
	protected $account;
	protected $payment_method;
	protected $fee_installment;
	protected $transaction;
	protected $student_fee_record_detail;
	protected $course_group;
	protected $batch;
	protected $fee_allocation;
	protected $employee;
	protected $admission;
	protected $id_card_template;

	/**
	 * Instantiate a new instance.
	 *
	 * @return void
	 */
	public function __construct(
		StudentRecord $student_record,
		StudentFeeRecord $student_fee_record,
		TransportCircle $transport_circle,
		FeeConcession $fee_concession,
		StudentOptionalFeeRecord $student_optional_fee_record,
		AccountRepository $account,
		PaymentMethodRepository $payment_method,
		FeeInstallment $fee_installment,
		Transaction $transaction,
		StudentFeeRecordDetail $student_fee_record_detail,
		CourseGroupRepository $course_group,
		BatchRepository $batch,
		FeeAllocation $fee_allocation,
		EmployeeRepository $employee,
		Admission $admission,
		IdCardTemplateRepository $id_card_template
	) {
		$this->student_record = $student_record;
		$this->student_fee_record = $student_fee_record;
		$this->transport_circle = $transport_circle;
		$this->fee_concession = $fee_concession;
		$this->student_optional_fee_record = $student_optional_fee_record;
		$this->account = $account;
		$this->payment_method = $payment_method;
		$this->fee_installment = $fee_installment;
		$this->transaction = $transaction;
		$this->student_fee_record_detail = $student_fee_record_detail;
		$this->course_group = $course_group;
		$this->batch = $batch;
		$this->fee_allocation = $fee_allocation;
		$this->employee = $employee;
		$this->admission = $admission;
		$this->id_card_template = $id_card_template;
	}

	/**
	 * Find student with given id or throw an error.
	 *
	 * @param integer $id
	 * @param integer $record_id
	 * @return StudentRecord
	 */
	public function findOrFail($id, $record_id, $field = 'message') {
		$student_record = $this->student_record->whereHas('student', function ($q) use ($id) {
			$q->where('id', $id);
		})->filterById($record_id)->first();

		if (!$student_record) {
			throw ValidationException::withMessages([$field => trans('student.could_not_find')]);
		}

		return $student_record;
	}

	/**
	 * Find student with given uuid or throw an error.
	 *
	 * @param string $uuid
	 * @param integer $record_id
	 * @return StudentRecord
	 */
	public function findByUuidOrFail($uuid, $record_id, $field = 'message') {
		$student_record = $this->student_record->whereHas('student', function ($q) use ($uuid) {
			$q->where('uuid', $uuid);
		})->filterById($record_id)->first();

		if (!$student_record) {
			throw ValidationException::withMessages([$field => trans('student.could_not_find')]);
		}

		return $student_record;
	}

	/**
	 * Get record edit requisite.
	 *
	 * @return Array
	 */
	public function getRecordPreRequisite() {
		$batches = $this->course_group->getBatchOption();

		return compact('batches');
	}

	/**
	 * Update student record.
	 *
	 * @param StudentRecord $student_record
	 * @param array $params
	 * @return void
	 */
	public function updateRecord(StudentRecord $student_record, $params) {
		if ($student_record->academic_session_id != config('config.default_academic_session.id')) {
			throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
		}

		beginTransaction();

		$admission = $student_record->admission;

		$prefix = gv($params, 'prefix');
		$number = gv($params, 'number');

		if (!is_numeric($number)) {
			throw ValidationException::withMessages(['number' => trans('validation.integer', ['attribute' => trans('student.admission_number')])]);
		}

		if ($this->admission->where('id', '!=', $admission->id)->filterByNumber($number)->filterByPrefix($prefix)->count()) {
			throw ValidationException::withMessages(['number' => trans('validation.unique', ['attribute' => trans('student.admission_number')])]);
		}

		$admission->prefix = $prefix;
		$admission->number = $number;

		$next_student_records = $this->student_record->filterByStudentId($student_record->student_id)->where('date_of_entry', '>', toDate($student_record->date_of_entry))->count();

		if ($next_student_records) {
			throw ValidationException::withMessages(['message' => trans('student.no_modification_allowed_in_intermediate_records')]);
		}

		$first_student_record = $this->student_record->filterByAdmissionId($admission->id)->orderBy('date_of_entry', 'asc')->first();

		$date_of_entry = toDate(gv($params, 'date_of_entry'));

		if ($date_of_entry != toDate($student_record->date_of_entry)) {
			$previous_student_record = $this->student_record->filterByStudentId($student_record->student_id)->where('date_of_entry', '<', toDate($student_record->date_of_entry))->orderBy('date_of_entry', 'desc')->first();

			if ($previous_student_record && toDate($previous_student_record->date_of_exit) && toDate($previous_student_record->date_of_exit) >= $date_of_entry) {
				throw ValidationException::withMessages(['message' => trans('student.record_is_overlapping')]);
			}

			if ($previous_student_record && !$previous_student_record->date_of_exit && toDate($previous_student_record->date_of_entry) >= $date_of_entry) {
				throw ValidationException::withMessages(['message' => trans('student.record_is_overlapping')]);
			}

			if ($date_of_entry > config('config.default_academic_session.end_date')) {
				throw ValidationException::withMessages(['message' => trans('student.date_of_entry_should_less_than_session_end_date')]);
			}

			$student_record->date_of_entry = toDate($date_of_entry);

			if ($first_student_record->id == $student_record->id) {
				$admission->date_of_admission = toDate($date_of_entry);
			}

		}

		if (!$student_record->relationLoaded('studentFeeRecords')) {
			$student_record->load('studentFeeRecords');
		}

		if (!$student_record->relationLoaded('batch')) {
			$student_record->load('batch');
		}

		$batch_id = gv($params, 'batch_id');
		$batch = $this->batch->findOrFail($batch_id);

		if ($batch->id != $student_record->batch_id) {

			$batch->load('feeAllocation');

			$fee_allocation = $batch->feeAllocation;

			$change_course_batch = false;
			if ((!$fee_allocation && $batch->course_id == $student_record->batch->course_id) || ($fee_allocation && $fee_allocation->course_id && $fee_allocation->course_id == $student_record->batch->course_id)) {
				$change_course_batch = true;
			}

			if (!$change_course_batch && $student_record->studentFeeRecords->firstWhere('status', '!=', 'unpaid')) {
				throw ValidationException::withMessages(['message' => trans('student.cannot_edit_record_batch_after_fee_payment')]);
			}

			$student_record->batch_id = $batch->id;
		}

		$student_record->save();
		$admission->save();

		commitTransaction();
	}

	/**
	 * Update student fee.
	 *
	 * @param StudentRecord $student_record
	 * @param array $params
	 * @return Array
	 */
	public function setFee(StudentRecord $student_record, $params) {
		$fee_groups = gv($params, 'fee_groups', []);

		$transport_circle_ids = $this->transport_circle->filterBySession($student_record->academic_session_id)->get()->pluck('id')->all();
		$fee_concession_ids = $this->fee_concession->filterBySession($student_record->academic_session_id)->get()->pluck('id')->all();

		foreach ($fee_groups as $fee_group) {
			$installments = gv($fee_group, 'installments', []);

			foreach ($installments as $installment) {
				$fee_installment_id = gv($installment, 'fee_installment_id');
				$transport_circle_id = gv($installment, 'transport_circle_id');
				$fee_concession_id = gv($installment, 'fee_concession_id');
				$late_fee_applicable = gbv($installment, 'late_fee_applicable');
				$late_fee_frequency = gv($installment, 'late_fee_frequency');
				$due_date = toDate(gv($installment, 'due_date'));
				$late_fee = gv($installment, 'late_fee', 0);
				$remarks = gv($installment, 'remarks');

				if ($late_fee_applicable && !$late_fee_frequency) {
					throw ValidationException::withMessages(['message' => trans('validation.numeric', ['attribute' => trans('finance.late_fee_frequency')])]);
				}

				if ($late_fee_applicable && (!$late_fee || $late_fee < 0)) {
					throw ValidationException::withMessages(['message' => trans('validation.numeric', ['attribute' => trans('finance.late_fee')])]);
				}

				$student_fee_record = $this->student_fee_record->with('studentOptionalFeeRecords', 'feeInstallment')->filterByStudentRecordId($student_record->id)->filterByFeeInstallmentId($fee_installment_id)->first();

				if (!$student_fee_record) {
					throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_installment')]);
				}

				if ($transport_circle_id && !in_array($transport_circle_id, $transport_circle_ids)) {
					throw ValidationException::withMessages(['message' => trans('transport.could_not_find_circle')]);
				}

				if ($fee_concession_id && !in_array($fee_concession_id, $fee_concession_ids)) {
					throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_concession')]);
				}

				$next_student_fee_record = $this->student_fee_record->with('feeInstallment')->filterByStudentRecordId($student_record->id)->where('fee_installment_id', '>', $fee_installment_id)->orderBy('fee_installment_id', 'asc')->first();

				if ($next_student_fee_record && $next_student_fee_record->feeInstallment->fee_allocation_group_id == $student_fee_record->feeInstallment->fee_allocation_group_id && (($next_student_fee_record->due_date && toDate($next_student_fee_record->due_date) <= $due_date) || (!$next_student_fee_record->due_date && toDate($next_student_fee_record->feeInstallment->due_date) <= $due_date))) {
					throw ValidationException::withMessages(['due_date_' . $fee_installment_id => trans('finance.due_date_greater_than_next_installment_due_date')]);
				}

				$previous_student_fee_record = $this->student_fee_record->with('feeInstallment')->filterByStudentRecordId($student_record->id)->where('fee_installment_id', '<', $fee_installment_id)->orderBy('fee_installment_id', 'desc')->first();

				if ($previous_student_fee_record && $previous_student_fee_record->feeInstallment->fee_allocation_group_id == $student_fee_record->feeInstallment->fee_allocation_group_id && (($previous_student_fee_record->due_date && toDate($previous_student_fee_record->due_date) >= $due_date) || (!$previous_student_fee_record->due_date && toDate($previous_student_fee_record->feeInstallment->due_date) >= $due_date))) {
					throw ValidationException::withMessages(['due_date_' . $fee_installment_id => trans('finance.due_date_less_than_previous_installment_due_date')]);
				}

				if ($student_fee_record->status == 'unpaid') {
					$student_fee_record->transport_circle_id = $transport_circle_id;
					$student_fee_record->fee_concession_id = $fee_concession_id;
					$student_fee_record->due_date = ($student_fee_record->feeInstallment->due_date != $due_date) ? toDate($due_date) : null;
					$student_fee_record->late_fee_applicable = ($student_fee_record->feeInstallment->late_fee_applicable != $late_fee_applicable) ? $late_fee_applicable : null;
					$student_fee_record->late_fee_frequency = ($student_fee_record->feeInstallment->late_fee_frequency != $late_fee_frequency) ? $late_fee_frequency : null;
					$student_fee_record->late_fee = ($student_fee_record->feeInstallment->late_fee != $late_fee) ? $late_fee : 0;
					$student_fee_record->remarks = $remarks;
					$student_fee_record->save();

					$fee_heads = gv($installment, 'heads', []);

					$optional_fee_head_ids = $this->student_optional_fee_record->filterByStudentFeeRecordId($student_fee_record->id)->get()->pluck('fee_head_id')->all();

					$non_optional_ids = array();
					$new_optional_fee_heads = array();
					foreach ($fee_heads as $fee_head) {
						$fee_head_id = gv($fee_head, 'id');
						$is_optional = gbv($fee_head, 'is_optional');
						$value = gbv($fee_head, 'value');

						if ($is_optional && !$value) {
							if (!in_array($fee_head_id, $optional_fee_head_ids)) {
								$new_optional_fee_heads[] = array(
									'student_fee_record_id' => $student_fee_record->id,
									'fee_head_id' => $fee_head_id,
								);
							}
						} else {
							$non_optional_ids[] = $fee_head_id;
						}
					}

					$this->student_optional_fee_record->insert($new_optional_fee_heads);
					$this->student_optional_fee_record->filterByStudentFeeRecordId($student_fee_record->id)->whereIn('fee_head_id', $non_optional_ids)->delete();
				}
			}
		}
	}

	/**
	 * Reset student fee.
	 *
	 * @param StudentRecord $student_record
	 * @param array $params
	 * @return Array
	 */
	public function resetFee(StudentRecord $student_record, $params) {
		$student_record->load('studentFeeRecords');

		if ($student_record->studentFeeRecords->where('status', '!=', 'unpaid')->count()) {
			throw ValidationException::withMessages(['message' => trans('student.fee_cannot_reset_for_any_paid_installment')]);
		}

		$this->student_fee_record->where('student_record_id', $student_record->id)->delete();
		$student_record->fee_allocation_id = null;
		$student_record->save();
	}

	/**
	 * Load more records
	 *
	 * @param StudentRecord $student_record
	 * @return StudentRecord
	 */
	public function loadFeeData(StudentRecord $student_record) {
		return $student_record->load('academicSession', 'student', 'student.parent', 'studentFeeRecords', 'batch', 'batch.course', 'batch.course.courseGroup', 'admission', 'studentFeeRecords.transportCircle', 'studentFeeRecords.feeConcession', 'studentFeeRecords.feeConcession.feeConcessionDetails', 'studentFeeRecords.studentOptionalFeeRecords', 'studentFeeRecords.transactions', 'feeAllocation', 'feeAllocation.feeAllocationGroups', 'feeAllocation.feeAllocationGroups.feeGroup', 'feeAllocation.feeAllocationGroups.feeGroup.feeHeads', 'feeAllocation.feeAllocationGroups.feeInstallments', 'feeAllocation.feeAllocationGroups.feeInstallments.transportFee', 'feeAllocation.feeAllocationGroups.feeInstallments.transportFee.transportFeeDetails', 'feeAllocation.feeAllocationGroups.feeInstallments.feeInstallmentDetails', 'feeAllocation.feeAllocationGroups.feeInstallments.feeInstallmentDetails.feeHead');
	}

	/**
	 * Get data for create fee
	 *
	 * @param StudentRecord $student_record
	 * @return Array
	 */
	public function getDataForCreateFee(StudentRecord $student_record) {
		$student_record->load('academicSession', 'student', 'student.parent', 'studentFeeRecords', 'batch', 'batch.course', 'batch.course.courseGroup', 'admission');

		$transport_circles = $this->transport_circle->filterBySession($student_record->academic_session_id)->get(['name', 'id']);
		$fee_concessions = $this->fee_concession->filterBySession($student_record->academic_session_id)->get(['name', 'id']);

		return compact('student_record', 'transport_circles', 'fee_concessions');
	}

	/**
	 * Create fee record for student
	 *
	 * @param StudentRecord $student_record
	 * @param Array $params
	 * @return void
	 */
	public function create(StudentRecord $student_record, $params) {
		$batch = $this->batch->findOrFail($student_record->batch_id);

		$fee_allocation = $this->fee_allocation->with('feeAllocationGroups', 'feeAllocationGroups.feeInstallments')->filterBySession()->where(function ($q) use ($batch) {
			$q->where('batch_id', $batch->id)->orWhere('course_id', $batch->course_id);
		})->first();

		if (!$fee_allocation) {
			throw ValidationException::withMessages(['batch_id' => trans('finance.no_fee_allocated')]);
		}

		$transport_circle_id = gv($params, 'transport_circle_id');

		if ($transport_circle_id && !$this->transport_circle->find($transport_circle_id)) {
			throw ValidationException::withMessages(['transport_circle_id' => trans('transport.could_not_find_circle')]);
		}

		$fee_concession_id = gv($params, 'fee_concession_id');

		if ($fee_concession_id && !$this->fee_concession->find($fee_concession_id)) {
			throw ValidationException::withMessages(['fee_concession_id' => trans('finance.could_not_find_fee_concession')]);
		}

		$existing_student_fee_record_count = $this->student_fee_record->whereStudentRecordId($student_record->id)->count();

		if ($existing_student_fee_record_count) {
			throw ValidationException::withMessages(['message' => trans('student.duplicate_fee_installment_found')]);
		}

		$installments = array();
		foreach ($fee_allocation->feeAllocationGroups as $fee_allocation_group) {
			foreach ($fee_allocation_group->feeInstallments as $fee_installment) {
				$installments[] = array(
					'student_record_id' => $student_record->id,
					'fee_installment_id' => $fee_installment->id,
					'transport_circle_id' => $transport_circle_id ?: null,
					'fee_concession_id' => $fee_concession_id ?: null,
					'status' => 'unpaid',
				);
			}
		}

		$this->student_fee_record->insert($installments);

		$student_record->fee_allocation_id = $fee_allocation->id;
		$student_record->save();
	}

	/**
	 * Get fee detail.
	 *
	 * @param StudentRecord $student_record
	 * @return Array
	 */
	public function fee(StudentRecord $student_record) {
		if (!$student_record->fee_allocation_id) {
			throw ValidationException::withMessages(['message' => trans('student.fee_unallocated')]);
		}

		$student_record = $this->loadFeeData($student_record);

		$transport_circles = $this->transport_circle->filterBySession($student_record->academic_session_id)->get(['name', 'id']);
		$fee_concessions = $this->fee_concession->filterBySession($student_record->academic_session_id)->get(['name', 'id']);
		$late_fee_frequencies = getLateFeeFrequencies();
		$today= date('Y-m-d');

		return compact('student_record', 'transport_circles', 'fee_concessions', 'late_fee_frequencies', 'today');
	}

	/**
	 * Get fee requisite.
	 *
	 * @return Array
	 */
	public function getFeePreRequisite() {
		$account_details = $this->account->getAll();
        $payment_method_details = $this->payment_method->getAll();
        $payment_methods = generateSelectOption($payment_method_details->pluck('name', 'id')->all());
        $accounts = generateSelectOption($account_details->where('is_active',1)->pluck('name', 'id')->all());
        $default_payment_method = $payment_method_details->firstWhere('is_default',1);
        $selected_payment_method = $default_payment_method ? array('id' => $default_payment_method->id, 'name' => $default_payment_method->name) : null;
        $default_account = $account_details->firstWhere('is_default',1);
        $selected_account = $default_account ? array('id' => $default_account->id, 'name' => $default_account->name) : null;

		return compact('accounts', 'payment_method_details', 'payment_methods','selected_payment_method','selected_account');
	}

	/**
	 * Get transport fee
	 *
	 * @param StudentFeeRecord $student_fee_record
	 * @param FeeInstallment $fee_installment
	 * @return integer
	 */
	private function getTransportFee(StudentFeeRecord $student_fee_record, FeeInstallment $fee_installment) {
		if ($fee_installment->feeAllocationGroup->feeGroup->getOption('has_transport') && $student_fee_record->transport_circle_id) {
			$transport_fee = $fee_installment->transportFee ? $fee_installment->transportFee->transportFeeDetails->firstWhere('transport_circle_id', $student_fee_record->transport_circle_id) : null;
			return $transport_fee ? $transport_fee->amount : 0;
		}

		return 0;
	}

	/**
	 * Get fee head amount
	 *
	 * @param StudentFeeRecord $student_fee_record
	 * @param FeeInstallmentDetail $fee_installment_detail
	 * @return integer
	 */
	private function getFee(StudentFeeRecord $student_fee_record, FeeInstallmentDetail $fee_installment_detail) {
		$amount = $fee_installment_detail->amount;

		if ($student_fee_record->studentOptionalFeeRecords->where('fee_head_id', $fee_installment_detail->fee_head_id)->count()) {
			$amount = 0;
		}

		if ($amount && $student_fee_record->fee_concession_id) {
			$fee_concession = $student_fee_record->feeConcession->feeConcessionDetails->firstWhere('fee_head_id', $fee_installment_detail->fee_head_id);

			$concession = $fee_concession ? ($fee_concession->type == 'percent' ? (($amount * $fee_concession->amount) / 100) : $fee_concession->amount) : 0;

			$amount -= $concession;

			$amount = ($amount < 0) ? 0 : $amount;
		}

		return $amount;
	}

	/**
	 * Get installment total fee
	 *
	 * @param StudentRecord $student_record
	 * @param FeeInstallment $fee_installment
	 * @return integer
	 */
	private function getInstallmentTotal(StudentRecord $student_record, FeeInstallment $fee_installment) {
		$total = 0;

		$student_fee_record = $student_record->studentFeeRecords->firstWhere('fee_installment_id', $fee_installment->id);

		foreach ($fee_installment->feeInstallmentDetails as $fee_installment_detail) {
			$total += $this->getFee($student_fee_record, $fee_installment_detail);
		}

		$total += $this->getTransportFee($student_fee_record, $fee_installment);

		return $total;
	}

	/**
	 * Get installment late fee
	 *
	 * @param StudentRecord $student_record
	 * @param FeeInstallment $fee_installment
	 * @param Date $date
	 * @return integer
	 */
	private function getLateFee(StudentRecord $student_record, FeeInstallment $fee_installment, $date = null) {
		$date = ($date) ? toDate($date) : date('Y-m-d');

		$student_fee_record = $student_record->studentFeeRecords->firstWhere('fee_installment_id', $fee_installment->id);

		$due_date = $student_fee_record->due_date ? toDate($student_fee_record->due_date) : toDate($fee_installment->due_date);

		$late_fee_applicable = (($student_fee_record->late_fee_applicable == null && $fee_installment->late_fee_applicable) || $student_fee_record->late_fee_applicable) ? 1 : 0;

		if ($due_date < $date && $late_fee_applicable) {
			$late_days = dateDiff($due_date, $date);

			// $per_period = floor($late_days / ($student_fee_record->late_fee_frequency ?: $fee_installment->late_fee_frequency));
			// $late_fee = ($student_fee_record->late_fee ?: $fee_installment->late_fee) * $per_period;

			$late_fee_frequency = $student_fee_record->late_fee_frequency ? : $fee_installment->late_fee_frequency;

            if ($late_fee_frequency == 500) {
                if ($late_days < 10) {
                    return 20;
                } else {
                    return 50;
                }
            }

            $per_period = floor($late_days / ($late_fee_frequency));
            $late_fee = ($student_fee_record->late_fee ? : $fee_installment->late_fee) * $per_period;

			return $late_fee;
		}

		return 0;
	}

	public function getFeeInstallment(StudentRecord $student_record, $fee_installment_id) {
		$fee_installment = $this->fee_installment->with('feeAllocationGroup', 'feeAllocationGroup.feeGroup', 'feeAllocationGroup.feeInstallments', 'feeAllocationGroup.feeInstallments.feeInstallmentDetails', 'transportFee', 'transportFee.transportFeeDetails')->whereHas('feeAllocationGroup', function ($q) use ($student_record) {
			$q->whereHas('feeAllocation', function ($q1) use ($student_record) {
				$q1->where('batch_id', $student_record->batch_id)->orWhere('course_id', $student_record->batch->course_id);
			});
		})->filterById($fee_installment_id)->first();

		if (!$fee_installment) {
			throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_installment')]);
		}

		return $fee_installment;
	}

	private function validateAmount($amount) {
		if ($amount < 0) {
			rollBackTransaction();
			throw ValidationException::withMessages(['message' => trans('general.transaction_failed')]);
		}
	}

	private function validateIntegerMinZero($number, $name, $field = 'message') {
		if (!is_numeric($number)) {
			throw ValidationException::withMessages([$field => trans('validation.numeric', ['attribute' => $name])]);
		}

		if ($number < 0) {
			throw ValidationException::withMessages([$field => trans('validation.min.numeric', ['attribute' => $name, 'min' => 0])]);
		}
	}

	private function validatePreviousPaymentDate(StudentRecord $student_record, $fee_installment, $params = array()) {
		$date = toDate(gv($params, 'date'));

		$previous_fee_paid_ids = $this->student_fee_record->filterByStudentRecordId($student_record->id)->whereIn('status', ['paid', 'partially_paid'])
			->whereHas('feeInstallment', function ($q) use ($fee_installment) {
				$q->where('fee_allocation_group_id', $fee_installment->fee_allocation_group_id);
			})->get()->pluck('id')->all();

		$previous_paid_date = $this->transaction->whereIn('student_fee_record_id', $previous_fee_paid_ids)->where('is_cancelled', 0)->max('date');

		if ($previous_paid_date > $date) {
			throw ValidationException::withMessages(['message' => trans('student.date_cannot_less_than_previous_paid_date', ['date' => showDate($previous_paid_date)])]);
		}
	}

	private function validateInput($fee_installments, $params = array()) {
		$installments = gv($params, 'installments', []);
		$date = toDate(gv($params, 'date'));
		$amount = gv($params, 'amount', 0);
		$additional_fee_charge = gv($params, 'additional_fee_charge', 0);
		$additional_fee_discount = gv($params, 'additional_fee_discount', 0);

		if ($additional_fee_charge && ! gv($params, 'additional_fee_charge_label')) {
			throw ValidationException::withMessages(['additional_fee_charge_label' => trans('validation.required', ['attribute' => trans('student.additional_fee_charge')])]);
		}

		if ($additional_fee_discount && ! gv($params, 'additional_fee_discount_label')) {
			throw ValidationException::withMessages(['additional_fee_discount_label' => trans('validation.required', ['attribute' => trans('student.additional_fee_discount')])]);
		}

		if (!count($installments)) {
			throw ValidationException::withMessages(['message' => trans('finance.installment_missing')]);
		}

		$can_customize_fee_date = (\Auth::check() && \Auth::user()->can('customize-fee-date')) ? true : false;

		if (!$can_customize_fee_date && $date != date('Y-m-d')) {
			throw ValidationException::withMessages(['message' => trans('student.fee_payment_date_cannot_be_customized')]);
		}

		$this->validateIntegerMinZero($amount, trans('finance.amount'));

		$previous_installment = null;
		$total = 0;
		foreach ($installments as $installment) {

			$this->validateIntegerMinZero(gv($installment, 'installment_balance', 0), trans('finance.installment_balance'));

			$this->validateIntegerMinZero(gv($installment, 'late_fee_balance', 0), trans('finance.late_fee_balance'));

			$installment_id = gv($installment, 'fee_installment_id');
			$student_fee_installment = $fee_installments->firstWhere('id', $installment_id);

			if (!$student_fee_installment) {
				throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_installment')]);
			}

			if ($previous_installment && toDate($previous_installment->due_date) > toDate($student_fee_installment->due_date)) {
				throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
			}

			$previous_installment = $student_fee_installment;
			$total += (gv($installment, 'installment_balance', 0) + gv($installment, 'late_fee_balance', 0));
		}

		$can_make_partial_payment = (\Auth::check() && \Auth::user()->can('make-partial-fee-payment')) ? true : false;
		if (!$can_make_partial_payment && $total != $amount) {
			throw ValidationException::withMessages(['message' => trans('finance.total_mismatch')]);
		}

		$final_amount = $amount + $additional_fee_charge - $additional_fee_discount;

		if ($amount < 0) {
			throw ValidationException::withMessages(['message' => trans('validation.min.numeric', ['attribute' => trans('finance.amount'), 'min' => 0])]);
		}
	}

	private function initializeTransaction($params = array()) {
		$date = toDate(gv($params, 'date'));
		$amount = gv($params, 'amount', 0);
		$is_online_payment = gbv($params, 'is_online_payment');
		$account_id = gv($params, 'account_id');
		$payment_method_id = gv($params, 'payment_method_id');
		$remarks = gv($params, 'remarks');
		$source = gv($params, 'source');
		$source_detail = gv($params, 'source_detail');
		$gateway_token = gv($params, 'gateway_token');
		$account_prefix = substr(strtoupper($source), 0, 3);
		$installments = gv($params, 'installments', []);

		if (!$is_online_payment && $amount) {
			$account = $this->account->findOrFail($account_id, 'account_id');
			$account_prefix = $account->prefix;
			$payment_method = $this->payment_method->findOrFail($payment_method_id, 'payment_method_id');
			$number = $this->transaction->filterByAccountId($account->id)->filterByType(1)->max('number');
		} else {
			$number = $this->transaction->whereSource($source)->max('number');
		}
		$number = ($number) ?: 0;

		$instrument_number = (isset($payment_method) && $payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null;
		$instrument_date = (isset($payment_method) && $payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null;
		$instrument_clearing_date = (isset($payment_method) && $payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null;
		$instrument_bank_detail = (isset($payment_method) && $payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null;
		$reference_number = ($is_online_payment || (isset($payment_method) && $payment_method->getOption('requires_instrument_bank_detail'))) ? gv($params, 'reference_number') : null;

		$transaction = [
			'user_id' => gv($params, 'user_id') ?: (\Auth::check() ? \Auth::user()->id : null),
			'prefix' => $account_prefix,
			'account_id' => $account_id,
			'date' => toDate($date),
			'remarks' => $remarks,
			'payment_method_id' => $payment_method_id,
			'is_multi_installment' => count($installments) > 1 ? 1 : 0,
			'instrument_number' => $instrument_number,
			'instrument_clearing_date' => $instrument_clearing_date,
			'instrument_bank_detail' => $instrument_bank_detail,
			'instrument_date' => $instrument_date,
			'reference_number' => $reference_number,
			'source' => $source,
			'source_detail' => $source_detail,
			'gateway_token' => $gateway_token,
			'is_online_payment' => $is_online_payment,
		];

		return compact('transaction', 'number');
	}

	/**
	 * Make fee payment.
	 *
	 * @param StudentRecord $student_record
	 * @return Array $params
	 */
	public function makePayment(StudentRecord $student_record, $params = array()) {
		$student_record = $this->loadFeeData($student_record);
		$fee_installment_id = gv($params, 'installment_id');
		$date = toDate(gv($params, 'date'));
		$amount = gv($params, 'amount', 0);
		$handling_fee = gv($params, 'handling_fee', 0);
		$installments = gv($params, 'installments', []);

		$is_student_or_parent =  \Auth::user()->hasAnyRole([config('system.default_role.student'), config('system.default_role.parent')]) ? true : false;

		if (! $is_student_or_parent) {
			$amount -= gv($params, 'additional_fee_charge', 0);
			$amount += gv($params, 'additional_fee_discount', 0);
			$params['amount'] = $amount;
		}

		$data = $this->initializeTransaction($params);
		$transaction = $data['transaction'];
		$number = $data['number'];
		$transaction_group_id = null;

		$fee_installment = $this->getFeeInstallment($student_record, $fee_installment_id);

		$fee_installments = $fee_installment->feeAllocationGroup->feeInstallments->sortBy('due_date');

		$this->validateInput($fee_installments, $params);

		$this->validatePreviousPaymentDate($student_record, $fee_installment, $params);

		$can_customize_late_fee = (\Auth::check() && \Auth::user()->can('customize-late-fee')) ? true : false;

		beginTransaction();

		foreach ($installments as $index => $installment) {
			$installment_id = gv($installment, 'fee_installment_id');
			$student_fee_installment = $fee_installments->firstWhere('id', $installment_id);

			$student_fee_record = $student_record->studentFeeRecords->firstWhere('fee_installment_id', $installment_id);

			if (!$student_fee_record) {
				throw ValidationException::withMessages(['message' => trans('finance.could_not_find_fee_concession')]);
			}

			$fee = $this->getInstallmentTotal($student_record, $student_fee_installment);
			$late_fee = ($fee) ? $this->getLateFee($student_record, $student_fee_installment, $date) : 0;

			$paid = 0;
			foreach ($student_fee_record->transactions->where('is_cancelled', 0)->all() as $paid_fee) {
				$transaction_additional_fee_charge = $paid_fee->getOption('additional_fee_charge');
				$transaction_additional_fee_discount = $paid_fee->getOption('additional_fee_discount');
				$fee += gv($transaction_additional_fee_charge, 'amount', 0) - gv($transaction_additional_fee_discount, 'amount', 0);
				$paid += $paid_fee->amount;
			}

			$transaction['student_fee_record_id'] = $student_fee_record->id;

			$transport_fee = $this->getTransportFee($student_fee_record, $student_fee_installment);

			$input_installment_balance = gv($installment, 'installment_balance', 0);

			$installment_balance = ($fee > $paid) ? ($fee - $paid) : 0;

			if ($installment_balance != $input_installment_balance) {
				throw ValidationException::withMessages(['message' => trans('finance.total_mismatch')]);
			}

			$input_late_fee_balance = gv($installment, 'late_fee_balance', 0);

			$late_fee_balance = (!$installment_balance && $late_fee) ? ($late_fee - ($paid - $fee)) : $late_fee;

			if (!$can_customize_late_fee && $late_fee_balance != $input_late_fee_balance) {
				throw ValidationException::withMessages(['message' => trans('finance.total_mismatch')]);
			}

			$is_customized_late_fee = 0;
			if ($can_customize_late_fee && $late_fee_balance != $input_late_fee_balance) {
				$late_fee_balance = $input_late_fee_balance;
				$is_customized_late_fee = 1;
			}

			$balance = $installment_balance + $late_fee_balance;

			if (!$index && !$amount && $balance) {
				throw ValidationException::withMessages(['message' => trans('finance.cannot_process_if_amount_is_zero')]);
			}

			$is_payable = 0;
			$is_paid = 0;
			if ($student_fee_record->status != 'paid' && $amount > 0) {
				$is_paid = ($amount >= $balance) ? 1 : 0;
				$transaction_amount = ($amount > $balance) ? $balance : $amount;
				$amount -= $transaction_amount;
				$is_payable = 1;
			}

			$this->validateAmount($amount);

			if ($is_payable) {
				$number++;
				$transaction['number'] = $number;
				$transaction['amount'] = $transaction_amount;
				$transaction['transaction_group_id'] = $transaction_group_id;

				$transport_fee_paid = 0;
				foreach ($student_fee_record->transactions->where('is_cancelled', 0)->all() as $paid_transport) {
					$transport_fee_paid += ($paid_transport->getOption('transport_fee') ?: 0);
				}

				$late_fee_paid = 0;
				foreach ($student_fee_record->transactions->where('is_cancelled', 0)->all() as $paid_late) {
					$late_fee_paid += ($paid_late->getOption('late_fee') ?: 0);
				}

				$txn = $this->createFeeTransaction($transaction);

				$transaction_amount = $this->createStudentFeeRecordDetail($student_fee_record, $student_fee_installment, $transaction_amount, $txn->id);

				$transport_fee_balance = $transport_fee - $transport_fee_paid;

				$transport = ($transaction_amount) ? (($transaction_amount > $transport_fee_balance) ? $transport_fee_balance : $transaction_amount) : 0;
				$transaction_amount -= $transport;
				$transport_fee_balance -= $transport;

				if ($is_customized_late_fee && $transaction_amount < $late_fee_balance) {
					throw ValidationException::withMessages(['message' => trans('finance.customize_late_fee_must_be_charged_at_one_time')]);
				}

				$late = ($transaction_amount) ? (($transaction_amount > $late_fee_balance) ? $late_fee_balance : $transaction_amount) : 0;
				$transaction_amount -= $late;

				$txn_options = $txn->options;
				$txn_options = [
					'transport_fee' => $transport,
					'late_fee' => $late,
				];

				if (!$transaction_group_id && $handling_fee) {
					$txn->handling_fee = $handling_fee;
				}

				if (!$transaction_group_id && !$is_student_or_parent) {
					$txn_options['additional_fee_charge'] = array(
						'label' => gv($params, 'additional_fee_charge_label'),
						'amount' => gv($params, 'additional_fee_charge', 0)
					);
					$txn_options['additional_fee_discount'] = array(
						'label' => gv($params, 'additional_fee_discount_label'),
						'amount' => gv($params, 'additional_fee_discount', 0)
					);
					$txn->amount = $txn->amount + gv($params, 'additional_fee_charge', 0) - gv($params, 'additional_fee_discount', 0);
				}

				if (!$transaction_group_id && $transaction['is_multi_installment']) {
					$transaction_group_id = $txn->id;
					$txn->transaction_group_id = $transaction_group_id;
				}

				$txn->options = $txn_options;
				$txn->save();		

				$student_fee_record->status = $is_paid ? 'paid' : 'partially_paid';
				$student_fee_record->transport_fee = $student_fee_record->transport_fee + $transport;
				$student_fee_record->late_fee_charged = $student_fee_record->late_fee_charged + $late;
				$student_fee_record->save();
			}

			if (!$is_payable && !$amount && !$balance) {
				$student_fee_record->status = 'paid';
				$student_fee_record->save();

				$number++;
                $transaction['number'] = $number;
                $transaction['amount'] = $amount;
                $transaction['transaction_group_id'] = $transaction_group_id;

                $txn = $this->createFeeTransaction($transaction);

                $transaction_amount = $this->createStudentFeeRecordDetail($student_fee_record, $student_fee_installment, $amount, $txn->id, 1);
			}
		}

		if ($amount) {
			$balance = currency(gv($params, 'amount') - $amount, 1);
			rollBackTransaction();
			throw ValidationException::withMessages(['message' => trans('finance.amount_greater_than_balance', ['balance' => $balance, 'extra' => $amount])]);
		}

		commitTransaction();
	}

	private function createStudentFeeRecordDetail(StudentFeeRecord $student_fee_record, $installment, $amount, $transaction_id) {
		$student_fee_record_details = $this->student_fee_record_detail->whereHas('transaction', function ($q) {
			$q->where('is_cancelled', 0);
		})->filterByStudentFeeRecordId($student_fee_record->id)->get();

		foreach ($installment->feeInstallmentDetails as $fee_installment_detail) {
			$fee_head_amount = $this->getFee($student_fee_record, $fee_installment_detail);

			$balance = $fee_head_amount;
			foreach ($student_fee_record_details->where('fee_head_id', $fee_installment_detail->fee_head_id)->all() as $paid_fee) {
				$balance -= $paid_fee->amount;
			}

			// if ($balance) {
			$fee_amount = ($amount > $balance) ? $balance : $amount;

			$this->student_fee_record_detail->forceCreate([
				'student_fee_record_id' => $student_fee_record->id,
				'fee_head_id' => $fee_installment_detail->fee_head_id,
				'amount' => $fee_amount,
				'transaction_id' => $transaction_id,
				'options' => [],
			]);
			$amount -= $fee_amount;
			// }

			$this->validateAmount($amount);
		}

		return $amount;
	}

	private function createFeeTransaction($params = array()) {
		$transaction_group_id = gv($params, 'transaction_group_id');

		$transaction = $this->transaction->forceCreate([
			'uuid' => Str::uuid(),
			'type' => 1,
			'prefix' => gv($params, 'prefix'),
			'number' => gv($params, 'number'),
			'user_id' => gv($params, 'user_id'),
			'amount' => gv($params, 'amount', 0),
			'account_id' => gv($params, 'account_id'),
			'head' => 'fee',
			'student_fee_record_id' => gv($params, 'student_fee_record_id'),
			'date' => toDate(gv($params, 'date')),
			'transaction_group_id' => $transaction_group_id,
			'remarks' => gv($params, 'remarks'),
			'upload_token' => Str::uuid(),
			'payment_method_id' => gv($params, 'payment_method_id'),
			'instrument_number' => gv($params, 'instrument_number'),
			'instrument_date' => gv($params, 'instrument_date'),
			'instrument_clearing_date' => gv($params, 'instrument_clearing_date'),
			'instrument_bank_detail' => gv($params, 'instrument_bank_detail'),
			'reference_number' => gv($params, 'reference_number'),
			'source' => gv($params, 'source'),
			'source_detail' => gv($params, 'source_detail'),
			'gateway_token' => gv($params, 'gateway_token'),
			'is_online_payment' => gbv($params, 'is_online_payment'),
			'options' => [],
		]);

		if (!$transaction_group_id) {
			$transaction_group_id = $transaction->id;
			$transaction->transaction_group_id = $transaction_group_id;
			$transaction->save();
		}

		return $transaction;
	}

	/**
	 * Get Student Fee Record.
	 *
	 * @param StudentRecord $student_record
	 * @param integer $student_fee_record_id
	 * @return StudentFeeRecord
	 */
	private function getStudentFeeRecord(StudentRecord $student_record, $fee_record_id) {
		$student_fee_record = $this->student_fee_record->with('feeInstallment')->filterByStudentRecordId($student_record->id)->filterById($fee_record_id)->first();

		if (!$student_fee_record) {
			throw ValidationException::withMessages(['message' => trans('general.invalid_link')]);
		}

		return $student_fee_record;
	}

	/**
	 * Get fee receipt detail.
	 *
	 * @param StudentRecord $student_record
	 * @param integer $student_fee_record_id
	 * @param integer $transaction_id
	 * @return Transaction $transaction
	 */
	public function getReceipt(StudentRecord $student_record, $fee_record_id, $transaction_id) {
		$student_fee_record = $this->getStudentFeeRecord($student_record, $fee_record_id);

		$student_fee_records = $this->student_fee_record->where('student_record_id', $student_record->id)->whereHas('feeInstallment', function ($q) use ($student_fee_record) {
			$q->where('fee_allocation_group_id', $student_fee_record->feeInstallment->fee_allocation_group_id);
		})->get()->pluck('id')->all();

		$transaction = $this->transaction->with('account', 'paymentMethod', 'user', 'user.employee', 'studentFeeRecord', 'studentFeeRecord.feeInstallment', 'studentFeeRecord.studentFeeRecordDetails', 'studentFeeRecord.studentFeeRecordDetails.feeHead', 'studentFeeRecordDetails', 'studentFeeRecordDetails.feeHead')->filterById($transaction_id)->whereStudentFeeRecordId($student_fee_record->id)->where('is_cancelled', 0)->first();
		
		$query = $this->transaction
					->with('account', 'paymentMethod', 'user', 'user.employee', 'studentFeeRecord', 'studentFeeRecord.feeInstallment', 'studentFeeRecord.studentFeeRecordDetails', 'studentFeeRecord.studentFeeRecordDetails.feeHead', 'studentFeeRecordDetails', 'studentFeeRecordDetails.feeHead')
					->where('transaction_group_id', $transaction->transaction_group_id)
					->where('id', '<=', $transaction_id)
					->where('is_cancelled', 0);
		
		$transactions = $query->whereIn('student_fee_record_id', $student_fee_records)->get();

		if (!$transaction) {
			throw ValidationException::withMessages(['message' => trans('general.could_not_find_record')]);
		}

		return $transactions;
	}

	/**
	 * Get fee payment detail.
	 *
	 * @param StudentRecord $student_record
	 * @param integer $student_fee_record_id
	 * @return Transaction $transaction
	 */
	public function getPaymentDetail(StudentRecord $student_record, $fee_record_id) {
		$student_fee_record = $this->getStudentFeeRecord($student_record, $fee_record_id);

		$student_fee_records = $this->student_fee_record->where('student_record_id', $student_record->id)->whereHas('feeInstallment', function ($q) use ($student_fee_record) {
			$q->where('fee_allocation_group_id', $student_fee_record->feeInstallment->fee_allocation_group_id);
		})->get()->pluck('id')->all();

		$transactions = $this->transaction->with(['account', 'paymentMethod', 'user', 'user.employee', 'transactionGroups' => function ($q) {
			$q->where('is_cancelled', 0);
		}])->where('student_fee_record_id', $fee_record_id)->where('is_cancelled', 0)->get();

		foreach ($transactions as $transaction) {
			$transaction->is_deletable = $this->transaction->whereIn('student_fee_record_id', $student_fee_records)->whereNotIn('id', $transaction->transactionGroups->pluck('id')->all())->where('id', '>', $transaction->id)->where('is_cancelled', 0)->count() ? 0 : 1;

			$group = $this->transaction->with(['transactionGroups' => function ($q) {
				$q->where('is_cancelled', 0);
			}])->filterById($transaction->transaction_group_id)->first();

			$transaction->groups = $group->transactionGroups;
		}

		return compact('transactions');
	}

	/**
	 * Cancel empty fee payment.
	 *
	 * @param StudentRecord $student_record
	 * @param integer $student_fee_record_id
	 * @return null
	 */
	public function cancelEmptyPayment(StudentRecord $student_record, $fee_record_id) {
		$student_fee_record = $this->getStudentFeeRecord($student_record, $fee_record_id);

		$paid = $this->student_fee_record->where('id', '!=', $student_fee_record->id)->where('student_record_id', $student_record->id)->whereHas('feeInstallment', function ($q) use ($student_fee_record) {
			$q->where('fee_allocation_group_id', $student_fee_record->feeInstallment->fee_allocation_group_id)->where('due_date', '>=', toDate($student_fee_record->feeInstallment->due_date));
		})->whereIn('status', ['paid', 'partially_paid'])->count();

		if ($paid) {
			throw ValidationException::withMessages(['message' => trans('finance.last_fee_payment_can_only_be_cancelled')]);
		}

		$student_fee_record->status = 'unpaid';
		$student_fee_record->save();
	}

	/**
	 * Cancel fee payment.
	 *
	 * @param StudentRecord $student_record
	 * @param integer $student_fee_record_id
	 * @param integer $transaction_id
	 * @param Arrau $params
	 * @return null
	 */
	public function cancelPayment(StudentRecord $student_record, $fee_record_id, $transaction_id, $params) {
		$student_fee_record = $this->getStudentFeeRecord($student_record, $fee_record_id);

		$transaction = $this->transaction->with(['transactionGroups' => function ($q) {
			$q->where('is_cancelled', 0);
		}])->where('student_fee_record_id', $fee_record_id)->filterById($transaction_id)->whereIsCancelled(0)->first();

		if (!$transaction) {
			throw ValidationException::withMessages(['message' => trans('general.could_not_find_record')]);
		}

		if ($transaction->is_online_payment) {
			throw ValidationException::withMessages(['message' => trans('finance.could_not_cancel_online_payment')]);
		}

		if (!$this->employee->userAccessible($transaction->User->Employee) && \Auth::user()->id != $transaction->user_id) {
			throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
		}

		$student_fee_records = $this->student_fee_record->where('student_record_id', $student_record->id)->whereHas('feeInstallment', function ($q) use ($student_fee_record) {
			$q->where('fee_allocation_group_id', $student_fee_record->feeInstallment->fee_allocation_group_id);
		})->get()->pluck('id')->all();

		$is_deletable = $this->transaction->whereIn('student_fee_record_id', $student_fee_records)->whereNotIn('id', $transaction->transactionGroups->pluck('id')->all())->where('id', '>', $transaction->id)->where('is_cancelled', 0)->count() ? 0 : 1;

		if (!$is_deletable) {
			throw ValidationException::withMessages(['message' => trans('finance.last_fee_payment_can_only_be_cancelled')]);
		}

		$transaction_group = $this->transaction->with(['transactionGroups' => function ($q) {
			$q->where('is_cancelled', 0);
		}])->filterById($transaction->transaction_group_id)->first();
		$transaction_group_ids = $transaction_group->transactionGroups->pluck('id')->all();

		$transactions = $this->transaction->whereIn('id', $transaction_group_ids)->with('studentFeeRecord', 'studentFeeRecord.studentFeeRecordDetails', 'studentFeeRecord.studentFeeRecordDetails.transaction')->get();

		beginTransaction();

		foreach ($transactions as $transaction) {
			if ($transaction->is_online_payment) {
				throw ValidationException::withMessages(['message' => trans('finance.could_not_cancel_online_payment')]);
			}

			$transaction->update(['is_cancelled' => 1, 'cancelled_at' => now(), 'cancellation_remarks' => gv($params, 'cancellation_remarks')]);

			$student_fee_record = $transaction->studentFeeRecord;
			$student_fee_record->transport_fee -= ($transaction->getOption('transport_fee') ?: 0);
			$student_fee_record->late_fee_charged -= ($transaction->getOption('late_fee') ?: 0);

			if ($student_fee_record->transport_fee < 0) {
				throw ValidationException::withMessages(['message' => trans('finance.could_not_cancel_selected_receipt')]);
			}

			if ($student_fee_record->late_fee_charged < 0) {
				throw ValidationException::withMessages(['message' => trans('finance.could_not_cancel_selected_receipt')]);
			}

			$paid = $student_fee_record->transport_fee + $student_fee_record->late_fee_charged;
			foreach ($student_fee_record->studentFeeRecordDetails->where('transaction_id', '!=', null)->all() as $student_fee_record_detail) {
				if (!$student_fee_record_detail->transaction->is_cancelled && !in_array($student_fee_record_detail->transaction_id, $transaction_group_ids)) {
					$paid += $student_fee_record_detail->amount;
				}
			}

			$student_fee_record->status = ($paid) ? 'partially_paid' : 'unpaid';
			$student_fee_record->save();
		}

		commitTransaction();
	}

	/**
	 * Get id card pre requisite.
	 *
	 * @return Array
	 */
	public function getIdCardPreRequisite() {
		$batches = $this->course_group->getBatchOption();

		$id_card_templates = $this->id_card_template->selectAllByType('student');

		return compact('batches', 'id_card_templates');
	}

	/**
	 * Validate Id card template
	 * @param  integer $id_card_template_id
	 * @return IdCardTemplate
	 */
	public function validateIdCardTemplate($id_card_template_id) {
		$id_card_template = $this->id_card_template->findOrFail($id_card_template_id);

		if ($id_card_template->type != 'student') {
			throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
		}

		return $id_card_template;
	}

	/**
	 * Get roll number pre requisite.
	 *
	 * @return Array
	 */
	public function getRollNumberPreRequisite() {
		$batches = $this->course_group->getBatchOption();

		return compact('batches');
	}

	/**
	 * Fetch students for given batch
	 *
	 * @param Array $params
	 * @return Array $student_records
	 */
	public function fetchBatchWiseStudent($params = array()) {
		$batch_id = gv($params, 'batch_id');

		$batch = $this->batch->findOrFail($batch_id);

		$student_records = $this->student_record->with('student', 'student.parent', 'admission')->filterBySession()->filterByBatchId($batch_id)->whereNull('date_of_exit')->select('student_records.*', \DB::raw('(SELECT concat_ws(" ", first_name,middle_name,last_name) FROM students WHERE student_records.student_id = students.id ) as name'))->orderBy('name','asc')->get();

		return compact('student_records', 'batch');
	}

	/**
	 * Store roll number of students of given batch
	 *
	 * @param Array $params
	 * @return null
	 */
	public function storeRollNumber($params = array()) {
		$batch_id = gv($params, 'batch_id');

		$batch = $this->batch->findOrFail($batch_id);

		$students = gv($params, 'students', []);

		if (!$students) {
			throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
		}

		$student_record_ids = $this->student_record->with('student', 'student.parent', 'admission')->filterBySession()->filterByBatchId($batch_id)->whereNull('date_of_exit')->get()->pluck('id')->all();

		$roll_numbers = array();
		foreach ($students as $student) {
			$roll_numbers[] = gv($student, 'roll_number');
		}

		if (count($roll_numbers) > count(array_unique($roll_numbers))) {
			throw ValidationException::withMessages(['message' => trans('student.duplicate_roll_number_found')]);
		}

		foreach ($students as $index => $student) {
			$student_record_id = gv($student, 'id');

			if (!in_array($student_record_id, $student_record_ids)) {
				throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
			}

			$roll_number = gv($student, 'roll_number');

			if (!$roll_number) {
				throw ValidationException::withMessages([$index . '_roll_number' => trans('validation.required', ['attribute' => trans('student.roll_number')])]);
			}

			$this->student_record->filterById($student_record_id)->update(['roll_number' => $roll_number]);
		}
	}

	public function search($q) {
		if (!\Auth::user()->can('list-student')) {
			return [];
		}

		$query = $this->student_record->select('id', 'student_id', 'batch_id', 'admission_id')
			->with([
				'student:id,uuid,student_parent_id,first_name,middle_name,last_name,contact_number,date_of_birth,gender',
				'student.parent:id,first_guardian_name',
				'batch:id,course_id,name',
				'batch.course:id,name',
				'admission:id,number,prefix',
			])->where(function ($q1) use ($q) {
			$q1->whereHas('student', function ($q2) use ($q) {
				$q2->where(\DB::raw('(SELECT concat_ws(" ", first_name,middle_name,last_name))'), 'LIKE', '%' . $q . '%');
			})->orWhereHas('admission', function ($q3) use ($q) {
				$q3->where(\DB::raw('concat_ws(prefix," ",LPAD(number, ' . config('config.admission_number_digit') . ', 0))'), 'LIKE', '%' . $q . '%');
			})->orWhereHas('admission',function($q3) use($q) {
                    $q3->where('number' , 'LIKE' , '%'.$q.'%');
			});
		})->filterBySession()->whereNull('date_of_exit');

		if (\Auth::user()->hasRole(config('system.default_role.student'))) {
			$query->whereHas('student', function ($q4) {
				$q4->filterById(\Auth::user()->Student->id);
			});
		}

		if (\Auth::user()->hasRole(config('system.default_role.parent'))) {
			$query->whereHas('student', function ($q5) {
				$q5->whereIn('id', \Auth::user()->Parent->Students->pluck('id')->all());
			});
		}

		return $query->take(10)->get();
	}
}
