<?php
namespace App\Repositories\Finance;

use App\Models\Finance\Account;
use Illuminate\Validation\ValidationException;

class AccountRepository
{
    protected $account;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Account $account
    ) {
        $this->account = $account;
    }

    /**
     * Get account query
     *
     * @return Account query
     */
    public function getQuery()
    {
        return $this->account;
    }

    /**
     * Count account
     *
     * @return integer
     */
    public function count()
    {
        return $this->account->count();
    }

    /**
     * List all active accounts by name & id
     *
     * @return array
     */
    public function listAllActive()
    {
        return $this->account->filterByIsActive(1)->get()->pluck('name', 'id')->all();
    }

    /**
     * List all accounts by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->account->all()->pluck('name', 'id')->all();
    }

    /**
     * List all active accounts by name & id for select option
     *
     * @return array
     */

    public function selectAllActive()
    {
        return $this->account->filterByIsActive(1)->get(['name', 'id']);
    }

    /**
     * List all accounts by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->account->all(['name', 'id']);
    }

    /**
     * List all accounts by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->account->all()->pluck('id')->all();
    }

    /**
     * List all active accounts by id
     *
     * @return array
     */
    public function listIdActive()
    {
        return $this->account->filterByIsActive(1)->get()->pluck('id')->all();
    }

    /**
     * Get all accounts
     *
     * @return array
     */
    public function getAll()
    {
        return $this->account->all();
    }

    /**
     * Find account with given id.
     *
     * @param integer $id
     * @return Account
     */
    public function find($id)
    {
        return $this->account->find($id);
    }

    /**
     * Find account with given id or throw an error.
     *
     * @param integer $id
     * @return Account
     */
    public function findOrFail($id, $field = 'message')
    {
        $account = $this->account->find($id);

        if (! $account) {
            throw ValidationException::withMessages([$field => trans('finance.could_not_find_account')]);
        }

        return $account;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Account
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->account->orderBy($sort_by, $order);
    }

    /**
     * Paginate all accounts using given params.
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
     * @return Account
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new account.
     *
     * @param array $params
     * @return Account
     */
    public function create($params)
    {
        return $this->account->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $account = null)
    {
        $is_default = gbv($params, 'is_default');

        if ($is_default) {
            if ($account) {
                $this->account->where('id', '!=', $account->id)->update(['is_default' => 0]);
            } else {
                $this->account->whereNotNull('id')->update(['is_default' => 0]);
            }
        }
        $type = gv($params, 'type');

        return [
            'name'                     => gv($params, 'name'),
            'prefix'                   => strtoupper(gv($params, 'prefix')),
            'type'                     => $type,
            'bank_name'                => ($type == 'bank') ? gv($params, 'bank_name') : null,
            'branch_name'              => ($type == 'bank') ? gv($params, 'branch_name') : null,
            'bank_identification_code' => ($type == 'bank') ? gv($params, 'bank_identification_code') : null,
            'account_number'           => ($type == 'bank') ? gv($params, 'account_number') : null,
            'opening_balance'          => gv($params, 'opening_balance', 0),
            'is_active'                => gbv($params, 'is_active'),
            'is_default'               => gbv($params, 'is_default')
        ];
    }

    /**
     * Update given account.
     *
     * @param Account $account
     * @param array $params
     *
     * @return Account
     */
    public function update(Account $account, $params)
    {
        return $account->forceFill($this->formatParams($params, $account))->save();
    }

    /**
     * Find account & check it can be deleted or not.
     *
     * @param integer $id
     * @return Account
     */
    public function deletable($id)
    {
        $account = $this->findOrFail($id);

        if ($account->transactions()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.account_associated_with_transaction')]);
        }

        if ($account->fromAccountTransfers()->count() || $account->toAccountTransfers()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.account_associated_with_account_transfer')]);
        }

        return $account;
    }

    /**
     * Delete account.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Account $account)
    {
        return $account->delete();
    }

    /**
     * Delete multiple accounts.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->account->whereIn('id', $ids)->delete();
    }
}
