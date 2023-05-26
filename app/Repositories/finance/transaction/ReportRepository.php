<?php
namespace App\Repositories\Finance\Transaction;

use App\Models\Student\Student;
use App\Models\Employee\Employee;
use App\Traits\CollectionPaginator;
use App\Models\Student\StudentRecord;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Transaction\Transaction;
use App\Repositories\Finance\AccountRepository;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;

class ReportRepository
{
    use CollectionPaginator;

    protected $transaction;
    protected $account;
    protected $student_record;
    protected $employee;
    protected $student;
    protected $payment_method;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Transaction $transaction,
        AccountRepository $account,
        StudentRecord $student_record,
        Employee $employee,
        Student $student,
        PaymentMethodRepository $payment_method
    ) {
        $this->transaction = $transaction;
        $this->account = $account;
        $this->student_record = $student_record;
        $this->employee = $employee;
        $this->student = $student;
        $this->payment_method = $payment_method;
    }

    /**
     * Get report pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $accounts = $this->account->selectAll();
        $payment_methods = $this->payment_method->selectAll();
        return compact('accounts','payment_methods');
    }

    /**
     * Get transaction summary data.
     *
     * @param array $params
     * @return Array
     */
    public function getSummaryData($params)
    {
        $sort_by    = gv($params, 'sort_by', 'date');
        $order      = gv($params, 'order', 'asc');
        $account_id = gv($params, 'account_id');
        $payment_method_id = gv($params, 'payment_method_id');
        $start_date = gv($params, 'start_date', config('config.default_academic_session.start_date'));
        $end_date   = gv($params, 'end_date', config('config.default_academic_session.end_date'));

        $list    = array();
        $footer  = array();
        $account = $this->account->findOrFail($account_id);

        /**  if (! dateBetweenSession($start_date) || ! dateBetweenSession($end_date)) {
        throw ValidationException::withMessages(['message' => trans('academic.invalid_session_date_range')]);
        }*/

        $query = $this->transaction->dateBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->isNotCancelled()->where(function($q) use($account_id) {
            $q->where('account_id', $account_id)->orWhere(function($q1) use($account_id) {
                $q1->whereHas('accountTransfer', function($q2) use($account_id) {
                    $q2->where('from_account_id', $account_id)->orWhere('to_account_id', $account_id);
                });
            });
        });

        if ($payment_method_id) {
            $query->where('payment_method_id', $payment_method_id);
        }

        $transactions = $query->orderBy('date', 'asc')->orderBy('number','asc')->get();

        $transactions->load($this->getTransactionRelation());

        $student_records = $this->student_record->with('student','admission')->get();
        $students = $this->student->get();
        $employees = $this->employee->with('employeeDesignations','employeeDesignations.designation','employeeDesignations.designation.employeeCategory')->get();

        $total_receipts = 0;
        $total_payments = 0;
        $fee_summary = array();
        $concession_amount = 0;
        $i = 1;
        foreach ($transactions as $transaction) {
            $payment_method_detail = $this->getPaymentMethodDetail($transaction);
            $head = $this->getHeadDetail($transaction, [
                'student_records' => $student_records,
                'students'        => $students,
                'employees'       => $employees,
            ]);

            $employee = $this->getEntryByEmployee($transaction, $employees);

            $total_receipts += ($transaction->type) ? $transaction->amount : 0;
            $total_payments += (! $transaction->type) ? $transaction->amount : 0;

            $installment_concession = 0;
            if ($transaction->registration_id) {
                $fee_summary[] = array('head' => trans('student.registration_fee'), 'amount' => $transaction->amount);
            } else if($transaction->student_fee_record_id) {
                $fee_concession = $transaction->studentFeeRecord->feeConcession;

                foreach ($transaction->studentFeeRecordDetails as $student_fee_record_detail) {
                    $optional = $transaction->studentFeeRecord->studentOptionalFeeRecords->firstWhere('fee_head_id', $student_fee_record_detail->fee_head_id);

                    $fee_installment_detail = $transaction->studentFeeRecord->feeInstallment->feeInstallmentDetails->firstWhere('fee_head_id', $student_fee_record_detail->fee_head_id);

                    $amount = $optional ? 0 : $student_fee_record_detail->amount;

                    $fee_summary[] = array('head' => $student_fee_record_detail->feeHead->name, 'amount' => $amount);

                    if ($fee_concession) {
                        $fee_concession_detail = $fee_concession->feeConcessionDetails->firstWhere('fee_head_id', $student_fee_record_detail->fee_head_id);

                        if ($fee_concession_detail) {
                            if ($fee_concession_detail->type == 'percent') {
                                $installment_concession += ($fee_installment_detail->amount * $fee_concession_detail->amount/100);
                            } else {
                                $installment_concession += $fee_concession_detail->amount;
                            }
                        }
                    }
                }

                if ($transaction->getOption('transport_fee')) {
                    $fee_summary[] = array('head' => trans('transport.fee'), 'amount' => $transaction->getOption('transport_fee'));
                }

                if ($transaction->getOption('late_fee')) {
                    $fee_summary[] = array('head' => trans('finance.late_fee'), 'amount' => $transaction->getOption('late_fee'));
                }

                $additional_fee_charge = $transaction->getOption('additional_fee_charge');
                if (gv($additional_fee_charge, 'amount', 0) > 0) {
                    $fee_summary[] = array('head' => gv($additional_fee_charge, 'label'), 'amount' => gv($additional_fee_charge, 'amount', 0));
                }

                $additional_fee_discount = $transaction->getOption('additional_fee_discount');
                if (gv($additional_fee_discount, 'amount', 0) > 0) {
                    $fee_summary[] = array('head' => gv($additional_fee_discount, 'label'), 'amount' => gv($additional_fee_discount, 'amount', 0));
                }
            }

            $concession_amount += $installment_concession;

            $list[] = array(
                'sno'                   => $i,
                'type'                  => $transaction->type ? 'receipt' : 'payment',
                'account'               => $transaction->account->name,
                'term'                  => $transaction->studentFeeRecord->feeInstallment->title,
                'fee_group'             => $transaction->studentFeeRecord->feeInstallment->feeAllocationGroup->feeGroup->name,
                'batch'                 => $transaction->studentFeeRecord->studentRecord->batch->course->name.' '.$transaction->studentFeeRecord->studentRecord->batch->name,
                'academic_session'      => $transaction->studentFeeRecord->studentRecord->batch->course->academicSession->name,
                'head'                  => $head,
                'payment_method'        => $transaction->paymentMethod->name,
                'payment_method_detail' => $payment_method_detail,
                'amount'                => currency($transaction->amount, 1),
                'fee_concession'        => $installment_concession ? currency($installment_concession, 1) : '-',
                'date'                  => $transaction->date,
                'voucher_number'        => ($transaction->prefix ? $transaction->prefix : '').$transaction->number,
                'admission_number'      => $transaction->studentFeeRecord->studentRecord->admission->admission_number,
                'employee'              => $employee
            );

            $i++;
        }

        $fee_summary[] = ['head' => trans('finance.fee_concession'), 'amount' => $concession_amount];

        $collection = collect($fee_summary);

        $fee_summary = $collection->groupBy('head')->map(function ($row) {
            return currency($row->sum('amount'),1);
        });

        // array_multisort(array_map(function($element) use($sort_by) {
        //       return $element[$sort_by];
        // }, $list), $order == 'asc' ? SORT_ASC : SORT_DESC, $list);

        $footer = array(
            'total_payments' => currency($total_payments, 1),
            'total_receipts' => currency($total_receipts, 1),
            'total_concessions' => currency($concession_amount, 1),
            'fee_summary' => $fee_summary
        );

        return compact('list','footer');
    }

    /**
     * Get summary of all transaction
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateSummary($params)
    {
        $page = gv($params, 'page', 1);
        $page_length = gv($params, 'page_length', config('config.page_length'));

        $data = $this->getSummaryData($params);

        $list = $data['list'];
        $footer = $data['footer'];

        $list = $this->collectionPaginate($list, $page_length, $page);

        return compact('list','footer');
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Array
     */
    public function printSummary($params)
    {
        $data = $this->getSummaryData($params);

        $list = $data['list'];
        $footer = $data['footer'];

        return compact('list','footer');
    }

    /**
     * Get payment method details
     *
     * @param Transaction $transaction
     * @return string
     */
    private function getPaymentMethodDetail(Transaction $transaction)
    {
        $payment_method_detail = '';
        $payment_method_detail .= $transaction->instrument_number ? (trans('finance.instrument_number').' :'.$transaction->instrument_number.'<br />') : '';
        $payment_method_detail .= $transaction->instrument_date ? (trans('finance.instrument_date').' :'.showDate($transaction->instrument_date).'<br />') : '';
        $payment_method_detail .= $transaction->instrument_bank_detail ? (trans('finance.instrument_bank_detail').' :'.$transaction->instrument_bank_detail.'<br />') : '';
        $payment_method_detail .= $transaction->instrument_clearing_date ? (trans('finance.instrument_clearing_date').' :'.showDate($transaction->instrument_clearing_date).'<br />') : '';
        $payment_method_detail .= $transaction->reference_number ? (trans('finance.reference_number').' :'.$transaction->reference_number.'<br />') : '';

        return $payment_method_detail;
    }

    /**
     * Get transaction head details
     *
     * @param Transaction $transaction
     * @param array $params
     * @return string
     */
    private function getHeadDetail(Transaction $transaction, $params = array())
    {
        $students        = gv($params, 'students');
        $employees       = gv($params, 'employees');
        $student_records = gv($params, 'student_records');

        $head = '';

        if ($transaction->income_id) {
            $head = $transaction->income->transactionCategory->name;
        } else if ($transaction->expense_id) {
            $head = $transaction->expense->transactionCategory->name;
        } else if ($transaction->account_transfer_id) {
            $head = $transaction->accountTransfer->toAccount->name;
        } else if ($transaction->registration_id) {
            $head = trans('student.registration_fee').' '.$students->firstWhere('id', $transaction->registration->student_id)->name.' ('.'#'.$transaction->registration->id.')';
        } else if($transaction->student_fee_record_id) {
            $student_record = $student_records->firstWhere('id', $transaction->studentFeeRecord->student_record_id);
            $head = trans('finance.fee').' '.$students->firstWhere('id', $student_record->student_id)->name.' ('.$student_record->admission->admission_number.')';
        } else if($transaction->employee_id && in_array($transaction->head, ['salary', 'advance', 'advance_return', 'other_payment', 'other_receipt'])) {
            $payroll_employee = $employees->firstWhere('id', $transaction->employee->id)->name_with_code;
            $head = trans('employee.payroll_transaction_'.$transaction->head).' '.$payroll_employee;
        } else if($transaction->book_log_detail_id) {
            $employee_id = $transaction->bookLogDetail->bookLog->employee_id;
            $student_record_id = $transaction->bookLogDetail->bookLog->student_record_id;
            $issuer = ($employee_id ? $employees->firstWhere('id', $employee_id)->name_with_code : $student_records->firstWhere('id', $student_record_id)->student->name);
            $head = trans('library.library_charge').' '.$issuer;
        } else {
            $head = '';
        }

        return $head;
    }

    /**
     * Get transaction relation
     *
     * @return array
     */
    private function getTransactionRelation()
    {
        return  [
            'account',
            'paymentMethod',
            'registration',
            'bookLogDetail',
            'bookLogDetail.bookLog',
            'income',
            'income.transactionCategory',
            'expense',
            'expense.transactionCategory',
            'accountTransfer',
            'accountTransfer.toAccount',
            'studentFeeRecord',
            'studentFeeRecord.feeInstallment',
            'studentFeeRecord.feeInstallment.feeInstallmentDetails',
            'studentFeeRecord.feeConcession',
            'studentFeeRecord.feeConcession.feeConcessionDetails',
            'payroll',
            'user',
            'user.employee',
            'studentFeeRecordDetails',
            'studentFeeRecordDetails.feeHead',
            'studentFeeRecordDetails.studentFeeRecord',
            'studentFeeRecordDetails.studentFeeRecord.studentOptionalFeeRecords',
        ];
    }

    /**
     * Get entry by employee details
     *
     * @param Transaction $transaction
     * @param Employee $employees
     * @return string
     */
    private function getEntryByEmployee(Transaction $transaction, $employees)
    {
        $employee = $employees->firstWhere('id', optional($transaction->user)->employee->id);
        $employee_designation = ($employee) ? getEmployeeDesignationName($employee, $transaction->date) : null;

        /** original data, below line is modified $employee = ($employee) ? ($employee->name.' '.$employee_designation) : '-'; */

        $employee = ($employee) ? ($employee->name) : '-';

        return $employee;
    }

    /**
     * Get transaction day book data.
     *
     * @param array $params
     * @return Array
     */
    public function getDayBookData($params)
    {
        $date = toDate(gv($params, 'date'));

        if (! dateBetweenSession($date)) {
            throw ValidationException::withMessages(['message' => trans('academic.invalid_session_date_range')]);
        }

        $student_records = $this->student_record->with('student','admission')->get();
        $students = $this->student->get();
        $employees = $this->employee->with('employeeDesignations','employeeDesignations.designation','employeeDesignations.designation.employeeCategory')->get();

        $transactions = $this->transaction->filterByDate($date)->isNotCancelled()->get();

        $transactions->load($this->getTransactionRelation());

        $list = array();
        $footer = array();
        $total_payments = 0;
        $total_receipts = 0;
        $i = 1;
        foreach ($transactions as $transaction) {
            $payment_method_detail = $this->getPaymentMethodDetail($transaction);
            $head = $this->getHeadDetail($transaction, [
                'student_records' => $student_records,
                'students'        => $students,
                'employees'       => $employees,
            ]);

            $employee = $this->getEntryByEmployee($transaction, $employees);

            $list[] = array(
                'sno' => $i,
                'type'                  => $transaction->type ? 'receipt' : 'payment',
                'account'               => $transaction->account->name,
                //'term'                  => $transaction->studentFeeRecord->feeInstallment->title,
                'head'                  => $head,
                'payment_method'        => $transaction->paymentMethod->name,
                'payment_method_detail' => $payment_method_detail,
                'amount'                => $transaction->amount,
                'date'                  => $transaction->date,
                'voucher_number'        => ($transaction->prefix ? $transaction->prefix : '').$transaction->number,
                'employee'              => $employee
            );

            $total_receipts += ($transaction->type) ? $transaction->amount : 0;
            $total_payments += (! $transaction->type) ? $transaction->amount : 0;
            $i++;
        }

        $footer = array(
            'total_payments' => currency($total_payments, 1),
            'total_receipts' => currency($total_receipts, 1)
        );

        return compact('list','footer');
    }

    /**
     * Get day book of all day book
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateDayBook($params)
    {
        $page = gv($params, 'page', 1);
        $page_length = gv($params, 'page_length', config('config.page_length'));

        $data = $this->getDayBookData($params);

        $list = $data['list'];
        $footer = $data['footer'];

        $list = $this->collectionPaginate($list, $page_length, $page);

        return compact('list','footer');
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Array
     */
    public function printDayBook($params)
    {
        $data = $this->getDayBookData($params);

        $list = $data['list'];
        $footer = $data['footer'];

        return compact('list','footer');
    }
}