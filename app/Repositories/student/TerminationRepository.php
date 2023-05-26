<?php
namespace App\Repositories\Student;

use Illuminate\Support\Str;
use App\Models\Student\StudentRecord;
use App\Models\Student\TransferCertificate;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class TerminationRepository
{
    protected $student_record;
    protected $course_group;
    protected $transfer_certificate;
    protected $upload;
    protected $module = 'student_record';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentRecord $student_record,
        CourseGroupRepository $course_group,
        TransferCertificate $transfer_certificate,
        UploadRepository $upload
    ) {
        $this->student_record = $student_record;
        $this->course_group = $course_group;
        $this->transfer_certificate = $transfer_certificate;
        $this->upload = $upload;
    }

    /**
     * Get terminated student's filtered data
     *
     * @param array $params
     * @return StudentRecord
     */
    public function getData($params)
    {
        $sort_by              = gv($params, 'sort_by', 'date_of_exit');
        $order                = gv($params, 'order', 'desc');
        $batch_id             = gv($params, 'batch_id');
        $first_name           = gv($params, 'first_name');
        $last_name            = gv($params, 'last_name');
        $first_guardian_name  = gv($params, 'father_name');
        $second_guardian_name = gv($params, 'mother_name');

        $date_of_exit_start_date = gv($params, 'date_of_exit_start_date');
        $date_of_exit_end_date   = gv($params, 'date_of_exit_end_date');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $query = $this->student_record->with('student', 'student.parent', 'admission', 'batch', 'batch.course')->filterBySession()->whereNotNull('date_of_exit')->filterByBatchesId($batch_id)->whereHas('student', function ($q) use ($first_name, $last_name, $first_guardian_name, $second_guardian_name) {
            $q->filterByFirstName($first_name)->filterByLastName($last_name);

            if ($first_guardian_name || $second_guardian_name) {
                $q->whereHas('parent', function ($q1) use ($first_guardian_name, $second_guardian_name) {
                    $q1->filterByFirstGuardianName($first_guardian_name)->filterBySecondGuardianName($second_guardian_name);
                });
            }
        })->dateOfExitBetween([
                'start_date' => $date_of_exit_start_date,
                'end_date' => $date_of_exit_end_date
            ]);

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate terminated student records using given params.
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
     * Get terminated student filtered data for printing
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

        return compact('batches');
    }

    /**
     * Terminate a student.
     *
     * @param StudentRecord $student_record
     * @param array $params
     */
    public function terminate(StudentRecord $student_record, $params)
    {
        $termination_reason = gv($params, 'termination_reason');

        $data = getVar('data');
        $student_termination_reasons = gv($data, 'student_termination_reasons', []);

        if (! in_array($termination_reason, $student_termination_reasons)) {
            throw ValidationException::withMessages(['termination_reason' => trans('general.invalid_input')]);
        }

        if ($student_record->date_of_exit) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $date_of_termination = toDate(gv($params, 'date_of_termination'));
        $termination_remarks = gv($params, 'termination_remarks');

        if (toDate($student_record->date_of_entry) >= $date_of_termination) {
            throw ValidationException::withMessages(['message' => trans('student.date_of_termination_less_than_date_of_admission')]);
        }

        if ($student_record->Student->StudentRecords->where('date_of_entry', '>', toDate($student_record->date_of_entry))->where('id', '!=', $student_record->id)->count()) {
            throw ValidationException::withMessages(['message' => trans('student.no_termination_allowed_in_intermediate_records')]);
        }

        $this->processUpload($student_record, $params);

        $student_record->termination_reason = $termination_reason;
        $student_record->date_of_exit = toDate($date_of_termination);
        $student_record->exit_remarks = $termination_remarks;
        $student_record->upload_token = $student_record->upload_token ? : gv($params, 'upload_token');
        $student_record->save();
    }

    /**
     * Upload attachment
     *
     * @param StudentRecord $student_record
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(StudentRecord $student_record, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $student_record->id, $upload_token);
        } else {
            $this->upload->update($this->module, $student_record->id, $upload_token);
        }
    }

    /**
     * Terminate a student.
     *
     * @param StudentRecord $student_record
     * @param array $params
     */
    public function transferCertificate(StudentRecord $student_record, $params)
    {
        $transfer_certificate_format = gv($params, 'transfer_certificate_format');

        $transfer_certificate_formats = gkv(gv(getVar('data'), 'transfer_certificate_formats', []), 'id');

        if (! in_array($transfer_certificate_format, $transfer_certificate_formats)) {
            throw ValidationException::withMessages(['transfer_certificate_format' => trans('general.invalid_input')]);
        }

        // $transfer_certificate_format = searchByKey(gv(getVar('data'), 'transfer_certificate_formats', []), 'id', $transfer_certificate_format);

        $date_of_application = toDate(gv($params, 'date_of_application'));
        $date_of_issue = toDate(gv($params, 'date_of_issue'));
        $memo = gv($params, 'memo');

        $transfer_certificate = $this->getTransferCertificate($student_record);

        if ($date_of_issue <= toDate($student_record->date_of_joining)) {
            throw ValidationException::withMessages(['message' => trans('student.date_of_issue_should_greater_than_joining_date')]);
        }

        $prefix = gv($params, 'prefix');
        $number = gv($params, 'number');

        if (! ctype_digit($number)) {
            throw ValidationException::withMessages(['message' => trans('validation.numeric', ['attribute' => trans('student.transfer_certificate_number')])]);
        }

        $number = (int) $number;

        $exists = $this->transfer_certificate->where('id', '!=', $transfer_certificate->id);

        if ($exists->filterByPrefix($prefix)->filterByNumber($number)->count()) {
            throw ValidationException::withMessages(['message' => trans('validation.unique', ['attribute' => trans('student.transfer_certificate_number')])]);
        }

        $variables = gv($params, 'variables');

        $transfer_certificate->prefix = $prefix;
        $transfer_certificate->number = $number;
        $transfer_certificate->date_of_application = toDate($date_of_application);
        $transfer_certificate->date_of_issue = toDate($date_of_issue);
        $transfer_certificate->format = $transfer_certificate_format;

        $options['transfer_certificate'] = $variables;
        $options['book_number'] = gv($params, 'book_number');
        $transfer_certificate->options = $options;
        $transfer_certificate->save();
    }

    private function getTransferCertificate(StudentRecord $student_record)
    {
        $transfer_certificate = $this->transfer_certificate->firstOrCreate([
            'student_record_id' => $student_record->id,
        ]);

        $transfer_certificate->uuid = $transfer_certificate->uuid ? : Str::uuid();
        $transfer_certificate->options = $transfer_certificate->options ? : [];
        $transfer_certificate->save();

        return $transfer_certificate;
    }
}
