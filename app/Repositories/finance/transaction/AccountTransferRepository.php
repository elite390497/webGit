<?php
namespace App\Repositories\Finance\Transaction;

use Illuminate\Support\Str;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Transaction\Transaction;
use App\Repositories\Finance\AccountRepository;
use App\Models\Finance\Transaction\AccountTransfer;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;

class AccountTransferRepository
{
    protected $account_transfer;
    protected $upload;
    protected $account;
    protected $payment_method;
    protected $transaction;

    protected $module = 'account-transfer';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        AccountTransfer $account_transfer,
        UploadRepository $upload,
        AccountRepository $account,
        PaymentMethodRepository $payment_method,
        Transaction $transaction
    ) {
        $this->account_transfer = $account_transfer;
        $this->upload = $upload;
        $this->account = $account;
        $this->payment_method = $payment_method;
        $this->transaction = $transaction;
    }

    /**
     * Find account transfer with given id.
     *
     * @param integer $id
     * @return AccountTransfer
     */
    public function find($id)
    {
        return $this->account_transfer->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find account transfer with given id or throw an error.
     *
     * @param integer $id
     * @return AccountTransfer
     */
    public function findOrFail($id, $field = 'message')
    {
        $account_transfer = $this->account_transfer->info()->filterBySession()->filterById($id)->first();

        if (! $account_transfer) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_account_transfer')]);
        }

        return $account_transfer;
    }

    /**
     * Find account transfer with given uuid.
     *
     * @param string $uuid
     * @return AccountTransfer
     */
    public function findByUuid($uuid)
    {
        return $this->account_transfer->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find account transfer with given uuid or throw an error.
     *
     * @param string $uuid
     * @return AccountTransfer
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $account_transfer = $this->account_transfer->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $account_transfer) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_account_transfer')]);
        }

        return $account_transfer;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return AccountTransfer
     */
    public function getData($params)
    {
        $sort_by           = gv($params, 'sort_by', 'date_of_account_transfer');
        $order             = gv($params, 'order', 'desc');
        $from_account_id   = gv($params, 'from_account_id');
        $to_account_id     = gv($params, 'to_account_id');
        $payment_method_id = gv($params, 'payment_method_id');
        $is_cancelled       = gv($params, 'is_cancelled');

        $from_account_id = is_array($from_account_id) ? $from_account_id : ($from_account_id ? explode(',', $from_account_id) : []);
        $to_account_id = is_array($to_account_id) ? $to_account_id : ($to_account_id ? explode(',', $to_account_id) : []);
        $payment_method_id = is_array($payment_method_id) ? $payment_method_id : ($payment_method_id ? explode(',', $payment_method_id) : []);

        $date_of_account_transfer_start_date = gv($params, 'date_of_account_transfer_start_date');
        $date_of_account_transfer_end_date   = gv($params, 'date_of_account_transfer_end_date');

        $query = $this->account_transfer->info()->filterBySession()->dateOfAccountTransferBetween([
                'start_date' => $date_of_account_transfer_start_date,
                'end_date' => $date_of_account_transfer_end_date
            ]);

        if ($is_cancelled) {
            $query->filterByCancelled(1);
        } else {
            $query->filterByCancelled(0);
        }

        if (count($from_account_id)) {
            $query->whereIn('from_account_id', $from_account_id);
        }

        if (count($to_account_id)) {
            $query->whereIn('to_account_id', $to_account_id);
        }

        if (count($payment_method_id)) {
            $query->whereHas('transaction', function ($q) use ($payment_method_id) {
                $q->whereIn('payment_method_id', $payment_method_id);
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all account transfer using given params.
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
     * @return AccountTransfer
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
        $accounts = $this->account->selectAllActive();
        $payment_method_details = $this->payment_method->getAll();
        $payment_methods = generateSelectOption($payment_method_details->pluck('name', 'id')->all());

        return compact('accounts', 'payment_method_details', 'payment_methods');
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
     * Create a new account transfer.
     *
     * @param array $params
     * @return AccountTransfer
     */
    public function create($params)
    {
        $payment_method_id = gv($params, 'payment_method_id');

        $account_transfer = $this->account_transfer->forceCreate($this->formatParams($params));

        $payment_method = $this->payment_method->findOrFail($payment_method_id);

        $number = $this->transaction->filterByAccountId($account_transfer->to_account_id)->filterByType(1)->max('number');
        $this->transaction->forceCreate([
            'uuid'                     => Str::uuid(),
            'type'                     => 1,
            'prefix'                   => $account_transfer->ToAccount->prefix,
            'number'                   => ($number) ? $number + 1 : 1,
            'user_id'                  => \Auth::user()->id,
            'amount'                   => gv($params, 'amount'),
            'account_id'               => $account_transfer->to_account_id,
            'head'                     => 'account-transfer',
            'account_transfer_id'      => $account_transfer->id,
            'date'                     => toDate(gv($params, 'date_of_account_transfer')),
            'remarks'                  => null,
            'upload_token'             => Str::uuid(),
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null,
        ]);

        $this->processUpload($account_transfer, $params);

        return $account_transfer;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $account_transfer_id = null)
    {
        $amount                   = gv($params, 'amount', 0);
        $date_of_account_transfer = toDate(gv($params, 'date_of_account_transfer'));
        $description              = gv($params, 'description');
        $from_account_id          = gv($params, 'from_account_id');
        $to_account_id            = gv($params, 'to_account_id');
        $payment_method_id        = gv($params, 'payment_method_id');

        $from_account = $this->account->findOrFail($from_account_id);
        $to_account = $this->account->findOrFail($to_account_id);

        if (! dateBetweenSession($date_of_account_transfer)) {
            throw ValidationException::withMessages(['date_of_account_transfer' => trans('academic.invalid_session_date_range')]);
        }

        $formatted = [
            'amount'                   => $amount,
            'date_of_account_transfer' => toDate($date_of_account_transfer),
            'description'              => $description,
            'options'                  => []
        ];

        if (! $account_transfer_id) {
            $formatted['upload_token']    = gv($params, 'upload_token');
            $formatted['uuid']            = Str::uuid();
            $formatted['user_id']         = \Auth::user()->id;
            $formatted['from_account_id'] = $from_account_id;
            $formatted['to_account_id']   = $to_account_id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param AccountTransfer $account_transfer
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(AccountTransfer $account_transfer, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $account_transfer->id, $upload_token);
        } else {
            $this->upload->update($this->module, $account_transfer->id, $upload_token);
        }
    }

    /**
     * Update given account transfer.
     *
     * @param AccountTransfer $account_transfer
     * @param array $params
     *
     * @return AccountTransfer
     */
    public function update(AccountTransfer $account_transfer, $params)
    {
        $this->isNotCancelled($account_transfer);
        
        $account_transfer->forceFill($this->formatParams($params, $account_transfer->id))->save();

        $payment_method_id = gv($params, 'payment_method_id');

        $payment_method = $this->payment_method->findOrFail($payment_method_id);

        $account_transfer->Transaction->forceFill([
            'amount'                   => gv($params, 'amount'),
            'date'                     => toDate(gv($params, 'date_of_account_transfer')),
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null,
        ])->save();

        $this->processUpload($account_transfer, $params, 'update');

        return $account_transfer;
    }

    /**
     * Find account transfer is cancelled or not.
     *
     * @param integer $id
     * @return void
     */
    public function isNotCancelled(AccountTransfer $account_transfer)
    {
        if ($account_transfer->is_cancelled) {
            throw ValidationException::withMessages(['message' => trans('finance.account_transfer_already_cancelled')]);
        }
    }

    /**
     * Find account transfer & check it can be cancelled or not.
     *
     * @param integer $id
     * @return AccountTransfer
     */
    public function cancellable($uuid)
    {
        $account_transfer = $this->findByUuidOrFail($uuid);

        $this->isNotCancelled($account_transfer);

        return $account_transfer;
    }

    /**
     * Cancel account transfer.
     *
     * @param integer $id
     * @return bool|null
     */
    public function cancel(AccountTransfer $account_transfer)
    {
        $account_transfer->is_cancelled = 1;
        $account_transfer->save();
    }

    /**
     * Delete multiple account transfer.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->account_transfer->whereIn('id', $ids)->delete();
    }
}
