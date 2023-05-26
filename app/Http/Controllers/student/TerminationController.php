<?php

namespace App\Http\Controllers\Student;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Calendar\Holiday;
use App\Http\Controllers\Controller;
use App\Models\Student\StudentRecord;
use App\Models\Student\TransferCertificate;
use App\Repositories\Upload\UploadRepository;
use App\Http\Requests\Student\TerminationRequest;
use App\Repositories\Student\TerminationRepository;
use App\Repositories\Student\StudentRecordRepository;
use App\Models\Student\StudentAttendance as Attendance;
use App\Http\Requests\Student\TransferCertificateRequest;

class TerminationController extends Controller
{
    protected $request;
    protected $repo;
    protected $student_record;
    protected $transfer_certificate;
    protected $holiday;
    protected $attendance;
    protected $upload;
    protected $module = 'student_record';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        TerminationRepository $repo,
        StudentRecordRepository $student_record,
        TransferCertificate $transfer_certificate,
        Holiday $holiday,
        Attendance $attendance,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->student_record = $student_record;
        $this->transfer_certificate = $transfer_certificate;
        $this->holiday = $holiday;
        $this->attendance = $attendance;
        $this->upload = $upload;
    }

    /**
     * Used to get list of students who are terminated
     * @get ("/api/student/terminated")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', StudentRecord::class);

        $student_records = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('student_records', 'filters'));
    }

    /**
     * Used to print list of students who are terminated
     * @post ("/api/students/terminated/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', StudentRecord::class);

        $student_records = $this->repo->print(request('filter'));

        $filter = request('filter');

        return view('print.student.termination', compact('student_records', 'filter'))->render();
    }

    /**
     * Used to generate pdf of list of students who are terminated
     * @post ("/api/students/terminated/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', StudentRecord::class);

        $student_records = $this->repo->print(request('filter'));

        $filter = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.student.termination', compact('student_records', 'filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to print transfer certificate
     * @post ("/api/students/{uuid}/transfer-certificate/{record_id}/print")
     * @return Response
     */
    public function printTransferCertificate($uuid, $record_id)
    {
        $this->authorize('terminate', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $student_record->load('transferCertificate','student','student.parent','batch','batch.course','admission');

        return view('print.student.transfer-certificate', compact('student_record'))->render();
    }

    /**
     * Used to terminate student
     * @post ("/api/student/{uuid}/terminate/{record_id}")
     * @return Response
     */
    public function terminate(TerminationRequest $request, $uuid, $record_id)
    {
        $this->authorize('terminate', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $this->repo->terminate($student_record, $this->request->all());

        return $this->success(['message' => trans('student.terminated')]);
    }

    /**
     * Get attachment of termination
     * @get ("/api/student/{uuid}/terminate/{record_id}/attachment")
     * @return Response
     */
    public function terminateAttachment($uuid, $record_id)
    {
        $this->authorize('terminate', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $attachments = $this->upload->getAttachment($this->module, $student_record->id);

        return $this->success(compact('attachments'));
    }

    /**
     * Used to get transfer certificate of student
     * @get ("/api/student/{uuid}/transfer-certificate/{record_id}")
     * @return Response
     */
    public function getTransferCertificate($uuid, $record_id)
    {
        $this->authorize('terminate', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $student_record->load('transferCertificate','student','student.parent','batch','batch.course','admission');

        $data = getVar('data');
        $transfer_certificate_formats = gv($data, 'transfer_certificate_formats', []);
        $numbers = $this->transfer_certificate->whereNotNull('prefix')->groupBy('prefix')->get(['prefix', \DB::raw('MAX(number) as number')]);

        $last_date = config('config.default_academic_session.end_date');
        $start_date = config('config.default_academic_session.start_date') >= $student_record->date_of_entry ? config('config.default_academic_session.start_date') : $student_record->date_of_entry;
        $holidays = $this->holiday->filterBySession()->where('date','<=',$last_date)->count();
        $working_days = dateDiff(config('config.default_academic_session.start_date'), $last_date) - $holidays;

        $attendances = $this->attendance->dateOfAttendanceBetween(['start_date' => config('config.default_academic_session.start_date'), 'end_date' => $last_date])->filterByBatchId($student_record->batch_id)->get();

        $total_absent = 0;
        foreach ($attendances as $attendance) {
            $absentees = $attendance->getAttendance('data');
            if (searchByKey($absentees, 'id', $student_record->id)) {
                $total_absent++;
            }
        }
        $working_days = $attendances->count();
        $attendance = $working_days - $total_absent;

        return $this->ok(compact('student_record', 'transfer_certificate_formats','numbers','working_days','attendance'));
    }

    /**
     * Used to store transfer certificate of student
     * @post ("/api/student/{uuid}/transfer-certificate/{record_id}")
     * @return Response
     */
    public function transferCertificate(TransferCertificateRequest $request, $uuid, $record_id)
    {
        $this->authorize('terminate', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $record_id);

        $this->repo->transferCertificate($student_record, $this->request->all());

        return $this->success(['message' => trans('student.transfer_certificate_saved')]);
    }

    /**
     * Used to download Student Termination Attachment
     * @get ("/student/{uuid}/terminate/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Document"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $id, $attachment_uuid)
    {
        $this->authorize('terminate', StudentRecord::class);

        $student_record = $this->student_record->findByUuidOrFail($uuid, $id);

        $attachment = $this->upload->getAttachment($this->module, $student_record->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
