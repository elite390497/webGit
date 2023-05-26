<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Employee\Attendance;
use App\Http\Controllers\Controller;
use App\Repositories\Employee\AttendanceRepository;

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
     * Used to get pre requisites
     * @get ("/api/employee/attendance/regular/pre-requisite")
     * @return Response
     */
    public function preRequisiteRegular()
    {
        $this->authorize('preRequisite', Attendance::class);

        return $this->success($this->repo->preRequisiteRegular());
    }

    /**
     * Used to get pre requisites of production attendance
     * @get ("/api/employee/attendance/production/pre-requisite")
     * @return Response
     */
    public function preRequisiteProduction()
    {
        $this->authorize('preRequisite', Attendance::class);

        return $this->success($this->repo->preRequisiteProduction());
    }

    /**
     * Used to get attendance
     * @get ("/api/employee/attendance/regular")
     * @return Response
     */
    public function listRegular()
    {
        $this->authorize('list', Attendance::class);

        return $this->success($this->repo->listRegular($this->request->all()));
    }

    /**
     * Used to fetch employee and their attendance
     * @post ("/api/employee/attendance/regular/fetch")
     * @return Response
     */
    public function fetchRegular()
    {
        $this->authorize('preRequisite', Attendance::class);

        return $this->success($this->repo->fetchRegular($this->request->all()));
    }

    /**
     * Used to fetch employee attendance for production
     * @post ("/api/employee/attendance/production/fetch")
     * @return Response
     */
    public function fetchProduction()
    {
        $this->authorize('preRequisite', Attendance::class);

        return $this->success($this->repo->fetchProduction($this->request->all()));
    }

    /**
     * Used to store employees' regular attendance
     * @post ("/api/employee/attendance/regular")
     * @return Response
     */
    public function storeRegular()
    {
        $this->authorize('create', Attendance::class);

        $this->repo->storeRegular($this->request->all());

        return $this->success(['message' => trans('employee.attendance_updated')]);
    }

    /**
     * Used to store employees' production attendance
     * @post ("/api/employee/attendance/production")
     * @return Response
     */
    public function storeProduction()
    {
        $this->authorize('create', Attendance::class);

        $this->repo->storeProduction($this->request->all());

        return $this->success(['message' => trans('employee.attendance_updated')]);
    }
}