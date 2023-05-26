<?php
namespace App\Repositories\Configuration\Finance\Transaction;

use App\Models\Configuration\Finance\Transaction\TransactionCategory;
use Illuminate\Validation\ValidationException;

class TransactionCategoryRepository
{
    protected $transaction_category;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        TransactionCategory $transaction_category
    ) {
        $this->transaction_category = $transaction_category;
    }

    /**
     * Get transaction category query
     *
     * @return TransactionCategory query
     */
    public function getQuery()
    {
        return $this->transaction_category;
    }

    /**
     * Count transaction category
     *
     * @return integer
     */
    public function count()
    {
        return $this->transaction_category->count();
    }

    /**
     * List all transaction categories by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->transaction_category->all()->pluck('name', 'id')->all();
    }

    /**
     * List all transaction categories by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->transaction_category->all(['name', 'id']);
    }

    /**
     * List all income categories by name & id for select option
     *
     * @return array
     */

    public function selectAllIncomeCategory()
    {
        return $this->transaction_category->filterByType('income')->get(['name', 'id']);
    }

    /**
     * List all expense categories by name & id for select option
     *
     * @return array
     */

    public function selectAllExpenseCategory()
    {
        return $this->transaction_category->filterByType('expense')->get(['name', 'id']);
    }

    /**
     * List all transaction categories by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->transaction_category->all()->pluck('id')->all();
    }

    /**
     * Get all transaction categories
     *
     * @return array
     */
    public function getAll()
    {
        return $this->transaction_category->all();
    }

    /**
     * Find transaction category with given id.
     *
     * @param integer $id
     * @return TransactionCategory
     */
    public function find($id)
    {
        return $this->transaction_category->find($id);
    }

    /**
     * Find transaction category with given id or throw an error.
     *
     * @param integer $id
     * @return TransactionCategory
     */
    public function findOrFail($id)
    {
        $transaction_category = $this->transaction_category->find($id);

        if (! $transaction_category) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_transaction_category')]);
        }

        return $transaction_category;
    }

    /**
     * Find expense transaction category with given id or throw an error.
     *
     * @param integer $id
     * @return TransactionCategory
     */
    public function findExpenseCategoryOrFail($id)
    {
        $transaction_category = $this->transaction_category->filterByType('expense')->filterById($id)->first();

        if (! $transaction_category) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_transaction_category')]);
        }

        return $transaction_category;
    }

    /**
     * Find income transaction category with given id or throw an error.
     *
     * @param integer $id
     * @return TransactionCategory
     */
    public function findIncomeCategoryOrFail($id)
    {
        $transaction_category = $this->transaction_category->filterByType('income')->filterById($id)->first();

        if (! $transaction_category) {
            throw ValidationException::withMessages(['message' => trans('finance.could_not_find_transaction_category')]);
        }

        return $transaction_category;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return TransactionCategory
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $type    = gv($params, 'type');

        return $this->transaction_category->filterByType($type)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all transaction category using given params.
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
     * @return TransactionCategory
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new transaction category.
     *
     * @param array $params
     * @return TransactionCategory
     */
    public function create($params)
    {
        return $this->transaction_category->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $transaction_category_id
     * @return array
     */
    private function formatParams($params, $transaction_category_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'type'        => gv($params, 'type'),
            'description' => gv($params, 'description')
        ];

        $formatted['options'] = [];

        return $formatted;
    }

    /**
     * Update given transaction category.
     *
     * @param TransactionCategory $transaction_category
     * @param array $params
     *
     * @return TransactionCategory
     */
    public function update(TransactionCategory $transaction_category, $params)
    {
        if ($transaction_category->type == 'income' && $transaction_category->incomes()->count() && $transaction_category->type != gv($params, 'type')) {
            throw ValidationException::withMessages(['message' => trans('finance.transaction_category_associated_with_income')]);
        }

        if ($transaction_category->type == 'expense' && $transaction_category->expenses()->count() && $transaction_category->type != gv($params, 'type')) {
            throw ValidationException::withMessages(['message' => trans('finance.transaction_category_associated_with_expense')]);
        }

        return $transaction_category->forceFill($this->formatParams($params, $transaction_category->id))->save();
    }

    /**
     * Find transaction category & check it can be deleted or not.
     *
     * @param integer $id
     * @return TransactionCategory
     */
    public function deletable($id)
    {
        $transaction_category = $this->findOrFail($id);

        if ($transaction_category->incomes()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.transaction_category_associated_with_income')]);
        }

        if ($transaction_category->expenses()->count()) {
            throw ValidationException::withMessages(['message' => trans('finance.transaction_category_associated_with_expense')]);
        }

        return $transaction_category;
    }

    /**
     * Delete transaction category.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(TransactionCategory $transaction_category)
    {
        return $transaction_category->delete();
    }

    /**
     * Delete multiple transaction categories.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->transaction_category->whereIn('id', $ids)->delete();
    }
}
