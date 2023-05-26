<?php
namespace App\Repositories\Communication;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\Communication\Communication;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Academic\CourseRepository;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Employee\EmployeeCategoryRepository;

class CommunicationRepository
{
    protected $communication;
    protected $employee_category;
    protected $department;
    protected $course_group;
    protected $course;
    protected $batch;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        EmployeeCategoryRepository $employee_category,
        DepartmentRepository $department,
        CourseGroupRepository $course_group,
        Communication $communication,
        CourseRepository $course,
        BatchRepository $batch
    ) {
        $this->employee_category = $employee_category;
        $this->department = $department;
        $this->course_group = $course_group;
        $this->communication = $communication;
        $this->course = $course;
        $this->batch = $batch;
    }

    /**
     * Find communication with given uuid.
     *
     * @param string $uuid
     * @return Communication
     */
    public function findByUuid($uuid)
    {
        return $this->communication->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find communication with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Communication
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $communication = $this->communication->info()->filterBySession()->filterByUuid($uuid)->first();
        if (! $communication) {
            throw ValidationException::withMessages([$field => trans('communication.could_not_find')]);
        }

        return $communication;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Communication
     */
    public function getData($params)
    {
        $sort_by              = gv($params, 'sort_by', 'created_at');
        $order                = gv($params, 'order', 'desc');
        $type                 = gv($params, 'type');
        $subject              = gv($params, 'subject');
        $course_id            = gv($params, 'course_id');
        $batch_id             = gv($params, 'batch_id');
        $department_id        = gv($params, 'department_id');
        $employee_category_id = gv($params, 'employee_category_id');
        
        $start_date = gv($params, 'start_date');
        $end_date   = gv($params, 'end_date');

        $course_id            = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);
        $batch_id             = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);
        $department_id        = is_array($department_id) ? $department_id : ($department_id ? explode(',', $department_id) : []);
        $employee_category_id = is_array($employee_category_id) ? $employee_category_id : ($employee_category_id ? explode(',', $employee_category_id) : []);

        $query = $this->communication->info()->filterBySession()->filterBySubject($subject)->filterByType($type)->dateBetween([
            'start_date' => $start_date,
            'end_date' => $end_date
        ]);

        if (! \Auth::user()->can('send-sms')) {
            $query->where('type','!=','sms');
        }

        if (! \Auth::user()->can('send-email')) {
            $query->where('type','!=','email');
        }

        if (count($course_id)) {
            $query->whereHas('courses', function ($q) use ($course_id) {
                $q->whereIn('course_id', $course_id);
            });
        }

        if (count($batch_id)) {
            $query->whereHas('batches', function ($q) use ($batch_id) {
                $q->whereIn('batch_id', $batch_id);
            });
        }

        if (count($department_id)) {
            $query->whereHas('departments', function ($q) use ($department_id) {
                $q->whereIn('department_id', $department_id);
            });
        }

        if (count($employee_category_id)) {
            $query->whereHas('employeeCategories', function ($q) use ($employee_category_id) {
                $q->whereIn('employee_category_id', $employee_category_id);
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all communication using given params.
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
     * @return Communication
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
        $employee_categories = $this->employee_category->selectAllExludingDefault();
        $departments = $this->department->selectAll();
        $courses = $this->course_group->getCourseOption();
        $batches = $this->course_group->getBatchOption();
        $audiences = [
            array('value' => 'everyone'                  , 'text' => trans('communication.audience_everyone')),
            array('value' => 'selected_course'           , 'text' => trans('communication.audience_selected_course')),
            array('value' => 'selected_batch'            , 'text' => trans('communication.audience_selected_batch')),
            array('value' => 'selected_department'       , 'text' => trans('communication.audience_selected_department')),
            array('value' => 'selected_employee_category', 'text' => trans('communication.audience_selected_employee_category'))
        ];
        $types = [
            array('value' => 'sms', 'text' => trans('communication.sms')),
            array('value' => 'email', 'text' => trans('communication.email')),
        ];

        return compact('employee_categories','departments','courses','batches','audiences','types');
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
     * Create communication
     * @param  array  $params
     * @return Communication
     */
    public function create($params = array())
    {
        $communication = $this->communication->forceCreate($this->formatParams($params));

        $this->syncRelations($communication, $params);

        $recipient_numbers = gv($params, 'recipient_numbers', []);
        $included_numbers = gv($params, 'included_numbers', []);
        $excluded_numbers = gv($params, 'excluded_numbers', []);

        $recipient_emails = gv($params, 'recipient_emails', []);
        $included_emails = gv($params, 'included_emails', []);
        $excluded_emails = gv($params, 'excluded_emails', []);

        $communication->recipient_count = $communication->type == 'email' ? count($recipient_emails) : count($recipient_numbers);
        $communication->recipient_numbers = implode(',', $recipient_numbers);
        $communication->included_numbers = implode(',' , $included_numbers);
        $communication->excluded_numbers = implode(',' , $excluded_numbers);
        $communication->recipient_emails = implode(',', $recipient_emails);
        $communication->included_emails = implode(',' , $included_emails);
        $communication->excluded_emails = implode(',' , $excluded_emails);
        $communication->save();

        return $communication;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    public function formatParams($params, $communication_id = null)
    {
        $type = gv($params, 'type');

        if (! in_array($type, ['email','sms'])) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_input')]);
        }

        $subject              = gv($params, 'subject');
        $audience             = gv($params, 'audience');
        $body                 = $type == 'email' ? gv($params, 'body') : gv($params, 'sms');
        $course_id            = gv($params, 'course_id', []);
        $batch_id             = gv($params, 'batch_id', []);
        $employee_category_id = gv($params, 'employee_category_id', []);
        $department_id        = gv($params, 'department_id', []);

        if ($audience == 'selected_department' && (! $department_id || count(array_diff($department_id, $this->department->listId())))) {
            throw ValidationException::withMessages(['department_id' => trans('employee.could_not_find_department')]);
        }

        if ($audience == 'selected_employee_category' && (! $employee_category_id || count(array_diff($employee_category_id, $this->employee_category->listId())))) {
            throw ValidationException::withMessages(['employee_category_id' => trans('employee.could_not_find_employee_category')]);
        }

        if ($audience == 'selected_course' && (! $course_id || count(array_diff($course_id, $this->course->listId())))) {
            throw ValidationException::withMessages(['course_id' => trans('academic.could_not_find_course')]);
        }

        if ($audience == 'selected_batch' && (! $batch_id || count(array_diff($batch_id, $this->batch->listId())))) {
            throw ValidationException::withMessages(['batch_id' => trans('academic.could_not_find_batch')]);
        }

        if ($audience && ! in_array($audience, ['everyone','selected_course','selected_batch','selected_department','selected_employee_category'])) {
            throw ValidationException::withMessages(['audience' => trans('general.invalid_input') ]);
        }

        $formatted = [
            'type'     => $type,
            'subject'  => $subject,
            'body'     => clean($body),
            'audience' => $audience,
            'options'  => []
        ];

        if (! $communication_id) {
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Sync communication relations
     *
     * @param Communication $communication
     * @param array $params
     * @return void
     */
    private function syncRelations(Communication $communication, $params = array())
    {
        if (gv($params, 'audience') == 'everyone') {
            $communication->courses()->sync([]);
            $communication->batches()->sync([]);
            $communication->departments()->sync([]);
            $communication->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_course') {
            $communication->courses()->sync(gv($params, 'course_id', []));
            $communication->batches()->sync([]);
            $communication->departments()->sync([]);
            $communication->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_batch') {
            $communication->courses()->sync([]);
            $communication->batches()->sync(gv($params, 'batch_id', []));
            $communication->departments()->sync([]);
            $communication->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_department') {
            $communication->courses()->sync([]);
            $communication->batches()->sync([]);
            $communication->departments()->sync(gv($params, 'department_id', []));
            $communication->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_employee_category') {
            $communication->courses()->sync([]);
            $communication->batches()->sync([]);
            $communication->departments()->sync([]);
            $communication->employeeCategories()->sync(gv($params, 'employee_category_id', []));
            return;
        }
    }

    /**
     * Is communication accessible
     * @param  Communication $communication
     * @return boolean                     
     */
    private function isAccessible(Communication $communication)
    {
        if (
            ($communication->type == 'email' && ! \Auth::user()->can('send-email')) ||
            ($communication->type == 'sms' && ! \Auth::user()->can('send-sms'))
        ) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Delete communication.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Communication $communication)
    {
        $this->isAccessible($communication);

        return $communication->delete();
    }

    /**
     * Delete multiple communication.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->communication->whereIn('id', $ids)->delete();
    }
}