<?php
namespace App\Repositories\Communication;

use Carbon\Carbon;
use App\Jobs\SendPushNotification;
use App\UserPushToken;
use App\Models\Employee\Employee;
use App\Models\Student\StudentRecord;
use App\Models\Communication\Communication;
use Illuminate\Validation\ValidationException;
use App\Repositories\Communication\CommunicationRepository;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Employee\EmployeeCategoryRepository;

class PushNotificationRepository
{
    protected $employee_category;
    protected $department;
    protected $course_group;
    protected $student_record;
    protected $employee;
    protected $communication;
    protected $user_push_token;

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
        CommunicationRepository $communication,
        UserPushToken $user_push_token
    ) {
        $this->employee_category = $employee_category;
        $this->department = $department;
        $this->course_group = $course_group;
        $this->student_record = $student_record;
        $this->employee = $employee;
        $this->communication = $communication;
        $this->user_push_token = $user_push_token;
    }

    /**
     * Send push notification
     *
     * @param array $params
     * @return null
     */
    public function submit($params = array())
    {
        $title = gv($params, 'title');
        $body = gv($params, 'body');

        if (! config('config.pusher_auth_token')) {
            throw ValidationException::withMessages(['message' => trans('configuration.pusher_auth_token_missing')]);
        }

        if (gbv($params, 'send_to_admin')) {
            $system_admins = $this->employee->whereHas('user', function ($q) {
                $q->role(config('system.default_role.admin'));
            })->get()->pluck('id')->all();
            $individual_employees = gv($params, 'individual_employees', []);
            $individual_employees = array_merge($individual_employees, $system_admins);
            $params['individual_employees'] = $individual_employees;
        }

        $tokens = $this->getAudienceToken($params);

        $options['individual_students'] = array_unique(gv($params, 'individual_students', []));
        $options['individual_employees'] = array_unique(gv($params, 'individual_employees', []));

        $params['recipient_tokens'] = $tokens;

        if (! count($tokens)) {
            throw ValidationException::withMessages(['message' => trans('communication.could_not_find_any_audience')]);
        }

        $communication = $this->communication->create($params);
        $communication->options = $options;
        $communication->save();

        SendPushNotification::dispatch([
            'pusher_auth_token' => config('config.pusher_auth_token'),
            'tokens' => $tokens,
            'title' => $title,
            'body' => $body,
            'url' => url()->current()
        ]);

        return count($tokens);
    }

    /**
     * Get audience token
     *
     * @param array $params
     * @return array
     */
    public function getAudienceToken($params = array())
    {
        $audience = gv($params, 'audience');

        $student_tokens = array();
        if (in_array($audience, ['everyone','selected_course','selected_batch']) || gv($params, 'individual_students', [])) {
            $student_tokens = $this->getStudentToken($params);
        } 

        $employee_tokens = array();
        if (in_array($audience, ['everyone','selected_department','selected_employee_category']) || gv($params, 'individual_employees', [])) {
            $employee_tokens = $this->getEmployeeToken($params);
        }

        $tokens = array_merge($student_tokens, $employee_tokens);

        $tokens = array_unique($tokens);

        return $tokens;
    }

    public function getStudentToken($params = array())
    {
        $course_id = gv($params, 'course_id');
        $batch_id  = gv($params, 'batch_id');
        $course_id = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);
        $batch_id  = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);
        $individual_students = array_unique(gv($params, 'individual_students', []));

        $selected_student_record_ids = array();
        if (in_array(gv($params, 'audience'), ['everyone', 'selected_course', 'selected_batch'])) {
            $query = $this->student_record->filterBySession()->whereNull('date_of_exit');

            if (gv($params, 'audience') == 'selected_course') {
                $query->whereHas('batch', function($q) use($course_id) {
                    $q->whereIn('course_id', $course_id);
                });
            }

            if (gv($params, 'audience') == 'selected_batch') {
                $query->whereIn('batch_id', $batch_id);
            }

            $selected_student_record_ids = $query->get()->pluck('id')->all();
        }

        $individual_student_record_ids = $this->student_record->whereIn('id', $individual_students)->get()->pluck('id')->all();

        $total_student_record_ids = array_merge($selected_student_record_ids, $individual_student_record_ids);

        $student_records = $this->student_record->select(['id','student_id'])->with(['student:id,user_id','student.parent:id,user_id'])->whereIn('id', $total_student_record_ids)->get();

        $user_ids = array();
        foreach ($student_records as $student_record) {
            if ($student_record->student->user_id) {
                $user_ids[] = $student_record->student->user_id;
            }
            if ($student_record->student->parent_id && $student_record->student->parent->user_id) {
                $user_ids[] = $student_record->student->parent->user_id;
            }
        }

        $tokens = $this->user_push_token->whereIn('user_id', $user_ids)->get()->pluck('token')->all();

        $tokens = array_unique($tokens);

        return $tokens;
    }

    public function getEmployeeToken($params = array())
    {
        $employee_category_id = gv($params, 'employee_category_id');
        $department_id        = gv($params, 'department_id');
        $employee_category_id = is_array($employee_category_id) ? $employee_category_id : ($employee_category_id ? explode(',', $employee_category_id) : []);
        $department_id        = is_array($department_id) ? $department_id : ($department_id ? explode(',', $department_id) : []);
        $individual_employees = array_unique(gv($params, 'individual_employees', []));

        $selected_employee_ids = array();
        if (in_array(gv($params, 'audience'), ['everyone', 'selected_employee_category', 'selected_department'])) {
            $query = $this->employee->whereHas('employeeTerms', function ($q) {
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

            $selected_employee_ids = $query->get()->pluck('id')->all();
        }

        $individual_employee_ids = $this->employee->whereIn('id', $individual_employees)->get()->pluck('id')->all();

        $total_employee_ids = array_merge($selected_employee_ids, $individual_employee_ids);

        $employees = $this->employee->whereIn('id', $total_employee_ids)->select(['id','user_id'])->get();

        $user_ids = array();
        foreach ($employees as $employee) {
            if ($employee->user_id) {
                $user_ids[] = $employee->user_id;
            }
        }

        $tokens = $this->user_push_token->whereIn('user_id', $user_ids)->get()->pluck('token')->all();

        $tokens = array_unique($tokens);

        return $tokens;
    }
}