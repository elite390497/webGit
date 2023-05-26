<?php
namespace App\Repositories\Communication;

use Carbon\Carbon;
use App\Jobs\SendSMS;
use App\Models\Employee\Employee;
use App\Models\Student\StudentRecord;
use App\Models\Communication\Communication;
use Illuminate\Validation\ValidationException;
use App\Repositories\Communication\CommunicationRepository;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Employee\EmployeeCategoryRepository;

class SMSRepository
{
    protected $employee_category;
    protected $department;
    protected $course_group;
    protected $student_record;
    protected $employee;
    protected $communication;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeCategoryRepository $employee_category,
        DepartmentRepository $department,
        CourseGroupRepository $course_group,
        StudentRecord $student_record,
        Employee $employee,
        CommunicationRepository $communication
    ) {
        $this->employee_category = $employee_category;
        $this->department = $department;
        $this->course_group = $course_group;
        $this->student_record = $student_record;
        $this->employee = $employee;
        $this->communication = $communication;
    }

    /**
     * Send SMS
     *
     * @param array $params
     * @return null
     */
    public function submit($params = array())
    {
        $sms      = gv($params, 'sms');
        $includes = gv($params, 'includes');
        $excludes = gv($params, 'excludes');

        $includes = explode("\n", $includes);
        $includes = array_filter($includes, 'trim');

        $excludes = explode("\n", $excludes);
        $excludes = array_filter($excludes, 'trim');

        $numbers = $this->getAudienceNumber($params);

        foreach ($includes as $include) {
            $numbers[] = $include;
        } 

        $numbers = array_filter($numbers);
        $numbers = array_diff($numbers, $excludes);

        if (! $numbers) {
            throw ValidationException::withMessages(['message' => trans('communication.could_not_find_any_audience')]);
        }

        $params['recipient_numbers'] = $numbers;
        $params['included_numbers'] = $includes;
        $params['excluded_numbers'] = $excludes;
        $communication = $this->communication->create($params);

        $numbers = collect($numbers);

        foreach ($numbers->chunk(config('config.max_sms_per_chunk')) as $chunk) {
            SendSMS::dispatch($chunk, $sms);
        }

        return count($numbers);
    }

    /**
     * Send SMS
     *
     * @param array $params
     * @return array
     */
    public function getAudienceNumber($params = array())
    {
        $audience = gv($params, 'audience');

        if (! $audience)
            return [];

        $student_numbers = array();
        if (in_array($audience, ['everyone','selected_course','selected_batch'])) {
            $student_numbers = $this->getStudentNumber($params);
        } 

        $employee_numbers = array();
        if (in_array($audience, ['everyone','selected_department','selected_employee_category'])) {
            $employee_numbers = $this->getEmployeeNumber($params);
        }

        $numbers = array_merge($student_numbers, $employee_numbers);

        $numbers = array_unique($numbers);

        return $numbers;
    }

    public function getStudentNumber($params = array())
    {
        $course_id = gv($params, 'course_id');
        $batch_id  = gv($params, 'batch_id');
        $course_id = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);
        $batch_id  = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $include_alternate_number = gbv($params, 'include_alternate_number');

        $query = $this->student_record->filterBySession()->whereNull('date_of_exit')->select(['id','student_id'])->with(['student:id,student_parent_id,contact_number,emergency_contact_number','student.parent:id,first_guardian_contact_number_1,first_guardian_contact_number_2,second_guardian_contact_number_1,second_guardian_contact_number_2']);

        if (gv($params, 'audience') == 'selected_course') {
            $query->whereHas('batch', function($q) use($course_id) {
                $q->whereIn('course_id', $course_id);
            });
        }

        if (gv($params, 'audience') == 'selected_batch') {
            $query->whereIn('batch_id', $batch_id);
        }

        $student_records = $query->get();

        $numbers = array();
        foreach ($student_records as $student_record) {
            $numbers[] = $student_record->student->contact_number;

            if ($include_alternate_number) {
                $numbers[] = $student_record->student->emergency_contact_number;
                $numbers[] = $student_record->student->parent->first_guardian_contact_number_1;
                $numbers[] = $student_record->student->parent->first_guardian_contact_number_2;
                $numbers[] = $student_record->student->parent->second_guardian_contact_number_1;
                $numbers[] = $student_record->student->parent->second_guardian_contact_number_2;
            }
        }

        $numbers = array_unique($numbers);

        return $numbers;
    }

    public function getEmployeeNumber($params = array())
    {
        $employee_category_id = gv($params, 'employee_category_id');
        $department_id        = gv($params, 'department_id');
        $employee_category_id = is_array($employee_category_id) ? $employee_category_id : ($employee_category_id ? explode(',', $employee_category_id) : []);
        $department_id        = is_array($department_id) ? $department_id : ($department_id ? explode(',', $department_id) : []);

        $include_alternate_number = gbv($params, 'include_alternate_number');

        $query = $this->employee->select(['id','contact_number','alternate_contact_number','emergency_contact_number'])->whereHas('employeeTerms', function ($q) {
            $q->where(function ($q1) {
                $q1->whereNull('date_of_leaving')->where('date_of_joining', '<=', date('Y-m-d'));
            })->orWhere(function ($q2) {
                $q2->whereNotNull('date_of_leaving')->where('date_of_joining', '<=', date('Y-m-d'))->where('date_of_leaving', '>=', date('Y-m-d'));
            });
        });

        if (gv($params, 'audience') == 'selected_employee_category') {
            $query->whereHas('employeeDesignations', function ($q) use ($employee_category_id) {
                $q->where('date_effective', '<=', date('Y-m-d'))->where(function ($q1) {
                    $q1->where('date_end', '=', null)->orWhere(function ($q2) {
                        $q2->where('date_end', '!=', null)->where('date_end', '>=', date('Y-m-d'));
                    });
                })->whereHas('designation', function($q) use ($employee_category_id) {
                    $q->whereHas('employeeCategory',function($q1) use ($employee_category_id) {
                        $q1->whereIn('employee_category_id', $employee_category_id);
                    });
                });
            });
        }

        if (gv($params, 'audience') == 'selected_department') {
            $query->whereHas('employeeDesignations', function ($q) use ($department_id) {
                $q->where('date_effective', '<=', date('Y-m-d'))->where(function ($q1) {
                    $q1->where('date_end', '=', null)->orWhere(function ($q2) {
                        $q2->where('date_end', '!=', null)->where('date_end', '>=', date('Y-m-d'));
                    });
                })->whereIn('department_id', $department_id);
            });
        }

        $employees = $query->get();

        $numbers = array();
        foreach ($employees as $employee) {
            $numbers[] = $employee->contact_number;

            if ($include_alternate_number) {
                $numbers[] = $employee->alternate_contact_number;
                $numbers[] = $employee->emergency_contact_number;
            }
        }

        $numbers = array_unique($numbers);

        return $numbers;
    }
}