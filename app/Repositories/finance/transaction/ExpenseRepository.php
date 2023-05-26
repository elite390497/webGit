<?php
namespace App\Repositories\Finance\Transaction;

use Illuminate\Support\Str;
use App\Models\Finance\Transaction\Expense;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Transaction\Transaction;
use App\Repositories\Finance\AccountRepository;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;
use App\Repositories\Configuration\Finance\Transaction\TransactionCategoryRepository;

class ExpenseRepository
{
    protected $expense;
    protected $upload;
    protected $transaction_category;
    protected $account;
    protected $payment_method;
    protected $transaction;

    protected $module = 'expense';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Expense $expense,
        UploadRepository $upload,
        TransactionCategoryRepository $transaction_category,
        AccountRepository $account,
        PaymentMethodRepository $payment_method,
        Transaction $transaction
    ) {
        $this->expense = $expense;
        $this->upload = $upload;
        $this->transaction_category = $transaction_category;
        $this->account = $account;
        $this->payment_method = $payment_method;
        $this->transaction = $transaction;
    }

    /**
     * Find expense with given id.
     *
     * @param integer $id
     * @return Expense
     */
    public function find($id)
    {
        return $this->expense->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find expense with given id or throw an error.
     *
     * @param integer $id
     * @return Expense
     */
    public function findOrFail($id, $field = 'message')
    {
        $expense = $this->expense->info()->filterBySession()->filterById($id)->first();

        if (! $expense) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_expense')]);
        }

        return $expense;
    }

    /**
     * Find expense with given uuid.
     *
     * @param string $uuid
     * @return Expense
     */
    public function findByUuid($uuid)
    {
        return $this->expense->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find expense with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Expense
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $expense = $this->expense->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $expense) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_expense')]);
        }

        return $expense;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Expense
     */
    public function getData($params)
    {
        $sort_by                 = gv($params, 'sort_by', 'date_of_expense');
        $order                   = gv($params, 'order', 'desc');
        $transaction_category_id = gv($params, 'transaction_category_id');
        $account_id              = gv($params, 'account_id');
        $payment_method_id       = gv($params, 'payment_method_id');
        $is_cancelled       = gv($params, 'is_cancelled');

        $transaction_category_id = is_array($transaction_category_id) ? $transaction_category_id : ($transaction_category_id ? explode(',', $transaction_category_id) : []);
        $account_id = is_array($account_id) ? $account_id : ($account_id ? explode(',', $account_id) : []);
        $payment_method_id = is_array($payment_method_id) ? $payment_method_id : ($payment_method_id ? explode(',', $payment_method_id) : []);

        $date_of_expense_start_date = gv($params, 'date_of_expense_start_date');
        $date_of_expense_end_date   = gv($params, 'date_of_expense_end_date');

        $query = $this->expense->info()->filterBySession()->dateOfExpenseBetween([
                'start_date' => $date_of_expense_start_date,
                'end_date' => $date_of_expense_end_date
            ]);

        if ($is_cancelled) {
            $query->filterByCancelled(1);
        } else {
            $query->filterByCancelled(0);
        }

        if (count($transaction_category_id)) {
            $query->whereIn('transaction_category_id', $transaction_category_id);
        }

        if (count($account_id)) {
            $query->whereHas('transaction', function ($q) use ($account_id) {
                $q->whereIn('account_id', $account_id);
            });
        }

        if (count($payment_method_id)) {
            $query->whereHas('transaction', function ($q) use ($payment_method_id) {
                $q->whereIn('payment_method_id', $payment_method_id);
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all expense using given params.
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
     * @return Expense
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $transaction_categories = $this->transaction_category->selectAllExpenseCategory();
        $accounts = $this->account->selectAllActive();
        $payment_method_details = $this->payment_method->getAll();
        $payment_methods = generateSelectOption($payment_method_details->pluck('name', 'id')->all());

        return compact('transaction_categories', 'accounts', 'payment_method_details', 'payment_methods');
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Create a new expense.
     *
     * @param array $params
     * @return Expense
     */
    public function create($params)
    {
        $expense = $this->expense->forceCreate($this->formatParams($params));

        $account_id = gv($params, 'account_id');
        $payment_method_id = gv($params, 'payment_method_id');
        
        $account = $this->account->findOrFail($account_id);
        $payment_method = $this->payment_method->findOrFail($payment_method_id);

        $number = $this->transaction->filterByAccountId($account->id)->filterByType(0)->max('number');
        $this->transaction->forceCreate([
            'uuid'                     => Str::uuid(),
            'type'                     => 0,
            'prefix'                   => $account->prefix,
            'number'                   => ($number) ? $number + 1 : 1,
            'user_id'                  => \Auth::user()->id,
            'amount'                   => gv($params, 'amount'),
            'account_id'               => $account->id,
            'head'                     => 'expense',
            'expense_id'                => $expense->id,
            'date'                     => toDate(gv($params, 'date_of_expense')),
            'remarks'                  => null,
            'upload_token'             => Str::uuid(),
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null,
        ]);

        $this->processUpload($expense, $params);

        return $expense;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $expense_id = null)
    {
        $amount                  = gv($params, 'amount', 0);
        $date_of_expense         = toDate(gv($params, 'date_of_expense'));
        $description             = gv($params, 'description');
        $transaction_category_id = gv($params, 'transaction_category_id');
        $account_id              = gv($params, 'account_id');
        $payment_method_id       = gv($params, 'payment_method_id');

        $transaction_category = $this->transaction_category->findExpenseCategoryOrFail($transaction_category_id);

        if (! dateBetweenSession($date_of_expense)) {
            throw ValidationException::withMessages(['date_of_expense' => trans('academic.invalid_session_date_range')]);
        }

        $formatted = [
            'transaction_category_id' => $transaction_category_id,
            'amount'                  => $amount,
            'date_of_expense'         => toDate($date_of_expense),
            'description'             => $description,
            'options'                 => []
        ];

        if (! $expense_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Expense $expense
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Expense $expense, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $expense->id, $upload_token);
        } else {
            $this->upload->update($this->module, $expense->id, $upload_token);
        }
    }

    /**
     * Update given expense.
     *
     * @param Expense $expense
     * @param array $params
     *
     * @return Expense
     */
    public function update(Expense $expense, $params)
    {
        $this->isNotCancelled($expense);

        $expense->forceFill($this->formatParams($params, $expense->id))->save();

        $payment_method_id = gv($params, 'payment_method_id');

        $payment_method = $this->payment_method->findOrFail($payment_method_id);

        $expense->Transaction->forceFill([
            'amount'                   => gv($params, 'amount'),
            'date'                     => toDate(gv($params, 'date_of_expense')),
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null,
        ])->save();

        $this->processUpload($expense, $params, 'update');

        return $expense;
    }

    /**
     * Find expense is cancelled or not.
     *
     * @param integer $id
     * @return void
     */
    public function isNotCancelled(Expense $expense)
    {
        if ($expense->is_cancelled) {
            throw ValidationException::withMessages(['message' => trans('finance.expense_already_cancelled')]);
        }
    }

    /**
     * Find expense & check it can be cancelled or not.
     *
     * @param integer $id
     * @return Expense
     */
    public function cancellable($uuid)
    {
        $expense = $this->findByUuidOrFail($uuid);

        $this->isNotCancelled($expense);

        return $expense;
    }

    /**
     * Cancel expense.
     *
     * @param integer $id
     * @return bool|null
     */
    public function cancel(Expense $expense)
    {
        $expense->is_cancelled = 1;
        $expense->save();
    }

    /**
     * Delete multiple expense.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->expense->whereIn('id', $ids)->delete();
    }
}
