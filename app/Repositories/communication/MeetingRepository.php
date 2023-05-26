<?php
namespace App\Repositories\Communication;

use Illuminate\Support\Str;
use App\Models\Communication\Meeting;
use App\Models\Employee\Employee;
use App\Models\Student\StudentRecord;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Academic\BatchRepository;
use App\Repositories\Academic\CourseRepository;
use App\Repositories\Configuration\Employee\DepartmentRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Employee\EmployeeCategoryRepository;
use App\Repositories\Employee\EmployeeRepository;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class MeetingRepository
{
    protected $meeting;
    protected $upload;
    protected $batch;
    protected $course;
    protected $department;
    protected $course_group;
    protected $employee_category;
    protected $employee;
    protected $student_record;
    protected $employee_model;
    protected $module = 'meeting';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Meeting $meeting,
        UploadRepository $upload,
        BatchRepository $batch,
        CourseRepository $course,
        DepartmentRepository $department,
        CourseGroupRepository $course_group,
        EmployeeRepository $employee,
        EmployeeCategoryRepository $employee_category,
        StudentRecord $student_record,
        Employee $employee_model
    ) {
        $this->meeting = $meeting;
        $this->upload = $upload;
        $this->batch = $batch;
        $this->course = $course;
        $this->department = $department;
        $this->course_group = $course_group;
        $this->employee = $employee;
        $this->employee_category = $employee_category;
        $this->student_record = $student_record;
        $this->employee_model = $employee_model;
    }

    /**
     * Get meeting query
     *
     * @return Meeting query
     */
    public function getQuery()
    {
        return $this->meeting;
    }

    /**
     * Count meeting
     *
     * @return integer
     */
    public function count()
    {
        return $this->meeting->filterBySession()->count();
    }

    /**
     * List all meeting by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->meeting->filterBySession()->get()->pluck('title', 'id')->all();
    }

    /**
     * Get all meetings
     *
     * @return array
     */
    public function getAll()
    {
        return $this->meeting->all();
    }

    /**
     * Find meeting with given id.
     *
     * @param integer $id
     * @return Meeting
     */
    public function find($id)
    {
        return $this->meeting->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find meeting with given id or throw an error.
     *
     * @param integer $id
     * @return Meeting
     */
    public function findOrFail($id, $field = 'message')
    {
        $meeting = $this->meeting->info()->filterBySession()->filterById($id)->first();

        if (! $meeting) {
            throw ValidationException::withMessages([$field => trans('communication.could_not_find_meeting')]);
        }

        return $meeting;
    }

    /**
     * Find meeting with given uuid.
     *
     * @param string $uuid
     * @return Meeting
     */
    public function findByUuid($uuid)
    {
        return $this->meeting->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find meeting with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Meeting
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $meeting = $this->meeting->info()->filterBySession()->filterByUuid($uuid)->first();
        if (! $meeting) {
            throw ValidationException::withMessages([$field => trans('communication.could_not_find_meeting')]);
        }

        return $meeting;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Meeting
     */
    public function getData($params)
    {
        $sort_by              = gv($params, 'sort_by', 'date');
        $order                = gv($params, 'order', 'desc');
        $keyword              = gv($params, 'keyword');
        $course_id            = gv($params, 'course_id');
        $batch_id             = gv($params, 'batch_id');
        $department_id        = gv($params, 'department_id');
        $employee_category_id = gv($params, 'employee_category_id');

        $course_id            = is_array($course_id) ? $course_id : ($course_id ? explode(',', $course_id) : []);
        $batch_id             = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);
        $department_id        = is_array($department_id) ? $department_id : ($department_id ? explode(',', $department_id) : []);
        $employee_category_id = is_array($employee_category_id) ? $employee_category_id : ($employee_category_id ? explode(',', $employee_category_id) : []);

        $query = $this->meeting->info();
        
        if (! \Auth::user()->hasRole(config('system.default_role.admin'))) {
            $query->whereUserId(\Auth::user()->id);
        }

        $query->filterBySession()->filterByKeyword($keyword);

        if (count($course_id)) {
            $query->where(function ($q1) use ($course_id) {
                $q1->where('audience', 'everyone')->orWhereHas('courses', function ($q2) use ($course_id) {
                    $q2->whereIn('course_id', $course_id);
                });
            });
        }

        if (count($batch_id)) {
            $query->where(function ($q1) use ($batch_id) {
                $q1->where('audience', 'everyone')->orWhereHas('batches', function ($q2) use ($batch_id) {
                    $q2->whereIn('batch_id', $batch_id);
                });
            });
        }

        if (count($department_id)) {
            $query->where(function ($q1) use ($department_id) {
                $q1->where('audience', 'everyone')->orWhereHas('departments', function ($q2) use ($department_id) {
                    $q2->whereIn('department_id', $department_id);
                });
            });
        }

        if (count($employee_category_id)) {
            $query->where(function ($q1) use ($employee_category_id) {
                $q1->where('audience', 'everyone')->orWhereHas('employeeCategories', function ($q2) use ($employee_category_id) {
                    $q2->whereIn('employee_category_id', $employee_category_id);
                });
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all meeting using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        if (isTestMode()) {
            $meeting = Meeting::orderBy('date', 'desc')->first();
            $meeting->date = today();
            $meeting->save();
        }

        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Meeting
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get my meeting
     *
     * @param array $params
     * @return array
     */
    public function myMeeting($params = array())
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        if (\Auth::user()->hasRole(config('system.default_role.admin'))) {
            return $this->meeting->info()->filterBySession()->orderBy('created_at', 'desc')->paginate($page_length);
        }
        
        return $this->meetingQuery()->orderBy('created_at', 'desc')->paginate($page_length);
    }

    private function meetingQuery($meeting_id = null)
    {
        $query = $this->meeting->info();

        if ($meeting_id) {
            $query->whereId($meeting_id);
        }
        
        return $query->filterBySession()->where(function($q0) {
            $q0->whereUserId(\Auth::user()->id)->orWhere(function ($q) {

                if (\Auth::user()->hasAnyRole([
                        config('system.default_role.parent'),
                        config('system.default_role.student'),
                    ])
                ) {
                    $student_record_ids = getAuthUserStudentRecordId();
                    $student_batch_ids = getAuthUserBatchId();
                    $student_course_ids = $this->batch->getCourseIdFromBatchIds($student_batch_ids);
    
                    $q->where(function ($q1) use ($student_course_ids) {
                        $q1->where('audience', 'selected_course')->whereHas('courses', function ($q2) use ($student_course_ids) {
                            $q2->whereIn('course_id', $student_course_ids);
                        });
                    })->orWhere(function ($q3) use ($student_batch_ids) {
                        $q3->where('audience', 'selected_batch')->whereHas('batches', function ($q4) use ($student_batch_ids) {
                            $q4->whereIn('batch_id', $student_batch_ids);
                        });
                    })->orWhere(function ($q5) use ($student_record_ids) {
                        $q5->whereHas('studentRecords', function ($q6) use ($student_record_ids) {
                            $q6->whereIn('student_record_id', $student_record_ids);
                        });
                    });
                } else {
                    $employee = \Auth::user()->employee;
    
                    $employee_designation = getEmployeeDesignation($employee);
                    $department_id = optional($employee_designation)->department_id;
                    $employee_category_id = $employee_designation ? $employee_designation->designation->employee_category_id : null;
    
                    $q->where(function ($q1) use ($department_id) {
                        $q1->where('audience', 'selected_department')->whereHas('departments', function ($q2) use ($department_id) {
                            $q2->where('department_id', $department_id);
                        });
                    })->orWhere(function ($q3) use ($employee_category_id) {
                        $q3->where('audience', 'selected_employee_category')->whereHas('employeeCategories', function ($q4) use ($employee_category_id) {
                            $q4->where('employee_category_id', $employee_category_id);
                        });
                    })->orWhere(function ($q5) use ($employee) {
                        $q5->whereHas('employees', function ($q6) use ($employee) {
                            $q6->where('employee_id', $employee->id);
                        });
                    });
                }
            });
        });
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
            array('value' => 'selected_course'           , 'text' => trans('communication.meeting_audience_selected_course')),
            array('value' => 'selected_batch'            , 'text' => trans('communication.meeting_audience_selected_batch')),
            array('value' => 'selected_department'       , 'text' => trans('communication.meeting_audience_selected_department')),
            array('value' => 'selected_employee_category', 'text' => trans('communication.meeting_audience_selected_employee_category'))
        ];

        return compact('employee_categories', 'departments', 'courses', 'batches', 'audiences');
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
     * Create a new meeting.
     *
     * @param array $params
     * @return Meeting
     */
    public function create($params)
    {
        $meeting = $this->meeting->forceCreate($this->formatParams($params));

        $this->syncRelations($meeting, $params);

        $this->processUpload($meeting, $params);

        return $meeting;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    public function formatParams($params, $meeting_id = null)
    {
        $title                = gv($params, 'title');
        $description          = gv($params, 'description');
        $date                 = toDate(gv($params, 'date'));
        $start_time           = gv($params, 'start_time');
        $end_time             = gv($params, 'end_time');
        $audience             = gv($params, 'audience');
        $course_id            = gv($params, 'course_id', []);
        $batch_id             = gv($params, 'batch_id', []);
        $employee_category_id = gv($params, 'employee_category_id', []);
        $department_id        = gv($params, 'department_id', []);

        if (! dateBetweenSession($date)) {
            throw ValidationException::withMessages(['date' => trans('academic.invalid_session_date_range')]);
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

        if (strtotime($start_time) === false) {
            throw ValidationException::withMessages(['message' => trans('communication.invalid_start_time')]);
        }

        if ($end_time && strtotime($end_time) === false) {
            throw ValidationException::withMessages(['message' => trans('communication.invalid_end_time')]);
        }

        if ($end_time && toTime($start_time) > toTime($end_time)) {
            throw ValidationException::withMessages(['message' => trans('communication.meeting_start_time_greater_than_end_time')]);
        }

        if (Carbon::parse($date.' '.$start_time) < Carbon::now()) {
            throw ValidationException::withMessages(['message' => trans('communication.meeting_cannot_schedule_earlier')]);
        }

        if ($audience && ! in_array($audience, ['selected_course','selected_batch','selected_department','selected_employee_category'])) {
            throw ValidationException::withMessages(['audience' => trans('general.invalid_input') ]);
        }

        $individual_students = array_unique(gv($params, 'individual_students', []));
        $individual_employees = array_unique(gv($params, 'individual_employees', []));

        if (! $meeting_id && ! $audience && ! $individual_employees && ! $individual_students) {
            throw ValidationException::withMessages(['message' => trans('communication.could_not_find_any_audience')]);
        }

        $formatted = [
            'title'       => $title,
            'date'        => toDate($date),
            'start_time'  => toTime($start_time),
            'end_time'    => $end_time ? toTime($end_time) : null,
            'description' => cleanBody($description),
            'audience'    => $audience
        ];

        $options = [];
        if (! $meeting_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
            $formatted['code'] = Str::random(20);
            $options['individual_students'] = array_unique(gv($params, 'individual_students', []));
            $options['individual_employees'] = array_unique(gv($params, 'individual_employees', []));
            $options['owner_video_preference'] = gbv($params, 'owner_video_preference');
            $options['audience_video_preference'] = gbv($params, 'audience_video_preference');
            $formatted['options'] = $options;
        }

        return $formatted;
    }

    /**
     * Sync meeting relations
     *
     * @param Meeting $meeting
     * @param array $params
     * @return void
     */
    private function syncRelations(Meeting $meeting, $params = array())
    {
        $individual_students = array_unique(gv($params, 'individual_students', []));
        if ($individual_students) {
            $meeting->studentRecords()->sync(gv($params, 'individual_students', []));
        }

        $individual_employees = array_unique(gv($params, 'individual_employees', []));
        if ($individual_employees) {
            $meeting->employees()->sync(gv($params, 'individual_employees', []));
        }

        if (gv($params, 'audience') == 'selected_course') {
            $meeting->courses()->sync(gv($params, 'course_id', []));
            $meeting->batches()->sync([]);
            $meeting->departments()->sync([]);
            $meeting->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_batch') {
            $meeting->courses()->sync([]);
            $meeting->batches()->sync(gv($params, 'batch_id', []));
            $meeting->departments()->sync([]);
            $meeting->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_department') {
            $meeting->courses()->sync([]);
            $meeting->batches()->sync([]);
            $meeting->departments()->sync(gv($params, 'department_id', []));
            $meeting->employeeCategories()->sync([]);
            return;
        }

        if (gv($params, 'audience') == 'selected_employee_category') {
            $meeting->courses()->sync([]);
            $meeting->batches()->sync([]);
            $meeting->departments()->sync([]);
            $meeting->employeeCategories()->sync(gv($params, 'employee_category_id', []));
            return;
        }
    }

    /**
     * Upload attachment
     *
     * @param Meeting $meeting
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Meeting $meeting, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $meeting->id, $upload_token);
        } else {
            $this->upload->update($this->module, $meeting->id, $upload_token);
        }
    }

    /**
     * Join a meeting
     *
     * @param Meeting $meeting
     * @return void
     */
    public function join(Meeting $meeting)
    {
        $this->isAccessible($meeting);

        if (! $meeting->is_live) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $code = $meeting->code;

        return compact('code');
    }

    /**
     * Leave a meeting
     *
     * @param Meeting $meeting
     * @return void
     */
    public function leave(Meeting $meeting)
    {
        $this->isAccessible($meeting);

        if (! $meeting->is_live) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }
    }

    /**
     * Update given meeting.
     *
     * @param Meeting $meeting
     * @param array $params
     *
     * @return Meeting
     */
    public function update(Meeting $meeting, $params)
    {
        $this->isEditableOrFail($meeting);
        
        $meeting->forceFill($this->formatParams($params, $meeting->id))->save();

        $options = $meeting->options;
        $options['owner_video_preference'] = gbv($params, 'owner_video_preference');
        $options['audience_video_preference'] = gbv($params, 'audience_video_preference');
        $meeting->options = $options;
        $meeting->save();

        $this->syncRelations($meeting, $params);

        $this->processUpload($meeting, $params, 'update');

        return $meeting;
    }

    /**
     * Is given meeting accessible.
     *
     * @param Meeting $meeting
     *
     * @return bool
     */
    public function isAccessible(Meeting $meeting)
    {
        if (! \Auth::user()->can('list-meeting')) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        if (\Auth::user()->hasRole(config('system.default_role.admin')) || $meeting->user_id === \Auth::user()->id) {
            return true;
        }

        if (! $this->meetingQuery($meeting->id)->count()) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }

        return true;
    }

    /**
     * Is given meeting editable.
     *
     * @param Meeting $meeting
     *
     * @return bool
     */
    public function isEditable(Meeting $meeting)
    {
        if (! \Auth::user()->can('edit-meeting')) {
            return false;
        }

        if (! $this->employee->userAccessible($meeting->user->employee) && $meeting->user_id != \Auth::user()->id) {
            return false;
        }

        if (Carbon::parse($meeting->date.' '.$meeting->start_time) < Carbon::now()) {
            return false;
        }

        return true;
    }

    /**
     * Is given meeting editable else fail.
     *
     * @param Meeting $meeting
     *
     * @return null
     */
    public function isEditableOrFail(Meeting $meeting)
    {
        if (! $this->isEditable($meeting)) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Delete meeting.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Meeting $meeting)
    {
        return $meeting->delete();
    }

    /**
     * Delete multiple meetings.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->meeting->whereIn('id', $ids)->delete();
    }

    /**
     * Get selected audience.
     *
     * @param Meeting $meeting
     * @return Array
     */
    public function getSelectedAudience(Meeting $meeting)
    {
        $selected = array();
        if ($meeting->audience == 'selected_course') {
            foreach ($meeting->courses as $course) {
                $selected[] = ['id' => $course->id, 'name' => $course->name];
            }
        } elseif ($meeting->audience == 'selected_batch') {
            foreach ($meeting->batches as $batch) {
                $selected[] = ['id' => $batch->id, 'name' => $batch->batch_with_course];
            }
        } elseif ($meeting->audience == 'selected_department') {
            foreach ($meeting->departments as $department) {
                $selected[] = ['id' => $department->id, 'name' => $department->name];
            }
        } elseif ($meeting->audience == 'selected_employee_category') {
            foreach ($meeting->employeeCategories as $employee_category) {
                $selected[] = ['id' => $employee_category->id, 'name' => $employee_category->name];
            }
        }

        return $selected;
    }

    /**
     * Get selected individual audience.
     *
     * @param Meeting $meeting
     * @return Array
     */
    public function getSelectedIndividualAudience(Meeting $meeting)
    {
        $student_record_ids = $meeting->studentRecords()->pluck('student_record_id')->all();
        $employee_ids = $meeting->employees()->pluck('employee_id')->all();
        $individual_audiences = array();

        if ($student_record_ids) {
            $student_records = $this->student_record->select('id', 'student_id', 'batch_id', 'admission_id', 'roll_number')
                ->with([
                    'student:id,uuid,student_parent_id,first_name,middle_name,last_name,contact_number,date_of_birth,gender,student_photo',
                    'student.parent:id,first_guardian_name',
                    'batch:id,course_id,name,options',
                    'batch.course:id,name',
                    'admission:id,number,prefix'
                ])->whereIn('id', $student_record_ids)->get();

            foreach ($student_records as $item) {
                $individual_audiences[] = array(
                    'key' => 'student_'.$item->id,
                    'type' => 'student',
                    'id' => $item->id,
                    'name' => $item->student->name,
                    'description_1' => $item->batch->course->name.' '.$item->batch->name,
                    'description_2' => $item->student->parent->first_guardian_name, 
                    'contact_number' => $item->student->contact_number
                );
            }
        }

        if ($employee_ids) {
            $employees = $this->employee_model->select('id', 'uuid', 'first_name', 'middle_name', 'last_name', 'code', 'contact_number','date_of_birth','prefix', 'gender', 'photo')
            ->with('employeeTerms:id,employee_id,date_of_joining,date_of_leaving', 'employeeDesignations:id,employee_id,designation_id,date_effective,date_end', 'employeeDesignations.designation:id,name,employee_category_id', 'employeeDesignations.designation.employeeCategory:id,name')->whereIn('id', $employee_ids)->get();

            foreach ($employees as $item) {
                $individual_audiences[] = array(
                    'key' => 'employee_'.$item->id,
                    'type' => 'employee',
                    'id' => $item->id,
                    'name' => $item->name,
                    'description_1' => getEmployeeDesignationName($item),
                    'description_2' => $item->employee_code, 
                    'contact_number' => $item->contact_number
                );
            }
        }

        return $individual_audiences;
    }

    /**
     * Add meeting audience
     *
     * @param Meeting $meeting
     * @param array $params
     * @return void
     */
    public function addAudience(Meeting $meeting, $params = array())
    {
        $this->isEditableOrFail($meeting);

        $individual_students = array_unique(gv($params, 'individual_students', []));
        $individual_employees = array_unique(gv($params, 'individual_employees', []));

        if (! $individual_students && ! $individual_employees) {
            throw ValidationException::withMessages(['message' => trans('communication.could_not_find_any_audience')]);
        }

        $options = $meeting->options;
        $options['individual_students'] = array_values(array_unique(array_merge(($meeting->getOption('individual_students') ? : []), $individual_students)));
        $options['individual_employees'] = array_values(array_unique(array_merge(($meeting->getOption('individual_employees') ? : []), $individual_employees)));
        
        $meeting->options = $options;
        $meeting->save();

        foreach ($individual_students as $individual_student) {
            $meeting->studentRecords()->attach($individual_student);
        }

        foreach ($individual_employees as $individual_employee) {
            $meeting->employees()->attach($individual_employee);
        }
    }

    /**
     * Delete meeting audience
     *
     * @param Meeting $meeting
     * @param array $params
     * @param string $type
     * @param int $id
     * @return void
     */
    public function deleteAudience(Meeting $meeting, $type, $id)
    {
        $this->isEditableOrFail($meeting);

        $options = $meeting->options;
        if ($type === 'student') {
            $individual_students = $meeting->getOption('individual_students') ? : [];
            $individual_students = Arr::where($individual_students, function($item) use($id) {
                return $item != $id;
            });
            $options['individual_students'] = array_values($individual_students);
        } else if($type === 'employee') {
            $individual_employees = $meeting->getOption('individual_employees') ? : [];
            $individual_employees = Arr::where($individual_employees, function($item) use($id) {
                return $item != $id;
            });
            $options['individual_employees'] = array_values($individual_employees);
        }

        $meeting->options = $options;
        $meeting->save();

        if ($type === 'student') {
            $meeting->studentRecords()->detach($id);
        }

        if ($type === 'employee') {
            $meeting->employees()->detach($id);
        }
    }

    public function getIceServers()
    {
        $webrtc = getVar('webrtc');
        $servers = gv($webrtc, 'ice_servers', []);
        $ice_servers = array();

        foreach ($servers as $server) {
            if (gbv($server, 'requires_credential')) {
                if (gbv($server, 'expirable_credentials')) {
                    $user = \Auth::user()->username;
                    $expire_time_unix_epoch = time() + (gv($server, 'expires_in', 0) + gv($server, 'time_difference', 0)) ;
                    $username = $expire_time_unix_epoch . ":" . $user ;
                    $hmac_sha1 = hash_hmac("sha1", $username, gv($server, 'secret'), true) ;
                    $credential = base64_encode($hmac_sha1) ;
    
                    $ice_servers[] = array(
                        'urls'       => gv($server, 'urls', []),
                        'username'   => $username,
                        'credential' => $credential
                    );
                } else {
                    $ice_servers[] = array(
                        'urls'       => gv($server, 'urls', []),
                        'username'   => gv($server, 'username'),
                        'credential' => gv($server, 'credential')
                    );
                }
            } else {
                $ice_servers[] = $server;
            }
        }

        return $ice_servers;
    }

    public function getSocketUrl()
    {
        $webrtc = getVar('webrtc');

        return gv($webrtc, 'socket');
    }
}
