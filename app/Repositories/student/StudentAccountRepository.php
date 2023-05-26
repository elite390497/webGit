<?php
namespace App\Repositories\Student;

use App\Models\Student\StudentAccount;
use Illuminate\Validation\ValidationException;

class StudentAccountRepository
{
    protected $student_account;
    protected $module = 'student_account';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentAccount $student_account
    ) {
        $this->student_account = $student_account;
    }

    /**
     * Get student account query
     *
     * @return StudentAccount query
     */
    public function getQuery()
    {
        return $this->student_account;
    }

    /**
     * Find student account with given id.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentAccount
     */
    public function find($student_id, $id)
    {
        return $this->student_account->filterByStudentId($student_id)->filterById($id)->first();
    }

    /**
     * Find student account with given id or throw an error.
     *
     * @param integer $student_id
     * @param integer $id
     * @return StudentAccount
     */
    public function findOrFail($student_id, $id, $field = 'message')
    {
        $student_account = $this->student_account->filterByStudentId($student_id)->filterById($id)->first();

        if (! $student_account) {
            throw ValidationException::withMessages([$field => trans('student.could_not_find_account')]);
        }

        return $student_account;
    }

    /**
     * Paginate all student accounts using given params.
     *
     * @param integer $student_id
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($student_id, $params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->student_account->filterByStudentId($student_id)->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Create a new student account.
     *
     * @param integer $student_id
     * @param array $params
     * @return StudentAccount
     */
    public function create($student_id, $params)
    {
        $this->validateInput($student_id, $params);

        return $this->student_account->forceCreate($this->formatParams($params, $student_id));
    }

    /**
     * Validate unique account number with student.
     *
     * @param array $params
     * @param integer $id [default null]
     * @return null
     */

    public function validateInput($student_id, $params, $id = null)
    {
        $query = $this->student_account->filterByStudentId($student_id);

        if ($id) {
            $query->where('id', '!=', $id);
        }

        if ($query->filterByAccountNumber(gv($params, 'account_number'))->count()) {
            throw ValidationException::withMessages(['account_number' => trans('validation.unique', ['attribute' => trans('student.account_number')])]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $student_id = null, $action = 'create')
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
            foreach ($this->student_account->filterByStudentId($student_id)->get() as $account) {
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
            $formatted['student_id'] = $student_id;
        }

        return $formatted;
    }

    /**
     * Update given student account.
     *
     * @param StudentAccount $student_account
     * @param array $params
     *
     * @return StudentAccount
     */
    public function update(StudentAccount $student_account, $params)
    {
        $this->validateInput($student_account->student_id, $params, $student_account->id);

        $student_account->forceFill($this->formatParams($params, null, 'update'))->save();

        return $student_account;
    }

    /**
     * Delete student account.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StudentAccount $student_account)
    {
        return $student_account->delete();
    }

    /**
     * Delete multiple student accounts.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->student_account->whereIn('id', $ids)->delete();
    }
}
