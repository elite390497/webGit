<?php
namespace App\Repositories\Student;

use Illuminate\Support\Str;
use App\Models\Student\StudentRecord;

class StudentFeeRecordRepository {

	public function __construct(
		StudentRecord $student_record
	) {
		$this->student_record = $student_record;
	}

	private function addData($array, $data) {
		array_push($array, array(
			'key' => Str::uuid(),
			'text' => $data
		));

		return $array;
	}

	/**
	 * Instantiate a new instance.
	 *
	 * @return void
	 */
	public function feeDetail(StudentRecord $student_record) {
		if (!$student_record->fee_allocation_id) {
			throw ValidationException::withMessages(['message' => trans('student.fee_unallocated')]);
		}

		$fee_details = array();

		$fee_groups = array();
		$grand_total_installment = 0;
		$grand_total_other = 0;
		$grand_total_paid = 0;
		$grand_total_balance = 0;

		foreach ($student_record->feeAllocation->feeAllocationGroups as $fee_allocation_group) {
			$header = array();
			$footer = array();
			$rows = array();

			$header = $this->addData($header, trans('finance.fee_installment_title'));
			$header = $this->addData($header, trans('finance.fee_installment_due_date'));

			foreach ($fee_allocation_group->feeGroup->feeHeads as $fee_head) {
				$header = $this->addData($header, $fee_head->name);
			}

			if ($fee_allocation_group->feeGroup->getOption('has_transport')) {
				$header = $this->addData($header, trans('transport.circle'));
				$header = $this->addData($header, trans('transport.fee'));
			}

			$header = $this->addData($header, trans('finance.late_fee'));
			$header = $this->addData($header, trans('finance.installment_total'));
			$header = $this->addData($header, trans('finance.other'));
			$header = $this->addData($header, trans('finance.paid'));
			$header = $this->addData($header, trans('finance.balance'));
			$header = $this->addData($header, trans('finance.fee_status'));

			$footer = $this->addData($footer, trans('finance.total'));
			$footer = $this->addData($footer, '');

			$total_transport_fee = 0;
			$total_late_fee = 0;
			$total_installment_fee = 0;
			$total_other_fee = 0;
			$total_paid_fee = 0;
			$total_balance_fee = 0;
            $installment_index = 0;
			foreach ($fee_allocation_group->feeInstallments as $fee_installment) {
				$student_fee_record = $student_record->studentFeeRecords->firstWhere('fee_installment_id', $fee_installment->id);

				$installment_data = array();
				$installment_data = $this->addData($installment_data, $fee_installment->title);
				$installment_data = $this->addData($installment_data, showDate($student_fee_record->due_date ? : $fee_installment->due_date));
                                
				foreach($fee_allocation_group->feeGroup->feeHeads as $fee_head) {
					$installment_with_concession = $this->getInstallmentFee($student_fee_record, $fee_installment, $fee_head->id);
					$installment_without_concession = $this->getInstallmentFeeWithoutConcession($student_fee_record, $fee_installment, $fee_head->id);

					array_push($installment_data, array(
						'key' => Str::uuid(),
						'text' => currency($installment_with_concession, 1),
						'actual' => currency($installment_without_concession, 1),
						'is_concession' => $this->checkInstallmentConcession($student_fee_record, $fee_installment, $fee_head->id) ? true : false
					));
				}

                if ($fee_allocation_group->feeGroup->getOption('has_transport')) {
                	$installment_data = $this->addData($installment_data, $this->getTransportCircleName($student_fee_record, $fee_installment));

                	$installment_transport_fee = $this->getTransportFee($student_fee_record, $fee_installment);
                	$total_transport_fee += is_numeric($installment_transport_fee) ? $installment_transport_fee : 0;
                	$installment_data = $this->addData($installment_data, currency($installment_transport_fee, 1));
                }

                $installment_late_fee = $this->getLateFee($student_fee_record, $fee_installment);
                $total_late_fee += is_numeric($installment_late_fee) ? $installment_late_fee : 0;
                $installment_data = $this->addData($installment_data, currency($installment_late_fee, 1));

                $installment_total_fee = $this->getInstallmentTotal($student_fee_record, $fee_installment);
                $total_installment_fee += is_numeric($installment_total_fee) ? $installment_total_fee : 0;
                $grand_total_installment += is_numeric($installment_total_fee) ? $installment_total_fee : 0;
                $installment_data = $this->addData($installment_data, currency($installment_total_fee, 1));

                $installment_other_fee = $this->getInstallmentOther($student_fee_record, $fee_installment);
                $total_other_fee += is_numeric($installment_other_fee) ? $installment_other_fee : 0;
                $grand_total_other += is_numeric($installment_other_fee) ? $installment_other_fee : 0;
                $installment_data = $this->addData($installment_data, currency($installment_other_fee, 1));

                $installment_paid_fee = $this->getInstallmentPaid($student_fee_record, $fee_installment);
                $total_paid_fee += is_numeric($installment_paid_fee) ? $installment_paid_fee : 0;
                $grand_total_paid += is_numeric($installment_paid_fee) ? $installment_paid_fee : 0;
                $installment_data = $this->addData($installment_data, currency($installment_paid_fee, 1));

                $installment_balance_fee = $this->getInstallmentBalance($student_fee_record, $fee_installment);
                $total_balance_fee += is_numeric($installment_balance_fee) ? $installment_balance_fee : 0;
                $grand_total_balance += is_numeric($installment_balance_fee) ? $installment_balance_fee : 0;
                $installment_data = $this->addData($installment_data, currency($installment_balance_fee, 1));
                $installment_data = $this->addData($installment_data, $this->getInstallmentPrintStatus($student_fee_record));

                $installment_index++;
                array_push($rows, array(
                    'index' => $installment_index,
                    'key' => $fee_allocation_group->id.'_installment_'.$installment_index,
                	'data' => $installment_data
                ));
			}

			foreach ($fee_allocation_group->feeGroup->feeHeads as $fee_head) {
				$footer = $this->addData($footer, $this->getTotalFee($student_record, $fee_allocation_group, $fee_head->id));
			}

			if ($fee_allocation_group->feeGroup->getOption('has_transport')) {
				$footer = $this->addData($footer, '');
				$footer = $this->addData($footer, currency($total_transport_fee, 1));
			}
            
            $footer = $this->addData($footer, currency($total_late_fee, 1));
            $footer = $this->addData($footer, currency($total_installment_fee, 1));
            $footer = $this->addData($footer, currency($total_other_fee, 1));
            $footer = $this->addData($footer, currency($total_paid_fee, 1));
            $footer = $this->addData($footer, currency($total_balance_fee, 1));
            $footer = $this->addData($footer, '');

            $installment_index++;
            array_push($fee_groups, array(
                'key' => 'fee_group_'.$fee_allocation_group->id,
                'name' => $fee_allocation_group->feeGroup->name,
                'header' => $header,
                'installments' => $rows,
                'footer' => $footer,
                'footer_row_index' => $installment_index
            ));
		}

		$grand_total = array(
			array('key' => 'grand_total_installment', 'text' => 'Grand Total', 'amount' => currency(($grand_total_installment + $grand_total_other), 1)),
			array('key' => 'grand_total_paid', 'text' => 'Total Paid', 'amount' => currency($grand_total_paid, 1)),
			array('key' => 'grand_total_balance', 'text' => 'Total Balance', 'amount' => currency($grand_total_balance, 1))
		);

		return compact('fee_groups', 'grand_total', 'student_record');
	}

