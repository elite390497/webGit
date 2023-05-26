<?php
namespace App\Repositories\Reception;

use Illuminate\Support\Str;
use App\Models\Reception\Enquiry;
use App\Models\Reception\EnquiryDetail;
use App\Models\Reception\EnquiryFollowUp;
use Illuminate\Validation\ValidationException;
use App\Repositories\Academic\CourseRepository;
use App\Repositories\Configuration\Academic\InstituteRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Reception\EnquiryTypeRepository;
use App\Repositories\Configuration\Reception\EnquirySourceRepository;

class EnquiryRepository
{
    protected $enquiry;
    protected $enquiry_type;
    protected $enquiry_source;
    protected $course_group;
    protected $institute;
    protected $course;
    protected $enquiry_detail;
    protected $enquiry_follow_up;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Enquiry $enquiry,
        EnquiryTypeRepository $enquiry_type,
        EnquirySourceRepository $enquiry_source,
        CourseGroupRepository $course_group,
        InstituteRepository $institute,
        CourseRepository $course,
        EnquiryDetail $enquiry_detail,
        EnquiryFollowUp $enquiry_follow_up
    ) {
        $this->enquiry = $enquiry;
        $this->enquiry_type = $enquiry_type;
        $this->enquiry_source = $enquiry_source;
        $this->course_group = $course_group;
        $this->institute = $institute;
        $this->course = $course;
        $this->enquiry_detail = $enquiry_detail;
        $this->enquiry_follow_up = $enquiry_follow_up;
    }

    /**
     * Find enquiry with given id.
     *
     * @param integer $id
     * @return Enquiry
     */
    public function find($id)
    {
        return $this->enquiry->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find enquiry with given id or throw an error.
     *
     * @param integer $id
     * @return Enquiry
     */
    public function findOrFail($id, $field = 'message')
    {
        $enquiry = $this->enquiry->info()->filterBySession()->filterById($id)->first();

        if (! $enquiry) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_enquiry')]);
        }

        return $enquiry;
    }

    /**
     * Find enquiry with given uuid.
     *
     * @param string $uuid
     * @return Enquiry
     */
    public function findByUuid($uuid)
    {
        return $this->enquiry->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find enquiry with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Enquiry
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $enquiry = $this->enquiry->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $enquiry) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_enquiry')]);
        }

        return $enquiry;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Enquiry
     */
    public function getData($params)
    {
        $sort_by           = gv($params, 'sort_by', 'entry_time');
        $order             = gv($params, 'order', 'desc');
        $enquiry_type_id   = gv($params, 'enquiry_type_id', []);
        $enquiry_source_id = gv($params, 'enquiry_source_id', []);
        $enquiry_status    = gv($params, 'enquiry_status', []);
        $institute_id      = gv($params, 'institute_id', []);

        $enquiry_type_id   = is_array($enquiry_type_id) ? $enquiry_type_id : ($enquiry_type_id ? explode(',', $enquiry_type_id) : []);
        $enquiry_source_id = is_array($enquiry_source_id) ? $enquiry_source_id : ($enquiry_source_id ? explode(',', $enquiry_source_id) : []);
        $enquiry_status    = is_array($enquiry_status) ? $enquiry_status : ($enquiry_status ? explode(',', $enquiry_status) : []);
        $institute_id      = is_array($institute_id) ? $institute_id : ($institute_id ? explode(',', $institute_id) : []);

        $date_of_enquiry_start_date = gv($params, 'date_of_enquiry_start_date');
        $date_of_enquiry_end_date   = gv($params, 'date_of_enquiry_end_date');

        $query = $this->enquiry->info()->filterBySession()->dateOfEnquiryBetween([
            'start_date' => $date_of_enquiry_start_date,
            'end_date' => $date_of_enquiry_end_date
        ]);

        if ($institute_id) {
            $query->withCount(['enquiryDetails' => function($q) use($institute_id) {
                $q->where('institute_id', $institute_id);
            }]);
        } else {
            $query->withCount(['enquiryDetails']);
        }

        if (count($enquiry_type_id)) {
            $query->whereIn('enquiry_type_id', $enquiry_type_id);
        }

        if (count($enquiry_source_id)) {
            $query->whereIn('enquiry_source_id', $enquiry_source_id);
        }

        if (count($enquiry_status)) {
            $query->whereIn('status', $enquiry_status);
        }

        if (count($institute_id)) {
            $query->whereHas('enquiryDetails',function($q) use($institute_id) {
                $q->whereIn('institute_id', $institute_id);
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all enquiries using given params.
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
     * @return Enquiry
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get enquiry filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $enquiry_types   = $this->enquiry_type->selectAll();
        $enquiry_sources = $this->enquiry_source->selectAll();
        $institutes      = $this->institute->selectAll();
        $courses         = $this->course_group->getCourseOption();
        $list            = getVar('list');
        $genders         = generateTranslatedSelectOption(isset($list['gender']) ? $list['gender'] : []);
        $guardian_relations         = generateTranslatedSelectOption(isset($list['relations']) ? $list['relations'] : []);
        $enquiry_statuses = [
        array('id' => 'open', 'name' => trans('reception.enquiry_status_open')),
        array('id' => 'partially_closed', 'name' => trans('reception.enquiry_status_partially_closed')),
        array('id' => 'closed', 'name' => trans('reception.enquiry_status_closed')),
        array('id' => 'missed', 'name' => trans('reception.enquiry_status_missed')),
        ];

        return compact('enquiry_types', 'enquiry_sources', 'courses', 'institutes', 'genders','enquiry_statuses','guardian_relations');
    }

    /**
     * Create a new enquiry.
     *
     * @param array $params
     * @return Enquiry
     */
    public function create($params)
    {
        $this->validateInput($params);

        $enquiry = $this->enquiry->forceCreate([
            'date_of_enquiry'          => toDate(gv($params, 'date_of_enquiry')),
            'enquiry_type_id'          => gv($params, 'enquiry_type_id'),
            'status'                   => 'open',
            'enquiry_source_id'        => gv($params, 'enquiry_source_id'),
            'first_guardian_name'      => gv($params, 'first_guardian_name'),
            'first_guardian_relation'  => gv($params, 'first_guardian_relation'),
            'second_guardian_name'     => gv($params, 'second_guardian_name'),
            'second_guardian_relation' => gv($params, 'second_guardian_relation'),
            'third_guardian_name'      => gv($params, 'third_guardian_name'),
            'third_guardian_relation'  => gv($params, 'third_guardian_relation'),
            'email'                    => gv($params, 'email'),
            'contact_number'           => gv($params, 'contact_number'),
            'alternate_contact_number' => gv($params, 'alternate_contact_number'),
            'remarks'                  => gv($params, 'remarks'),
            'uuid'                     => Str::uuid(),
            'user_id'                  => \Auth::user()->id,
            'options'                  => []
        ]);

        foreach (gv($params, 'students') as $student) {
            $this->enquiry_detail->forceCreate([
                'uuid'          => Str::uuid(),
                'enquiry_id'    => $enquiry->id,
                'student_name'  => gv($student, 'student_name'),
                'date_of_birth' => toDate(gv($student, 'date_of_birth')),
                'gender'        => gv($student, 'gender'),
                'course_id'     => gv($student, 'course_id'),
                'institute_id'     => gv($student, 'institute_id'),
                'remarks'       => gv($student, 'remarks'),
                'options'       => []
            ]);
        }

        return $enquiry;
    }

    /**
     * Validate enquiry input.
     *
     * @param array $params
     * @return void
     */
    public function validateInput($params, $enquiry_id = null)
    {
        $enquiry_type = $this->enquiry_type->findOrFail(gv($params, 'enquiry_type_id'));
        $enquiry_source = $this->enquiry_source->findOrFail(gv($params, 'enquiry_source_id'));

        if (! dateLessThanSessionEnd(gv($params, 'date_of_enquiry'))) {
            throw ValidationException::withMessages(['date_of_enquiry' => trans('academic.date_less_than_session_end')]);
        }

        $students = gv($params, 'students');

        if (! $students) {
            throw ValidationException::withMessages(['message' => trans('reception.no_student_found')]);
        }

        $course_ids    = $this->course->listId();
        $institute_ids = $this->institute->listId();

        $student_names = array();
        foreach ($students as $index => $student) {
            $course_id     = gv($student, 'course_id');
            $institute_id  = gv($student, 'institute_id');
            $student_name  = gv($student, 'student_name');
            $date_of_birth = toDate(gv($student, 'date_of_birth'));
            $gender        = toDate(gv($student, 'gender'));

            if (! $student_name) {
                throw ValidationException::withMessages([$index.'_student_name' => trans('validation.required', ['attribute' => trans('student.name')])]);
            }

            if (! $date_of_birth) {
                throw ValidationException::withMessages([$index.'_date_of_birth' => trans('validation.required', ['attribute' => trans('student.date_of_birth')])]);
            }

            if (! $gender) {
                throw ValidationException::withMessages([$index.'_gender' => trans('validation.required', ['attribute' => trans('student.gender')])]);
            }

            if (! in_array($course_id, $course_ids)) {
                throw ValidationException::withMessages([$index.'_course_id' => trans('academic.could_not_find_course')]);
            }

            if ($institute_id && ! in_array($institute_id, $institute_ids)) {
                throw ValidationException::withMessages([$index.'_institute_id' => trans('academic.could_not_find_institute')]);
            }

            $student_names[] = $student_name;
        }

        if (count($student_names) > count(array_unique($student_names))) {
            throw ValidationException::withMessages(['message' => trans('reception.duplicate_student_found')]);
        }
    }

    /**
     * Update given enquiry.
     *
     * @param Enquiry $enquiry
     * @param array $params
     *
     * @return Enquiry
     */
    public function update(Enquiry $enquiry, $params)
    {
        $this->validateInput($params, $enquiry->id);

        $enquiry->date_of_enquiry          = toDate(gv($params, 'date_of_enquiry'));
        $enquiry->enquiry_type_id          = gv($params, 'enquiry_type_id');
        $enquiry->enquiry_source_id        = gv($params, 'enquiry_source_id');
        $enquiry->first_guardian_name      = gv($params, 'first_guardian_name');
        $enquiry->first_guardian_relation  = gv($params, 'first_guardian_relation');
        $enquiry->second_guardian_name     = gv($params, 'second_guardian_name');
        $enquiry->second_guardian_relation = gv($params, 'second_guardian_relation');
        $enquiry->third_guardian_name      = gv($params, 'third_guardian_name');
        $enquiry->third_guardian_relation  = gv($params, 'third_guardian_relation');
        $enquiry->contact_number           = gv($params, 'contact_number');
        $enquiry->alternate_contact_number = gv($params, 'alternate_contact_number');
        $enquiry->email                    = gv($params, 'email');
        $enquiry->remarks                  = gv($params, 'remarks');
        $enquiry->save();

        $student_uuid = array();
        foreach ($params['students'] as $student) {
            $student_uuid[] = gv($student, 'uuid');
        }

        $existing_students = $enquiry->EnquiryDetails->pluck('uuid')->all();
        foreach ($existing_students as $existing_student) {
            if (! in_array($existing_student, $student_uuid)) {
                $this->enquiry_detail->whereUuid($existing_student)->delete();
            }
        }

        foreach ($params['students'] as $student) {
            $uuid = gv($student, 'uuid');
            $enquiry_detail = $this->enquiry_detail->firstOrCreate([
                'uuid' => $uuid
            ]);

            $enquiry_detail->uuid          = $uuid;
            $enquiry_detail->enquiry_id    = $enquiry->id;
            $enquiry_detail->student_name  = gv($student, 'student_name');
            $enquiry_detail->gender        = gv($student, 'gender');
            $enquiry_detail->date_of_birth = toDate(gv($student, 'date_of_birth'));
            $enquiry_detail->course_id     = gv($student, 'course_id');
            $enquiry_detail->institute_id  = gv($student, 'institute_id');
            $enquiry_detail->remarks       = gv($student, 'remarks');
            $enquiry_detail->options       = [];
            $enquiry_detail->save();
        }
    }

    /**
     * Delete enquiry.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Enquiry $enquiry)
    {
        return $enquiry->delete();
    }

    /**
     * Delete multiple enquiry.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->enquiry->whereIn('id', $ids)->delete();
    }

    /**
     * Add new follow up to given enquiry.
     *
     * @param Enquiry $enquiry
     * @param array $params
     *
     * @return Enquiry
     */
    public function followUp(Enquiry $enquiry, $params)
    {
        $date_of_follow_up = toDate(gv($params, 'date_of_follow_up'));
        $date_of_next_follow_up = toDate(gv($params, 'date_of_next_follow_up'));
        $status = gv($params, 'status');
        $remarks = gv($params, 'remarks');

        if (! in_array($status, ['open','partially_closed','closed','missed'])) {
            throw ValidationException::withMessages(['status' => trans('reception.invalid_enquiry_status')]);
        }

        if ($date_of_next_follow_up && $date_of_follow_up > $date_of_next_follow_up) {
            throw ValidationException::withMessages(['date_of_next_follow_up' => trans('reception.date_of_next_follow_up_less_than_date_of_follow_up')]);
        }

        if ($date_of_follow_up < toDate($enquiry->date_of_enquiry)) {
            throw ValidationException::withMessages(['date_of_follow_up' => trans('reception.date_of_follow_up_less_than_date_of_enquiry')]);
        }

        if ($date_of_next_follow_up && $date_of_next_follow_up < toDate($enquiry->date_of_enquiry)) {
            throw ValidationException::withMessages(['date_of_next_follow_up' => trans('reception.date_of_next_follow_up_less_than_date_of_enquiry')]);
        }

        $last_follow_up = $enquiry->EnquiryFollowUps->sortByDesc('date_of_follow_up')->first();

        if ($last_follow_up && toDate($last_follow_up->date_of_follow_up) >= $date_of_follow_up) {
            throw ValidationException::withMessages(['date_of_follow_up' => trans('reception.date_of_follow_up_less_than_last_date_of_follow_up')]);
        }

        $this->enquiry_follow_up->forceCreate([
            'enquiry_id' => $enquiry->id,
            'date_of_follow_up' => toDate($date_of_follow_up),
            'date_of_next_follow_up' => toDate($date_of_next_follow_up),
            'status' => $status,
            'remarks' => $remarks,
            'user_id' => \Auth::user()->id
        ]);

        $enquiry->status = $status;
        $enquiry->save();

        return $enquiry;
    }

    /**
     * Delete enquiry follow up.
     *
     * @param integer $id
     * @return bool|null
     */
    public function deleteFollowUp(Enquiry $enquiry, $id)
    {
        $enquiry_follow_up = $this->enquiry_follow_up->filterByEnquiryId($enquiry->id)->filterById($id)->first();

        if (! $enquiry_follow_up) {
            throw ValidationException::withMessages(['message' => trans('reception.could_not_find_enquiry_follow_up')]);
        }

        if ($enquiry->enquiryFollowUps->sortByDesc('date_of_follow_up')->first()->id != $id) {
            throw ValidationException::withMessages(['message' => trans('reception.could_not_delete_intermediate_follow_up')]);
        }

        $enquiry_follow_up->delete();

        $last_follow_up = $enquiry->EnquiryFollowUps->sortByDesc('date_of_follow_up')->first();

        $enquiry->status = ($last_follow_up) ? $last_follow_up->status : 'open';
        $enquiry->save();
    }
}
