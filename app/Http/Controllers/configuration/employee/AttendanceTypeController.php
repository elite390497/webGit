<?php

namespace App\Http\Controllers\Configuration\Employee;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Employee\AttendanceTypeRequest;
use App\Repositories\Configuration\Employee\AttendanceTypeRepository;

class AttendanceTypeController extends Controller
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
        AttendanceTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Employee Attendance Types
     * @get ("/api/employee/attendance/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Employee Attendance Types
     * @post ("/api/employee/attendance/type/print")
     * @return Response
     */
    public function print()
    {
        $employee_attendance_types = $this->repo->print(request('filter'));

        return view('print.configuration.employee.attendance-type', compact('employee_attendance_types'))->render();
    }

    /**
     * Used to generate pdf all Employee Attendance Types
     * @post ("/api/employee/attendance/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $employee_attendance_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.employee.attendance-type', compact('employee_attendance_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Employee Attendance Type
     * @post ("/api/employee/attendance/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Employee Attendance Type"),
     *      @Parameter("alias", type="string", required="true", description="Alias of Employee Attendance Type"),
     *      @Parameter("type", type="string", required="true", description="Type of Employee Attendance Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Attendance Type")
     * })
     * @return Response
     */
    public function store(AttendanceTypeRequest $request)
    {
        $employee_attendance_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('employee.attendance_type_added')]);
    }

    /**
     * Used to get Employee Attendance Type detail
     * @get ("/api/employee/attendance/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Attendance Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Employee Attendance Type
     * @patch ("/api/employee/attendance/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Attendance Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Employee Attendance Type"),
     *      @Parameter("alias", type="string", required="true", description="Alias of Employee Attendance Type"),
     *      @Parameter("type", type="string", required="true", description="Type of Employee Attendance Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Employee Attendance Type")
     * })
     * @return Response
     */
    public function update($id, AttendanceTypeRequest $request)
    {
        $employee_attendance_type = $this->repo->findOrFail($id);

        $employee_attendance_type = $this->repo->update($employee_attendance_type, $this->request->all());

        return $this->success(['message' => trans('employee.attendance_type_updated')]);
    }

    /**
     * Used to delete Employee Attendance Type
     * @delete ("/api/employee/attendance/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Employee Attendance Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $employee_attendance_type = $this->repo->deletable($id);

        $this->repo->delete($employee_attendance_type);

        return $this->success(['message' => trans('employee.attendance_type_deleted')]);
    }
}