    private function getInstallmentFee($student_fee_record, $fee_installment, $fee_head_id){
        $amount = $this->getInstallmentFeeWithoutConcession($student_fee_record, $fee_installment, $fee_head_id);

        return $this->getInstallmentFeeWithConcession($student_fee_record, $amount, $fee_installment, $fee_head_id);
    }

    private function getInstallmentFeeWithConcession($student_fee_record, $amount, $fee_installment, $fee_head_id){
        $installment_detail = $fee_installment->feeInstallmentDetails->firstWhere('fee_head_id', $fee_head_id);

        if (! $installment_detail) {
        	return 0;
        }

        if ($student_fee_record->feeConcession) {
        	$fee_concession_detail = $student_fee_record->feeConcession->feeConcessionDetails->firstWhere('fee_head_id', $fee_head_id);

        	if ($fee_concession_detail) {

	            $fee_concession_amount = $fee_concession_detail->type == 'percent' ? ($amount * ($fee_concession_detail->amount/100)) : $fee_concession_detail->amount;

	            return (($amount - $fee_concession_amount) >= 0) ? ($amount - $fee_concession_amount) : 0;
        	}
        }

        return ceil($amount);
    }

    private function getInstallmentFeeWithoutConcession($student_fee_record, $fee_installment, $fee_head_id){
        $installment_detail = $fee_installment->feeInstallmentDetails->firstWhere('fee_head_id', $fee_head_id);

        if (! $installment_detail) {
        	return 0;
        }

        $student_optional_fee_record = $student_fee_record->studentOptionalFeeRecords->firstWhere('fee_head_id', $fee_head_id);

        return (! $student_optional_fee_record) ? $installment_detail->amount : 0;
    }

    private function checkInstallmentConcession($student_fee_record, $fee_installment, $fee_head_id){
        $installment_detail = $fee_installment->feeInstallmentDetails->firstWhere('fee_head_id', $fee_head_id);

        if ($student_fee_record->feeConcession) {
        	return $student_fee_record->feeConcession->feeConcessionDetails->firstWhere('fee_head_id', $fee_head_id) ? true : false;
        }

        return false;
    }

