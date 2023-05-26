<?php

namespace App\Http\Controllers\Student;

use Illuminate\Http\Request;
use App\Models\Student\Student;
use App\Http\Controllers\Controller;
use App\Repositories\Upload\UploadRepository;
use App\Repositories\Student\StudentRepository;
use App\Http\Requests\Student\StudentQualificationRequest;
use App\Repositories\Student\StudentQualificationRepository;

class StudentQualificationController extends Controller
{
    protected $request;
    protected $repo;
    protected $student;
    protected $upload;
    protected $module = 'student_qualification';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        StudentQualificationRepository $repo,
        StudentRepository $student,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->student = $student;
        $this->upload = $upload;
    }

    /**
     * Used to get all student qualifications
     * @get ("/api/student/{uuid}/qualification")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     * })
     * @return Response
     */
    public function index($uuid)
    {
        $this->authorize('list', Student::class);

        $student = $this->student->findByUuidOrFail($uuid);

        return $this->ok($this->repo->paginate($student->id, $this->request->all()));
    }

    /**
     * Used to store student qualification
     * @post ("/api/student/{uuid}/qualification")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("standard", type="string", required="true", description="Standard of Qualification"),
     *      @Parameter("institute_name", type="string", required="true", description="Institute Name of Qualification"),
     *      @Parameter("board_name", type="string", required="optional", description="Board Name of Qualification"),
     *      @Parameter("start_period", type="year-month", required="true", description="Start Period of Qualification"),
     *      @Parameter("end_period", type="year-month", required="true", description="End Period of Qualification"),
     *      @Parameter("result", type="string", required="true", description="Result of Qualification"),
     *      @Parameter("description", type="text", required="optional", description="Description of Qualification")
     * })
     * @return Response
     */
    public function store(StudentQualificationRequest $request, $uuid)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_qualification = $this->repo->create($student->id, $this->request->all());

        return $this->success(['message' => trans('student.qualification_added')]);
    }

    /**
     * Used to get Student Qualification detail
     * @get ("/api/student/{uuid}/qualification/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     * })
     * @return Response
     */
    public function show($uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_qualification = $this->repo->findOrFail($student->id, $id);

        $attachments = $this->upload->getAttachment($this->module, $student_qualification->id);

        return $this->success(compact('student_qualification', 'attachments'));
    }

    /**
     * Used to update Student Qualification
     * @patch ("/api/student/{uuid}/qualification/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     *      @Parameter("standard", type="string", required="true", description="Standard of Qualification"),
     *      @Parameter("institute_name", type="string", required="true", description="Institute Name of Qualification"),
     *      @Parameter("board_name", type="string", required="optional", description="Board Name of Qualification"),
     *      @Parameter("start_period", type="year-month", required="true", description="Start Period of Qualification"),
     *      @Parameter("end_period", type="year-month", required="true", description="End Period of Qualification"),
     *      @Parameter("result", type="string", required="true", description="Result of Qualification"),
     *      @Parameter("description", type="text", required="optional", description="Description of Qualification")
     * })
     * @return Response
     */
    public function update(StudentQualificationRequest $request, $uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_qualification = $this->repo->findOrFail($student->id, $id);

        $student_qualification = $this->repo->update($student_qualification, $this->request->all());

        return $this->success(['message' => trans('student.qualification_updated')]);
    }

    /**
     * Used to delete Student Qualification
     * @delete ("/api/student/{uuid}/qualification/{id}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     * })
     * @return Response
     */
    public function destroy($uuid, $id)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_qualification = $this->repo->findOrFail($student->id, $id);

        $this->upload->delete($this->module, $student_qualification->id);

        $this->repo->delete($student_qualification);

        return $this->success(['message' => trans('student.qualification_deleted')]);
    }

    /**
     * Used to download Student Qualification
     * @get ("/student/{uuid}/download/{id}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
     *      @Parameter("id", type="integer", required="true", description="Id of Qualification"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $id, $attachment_uuid)
    {
        $student = $this->student->findByUuidOrFail($uuid);

        $this->authorize('update', Student::class);

        $student_qualification = $this->repo->findOrFail($student->id, $id);

        $attachment = $this->upload->getAttachment($this->module, $student_qualification->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
