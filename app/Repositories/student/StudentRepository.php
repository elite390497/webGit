<?php

namespace App\Repositories\Student;

use App\User;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\Academic\Batch;
use App\Models\Student\Student;
use App\Models\Student\Admission;
use App\Models\Academic\ClassTeacher;
use App\Models\Student\StudentParent;
use App\Models\Student\StudentRecord;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Misc\CasteRepository;
use App\Repositories\Configuration\CustomFieldRepository;
use App\Repositories\Configuration\Misc\CategoryRepository;
use App\Repositories\Configuration\Misc\ReligionRepository;
use App\Repositories\Configuration\Misc\BloodGroupRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;
use App\Repositories\Configuration\Student\StudentGroupRepository;

class StudentRepository
{
    protected $student;
    protected $caste;
    protected $category;
    protected $religion;
    protected $blood_group;
    protected $student_parent;
    protected $course_group;
    protected $user;
    protected $student_group;
    protected $batch;
    protected $admission;
    protected $class_teacher;
    protected $custom_field;
    protected $student_record;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Student $student,
        CasteRepository $caste,
        CategoryRepository $category,
        ReligionRepository $religion,
        BloodGroupRepository $blood_group,
        StudentParent $student_parent,
        CourseGroupRepository $course_group,
        User $user,
        StudentGroupRepository $student_group,
        Batch $batch,
        Admission $admission,
        ClassTeacher $class_teacher,
        CustomFieldRepository $custom_field,
        StudentRecord $student_record
    ) {
        $this->student = $student;
        $this->caste = $caste;
        $this->category = $category;
        $this->religion = $religion;
        $this->blood_group = $blood_group;
        $this->student_parent = $student_parent;
        $this->course_group = $course_group;
        $this->user = $user;
        $this->student_group = $student_group;
        $this->batch = $batch;
        $this->admission = $admission;
        $this->class_teacher = $class_teacher;
        $this->custom_field = $custom_field;
        $this->student_record = $student_record;
    }

    /**
     * Get student query
     *
     * @return Student query
     */
    public function getQuery()
    {
        return $this->student;
    }

    /**
     * Count student
     *
     * @return integer
     */
    public function count()
    {
        return $this->student->count();
    }

    /**
     * List all students by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->student->all()->pluck('id')->all();
    }

    /**
     * Get all students
     *
     * @return array
     */
    public function getAll()
    {
        return $this->student->all();
    }

    /**
     * List all students by name & id for select option
     *
     * @return array
     */
    public function selectAll()
    {
        $students = $this->student->with('parent')->get();

        $data = array();
        foreach ($students as $student) {
            $data[] = array(
                'name' => ($student->Parent) ? $student->name.' ('.$student->Parent->first_guardian_name.' '.$student->contact_number.')' : $student->name,
                'id' => $student->id
            );
        }

        return $data;
    }

    /**
     * Find student with given id.
     *
     * @param integer $id
     * @return Student
     */
    public function find($id)
    {
        return $this->student->find($id);
    }

    /**
     * Find student with given id or throw an error.
     *
     * @param integer $id
     * @return Student
     */
    public function findOrFail($id, $field = 'message')
    {
        $student = $this->student->find($id);

        if (! $student) {
            throw ValidationException::withMessages([$field => trans('student.could_not_find')]);
        }

        return $student;
    }

    /**
     * Find student with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Student
     */
    public function findByUuidOrFail($id, $field = 'message')
    {
        $student = $this->student->with('caste:id,name', 'category:id,name', 'religion:id,name', 'bloodGroup:id,name')->filterByUuid($id)->first();

        if (! $student) {
            throw ValidationException::withMessages([$field => trans('student.could_not_find')]);
        }

        return $student;
    }

    /**
     * Get student pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        if (request('form_type') == 'termination') {
            $data = getVar('data');
            $student_termination_reasons = gv($data, 'student_termination_reasons', []);

            $termination_reasons = array();
            foreach ($student_termination_reasons as $student_termination_reason) {
                $termination_reasons[] = array(
                    'text' => trans('student.termination_reason_'.$student_termination_reason),
                    'value' => $student_termination_reason
                );
            }

            return compact('termination_reasons');
        }

        $castes = $this->caste->selectAll();
        $categories = $this->category->selectAll();
        $religions = $this->religion->selectAll();
        $blood_groups = $this->blood_group->selectAll();
        $list = getVar('list');
        $genders = generateTranslatedSelectOption(isset($list['gender']) ? $list['gender'] : []);
        $guardian_relations = generateTranslatedSelectOption(isset($list['relations']) ? $list['relations'] : []);
        $parents = $this->student_parent->all();
        $student_parents = array();

        foreach ($parents as $parent) {
            $student_parents[] = array('id' => $parent->id, 'name' => $parent->first_guardian_name.' ('.$parent->first_guardian_contact_number_1.')');
        }

        $form_type = in_array(request('form_type'), ['student_basic', 'student_parent', 'student_contact']) ? request('form_type') : 'student_basic';

        $custom_fields = $this->custom_field->listAllByForm($form_type);

        return compact('castes', 'categories', 'religions', 'blood_groups', 'genders', 'student_parents', 'custom_fields','guardian_relations');
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Student
     */
    public function getData($params)
    {
        $sort_by              = gv($params, 'sort_by', 'first_name');
        $order                = gv($params, 'order', 'asc');
        $batch_id             = gv($params, 'batch_id');
        $blood_group_id       = gv($params, 'blood_group_id');
        $religion_id          = gv($params, 'religion_id');
        $caste_id             = gv($params, 'caste_id');
        $category_id          = gv($params, 'category_id');
        $first_name           = gv($params, 'first_name');
        $last_name            = gv($params, 'last_name');
        $first_guardian_name  = gv($params, 'first_guardian_name');
        $second_guardian_name = gv($params, 'second_guardian_name');
        $student_group_id     = gv($params, 'student_group_id');
        $gender               = gv($params, 'gender', []);

        $date_of_birth_start_date     = gv($params, 'date_of_birth_start_date');
        $date_of_birth_end_date       = gv($params, 'date_of_birth_end_date');
        $date_of_admission_start_date = gv($params, 'date_of_admission_start_date');
        $date_of_admission_end_date   = gv($params, 'date_of_admission_end_date');

        $this->admission->whereNull('prefix')->update(['prefix' => config('config.admission_number_prefix')]);

        $batch_id         = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : $this->batch->filterBySession()->get()->pluck('id')->all());
        $blood_group_id   = is_array($blood_group_id) ? $blood_group_id : ($blood_group_id ? explode(',', $blood_group_id) : []);
        $religion_id      = is_array($religion_id) ? $religion_id : ($religion_id ? explode(',', $religion_id) : []);
        $caste_id         = is_array($caste_id) ? $caste_id : ($caste_id ? explode(',', $caste_id) : []);
        $category_id      = is_array($category_id) ? $category_id : ($category_id ? explode(',', $category_id) : []);
        $gender          = is_array($gender) ? $gender : ($gender ? explode(',', $gender) : []);
        $student_group_id = is_array($student_group_id) ? $student_group_id : ($student_group_id ? explode(',', $student_group_id) : []);
        
        $auth_user = \Auth::user();

        $student_user_id = [];
        $student_user_ids = [];
        if ($auth_user->hasRole(config('system.default_role.student'))) {
            $student_user_id = $auth_user->student->id;
        } else if ($auth_user->hasRole(config('system.default_role.parent'))) {
            $student_user_ids = $auth_user->parent->students->pluck('id');
        }

        if (! $auth_user->can('list-student') && $auth_user->can('list-class-teacher-wise-student')) {
            $employee_id = $auth_user->Employee->id;
            $batches = $this->batch->with('classTeachers')->filterBySession()->get();

            $batch_id = array();
            foreach ($batches as $batch) {
                if (getCurrentClassTeacherEmployeeId($batch->classTeachers) == $employee_id) {
                    $batch_id[] = $batch->id;
                }
            }
        }

        $query = $this->student_record->with('student','admission','batch','batch.course','student.bloodGroup','student.religion','student.caste','student.category','student.parent')
            ->whereNull('date_of_exit')
            ->filterbySession()
            ->whereIn('batch_id', $batch_id)
            ->dateOfAdmissionBetween([
                'start_date' => $date_of_admission_start_date,
                'end_date' => $date_of_admission_end_date
            ])->whereHas('student', function($q) use(
                $first_name,
                $last_name,
                $date_of_birth_start_date,
                $date_of_birth_end_date,
                $blood_group_id,
                $religion_id,
                $caste_id,
                $category_id,
                $gender,
                $first_guardian_name,
                $second_guardian_name,
                $student_group_id,
                $student_user_id,
                $student_user_ids
            ) {
                $q->filterByFirstName($first_name)
                ->filterByLastName($last_name)
                ->dateOfBirthBetween([
                    'start_date' => $date_of_birth_start_date,
                    'end_date' => $date_of_birth_end_date
                ])->when($blood_group_id, function ($query, $blood_group_id) {
                    return $query->whereIn('blood_group_id', $blood_group_id);
                })->when($religion_id, function ($query, $religion_id) {
                    return $query->whereIn('religion_id', $religion_id);
                })->when($caste_id, function ($query, $caste_id) {
                    return $query->whereIn('caste_id', $caste_id);
                })->when($category_id, function ($query, $category_id) {
                    return $query->whereIn('category_id', $category_id);
                })->when($gender, function ($query, $gender) {
                    return $query->whereIn('gender', $gender);
                })->when($student_user_id, function ($query, $student_user_id) {
                    return $query->filterById($student_user_id);
                })->when($student_user_ids, function ($query, $student_user_ids) {
                    return $query->whereIn('id', $student_user_ids);
                })->when($first_guardian_name, function ($query, $first_guardian_name) {
                    return $query->whereHas('parent', function($q1) use($first_guardian_name) {
                        $q1->filterByFirstGuardianName($first_guardian_name);
                    });
                })->when($second_guardian_name, function ($query, $second_guardian_name) {
                    return $query->whereHas('parent', function($q1) use($second_guardian_name) {
                        $q1->filterBySecondGuardianName($second_guardian_name);
                    });
                })->when($student_group_id, function ($query, $student_group_id) {
                    return $query->whereHas('studentGroups', function($q2) use($student_group_id) {
                        $q2->whereIn('student_group_id', $student_group_id);
                    });
                });
            });

        if ($sort_by == 'first_guardian_name') {
            $query->select('student_records.*', \DB::raw('(SELECT first_guardian_name FROM student_parents,students WHERE student_records.student_id = students.id and students.student_parent_id = student_parents.id ) as sort_by'));
        } else if ($sort_by == 'second_guardian_name') {
            $query->select('student_records.*', \DB::raw('(SELECT second_guardian_name FROM student_parents,students WHERE student_records.student_id = students.id and students.student_parent_id = student_parents.id ) as sort_by'));
        } else if ($sort_by == 'first_name') {
            $query->select('student_records.*', \DB::raw('(SELECT first_name FROM students WHERE student_records.student_id = students.id ) as sort_by'));
        } else if ($sort_by == 'last_name') {
            $query->select('student_records.*', \DB::raw('(SELECT last_name FROM students WHERE student_records.student_id = students.id ) as sort_by'));
        } else if ($sort_by == 'date_of_birth') {
            $query->select('student_records.*', \DB::raw('(SELECT date_of_birth FROM students WHERE student_records.student_id = students.id ) as sort_by'));
        } else {
            $query->select('student_records.*', 'date_of_entry as sort_by');
        }

        return $query->orderBy('sort_by', $order);
    }

    /**
     * Paginate all student records using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        $query = $this->getData($params);

        if (request('action') == 'excel') {
            return $this->exportExcel($query->get());
        }

        return $query->paginate($page_length);
    }

    /**
     * Export student data
     * @param  array  $students
     * @return array
     */
    private function exportExcel($student_records = array())
    {
        $data = array();
        $data[] = array(
            trans('student.admission_number_short'),
            trans('student.roll_number'),
            trans('student.first_name'),
            trans('student.middle_name'),
            trans('student.last_name'),
            trans('student.gender'),
            trans('student.first_guardian_name'),
            trans('student.second_guardian_name'),
            trans('student.date_of_birth'),
            trans('student.date_of_admission'),
            trans('student.date_of_promotion'),
            trans('student.contact_number'),
            trans('academic.course'),
            trans('academic.batch'),
            trans('student.nationality'),
            trans('misc.blood_group'),
            trans('misc.religion'),
            trans('misc.caste'),
            trans('misc.category'),
            trans('student.unique_identification_number'),
            trans('student.first_guardian_contact_number_1'),
            trans('student.second_guardian_contact_number_1'),
            trans('student.emergency_contact_name'),
            trans('student.emergency_contact_number'),
            trans('student.present_address'),
            trans('student.permanent_address')
        );
        foreach ($student_records as $student_record) {
            $data[] = array(
                $student_record->admission->admission_number,
                getRollNumber($student_record),
                $student_record->student->first_name,
                $student_record->student->middle_name,
                $student_record->student->last_name,
                trans('list.'.$student_record->student->gender),
                optional($student_record->student->parent)->first_guardian_name,
                optional($student_record->student->parent)->second_guardian_name,
                showDate($student_record->student->date_of_birth),
                $student_record->admission->date_of_admission,
                $student_record->date_of_entry,
                $student_record->student->contact_number,
                $student_record->batch->course->name,
                $student_record->batch->name,
                $student_record->student->nationality,
                optional($student_record->student->bloodGroup)->name,
                optional($student_record->student->religion)->name,
                optional($student_record->student->caste)->name,
                optional($student_record->student->category)->name,
                $student_record->student->unique_identification_number,
                $student_record->student->parent->first_guardian_contact_number_1,
                $student_record->student->parent->second_guardian_contact_number_1,
                $student_record->student->emergency_contact_name,
                $student_record->student->emergency_contact_number,
                $student_record->student->present_address,
                $student_record->student->permanent_address,
            );
        }

        return $data;
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return StudentRecord
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get student record filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $batches = $this->course_group->getBatchOption();
        $blood_groups = $this->blood_group->selectAll();
        $religions = $this->religion->selectAll();
        $castes = $this->caste->selectAll();
        $categories = $this->category->selectAll();
        $student_groups = $this->student_group->selectAll();
        $list = getVar('list');
        $genders = generateTranslatedSelectOption(isset($list['gender']) ? $list['gender'] : []);

        return compact('batches', 'blood_groups', 'religions', 'castes', 'categories', 'student_groups','genders');
    }

    /**
     * Create a new student.
     *
     * @param array $params
     * @return Student
     */
    public function create($params)
    {
        $this->validateInput($params);

        return $this->student->forceCreate($this->formatParams($params));
    }

    /**
     * Validate all input.
     *
     * @param array $params
     */
    public function validateInput($params = array(), $id = null)
    {
        $existing_student = $this->getExistingStudent($params, $id);

        if ($existing_student) {
            throw ValidationException::withMessages(['message' => trans('student.student_exists')]);
        }
    }

    public function getExistingStudent($params = array(), $id = null)
    {
        $first_name    = gv($params, 'first_name');
        $middle_name   = gv($params, 'middle_name');
        $last_name     = gv($params, 'last_name');
        $date_of_birth = toDate(gv($params, 'date_of_birth'));

        $student_exist_query = ($id) ? $this->student->where('id', '!=', $id) : $this->student->whereNotNull('id');

        return $student_exist_query->filterByFirstName($first_name, 1)->filterByMiddleName($middle_name, 1)->filterByLastName($last_name, 1)->filterByDateOfBirth($date_of_birth)->first();
    }

    /**
     * Validate student for registration
     * @param  Student $student
     * @param  array $params
     * @return void
     */
    public function validateStudentForRegistration(Student $student, $params = array())
    {
        $course_id = gv($params, 'course_id');
        $date_of_registration = toDate(gv($params, 'date_of_registration'));

        $existing_student = $this->student_record->filterBySession()->where('student_id', $student->id)->whereHas('batch', function($q) use($course_id) {
            $q->where('course_id', $course_id);
        })->where(function($q1) use($date_of_registration) {
            $q1->whereNull('date_of_exit')->orWhere(function($q2) use($date_of_registration) {
                $q2->whereNotNull('date_of_exit')->where('date_of_exit', '>=', $date_of_registration);
            });
        })->first();

        if ($existing_student) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find_for_registration')]);
        }
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @return array
     */
    private function formatParams($params)
    {
        $formatted = [
            'first_name'             => gv($params, 'first_name'),
            'last_name'              => gv($params, 'last_name'),
            'date_of_birth'          => toDate(gv($params, 'date_of_birth')),
            'middle_name'            => gv($params, 'middle_name'),
            'contact_number'         => gv($params, 'contact_number'),
            'gender'                 => gv($params, 'gender'),
            'student_parent_id'      => gv($params, 'student_parent_id'),
            'present_address_line_1' => gv($params, 'address_line_1'),
            'present_address_line_2' => gv($params, 'address_line_2'),
            'present_city'           => gv($params, 'city'),
            'present_state'          => gv($params, 'state'),
            'present_zipcode'        => gv($params, 'zipcode'),
            'present_country'        => gv($params, 'country')
        ];


        $formatted['uuid'] = Str::uuid();

        return $formatted;
    }

    /**
     * Update given student.
     *
     * @param Student $student
     * @param array $params
     *
     * @return Student
     */
    public function update(Student $student, $params)
    {
        $type = gv($params, 'type', 'basic');

        if ($type == 'basic') {
            $custom_values = $this->custom_field->validateCustomValues('student_basic', gv($params, 'custom_values', []));

            $student->forceFill($this->updateBasic($student, $params))->save();

            $options = $student->options;
            $options['custom_values'] = mergeByKey($student->getOption('custom_values'), $custom_values);
            $student->options = $options;
            $student->save();

        } elseif ($type == 'parent') {
            $custom_values = $this->custom_field->validateCustomValues('student_parent', gv($params, 'custom_values', []));

            $parent = $student->Parent;

            if (! $parent) {
                $parent = $this->student_parent->forceFill($this->updateParent($params))->save();
                $student->student_parent_id = $parent->id;
                $student->save();
            } else {
                $parent->forceFill($this->updateParent($params))->save();
            }
            
            $options = $parent->options;
            $options['custom_values'] = mergeByKey($parent->getOption('custom_values'), $custom_values);
            $parent->options = $options;
            $parent->save();
        } elseif ($type == 'contact') {
            $custom_values = $this->custom_field->validateCustomValues('student_contact', gv($params, 'custom_values', []));

            $student->forceFill($this->updateContact($params))->save();

            $options = $student->options;
            $options['custom_values'] = mergeByKey($student->getOption('custom_values'), $custom_values);
            $student->options = $options;
            $student->save();
        } else {
        }

        return  $student;
    }

    /**
     * Update given student's parennt.
     *
     * @param Student $student
     * @param array $params
     *
     * @return Student
     */
    public function updateParentId(Student $student, $params)
    {
        $student_parent_id = gv($params, 'student_parent_id');

        $student->student_parent_id = $student_parent_id;
        $student->save();
    }

    /**
     * Prepare basic params for inserting into database.
     *
     * @param Student $student
     * @param array $params
     * @return array
     */
    private function updateBasic(Student $student, $params)
    {
        $this->validateInput($params, $student->id);

        $caste_id = gv($params, 'caste_id');
        if ($caste_id) {
            $this->caste->findOrFail($caste_id);
        }

        $category_id = gv($params, 'category_id');
        if ($category_id) {
            $this->category->findOrFail($category_id);
        }

        $blood_group_id = gv($params, 'blood_group_id');
        if ($blood_group_id) {
            $this->blood_group->findOrFail($blood_group_id);
        }

        $religion_id = gv($params, 'religion_id');
        if ($religion_id) {
            $this->religion->findOrFail($religion_id);
        }

        return [
            'first_name'                   => gv($params, 'first_name'),
            'last_name'                    => gv($params, 'last_name'),
            'date_of_birth'                => toDate(gv($params, 'date_of_birth')),
            'middle_name'                  => gv($params, 'middle_name'),
            'gender'                       => gv($params, 'gender'),
            'mother_tongue'                => gv($params, 'mother_tongue'),
            'unique_identification_number' => gv($params, 'unique_identification_number'),
            'birth_place'                  => gv($params, 'birth_place'),
            'nationality'                  => gv($params, 'nationality'),
            'caste_id'                     => $caste_id,
            'category_id'                  => $category_id,
            'religion_id'                  => $religion_id,
            'blood_group_id'               => $blood_group_id
        ];
    }

    /**
     * Prepare basic params for inserting into database.
     *
     * @param array $params
     * @return array
     */
    private function updateParent($params)
    {
        return [
            'first_guardian_name'                          => gv($params, 'first_guardian_name'),
            'first_guardian_relation'                      => gv($params, 'first_guardian_relation'),
            'second_guardian_name'                         => gv($params, 'second_guardian_name'),
            'second_guardian_relation'                     => gv($params, 'second_guardian_relation'),
            'first_guardian_date_of_birth'                 => toDate(gv($params, 'first_guardian_date_of_birth')),
            'second_guardian_date_of_birth'                => toDate(gv($params, 'second_guardian_date_of_birth')),
            'first_guardian_qualification'                 => gv($params, 'first_guardian_qualification'),
            'second_guardian_qualification'                => gv($params, 'second_guardian_qualification'),
            'first_guardian_occupation'                    => gv($params, 'first_guardian_occupation'),
            'second_guardian_occupation'                   => gv($params, 'second_guardian_occupation'),
            'first_guardian_annual_income'                 => gv($params, 'first_guardian_annual_income'),
            'second_guardian_annual_income'                => gv($params, 'second_guardian_annual_income'),
            'first_guardian_email'                         => gv($params, 'first_guardian_email'),
            'second_guardian_email'                        => gv($params, 'second_guardian_email'),
            'first_guardian_contact_number_1'              => gv($params, 'first_guardian_contact_number_1'),
            'second_guardian_contact_number_1'             => gv($params, 'second_guardian_contact_number_1'),
            'first_guardian_contact_number_2'              => gv($params, 'first_guardian_contact_number_2'),
            'second_guardian_contact_number_2'             => gv($params, 'second_guardian_contact_number_2'),
            'first_guardian_unique_identification_number'  => gv($params, 'first_guardian_unique_identification_number'),
            'second_guardian_unique_identification_number' => gv($params, 'second_guardian_unique_identification_number')
        ];
    }

    /**
     * Prepare basic params for inserting into database.
     *
     * @param array $params
     * @return array
     */
    private function updateContact($params)
    {
        $same_as_present_address = gbv($params, 'same_as_present_address');

        return [
            'contact_number'           => gv($params, 'contact_number'),
            'email'                    => gv($params, 'email'),
            'emergency_contact_number' => gv($params, 'emergency_contact_number'),
            'emergency_contact_name'   => gv($params, 'emergency_contact_name'),
            'present_address_line_1'   => gv($params, 'present_address_line_1'),
            'present_address_line_2'   => gv($params, 'present_address_line_2'),
            'present_city'             => gv($params, 'present_city'),
            'present_state'            => gv($params, 'present_state'),
            'present_zipcode'          => gv($params, 'present_zipcode'),
            'present_country'          => gv($params, 'present_country'),
            'same_as_present_address'  => $same_as_present_address,
            'permanent_address_line_1' => ! $same_as_present_address ? gv($params, 'permanent_address_line_1') : '',
            'permanent_address_line_2' => ! $same_as_present_address ? gv($params, 'permanent_address_line_2') : '',
            'permanent_city'           => ! $same_as_present_address ? gv($params, 'permanent_city') : '',
            'permanent_state'          => ! $same_as_present_address ? gv($params, 'permanent_state') : '',
            'permanent_zipcode'        => ! $same_as_present_address ? gv($params, 'permanent_zipcode') : '',
            'permanent_country'        => ! $same_as_present_address ? gv($params, 'permanent_country') : ''
        ];
    }

    /**
     * Update user login
     *
     * @param Student $student
     * @param array $params
     * @return Student
     */
    public function updateUserLogin(Student $student, $params)
    {
        $enable_student_login    = gbv($params, 'enable_student_login');
        $enable_parent_login     = gbv($params, 'enable_parent_login');
        $change_student_password = gbv($params, 'change_student_password');
        $change_parent_password  = gbv($params, 'change_parent_password');
        $student_email           = gv($params, 'student_email');
        $student_username        = gv($params, 'student_username');
        $parent_email            = gv($params, 'parent_email');
        $parent_username         = gv($params, 'parent_username');
        $student_password        = gv($params, 'student_password');
        $parent_password         = gv($params, 'parent_password');

        $student_user = $student->User;
        $parent_user  = $student->Parent->User;

        if ($enable_student_login && ! $student_user) {
            if (! $student_password) {
                throw ValidationException::withMessages(['student_password' => trans('validation.required', ['attribute' => trans('student.student_password')])]);
            }

            if (! $student_username && ! $student_email) {
                throw ValidationException::withMessages(['message' => trans('auth.username_or_email_required')]);
            }

            if ($student_email && $this->user->whereEmail($student_email)->count()) {
                throw ValidationException::withMessages(['message' => trans('auth.email_already_exists')]);
            }

            if ($student_username && $this->user->whereUsername($student_username)->count()) {
                throw ValidationException::withMessages(['message' => trans('auth.username_already_exists')]);
            }

            $student_user = $this->user->forceCreate([
                'email'            => $student_email,
                'username'         => $student_username,
                'password'         => bcrypt($student_password),
                'status'           => 'activated',
                'uuid'             => Str::uuid(),
                'activation_token' => Str::uuid()
            ]);

            $student->user_id = $student_user->id;
            $student->save();
            $student_user->syncRoles([config('system.default_role.student')]);
        }

        if ($enable_parent_login && ! $parent_user) {
            if (! $parent_password) {
                throw ValidationException::withMessages(['parent_password' => trans('validation.required', ['attribute' => trans('student.parent_password')])]);
            }

            if (! $parent_username && ! $parent_email) {
                throw ValidationException::withMessages(['message' => trans('auth.username_or_email_required')]);
            }

            if ($parent_email && $this->user->whereEmail($parent_email)->count()) {
                throw ValidationException::withMessages(['message' => trans('auth.email_already_exists')]);
            }

            if ($parent_username && $this->user->whereUsername($parent_username)->count()) {
                throw ValidationException::withMessages(['message' => trans('auth.username_already_exists')]);
            }

            $parent_user = $this->user->forceCreate([
                'email'            => $parent_email,
                'username'         => $parent_username,
                'password'         => bcrypt($parent_password),
                'status'           => 'activated',
                'uuid'             => Str::uuid(),
                'activation_token' => Str::uuid()
            ]);

            $parent = $student->Parent;
            $parent->user_id = $parent_user->id;
            $parent->save();
            $parent_user->syncRoles([config('system.default_role.parent')]);
        }

        if ($enable_student_login) {
            if (! $change_student_password) {
                $student_user->status = 'activated';
                $student_user->email = $student_email;
                $student_user->username = $student_username;
                $student_user->save();
            } else {
                $student_user->password = bcrypt($student_password);
                $student_user->save();
            }
        } else if ($student_user) {
            $student_user->status = 'banned';
            $student_user->save();
        }

        if ($enable_parent_login) {
            if (! $change_parent_password) {
                $parent_user->status = 'activated';
                $parent_user->email = $parent_email;
                $parent_user->username = $parent_username;
                $parent_user->save();
            } else {
                $parent_user->password = bcrypt($parent_password);
                $parent_user->save();
            }
        } else if ($parent_user) {
            $parent_user->status = 'banned';
            $parent_user->save();
        }

        return $student;
    }

    /**
     * Search student by name
     *
     * @param array $params
     * @return Student
     */
    public function searchByName($params)
    {
        if (strlen(request('name')) < 3) {
            throw ValidationException::withMessages(['message' => trans('general.type_min_3_char_for_search')]);
        }

        $name = gv($params, 'name');
        $date = toDate(gv($params, 'date'));
        $array_of_name = explode(' ', $name);
        $first_name = gv($array_of_name, 0);
        $middle_name = (str_word_count($name) > 2) ? gv($array_of_name, 1) : '';
        $last_name = gv($array_of_name, (str_word_count($name) > 2) ? 2 : 1);

        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->student->with(['studentRecords' => function ($q) {
            $q->where('academic_session_id', config('config.default_academic_session.id'));
        } ,'studentRecords.admission','studentRecords.batch','studentRecords.batch.course','parent','caste','category','religion'])->filterByFirstName($first_name)->filterByMiddleName($middle_name)->filterByLastName($last_name)->whereHas('studentRecords', function ($q) {
            $q->whereNull('date_of_exit')->filterBySession();
        })->orderBy('first_name', 'asc')->orderBy('last_name', 'asc')->paginate($page_length);
    }

    /**
     * Search student for registration
     *
     * @param array $params
     * @return Student
     */
    public function searchForRegistration($params)
    {
        $name = gv($params, 'name');
        $date = toDate(gv($params, 'date'));
        $array_of_name = explode(' ', $name);
        $first_name = gv($array_of_name, 0);
        $middle_name = (str_word_count($name) > 2) ? gv($array_of_name, 1) : '';
        $last_name = gv($array_of_name, (str_word_count($name) > 2) ? 2 : 1);

        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->student->with('parent')->filterByFirstName($first_name)->filterByMiddleName($middle_name)->filterByLastName($last_name)->orderBy('first_name', 'asc')->orderBy('last_name', 'asc')->paginate($page_length);
    }

    /**
     * Validate student
     *
     * @param integer $student_id
     * @return Student
     */
    public function validateStudentOrFail($student_id)
    {
        $student = $this->student->with(['studentRecords' => function ($q) {
            $q->where('academic_session_id', config('config.default_academic_session.id'))->whereNull('date_of_exit')->orderBy('date_of_entry', 'desc');
        }])->filterById($student_id)->whereHas('studentRecords', function ($q) {
            $q->whereNull('date_of_exit')->filterBySession();
        })->first();

        if (! $student) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
        }

        return $student;
    }

    /**
     * Validate student on a date
     *
     * @param integer $student_id
     * @param date $date
     * @return Student
     */
    public function validateStudentWithDateOrFail($student_id, $date)
    {
        $student = $this->student->with(['studentRecords' => function ($q) {
            $q->where('academic_session_id', config('config.default_academic_session.id'))->whereNull('date_of_exit')->orderBy('date_of_entry', 'desc');
        }])->filterById($student_id)->whereHas('studentRecords', function ($q) use ($date) {
            $q->where('date_of_entry', '<=', $date)->whereNull('date_of_exit')->filterBySession();
        })->first();

        if (! $student) {
            throw ValidationException::withMessages(['message' => trans('student.invalid_record_for_given_date', ['date' => showDate($date)])]);
        }

        return $student;
    }

    /**
     * Update student group
     *
     * @param array $params
     * @return null
     */
    public function updateGroup($params)
    {
        $student_group_id = gv($params, 'student_group_id');
        $action = gv($params, 'action');
        $ids = gv($params, 'ids', []);

        if (! in_array($action, ['attach','detach'])) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        if (! count($ids)) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find_student')]);
        }

        $students = $this->student->whereIn('id', $ids)->get();

        foreach ($students as $student) {
            if ($action == 'attach') {
                $student->studentGroups()->attach($student_group_id);
            } else {
                $student->studentGroups()->detach($student_group_id);
            }
        }
    }

    /**
     * Get authenticated student's record
     *
     * @param  integer batch_id
     * @return StudentRecord $student_record
     */
    public function getAuthStudentRecord($batch_id)
    {
        $student = $this->student->with('studentRecords')->filterById(\Auth::user()->Student->id)->first();

        if (! $student) {
            return null;
        }

        return $student->studentRecords->where('academic_session_id', config('config.default_academic_session.id'))->where('batch_id', $batch_id)->first();
    }
}