	private function getTransportCircleName($student_fee_record, $fee_installment){
		return $student_fee_record->transport_circle_id ? $student_fee_record->transportCircle->name : '-';
	}
	
	private function getTransportFee($student_fee_record, $fee_installment){
	    if (! $student_fee_record->transport_circle_id || ! $fee_installment->transport_fee_id)
	        return '-';

	    $transport_fee = $fee_installment->transportFee->transportFeeDetails->firstWhere('transport_circle_id', $student_fee_record->transport_circle_id);

	    return $transport_fee->amount;
	}

    private function getInstallmentTotalWithoutLateFee($student_fee_record, $fee_installment){
        $total = 0;

        foreach($fee_installment->feeInstallmentDetails as $fee_installment_detail) {
        	$total += $this->getInstallmentFee($student_fee_record, $fee_installment, $fee_installment_detail->fee_head_id);
        }

        $transport_fee = $this->getTransportFee($student_fee_record, $fee_installment);

        $total += is_numeric($transport_fee) ? $transport_fee : 0;

        return $total;
    }
    
    private function getLateFee($student_fee_record, $fee_installment){
        $installment_total = $this->getInstallmentTotalWithoutLateFee($student_fee_record, $fee_installment);
        if (! $installment_total)
            return '-';

        $date = toDate(request('date') ? : date('Y-m-d'));

        if ($student_fee_record->status == 'paid') {
            return $student_fee_record->late_fee_charged;
        }

        if (($student_fee_record->late_fee_applicable === null && ! $fee_installment->late_fee_applicable) || $student_fee_record->late_fee_applicable === 0)
            return '-';

        if ($date <= ($student_fee_record->due_date ? : $fee_installment->due_date))
            return '-';

        $late_day = dateDiff(($student_fee_record->due_date ? : $fee_installment->due_date), $date);

        $per_period = floor($late_day / ($student_fee_record->late_fee_frequency ? : $fee_installment->late_fee_frequency));

        return ($student_fee_record->late_fee ? : $fee_installment->late_fee) * $per_period;
    }

    private function getInstallmentTotal($student_fee_record, $fee_installment){
        $total = $this->getInstallmentTotalWithoutLateFee($student_fee_record, $fee_installment);

        if ($total || $student_fee_record->status != 'unpaid') {
            $late_fee = $this->getLateFee($student_fee_record, $fee_installment);
            $total += is_numeric($late_fee) ? $late_fee : 0;
        }

        return $total;
    }

    private function getInstallmentOther($student_fee_record, $fee_installment){
        $other = 0;

        foreach ($student_fee_record->transactions as $transaction) {
            if (! $transaction->is_cancelled) {
            	$additional_fee_charge = $transaction->getOption('additional_fee_charge');

                if ($additional_fee_charge && gv($additional_fee_charge, 'amount', 0)) {
                    $other += gv($additional_fee_charge, 'amount', 0);
                }

            	$additional_fee_discount = $transaction->getOption('additional_fee_discount');
                if ($additional_fee_discount && gv($additional_fee_discount, 'amount', 0)) {
                    $other -= gv($additional_fee_discount, 'amount', 0);
                }
            }
        }

        return $other;
    }

    private function getInstallmentPaid($student_fee_record, $fee_installment){
        $paid = 0;

        foreach ($student_fee_record->transactions as $transaction) {
        	if (! $transaction->is_cancelled) {
        		$paid += $transaction->amount;
        	}
        }

        return $paid;
    }

    private function getInstallmentBalance($student_fee_record, $fee_installment){
        $total = $this->getInstallmentTotal($student_fee_record, $fee_installment);
        $other = $this->getInstallmentOther($student_fee_record, $fee_installment);
        $paid = $this->getInstallmentPaid($student_fee_record, $fee_installment);
        
        return $total + $other - $paid;
    }

    private function getInstallmentPrintStatus($student_fee_record){
        if ($student_fee_record->status == 'paid')
            return trans('student.fee_status_paid');
        else if($student_fee_record->status == 'partially_paid')
            return trans('student.fee_status_partially_paid');
        else if($student_fee_record->status == 'cancelled')
            return trans('student.fee_status_cancelled');
        else if($student_fee_record->status == 'unpaid')
            return trans('student.fee_status_unpaid');
    }

    private function getTotalFee($student_record, $fee_allocation_group, $fee_head_id){
        $total = 0;

        foreach ($fee_allocation_group->feeInstallments as $fee_installment) {
			$student_fee_record = $student_record->studentFeeRecords->firstWhere('fee_installment_id', $fee_installment->id);
        	$total += $this->getInstallmentFee($student_fee_record, $fee_installment, $fee_head_id);
        }

        return currency($total, 1);
    }
}