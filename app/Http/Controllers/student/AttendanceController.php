<?php

namespace App\Http\Controllers\Student;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Student\StudentAttendance;
use App\Repositories\Student\AttendanceRepository;

class AttendanceController extends Controller
{
    protected $request;
    protected $repo;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        AttendanceRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisite
     * @get ("/api/student/attendance/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', StudentAttendance::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to fetch student and their attendance
     * @post ("/api/student/attendance/fetch")
     * @return Response
     */
    public function fetch()
    {
        $this->authorize('list', StudentAttendance::class);

        return $this->success($this->repo->fetch($this->request->all()));
    }

    /**
     * Used to store attendance
     * @post ("/api/student/attendance")
     * @return Response
     */
    public function store()
    {
        $this->authorize('store', StudentAttendance::class);

        $this->repo->store($this->request->all());

        return $this->success(['message' => trans('student.attendance_marked')]);
    }

    /**
     * Used to get all absentee students
     * @get ("/api/student/attendance/absentee")
     * @return Response
     */
    public function getAbsentee()
    {
        $this->authorize('list', StudentAttendance::class);

        $student_records = $this->repo->paginateAbsentee($this->request->all());

        $filters = $this->repo->getAbsenteeFilters();

        return $this->success(compact('student_records', 'filters'));
    }

    /**
     * Used to print all absentee students
     * @post ("/api/student/attendance/absentee/print")
     * @return Response
     */
    public function printAbsentee()
    {
        $this->authorize('list', StudentAttendance::class);

        $student_records = $this->repo->printAbsentee(request('filter'));

        $filter = request('filter');

        return view('print.student.absentee', compact('student_records', 'filter'))->render();
    }

    /**
     * Used to generate pdf all absentee students
     * @post ("/api/student/attendance/absentee/pdf")
     * @return Response
     */
    public function pdfAbsentee()
    {
        $this->authorize('list', StudentAttendance::class);

        $student_records = $this->repo->printAbsentee(request('filter'));

        $filter = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.student.absentee', compact('student_records', 'filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to send fee due via SMS
     * @post ("/api/student/attendance/absentee")
     * @return Response
     */
    public function sendSMSToAbsentee()
    {
        request()->validate([
            'sms' => 'required'
        ],[],[
            'sms' => trans('configuration.sms')
        ]);

        $this->repo->sendSMSToAbsentee($this->request->all());

        return $this->success(['message' => trans('communication.sms_submitted')]);
    }

    /**
     * Used to default attendance
     * @post ("/api/student/attendance/default")
     * @return Response
     */
    public function default()
    {
        $this->authorize('store', StudentAttendance::class);

        $this->repo->default($this->request->all());

        return $this->success(['message' => trans('student.attendance_updated')]);
    }

    /**
     * Used to delete attendance
     * @post ("/api/student/attendance/delete")
     * @return Response
     */
    public function destroy()
    {
        $this->authorize('store', StudentAttendance::class);

        $this->repo->delete($this->request->all());

        return $this->success(['message' => trans('student.attendance_removed')]);
    }

    /**
     * Used to get monthly student attendance
     * @get ("/api/student/{uuid}/record/{record_id}/attendance")
     * @return Response
     */
    public function studentMonthlyReport($uuid, $record_id)
    {
        $this->authorize('list', StudentAttendance::class);

        return $this->ok($this->repo->studentMonthlyReport($uuid, $record_id));
    }
}
