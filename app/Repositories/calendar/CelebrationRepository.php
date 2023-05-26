<?php
namespace App\Repositories\Calendar;

use Carbon\Carbon;
use App\Models\Student\Student;
use App\Models\Employee\Employee;
use App\Models\Employee\EmployeeTerm;
use Illuminate\Validation\ValidationException;

class CelebrationRepository
{
    protected $student;
    protected $employee;
    protected $employee_term;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Student $student,
        Employee $employee,
        EmployeeTerm $employee_term
    ) {
        $this->student = $student;
        $this->employee = $employee;
        $this->employee_term = $employee_term;
    }

    /**
     * Get birthdays
     *
     * @return Employee or Student
     */
    public function getBirthday($params = array())
    {
        $start_date = gv($params, 'start_date') ? toDate(gv($params, 'start_date')) : date('Y-m-d');
        $end_date = gv($params, 'end_date') ? toDate(gv($params, 'end_date')) : date('Y-m-d');

        if (dateDiff($end_date, $start_date) > 365) {
            throw ValidationException::withMessages(['message' => trans('calendar.max_selection_period_is_one_year')]);
        }

        $type = gv($params, 'type', 'student');

        if ($type == 'student') {

            $student_ids = $this->student->whereBetween(\DB::raw('DATE_FORMAT(date_of_birth, "%c-%d")'), [\DB::raw('DATE_FORMAT(?, "%c-%d")'), \DB::raw('DATE_FORMAT(?, "%c-%d")')])
                ->orWhere(function($q) {
                    $q->whereRaw('MONTH(?) > MONTH(?)')
                    ->where(function($q1) {
                        $q1->whereRaw('MONTH(date_of_birth) >= MONTH(?)')
                        ->orWhereRaw('MONTH(date_of_birth) <= MONTH(?)');
                    });
                })->setBindings([$start_date, $end_date, $start_date, $end_date, $start_date, $end_date])->get()->pluck('id')->all();

            if (\Auth::user()->hasRole(config('system.default_role.student'))) {
                $student_id = \Auth::user()->student->id;
                $student_ids = in_array($student_id, $student_ids) ? [$student_id] : [];
            } else if (\Auth::user()->hasRole(config('system.default_role.parent'))) {
                $parent_student_ids = \Auth::user()->parent->students->pluck('id')->all();
                $student_ids = array_intersect($parent_student_ids, $student_ids);
            }

            $query = $this->student->with(['studentRecords','studentRecords.batch','studentRecords.batch.course','parent'])->whereHas('studentRecords', function ($q){
                $q->whereNull('date_of_exit')->filterBySession();
            })->whereIn('id', $student_ids);
        } else {
            $employee_ids = $this->employee->whereBetween(\DB::raw('DATE_FORMAT(date_of_birth, "%c-%d")'), [\DB::raw('DATE_FORMAT(?, "%c-%d")'), \DB::raw('DATE_FORMAT(?, "%c-%d")')])
                ->orWhere(function($q) {
                    $q->whereRaw('MONTH(?) > MONTH(?)')
                    ->where(function($q1) {
                        $q1->whereRaw('MONTH(date_of_birth) >= MONTH(?)')
                        ->orWhereRaw('MONTH(date_of_birth) <= MONTH(?)');
                    });
                })->setBindings([$start_date, $end_date, $start_date, $end_date, $start_date, $end_date])->get()->pluck('id')->all();

            if (\Auth::user()->hasAnyRole([config('system.default_role.student'), config('system.default_role.parent')])) {
                $employee_ids = [];
            }

            $query = $this->employee->with(['employeeDesignations','employeeDesignations.designation','employeeDesignations.designation.employeeCategory'])->whereHas('employeeTerms', function ($q) use($start_date, $end_date) {
                $q->whereNull('date_of_leaving');
            })->whereIn('id', $employee_ids);
        }

        return $query->orderBy(\DB::raw('MONTH(date_of_birth)'),'asc')->orderBy(\DB::raw('DAYOFMONTH(date_of_birth)'),'asc');
    }

    /**
     * Paginate all birthdays using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateBirthday($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getBirthday($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Employee or Student
     */
    public function printBirthday($params)
    {
        return $this->getBirthday($params)->get();
    }

    /**
     * Get anniversaries
     *
     * @return Employee
     */
    public function getAnniversary($params = array())
    {
        $start_date = gv($params, 'start_date') ? toDate(gv($params, 'start_date')) : date('Y-m-d');
        $end_date = gv($params, 'end_date') ? toDate(gv($params, 'end_date')) : date('Y-m-d');

        if (dateDiff($end_date, $start_date) > 365) {
            throw ValidationException::withMessages(['message' => trans('calendar.max_selection_period_is_one_year')]);
        }

        $employee_ids = $this->employee->whereBetween(\DB::raw('DATE_FORMAT(date_of_anniversary, "%c-%d")'), [\DB::raw('DATE_FORMAT(?, "%c-%d")'), \DB::raw('DATE_FORMAT(?, "%c-%d")')])
            ->orWhere(function($q) {
                $q->whereRaw('MONTH(?) > MONTH(?)')
                ->where(function($q1) {
                    $q1->whereRaw('MONTH(date_of_anniversary) >= MONTH(?)')
                    ->orWhereRaw('MONTH(date_of_anniversary) <= MONTH(?)');
                });
            })->setBindings([$start_date, $end_date, $start_date, $end_date, $start_date, $end_date])->get()->pluck('id')->all();

        $query = $this->employee->with(['employeeDesignations','employeeDesignations.designation','employeeDesignations.designation.employeeCategory'])->whereHas('employeeTerms', function ($q) use($start_date, $end_date) {
            $q->whereNull('date_of_leaving');
        })->whereIn('id', $employee_ids);

        return $query->orderBy(\DB::raw('MONTH(date_of_anniversary)'),'asc')->orderBy(\DB::raw('DAYOFMONTH(date_of_anniversary)'),'asc');
    }

    /**
     * Paginate all anniversaries using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateAnniversary($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getAnniversary($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Employee
     */
    public function printAnniversary($params)
    {
        return $this->getAnniversary($params)->get();
    }

    /**
     * Get work anniversaries
     *
     * @return Employee
     */
    public function getWorkAnniversary($params = array())
    {
        $start_date = gv($params, 'start_date') ? toDate(gv($params, 'start_date')) : date('Y-m-d');
        $end_date = gv($params, 'end_date') ? toDate(gv($params, 'end_date')) : date('Y-m-d');

        if (dateDiff($end_date, $start_date) > 365) {
            throw ValidationException::withMessages(['message' => trans('calendar.max_selection_period_is_one_year')]);
        }

        $query = $this->employee_term->with('employee','employee.employeeDesignations','employee.employeeDesignations.designation','employee.employeeDesignations.designation.employeeCategory')->whereNull('date_of_leaving')->whereBetween(\DB::raw('DATE_FORMAT(date_of_joining, "%c-%d")'), [\DB::raw('DATE_FORMAT(?, "%c-%d")'), \DB::raw('DATE_FORMAT(?, "%c-%d")')])
            ->orWhere(function($q) {
                $q->whereRaw('MONTH(?) > MONTH(?)')
                ->where(function($q1) {
                    $q1->whereRaw('MONTH(date_of_joining) >= MONTH(?)')
                    ->orWhereRaw('MONTH(date_of_joining) <= MONTH(?)');
                });
            })->setBindings([$start_date, $end_date, $start_date, $end_date, $start_date, $end_date]);

        return $query->orderBy(\DB::raw('MONTH(date_of_joining)'),'asc')->orderBy(\DB::raw('DAYOFMONTH(date_of_joining)'),'asc');
    }

    /**
     * Paginate all work anniversaries using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateWorkAnniversary($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getWorkAnniversary($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Employee
     */
    public function printWorkAnniversary($params)
    {
        return $this->getWorkAnniversary($params)->get();
    }
}
