<?php
namespace App\Repositories\Finance\Transaction;

use Illuminate\Support\Str;
use App\Models\Finance\Transaction\Income;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Transaction\Transaction;
use App\Repositories\Finance\AccountRepository;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;
use App\Repositories\Configuration\Finance\Transaction\TransactionCategoryRepository;

class IncomeRepository
{
    protected $income;
    protected $upload;
    protected $transaction_category;
    protected $account;
    protected $payment_method;
    protected $transaction;

    protected $module = 'income';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Income $income,
        UploadRepository $upload,
        TransactionCategoryRepository $transaction_category,
        AccountRepository $account,
        PaymentMethodRepository $payment_method,
        Transaction $transaction
    ) {
        $this->income = $income;
        $this->upload = $upload;
        $this->transaction_category = $transaction_category;
        $this->account = $account;
        $this->payment_method = $payment_method;
        $this->transaction = $transaction;
    }

    /**
     * Find income with given id.
     *
     * @param integer $id
     * @return Income
     */
    public function find($id)
    {
        return $this->income->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find income with given id or throw an error.
     *
     * @param integer $id
     * @return Income
     */
    public function findOrFail($id, $field = 'message')
    {
        $income = $this->income->info()->filterBySession()->filterById($id)->first();

        if (! $income) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_income')]);
        }

        return $income;
    }

    /**
     * Find income with given uuid.
     *
     * @param string $uuid
     * @return Income
     */
    public function findByUuid($uuid)
    {
        return $this->income->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find income with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Income
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $income = $this->income->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $income) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_income')]);
        }

        return $income;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Income
     */
    public function getData($params)
    {
        $sort_by                 = gv($params, 'sort_by', 'date_of_income');
        $order                   = gv($params, 'order', 'desc');
        $transaction_category_id = gv($params, 'transaction_category_id');
        $account_id              = gv($params, 'account_id');
        $payment_method_id       = gv($params, 'payment_method_id');
        $is_cancelled       = gv($params, 'is_cancelled');

        $transaction_category_id = is_array($transaction_category_id) ? $transaction_category_id : ($transaction_category_id ? explode(',', $transaction_category_id) : []);
        $account_id = is_array($account_id) ? $account_id : ($account_id ? explode(',', $account_id) : []);
        $payment_method_id = is_array($payment_method_id) ? $payment_method_id : ($payment_method_id ? explode(',', $payment_method_id) : []);

        $date_of_income_start_date = gv($params, 'date_of_income_start_date');
        $date_of_income_end_date   = gv($params, 'date_of_income_end_date');

        $query = $this->income->info()->filterBySession()->dateOfIncomeBetween([
                'start_date' => $date_of_income_start_date,
                'end_date' => $date_of_income_end_date
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
     * Paginate all income using given params.
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
     * @return Income
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
        $transaction_categories = $this->transaction_category->selectAllIncomeCategory();
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
     * Create a new income.
     *
     * @param array $params
     * @return Income
     */
    public function create($params)
    {
        $income = $this->income->forceCreate($this->formatParams($params));

        $account_id = gv($params, 'account_id');
        $payment_method_id = gv($params, 'payment_method_id');

        $account = $this->account->findOrFail($account_id);
        $payment_method = $this->payment_method->findOrFail($payment_method_id);

        $number = $this->transaction->filterByAccountId($account->id)->filterByType(1)->max('number');
        $this->transaction->forceCreate([
            'uuid'                     => Str::uuid(),
            'type'                     => 1,
            'prefix'                   => $account->prefix,
            'number'                   => ($number) ? $number + 1 : 1,
            'user_id'                  => \Auth::user()->id,
            'amount'                   => gv($params, 'amount'),
            'account_id'               => $account->id,
            'head'                     => 'income',
            'income_id'                => $income->id,
            'date'                     => toDate(gv($params, 'date_of_income')),
            'remarks'                  => null,
            'upload_token'             => Str::uuid(),
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null,
        ]);

        $this->processUpload($income, $params);

        return $income;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $income_id = null)
    {
        $amount                  = gv($params, 'amount', 0);
        $date_of_income          = toDate(gv($params, 'date_of_income'));
        $description             = gv($params, 'description');
        $transaction_category_id = gv($params, 'transaction_category_id');
        $account_id              = gv($params, 'account_id');
        $payment_method_id       = gv($params, 'payment_method_id');

        $transaction_category = $this->transaction_category->findIncomeCategoryOrFail($transaction_category_id);

        if (! dateBetweenSession($date_of_income)) {
            throw ValidationException::withMessages(['date_of_income' => trans('academic.invalid_session_date_range')]);
        }

        $formatted = [
            'transaction_category_id' => $transaction_category_id,
            'amount'                  => $amount,
            'date_of_income'          => toDate($date_of_income),
            'description'             => $description,
            'options'                 => []
        ];

        if (! $income_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Income $income
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Income $income, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $income->id, $upload_token);
        } else {
            $this->upload->update($this->module, $income->id, $upload_token);
        }
    }

    /**
     * Update given income.
     *
     * @param Income $income
     * @param array $params
     *
     * @return Income
     */
    public function update(Income $income, $params)
    {
        $this->isNotCancelled($income);

        $income->forceFill($this->formatParams($params, $income->id))->save();

        $payment_method_id = gv($params, 'payment_method_id');

        $payment_method = $this->payment_method->findOrFail($payment_method_id);

        $income->Transaction->forceFill([
            'amount'                   => gv($params, 'amount'),
            'date'                     => toDate(gv($params, 'date_of_income')),
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null,
        ])->save();

        $this->processUpload($income, $params, 'update');

        return $income;
    }

    /**
     * Find income is cancelled or not.
     *
     * @param integer $id
     * @return void
     */
    public function isNotCancelled(Income $income)
    {
        if ($income->is_cancelled) {
            throw ValidationException::withMessages(['message' => trans('finance.income_already_cancelled')]);
        }
    }

    /**
     * Find income & check it can be cancelled or not.
     *
     * @param integer $id
     * @return Income
     */
    public function cancellable($uuid)
    {
        $income = $this->findByUuidOrFail($uuid);

        $this->isNotCancelled($income);

        return $income;
    }

    /**
     * Cancel income.
     *
     * @param integer $id
     * @return bool|null
     */
    public function cancel(Income $income)
    {
        $income->is_cancelled = 1;
        $income->save();
    }

    /**
     * Delete multiple income.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->income->whereIn('id', $ids)->delete();
    }
}
