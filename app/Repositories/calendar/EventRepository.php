<?php
namespace App\Repositories\Calendar;

use Illuminate\Support\Str;
use App\Models\Calendar\Event;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Academic\CourseRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Configuration\Calendar\EventTypeRepository;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Employee\EmployeeCategoryRepository;

class EventRepository
{
    protected $event;
    protected $upload;
    protected $event_type;
    protected $course_group;
    protected $employee_category;
    protected $department;
    protected $course;
    protected $batch;
    protected $employee;
    protected $module = 'event';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Event $event,
        UploadRepository $upload,
        EventTypeRepository $event_type,
        CourseGroupRepository $course_group,
        EmployeeCategoryRepository $employee_category,
        DepartmentRepository $department,
        CourseRepository $course,
        BatchRepository $batch,
        EmployeeRepository $employee
    ) {
        $this->event = $event;
        $this->upload = $upload;
        $this->event_type = $event_type;
        $this->course_group = $course_group;
        $this->employee_category = $employee_category;
        $this->department = $department;
        $this->course = $course;
        $this->batch = $batch;
        $this->employee = $employee;
    }

    /**
     * Get event query
     *
     * @return Event query
     */
    public function getQuery()
    {
        return $this->event;
    }

    /**
     * Count Event
     *
     * @return integer
     */
    public function count()
    {
        return $this->event->filterBySession()->count();
    }

    /**
     * List all event by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->event->filterBySession()->get()->pluck('title', 'id')->all();
    }

    /**
     * Get all events
     *
     * @return array
     */
    public function getAll()
    {
        return $this->event->all();
    }

    /**
     * Find event with given id.
     *
     * @param integer $id
     * @return Event
     */
    public function find($id)
    {
        return $this->event->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find event with given id or throw an error.
     *
     * @param integer $id
     * @return Event
     */
    public function findOrFail($id, $field = 'message')
    {
        $event = $this->event->info()->filterBySession()->filterById($id)->first();

        if (! $event) {
            throw ValidationException::withMessages([$field => trans('calendar.could_not_find_event')]);
        }

        return $event;
    }

    /**
     * Find event with given uuid.
     *
     * @param string $uuid
     * @return Event
     */
    public function findByUuid($uuid)
    {
        return $this->event->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find event with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Event
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $event = $this->event->info()->filterBySession()->filterByUuid($uuid)->first();
        if (! $event) {
            throw ValidationException::withMessages([$field => trans('calendar.could_not_find_event')]);
        }

        return $event;
    }

    /**
     * Find event with given uuid for any session or throw an error.
     *
     * @param string $uuid
     * @return Event
     */
    public function findByUuidOrFailWithoutSession($uuid, $field = 'message')
    {
        $event = $this->event->info()->filterByUuid($uuid)->first();
        if (! $event) {
            throw ValidationException::withMessages([$field => trans('calendar.could_not_find_event')]);
        }

        return $event;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Event
     */
    public function getData($params)
    {
        $sort_by              = gv($params, 'sort_by', 'start_date');
        $order                = gv($params, 'order', 'desc');
        $keyword              = gv($params, 'keyword');
        $event_type_id        = gv($params, 'event_type_id');
        $course_id            = gv($params, 'course_id');
        $batch_id             = gv($params, 'batch_id');
        $department_id        = gv($params, 'department_id');
        $employee_category_id = gv($params, 'employee_category_id');

        $event_type_id        = is_array($event_type_id) ? $event_type_id : ($event_type_id ? explode(',', $event_type_id) : []);
        $course_id            = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);
        $batch_id             = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);
        $department_id        = is_array($department_id) ? $department_id : ($department_id ? explode(',', $department_id) : []);
        $employee_category_id = is_array($employee_category_id) ? $employee_category_id : ($employee_category_id ? explode(',', $employee_category_id) : []);

        $query = $this->event->info()->filterBySession()->filterByKeyword($keyword);

        if (count($event_type_id)) {
            $query->whereIn('event_type_id', $event_type_id);
        }

        if (count($course_id)) {
            $query->where(function($q1) use($course_id) {
                $q1->where('audience', 'everyone')->orWhereHas('courses', function ($q2) use ($course_id) {
                    $q2->whereIn('course_id', $course_id);
                });
            });
        }

        if (count($batch_id)) {
            $query->where(function($q1) use($batch_id) {
                $q1->where('audience', 'everyone')->orWhereHas('batches', function ($q2) use ($batch_id) {
                    $q2->whereIn('batch_id', $batch_id);
                });
            });
        }

        if (count($department_id)) {
            $query->where(function($q1) use($department_id) {
                $q1->where('audience', 'everyone')->orWhereHas('departments', function ($q2) use ($department_id) {
                    $q2->whereIn('department_id', $department_id);
                });
            });
        }

        if (count($employee_category_id)) {
            $query->where(function($q1) use($employee_category_id) {
                $q1->where('audience', 'everyone')->orWhereHas('employeeCategories', function ($q2) use ($employee_category_id) {
                    $q2->whereIn('employee_category_id', $employee_category_id);
                });
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all event using given params.
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
     * @return Event
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
        $event_types = $this->event_type->selectAll();
        $employee_categories = $this->employee_category->selectAllExludingDefault();
        $departments = $this->department->selectAll();
        $courses = $this->course_group->getCourseOption();
        $batches = $this->course_group->getBatchOption();
        $audiences = [
            array('value' => 'everyone'                  , 'text' => trans('calendar.event_audience_everyone')),
            array('value' => 'selected_course'           , 'text' => trans('calendar.event_audience_selected_course')),
            array('value' => 'selected_batch'            , 'text' => trans('calendar.event_audience_selected_batch')),
            array('value' => 'selected_department'       , 'text' => trans('calendar.event_audience_selected_department')),
            array('value' => 'selected_employee_category', 'text' => trans('calendar.event_audience_selected_employee_category'))
        ];

        return compact('event_types', 'employee_categories', 'departments', 'courses', 'batches', 'audiences');
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
     * Create a new event.
     *
     * @param array $params
     * @return Event
     */
    public function create($params)
    {
        $event = $this->event->forceCreate($this->formatParams($params));

        $this->syncRelations($event, $params);

        $this->processUpload($event, $params);

        return $event;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    public function formatParams($params, $event_id = null)
    {
        $title                = gv($params, 'title');
        $venue                = gv($params, 'venue');
        $description          = gv($params, 'description');
        $start_date           = toDate(gv($params, 'start_date'));
        $end_date             = toDate(gv($params, 'end_date'));
        $start_time           = gv($params, 'start_time');
        $end_time             = gv($params, 'end_time');
        $no_time              = gbv($params, 'no_time');
        $audience             = gv($params, 'audience');
        $event_type_id        = gv($params, 'event_type_id');
        $course_id            = gv($params, 'course_id', []);
        $batch_id             = gv($params, 'batch_id', []);
        $employee_category_id = gv($params, 'employee_category_id', []);
        $department_id        = gv($params, 'department_id', []);

        $event_type = $this->event_type->findOrFail($event_type_id);

        if (! dateBetweenSession($start_date)) {
            throw ValidationException::withMessages(['start_date' => trans('academic.invalid_session_date_range')]);
        }

        if (! dateBetweenSession($end_date)) {
            throw ValidationException::withMessages(['end_date' => trans('academic.invalid_session_date_range')]);
        }

        $event_exists_query = ($event_id) ? $this->event->where('id', '!=', $event_id) : $this->event->whereNotNull('id');

        if ($event_exists_query->filterBySession()->filterByEventTypeId($event_type_id)->filterByTitle($title, 1)->count()) {
            throw ValidationException::withMessages(['title' => trans('calendar.event_title_exists')]);
        }

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

        if (! $no_time && strtotime($start_time) === false) {
            throw ValidationException::withMessages(['message' => trans('calendar.invalid_start_time')]);
        }

        if (! $no_time && strtotime($end_time) === false) {
            throw ValidationException::withMessages(['message' => trans('calendar.invalid_end_time')]);
        }

        if (! $no_time && $start_date == $end_date && toTime($start_time) > toTime($end_time)) {
            throw ValidationException::withMessages(['message' => trans('calendar.event_start_time_greater_than_end_time')]);
        }

        if (! in_array($audience, ['everyone','selected_course','selected_batch','selected_department','selected_employee_category'])) {
            throw ValidationException::withMessages(['audience' => trans('general.invalid_input') ]);
        }

        $formatted = [
            'event_type_id' => $event_type_id,
            'title'         => $title,
            'venue'         => $venue,
            'start_date'    => toDate($start_date),
            'end_date'      => toDate($end_date),
            'start_time'    => (! $no_time) ? toTime($start_time) : null,
            'end_time'      => (! $no_time) ? toTime($end_time) : null,
            'description'   => clean($description),
            'audience'      => $audience,
            'options'       => []
        ];

        if (! $event_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Sync event relations
     *
     * @param Event $event
     * @param array $params
     * @return void
     */
    private function syncRelations(Event $event, $params = array())
    {
        if (gv($params, 'audience') == 'everyone') {
            $event->courses()->sync([]);
            $event->batches()->sync([]);
            $event->departments()->sync([]);
            $event->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_course') {
            $event->courses()->sync(gv($params, 'course_id', []));
            $event->batches()->sync([]);
            $event->departments()->sync([]);
            $event->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_batch') {
            $event->courses()->sync([]);
            $event->batches()->sync(gv($params, 'batch_id', []));
            $event->departments()->sync([]);
            $event->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_department') {
            $event->courses()->sync([]);
            $event->batches()->sync([]);
            $event->departments()->sync(gv($params, 'department_id', []));
            $event->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_employee_category') {
            $event->courses()->sync([]);
            $event->batches()->sync([]);
            $event->departments()->sync([]);
            $event->employeeCategories()->sync(gv($params, 'employee_category_id', []));
            return;
        }
    }

    /**
     * Upload attachment
     *
     * @param Event $event
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Event $event, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $event->id, $upload_token);
        } else {
            $this->upload->update($this->module, $event->id, $upload_token);
        }
    }

    /**
     * Update given event.
     *
     * @param Event $event
     * @param array $params
     *
     * @return Event
     */
    public function update(Event $event, $params)
    {
        $this->isEditableOrFail($event);
        
        $event->forceFill($this->formatParams($params, $event->id))->save();

        $this->syncRelations($event, $params);

        $this->processUpload($event, $params, 'update');

        return $event;
    }

    /**
     * Is given event editable.
     *
     * @param Event $event
     *
     * @return bool
     */
    public function isEditable(Event $event)
    {
        return \Auth::user()->can('edit-event') ? $this->employee->userAccessible($event->user->employee) || $event->user_id == \Auth::user()->id : false;
    }

    /**
     * Is given event editable else fail.
     *
     * @param Event $event
     *
     * @return null
     */
    public function isEditableOrFail(Event $event)
    {
        if (! $this->isEditable($event)) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Delete event.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Event $event)
    {
        $this->isEditableOrFail($event);

        return $event->delete();
    }

    /**
     * Delete multiple event.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->event->whereIn('id', $ids)->delete();
    }

    /**
     * Get selected audience.
     *
     * @param Event $event
     * @return Array
     */
    public function getSelectedAudience(Event $event)
    {
        $selected = array();
        if ($event->audience == 'everyone') {
        } elseif ($event->audience == 'selected_course') {
            foreach ($event->courses as $course) {
                $selected[] = ['id' => $course->id, 'name' => $course->name];
            }
        } elseif ($event->audience == 'selected_batch') {
            foreach ($event->batches as $batch) {
                $selected[] = ['id' => $batch->id, 'name' => $batch->batch_with_course];
            }
        } elseif ($event->audience == 'selected_department') {
            foreach ($event->departments as $department) {
                $selected[] = ['id' => $department->id, 'name' => $department->name];
            }
        } elseif ($event->audience == 'selected_employee_category') {
            foreach ($event->employeeCategories as $employee_category) {
                $selected[] = ['id' => $employee_category->id, 'name' => $employee_category->name];
            }
        }

        return $selected;
    }
}
