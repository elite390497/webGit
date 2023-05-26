<?php
namespace App\Repositories\Library;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\Library\BookLog;
use App\Models\Library\BookLogDetail;
use App\Models\Library\BookPostDetail;
use App\Repositories\Library\BookRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Finance\Transaction\Transaction;
use App\Repositories\Finance\AccountRepository;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Configuration\Finance\Transaction\PaymentMethodRepository;

class BookLogRepository
{
    protected $book_log;
    protected $book;
    protected $student;
    protected $employee;
    protected $book_log_detail;
    protected $book_post_detail;
    protected $account;
    protected $payment_method;
    protected $transaction;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        BookLog $book_log,
        BookRepository $book,
        StudentRepository $student,
        EmployeeRepository $employee,
        BookLogDetail $book_log_detail,
        BookPostDetail $book_post_detail,
        AccountRepository $account,
        PaymentMethodRepository $payment_method,
        Transaction $transaction
    ) {
        $this->book_log = $book_log;
        $this->book = $book;
        $this->student = $student;
        $this->employee = $employee;
        $this->book_log_detail = $book_log_detail;
        $this->book_post_detail = $book_post_detail;
        $this->account = $account;
        $this->payment_method = $payment_method;
        $this->transaction = $transaction;
    }

    /**
     * Find book log with given id.
     *
     * @param integer $id
     * @return BookLog
     */
    public function find($id)
    {
        return $this->book_log->info()->filterById($id)->first();
    }

    /**
     * Find book log with given id or throw an error.
     *
     * @param integer $id
     * @return BookLog
     */
    public function findOrFail($id)
    {
        $book_log = $this->book_log->info()->filterById($id)->first();

        if (! $book_log) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_log')]);
        }

        return $book_log;
    }

    /**
     * Find book log with given uuid.
     *
     * @param string $uuid
     * @return BookLog
     */
    public function findByUuid($uuid)
    {
        return $this->book_log->info()->filterByUuid($id)->first();
    }

    /**
     * Find book log with given uuid or throw an error.
     *
     * @param string $uuid
     * @return BookLog
     */
    public function findByUuidOrFail($uuid)
    {
        $book_log = $this->book_log->info()->filterByUuid($uuid)->first();

        if (! $book_log) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book_log')]);
        }

        return $book_log;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return BookLog
     */
    public function getData($params)
    {
        $sort_by       = gv($params, 'sort_by', 'date_of_issue');
        $order         = gv($params, 'order', 'desc');
        $issue_to      = gv($params, 'issue_to');
        $return_status = gv($params, 'return_status');

        $date_of_issue_start_date = gv($params, 'date_of_issue_start_date');
        $date_of_issue_end_date   = gv($params, 'date_of_issue_end_date');
        $due_date_start           = gv($params, 'due_date_start');
        $due_date_end             = gv($params, 'due_date_end');

        $query = $this->book_log->info()->withCount([
            'bookLogDetails as book_issue_count','bookLogDetails as book_return_count' => function ($q) {
                $q->whereNotNull('date_of_return')->orWhere('is_non_returnable', 1);
            }
        ])->dateOfIssueBetween([
            'start_date' => $date_of_issue_start_date,
            'end_date' => $date_of_issue_end_date
        ])->dueDateBetween([
            'start_date' => $due_date_start,
            'end_date' => $due_date_end
        ]);

        if ($issue_to == 'student') {
            $query->whereNull('employee_id');
        } elseif ($issue_to == 'employee') {
            $query->whereNull('student_record_id');
        }

        if ($return_status == 'complete') {
            $query->whereHas('bookLogDetails', function ($q1) {
                $q1->whereNotNull('date_of_return')->orWhere('is_non_returnable', 1);
            });
        } elseif ($return_status == 'due') {
            $query->whereHas('bookLogDetails', function ($q1) {
                $q1->whereNull('date_of_return')->where('is_non_returnable', 0);
            });
        } elseif ($return_status == 'overdue') {
            $query->where('due_date', '<', date('Y-m-d'))->whereHas('bookLogDetails', function ($q1) {
                $q1->whereNull('date_of_return')->where('is_non_returnable', 0);
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all book logs using given params.
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
     * @return BookLog
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get late fee payment pre requisite.
     *
     * @return Array
     */
    public function getFeePreRequisite()
    {
        $accounts = $this->account->selectAllActive();

        $payment_method_details = $this->payment_method->getAll();

        $payment_methods = generateSelectOption($payment_method_details->pluck('name', 'id')->all());

        return compact('accounts', 'payment_method_details', 'payment_methods');
    }

    /**
     * Issue a book.
     *
     * @param array $params
     * @return BookLog
     */
    public function issue($params)
    {
        $numbers = gv($params, 'books');
        $type = gv($params, 'type');
        $student_id = gv($params, 'student_id');
        $employee_id = gv($params, 'employee_id');
        $issue_remarks = gv($params, 'issue_remarks');
        $date_of_issue = toDate(gv($params, 'date_of_issue'));

        if (! dateBetweenSession($date_of_issue)) {
            throw ValidationException::withMessages(['date_of_issue' => trans('academic.invalid_session_date_range')]);
        }

        foreach ($numbers as $number) {
            $book_post_detail = $this->book->getBookPostDetail($number, $date_of_issue);
        }

        if (count($numbers) > count(array_unique($numbers))) {
            throw ValidationException::withMessages(['message' => trans('library.duplicate_book_number_found')]);
        }

        $book_post_details = $this->book_post_detail->whereIn('number', $numbers)->get();

        if (! in_array($type, ['student','employee'])) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        if ($type == 'student' && ! $student_id) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
        }

        if ($type == 'employee' && ! $employee_id) {
            throw ValidationException::withMessages(['message' => trans('employee.could_not_find_employee')]);
        }

        if ($type == 'student') {
            $student = $this->student->validateStudentWithDateOrFail($student_id, $date_of_issue);
            $student_record_id = $student->StudentRecords->first()->id;

            $total_unreturned_books = $this->unreturnedBookCount(['type' => $type, 'id' => $student_record_id]);
        } elseif ($type == 'employee') {
            $employee = $this->employee->validateEmployeeWithDateOrFail($employee_id, $date_of_issue);

            $total_unreturned_books = $this->unreturnedBookCount(['type' => $type, 'id' => $employee_id]);
        }

        $total_book = $total_unreturned_books + count($numbers);
        $max_limit = config('config.library_max_book_issue_to_'.$type);

        if ($total_book > $max_limit) {
            throw ValidationException::withMessages(['message' => trans('library.max_book_limit_cross', ['limit' => $max_limit, 'total' => $total_book ])]);
        }

        $due_days = config('config.library_return_due_day_for_'.$type) ? : 0;
        $late_fee_applicable = config('config.library_late_fee_applicable_'.$type) ? 1 : 0;
        $late_fee_frequency = ($late_fee_applicable) ? config('config.library_late_fee_frequency_'.$type) : null;
        $late_fee_charge = ($late_fee_applicable) ? config('config.library_late_fee_charge_'.$type) : 0;

        $book_log = $this->book_log->forceCreate([
            'uuid' => Str::uuid(),
            'date_of_issue' => toDate($date_of_issue),
            'student_record_id' => ($type == 'student') ? $student_record_id : null,
            'employee_id' => ($type == 'employee') ? $employee_id : null,
            'issue_remarks' => $issue_remarks,
            'due_date' => Carbon::parse($date_of_issue)->addDays($due_days)->toDateString(),
            'late_fee_applicable' => $late_fee_applicable,
            'late_fee_frequency' => $late_fee_frequency,
            'late_fee_charge' => $late_fee_charge,
            'options' => []
        ]);

        foreach ($numbers as $number) {
            $this->book_log_detail->create([
                'book_log_id' => $book_log->id,
                'book_post_detail_id' => $book_post_details->firstWhere('number', $number)->id
            ]);
        }
    }

    /**
     * Get unreturned book query
     *
     * @return BookLogDetail
     */
    public function unreturnedBookQuery($params)
    {
        $type = gv($params, 'type');
        $id = gv($params, 'id');

        $query = $this->book_log->whereNotNull('id');

        if ($type == 'student') {
            $query->filterByStudentRecordId($id);
        } elseif ($type == 'employee') {
            $query->filterByEmployeeId($id);
        }

        return $query->whereHas('bookLogDetails', function ($q) {
            $q->whereNull('date_of_return')->orWhere(function ($q1) {
                $q1->whereNotNull('date_of_return')->whereIsNonReturnable(1);
            });
        })->get();
    }

    /**
     * Get unreturned books
     *
     * @return BookLogDetail
     */
    public function unreturnedBooks($params)
    {
        $book_logs = $this->unreturnedBookQuery($params);

        return $book_logs->load(['bookLogDetails' => function ($q) {
            $q->whereNull('date_of_return')->orWhere(function ($q1) {
                $q1->whereNotNull('date_of_return')->whereIsNonReturnable(1);
            });
        }, 'bookLogDetails.bookPostDetail','bookLogDetails.bookPostDetail.bookPost','bookLogDetails.bookPostDetail.bookPost.book','bookLogDetails.bookPostDetail.bookPost.book.bookAuthor']);
    }

    /**
     * Get unreturned book count
     *
     * @return BookLogDetail
     */
    public function unreturnedBookCount($params)
    {
        $book_logs = $this->unreturnedBookQuery($params);

        $book_logs->load(['bookLogDetails' => function ($q) {
            $q->whereNull('date_of_return')->orWhere(function ($q1) {
                $q1->whereNotNull('date_of_return')->whereIsNonReturnable(1);
            });
        }]);

        $total = 0;
        foreach ($book_logs as $book_log) {
            $total += $book_log->bookLogDetails->count();
        }

        return $total;
    }

    /**
     * Return book(s).
     *
     * @param BookLog $book_log
     * @param array $params
     * @return BookLog
     */
    public function returnBook(BookLog $book_log, $params)
    {
        $ids = gv($params, 'ids', []);

        if (! count($ids)) {
            throw ValidationException::withMessages(['message' => trans('library.could_not_find_book')]);
        }

        $unreturned_book_ids = $book_log->BookLogDetails->where('date_of_return', null)->where('is_non_returnable', 0)->pluck('id')->all();

        if (count(array_diff($ids, $unreturned_book_ids))) {
            throw ValidationException::withMessages(['message' => trans('library.some_book_are_returned')]);
        }

        $is_non_returnable = gbv($params, 'is_non_returnable');

        if ($is_non_returnable) {
            $this->nonReturnableAction($book_log, $params);
        } else {
            $this->bookReturnAction($book_log, $params);
        }

        return $book_log;
    }

    /**
     * Non Returnable book action.
     *
     * @param BookLog $book_log
     * @param array $params
     * @return null
     */
    private function nonReturnableAction(BookLog $book_log, $params)
    {
        $non_returnable_remarks           = gv($params, 'non_returnable_remarks');
        $non_returnable_charge_applicable = gbv($params, 'non_returnable_charge_applicable');
        $non_returnable_charge            = ($non_returnable_charge_applicable) ? gv($params, 'non_returnable_charge', 0) : 0;
        $ids                              = gv($params, 'ids');
        $account_id                       = gv($params, 'account_id');
        $payment_method_id                = gv($params, 'payment_method_id');

        if (count($ids) > 1) {
            throw ValidationException::withMessages(['message' => trans('library.mark_non_returnable_book_one_by_one')]);
        }

        $book_log_detail = $book_log->BookLogDetails->whereIn('id', $ids)->first();

        if ($non_returnable_charge_applicable) {
            if ($non_returnable_charge < 1) {
                throw ValidationException::withMessages(['non_returnable_charge' => trans('validation.min.numeric', ['attribute' => trans('library.non_returnable_charge'), 'min' => 1])]);
            }

            $params['amount'] = $non_returnable_charge;
            $params['book_log_detail_id'] = $book_log_detail->id;
            $account        = $this->account->findOrFail($account_id, 'account_id');
            $payment_method = $this->payment_method->findOrFail($payment_method_id, 'payment_method_id');

            $this->createTransaction($payment_method, $account,  $params);
        }

        $book_log_detail->is_non_returnable = 1;
        $book_log_detail->non_returnable_at = now();
        $book_log_detail->non_returnable_remarks = $non_returnable_remarks;
        $book_log_detail->non_returnable_charge = $non_returnable_charge;
        $book_log_detail->save();
    }

    /**
     * Return books.
     *
     * @param BookLog $book_log
     * @param array $params
     * @return null
     */
    private function bookReturnAction(BookLog $book_log, $params)
    {
        $date_of_return    = toDate(gv($params, 'date_of_return'));
        $ids               = gv($params, 'ids', []);
        $late_fee          = gv($params, 'late_fee');
        $return_remarks    = gv($params, 'return_remarks');
        $account_id        = gv($params, 'account_id');
        $payment_method_id = gv($params, 'payment_method_id');

        if (! dateBetweenSession($date_of_return)) {
            throw ValidationException::withMessages(['date_of_return' => trans('academic.invalid_session_date_range')]);
        }

        if ($date_of_return < todate($book_log->date_of_issue)) {
            throw ValidationException::withMessages(['date_of_return' => trans('library.date_of_return_less_than_date_of_issue')]);
        }

        $late = 0;
        if ($book_log->late_fee_applicable && toDate($book_log->due_date) < $date_of_return) {
            $frequency = getLateFeeFrequenciesInDays($book_log->late_fee_frequency);

            $late_days = dateDiff(toDate($book_log->due_date), $date_of_return);

            $per_period = floor($late_days / $frequency);
            $late = $book_log->late_fee_charge * $per_period;
            $total = $late * count($ids);

            if ($late_fee != $total) {
                throw ValidationException::withMessages(['message' => trans('library.late_fee_doesnot_match')]);
            }
        }
            
        if ($late) {
            $account = $this->account->findOrFail($account_id, 'account_id');
            $payment_method = $this->payment_method->findOrFail($payment_method_id, 'payment_method_id');
        }

        $book_log_details = $book_log->BookLogDetails->whereIn('id', $ids)->all();

        foreach ($book_log_details as $book_log_detail) {
            if ($late) {
                $params['amount'] = $late;
                $params['book_log_detail_id'] = $book_log_detail->id;
                $this->createTransaction($payment_method, $account, $params);
            }

            $book_log_detail->date_of_return = toDate($date_of_return);
            $book_log_detail->return_remarks = $return_remarks;
            $book_log_detail->late_fee = $late;
            $book_log_detail->save();
        }
    }

    /**
     * Create transaction for library charge.
     *
     * @param PaymentMethod $payment_method
     * @param array $params
     * @return null
     */
    private function createTransaction($payment_method, $account, $params)
    {
        $account_id        = gv($params, 'account_id');
        $payment_method_id = gv($params, 'payment_method_id');
        $amount = gv($params, 'amount', 0);
        $book_log_detail_id = gv($params, 'book_log_detail_id');

        $number = $this->transaction->filterByAccountId($account_id)->filterByType(1)->max('number');

        $this->transaction->forceCreate([
            'uuid'                     => Str::uuid(),
            'type'                     => 1,
            'prefix'                  => $account->prefix,
            'number'                   => ($number) ? $number + 1 : 1,
            'user_id'                  => \Auth::user()->id,
            'amount'                   => $amount,
            'account_id'               => $account_id,
            'head'                     => 'library_charge',
            'book_log_detail_id'       => $book_log_detail_id,
            'date'                     => date('Y-m-d'),
            'remarks'                  => null,
            'upload_token'             => Str::uuid(),
            'payment_method_id'        => $payment_method_id,
            'instrument_number'        => ($payment_method->getOption('requires_instrument_number')) ? gv($params, 'instrument_number') : null,
            'instrument_date'          => ($payment_method->getOption('requires_instrument_date')) ? toDate(gv($params, 'instrument_date')) : null,
            'instrument_clearing_date' => ($payment_method->getOption('requires_instrument_clearing_date')) ? toDate(gv($params, 'instrument_clearing_date')) : null,
            'instrument_bank_detail'   => ($payment_method->getOption('requires_instrument_bank_detail')) ? gv($params, 'instrument_bank_detail') : null,
            'reference_number'         => ($payment_method->getOption('requires_reference_number')) ? gv($params, 'reference_number') : null,
        ]);
    }
}
