<?php
namespace App\Repositories\Employee;

use Illuminate\Support\Str;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Transaction\Transaction;
use App\Repositories\Finance\AccountRepository;
use App\Repositories\Employee\PayrollRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;

class PayrollTransactionRepository
{
    protected $payroll_transaction;
    protected $account;
    protected $payment_method;
    protected $employee;
    protected $payroll;
    protected $upload;
    protected $module = 'payroll_transaction';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Transaction $payroll_transaction,
        AccountRepository $account,
        PaymentMethodRepository $payment_method,
        EmployeeRepository $employee,
        PayrollRepository $payroll,
        UploadRepository $upload
    ) {
        $this->payroll_transaction = $payroll_transaction;
        $this->account = $account;
        $this->payment_method = $payment_method;
        $this->employee = $employee;
        $this->payroll = $payroll;
        $this->upload = $upload;
    }

    /**
     * Find payroll transaction with given id or throw an error.
     *
     * @param integer $id
     * @return Transaction
     */

    public function findOrFail($id)
    {
        $payroll_transaction = $this->payroll_transaction->payrollTransactionInfo()->filterByPayrollTransaction()->filterById($id)->first();

        if (! $payroll_transaction) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_payroll_transaction')]);
        }

        return $payroll_transaction;
    }

    /**
     * Find payroll transaction with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Transaction
     */
    public function findByUuidOrFail($uuid)
    {
        $payroll_transaction = $this->payroll_transaction->payrollTransactionInfo()->filterByPayrollTransaction()->whereUuid($uuid)->first();

        if (! $payroll_transaction) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_payroll_transaction')]);
        }

        return $payroll_transaction;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Transaction
     */
    public function getData($params)
    {
        $sort_by      = gv($params, 'sort_by', 'created_at');
        $order        = gv($params, 'order', 'desc');
        $name         = gv($params, 'name');
        $employee_id  = gv($params, 'employee_id');
        $is_cancelled = gv($params, 'is_cancelled', 0);

        $employee_id = is_array($employee_id) ? $employee_id : ($employee_id ? explode(',', $employee_id) : []);

        $accessible_employee_ids = $this->employee->getAccessibleEmployeeId();
        array_push($accessible_employee_ids, \Auth::user()->Employee->id);

        if (array_diff($employee_id, $accessible_employee_ids)) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
        
        $query = $this->payroll_transaction->payrollTransactionInfo()->whereIn('employee_id', $accessible_employee_ids)->filterByPayrollTransaction();

        if ($is_cancelled) {
            $query->filterByCancelled(1);
        } else {
            $query->filterByCancelled(0);
        }
        
        if (count($employee_id)) {
            $query->whereIn('employee_id', $employee_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all payroll transaction using given params.
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
     * @return Payroll
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get advance balance of an employee
     *
     * @param array $params
     * @return numeric
     */
    public function advanceBalance($params)
    {
        $employee_id = gv($params, 'employee_id');

        $employee = $this->employee->findOrFail($employee_id);

        $this->employee->isAccessible($employee);

        $payroll_transactions = $this->payroll_transaction->filterByEmployeeId($employee_id)->whereIn('head', ['advance', 'advance_return'])->isNotCancelled()->get();

        $balance = 0;
        foreach ($payroll_transactions as $payroll_transaction) {
            if ($payroll_transaction->head == 'advance') {
                $balance += $payroll_transaction->amount;
            } else {
                $balance -= $payroll_transaction->amount;
            }
        }

        return compact('balance');
    }

    /**
     * Get payroll filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $employees = $this->employee->getAccessibleEmployeeList();
        
        return compact('employees');
    }

    /**
     * Get payroll pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $employees = $this->employee->getAccessibleEmployeeList();
        $accounts = $this->account->selectAllActive();
        $payment_method_details = $this->payment_method->getAll();
        $payment_methods = generateSelectOption($payment_method_details->pluck('name', 'id')->all());

        return compact('employees','accounts','payment_methods','payment_method_details');
    }

    /**
     * Validate given input
     *
     * @param array $params
     * @return void
     */
    private function validateInput($params)
    {
        $employee_id         = gv($params, 'employee_id');
        $amount              = gv($params, 'amount', 0);
        $head                = gv($params, 'head');
        $date_of_transaction = toDate(gv($params, 'date_of_transaction'));

        if (! is_numeric($amount)) {
            throw ValidationException::withMessages(['amount' => trans('validation.numeric', ['attribute' => trans('finance.amount')])]);
        }

        if ($amount < 0) {
            throw ValidationException::withMessages(['amount' => trans('validation.min.numeric', ['attribute' => trans('finance.amount'), 'min' => 0])]);
        }

        if (! dateBetweenSession($date_of_transaction)) {
            throw ValidationException::withMessages(['date_of_transaction' => trans('academic.invalid_session_date_range')]);
        }

        if (! in_array($head, ['salary', 'advance', 'advance_return', 'other_payment', 'other_receipt'])) {
            throw ValidationException::withMessages(['head' => trans('general.invalid_input')]);
        }

        $employee = $this->employee->findOrFail($employee_id);

        $this->employee->isAccessible($employee);
    }

    private function getTransactionType($params)
    {
        $head = gv($params, 'head');

        switch ($head) {
            case 'salary':
                $type = 0;
                break;
            
            case 'advance':
                $type = 0;
                break;
            
            case 'advance_return':
                $type = 1;
                break;
            
            case 'other_payment':
                $type = 0;
                break;
            
            case 'other_receipt':
                $type = 1;
                break;
            
            default:
                $type = 0;
                break;
        }

        return $type;
    }

    /**
     * Create a new payroll transaction.
     *
     * @param array $params
     * @return PayrollTransaction
     */
    public function create($params)
    {
        $payroll_transaction = $this->payroll_transaction->forceCreate($this->formatParams($params));

        $this->processUpload($payroll_transaction, $params);

        $this->updatePayroll($payroll_transaction, $payroll_transaction->amount);

        return $payroll_transaction;
    }

    private function updatePayroll(Transaction $payroll_transaction, $previous_amount)
    {
        if ($payroll_transaction->head != 'salary') {
            return;
        }

        $payroll = $payroll_transaction->Payroll;

        if ($payroll_transaction->amount != $previous_amount) {
            $payroll->decrement('paid', $previous_amount);
        }

        $payroll->increment('paid', $payroll_transaction->amount);

        if (! $payroll->paid) {
            $payroll->payment_status = 'unpaid';
        } else if ($payroll->balance > 0) {
            $payroll->payment_status = 'partially_paid';
        } else {
            $payroll->payment_status = 'paid';
        }

        $payroll->save();
    }

    private function validateHead($params, $payroll_transaction_id)
    {
        if ($payroll_transaction_id) {
            return;
        }

        $head                = gv($params, 'head');
        $date_of_transaction = toDate(gv($params, 'date_of_transaction'));
        $amount              = gv($params, 'amount', 0);
        $employee_id         = gv($params, 'employee_id');

        if ($head == 'salary') {
            $data = $this->payroll->fetchUnpaid(['employee_id' => $employee_id]);

            $payroll = gv($data, 'payroll');

            if (! $payroll) {
                throw ValidationException::withMessages(['message' => trans('employee.payroll_transaction_no_unpaid_payroll')]);
            }

            if ($payroll->balance < $amount) {
                throw ValidationException::withMessages(['message' => trans('employee.payroll_transaction_amount_greater_than_unpaid_payroll_balance', ['balance' => currency($payroll->balance, 1)])]);
            }

            if ($date_of_transaction < toDate($payroll->end_date)) {
                throw ValidationException::withMessages(['message' => trans('employee.payroll_transaction_date_less_than_payroll_end_date')]);
            }

        } else if ($head == 'advance_return') {
            $data = $this->advanceBalance(['employee_id' => $employee_id]);

            $advance_balance = gv($data, 'balance');

            if ($advance_balance < $amount) {
                throw ValidationException::withMessages(['message' => trans('employee.payroll_transaction_amount_greater_than_advance_returnable', ['balance' => currency($advance_balance, 1)])]);
            }
        }

        return isset($payroll) ? $payroll : null;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $payroll_transaction_id
     * @return array
     */
    private function formatParams($params, $payroll_transaction_id = null)
    {
        $amount              = gv($params, 'amount', 0);
        $date_of_transaction = toDate(gv($params, 'date_of_transaction'));
        $head                = gv($params, 'head');
        $remarks             = gv($params, 'remarks');
        $employee_id         = gv($params, 'employee_id');
        $account_id          = gv($params, 'account_id');
        $payment_method_id   = gv($params, 'payment_method_id');

        $this->validateInput($params);

        $account = $this->account->findOrFail($account_id);
        $payment_method = $this->payment_method->findOrFail($payment_method_id);

        $type = $this->getTransactionType($params);

        $payroll = $this->validateHead($params, $payroll_transaction_id);

        $previous_date_query = (! $payroll_transaction_id) ? $this->payroll_transaction : $this->payroll_transaction->where('id','!=',$payroll_transaction_id);

        if ($previous_date_query->filterByEmployeeId($employee_id)->filterByHead($head)->where('date','>',$date_of_transaction)->isNotCancelled()->count()) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_transaction_cannot_add_alter_at_previous_date')]);
        }

        $number = $this->payroll_transaction->filterByAccountId($account->id)->filterByType($type)->max('number');

        $formatted = [
            'type'                     => $type,
            'prefix'                   => $account->prefix,
            'number'                   => ($number) ? $number + 1 : 1,
            'amount'                   => $amount,
            'account_id'               => $account->id,
            'head'                     => $head,
            'date'                     => toDate($date_of_transaction),
            'remarks'                  => $remarks,
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null
        ];

        if (! $payroll_transaction_id) {
            $formatted['employee_id']  = $employee_id;
            $formatted['payroll_id']   = $payroll ? $payroll->id : null;
            $formatted['uuid']         = Str::uuid();
            $formatted['upload_token'] = Str::uuid();
            $formatted['user_id']      = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Transaction $payroll_transaction
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Transaction $payroll_transaction, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $payroll_transaction->id, $upload_token);
        } else {
            $this->upload->update($this->module, $payroll_transaction->id, $upload_token);
        }
    }

    /**
     * Update given payroll transaction.
     *
     * @param Transaction $payroll_transaction
     * @param array $params
     *
     * @return PayrollTransaction
     */
    public function update(Transaction $payroll_transaction, $params)
    {
        $amount = $payroll_transaction->amount;
        $balance = $payroll_transaction->payroll->balance + $amount;

        if ($balance < gv($params, 'amount')) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_transaction_amount_greater_than_unpaid_payroll_balance', ['balance' => currency($balance, 1)])]);
        }

        $payroll_transaction->forceFill($this->formatParams($params, $payroll_transaction->id))->save();

        $this->processUpload($payroll_transaction, $params, 'update');

        $this->updatePayroll($payroll_transaction, $amount);

        return $payroll_transaction;
    }

    /**
     * Find payroll transaction & check it can be cancelled or not.
     *
     * @param integer $id
     * @return Course
     */
    public function cancellable($uuid)
    {
        $payroll_transaction = $this->findByUuidOrFail($uuid);

        if ($payroll_transaction->is_cancelled) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $previous_payroll_transactions = $this->payroll_transaction->filterByEmployeeId($payroll_transaction->employee_id)->filterByHead($payroll_transaction->head)->isNotCancelled()->where('date','>', toDate($payroll_transaction->date))->count();

        if ($previous_payroll_transactions) {
            throw ValidationException::withMessages(['message' => trans('employee.payroll_transaction_cannot_add_alter_at_previous_date')]);
        }

        return $payroll_transaction;
    }

    /**
     * Cancel payroll transaction.
     *
     * @param integer $id
     * @return bool|null
     */
    public function cancel(Transaction $payroll_transaction)
    {
        $payroll = $payroll_transaction->Payroll;

        $payroll->decrement('paid', $payroll_transaction->amount);

        if (! $payroll->paid) {
            $payroll->payment_status = 'unpaid';
        } else if ($payroll->balance > 0) {
            $payroll->payment_status = 'partially_paid';
        } else {
            $payroll->payment_status = 'paid';
        }

        $payroll->save();

        $payroll_transaction->is_cancelled = 1;
        $payroll_transaction->save();
    }

    /**
     * Delete payroll transaction.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Transaction $payroll_transaction)
    {
        return $payroll_transaction->delete();
    }

    /**
     * Delete multiple payroll transactions.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->payroll_transaction->whereIn('id', $ids)->delete();
    }
}