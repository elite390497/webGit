<?php
namespace App\Repositories\Employee;

use App\Models\Employee\EmployeeAccount;
use Illuminate\Validation\ValidationException;

class EmployeeAccountRepository
{
    protected $employee_account;
    protected $module = 'employee_account';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeAccount $employee_account
    ) {
        $this->employee_account = $employee_account;
    }

    /**
     * Get employee account query
     *
     * @return EmployeeAccount query
     */
    public function getQuery()
    {
        return $this->employee_account;
    }

    /**
     * Find employee account with given id.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeAccount
     */
    public function find($employee_id, $id)
    {
        return $this->employee_account->filterByEmployeeId($employee_id)->filterById($id)->first();
    }

    /**
     * Find employee account with given id or throw an error.
     *
     * @param integer $employee_id
     * @param integer $id
     * @return EmployeeAccount
     */
    public function findOrFail($employee_id, $id, $field = 'message')
    {
        $employee_account = $this->employee_account->filterByEmployeeId($employee_id)->filterById($id)->first();

        if (! $employee_account) {
            throw ValidationException::withMessages([$field => trans('employee.could_not_find_account')]);
        }

        return $employee_account;
    }

    /**
     * Paginate all employee accounts using given params.
     *
     * @param integer $employee_id
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($employee_id, $params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->employee_account->filterByEmployeeId($employee_id)->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Create a new employee account.
     *
     * @param integer $employee_id
     * @param array $params
     * @return EmployeeAccount
     */
    public function create($employee_id, $params)
    {
        $this->validateInput($employee_id, $params);

        return $this->employee_account->forceCreate($this->formatParams($params, $employee_id));
    }

    /**
     * Validate unique account number with employee.
     *
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput($employee_id, $params, $id = null)
    {
        $query = $this->employee_account->filterByEmployeeId($employee_id);

        if ($id) {
            $query->where('id', '!=', $id);
        }

        if ($query->filterByAccountNumber(gv($params, 'account_number'))->count()) {
            throw ValidationException::withMessages(['account_number' => trans('validation.unique', ['attribute' => trans('employee.account_number')])]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $employee_id = null, $action = 'create')
    {
        $is_primary = gbv($params, 'is_primary');

        $formatted = [
            'name'                     => gv($params, 'name'),
            'account_number'           => gv($params, 'account_number'),
            'bank_name'                => gv($params, 'bank_name'),
            'branch_name'              => gv($params, 'branch_name'),
            'bank_identification_code' => gv($params, 'bank_identification_code'),
            'description'                     => gv($params, 'description')
        ];

        if ($is_primary) {
            foreach ($this->employee_account->filterByEmployeeId($employee_id)->get() as $account) {
                if ($account->getOption('is_primary')) {
                    $options = $account->options;
                    $options['is_primary'] = 0;
                    $account->options = $options;
                    $account->save();
                }
            }
        }

        $options['is_primary'] = $is_primary;
        
        $formatted['options'] = $options;

        if ($action == 'create') {
            $formatted['employee_id'] = $employee_id;
        }

        return $formatted;
    }

    /**
     * Update given employee account.
     *
     * @param EmployeeAccount $employee_account
     * @param array $params
     *
     * @return EmployeeAccount
     */
    public function update(EmployeeAccount $employee_account, $params)
    {
        $this->validateInput($employee_account->employee_id, $params, $employee_account->id);

        $employee_account->forceFill($this->formatParams($params, null, 'update'))->save();

        return $employee_account;
    }

    /**
     * Delete employee account.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(EmployeeAccount $employee_account)
    {
        return $employee_account->delete();
    }

    /**
     * Delete multiple employee accounts.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->employee_account->whereIn('id', $ids)->delete();
    }
}
