<?php
namespace Mint\Service\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Employee\Employee;
use App\Models\Student\Admission;
use App\Http\Controllers\Controller;
use App\Models\Academic\AcademicSession;
use Illuminate\Validation\ValidationException;
use App\Repositories\Student\AttendanceRepository as StudentAttendanceRepository;

class AttendanceController extends Controller
{
	private $employee;
	private $admission;
	private $academic_session;
	private $student_attendance;

	public function __construct(
		Employee $employee, 
		Admission $admission, 
		AcademicSession $academic_session,
		StudentAttendanceRepository $student_attendance
	) {
		$this->employee = $employee;
		$this->admission = $admission;
		$this->academic_session = $academic_session;
		$this->student_attendance = $student_attendance;
	}

    /**
     * Used to get Biometric Attendance
     * @post ("/api/biometric")
     * @return Response
     */
	public function read()
	{
		$params = request()->all();

		$data = json_decode(gv($params, 'request_data'), true);
		$data = gv($data, 'ApiRequestInfo');

		$auth_token = gv($data, 'AuthToken');
		$user_id = gv($data, 'UserId');
		$date_time = gv($data, 'OperationTime');

		$response = $this->process($auth_token, $user_id, $date_time);

		return response()->json($response, 200);
	}

    /**
     * Used to get Biometric Attendance V2
     * @post ("/api/biometric/v2")
     * @return Response
     */
	public function readV2()
	{
		$params = request()->all();

		$auth_token = gv($params, 'auth_token');
		$user_id = gv($params, 'user_id');
		$date_time = gv($params, 'date_time');

		$response = $this->process($auth_token, $user_id, $date_time);

		return response()->json($response, 200);
	}

	/**
	 * User to process attendance
	 * @param  String $auth_token
	 * @param  integer $user_id
	 * @param  timestamp $date_time
	 * @return arr             [description]
	 */
	private function process($auth_token, $user_id, $date_time)
	{
		if (! $auth_token) {
			return ['status' => 'error', 'text' => 'missing auth token'];
		}

		if (! $user_id) {
			return ['status' => 'error', 'text' => 'missing user id'];
		}

		if (! $date_time) {
			return ['status' => 'error', 'text' => 'missing date time'];
		}

		$date_time = Carbon::createFromTimestampUTC($date_time);

        $text = 'Request received for User Id: '.$user_id;
        $text .= ' with Time: '.$date_time;
        $text .= ' at '.Carbon::now()->toDateTimeString();
        $text .= ($auth_token != config('config.biometric_auth_token')) ? (' Auth Token: '. $auth_token) : '';

		if ($date_time->toDateTimeString() > Carbon::now()) {
			$text .= ' Error: Invalid Time';
			$this->logApi($text);
			return ['status' => 'done'];
		}

		if (date('Y-m-d', strtotime($date_time->toDateTimeString())) != date('Y-m-d')) {
			$text .= ' Error: Attendance Expired';
			$this->logApi($text);
			return ['status' => 'done'];
		}

		if ($auth_token != explode(',', config('config.biometric_auth_token'))) {
			$text .= ' Error: Unauthorized Action';
			$this->logApi($text);
			return ['status' => 'done'];
		}

		$academic_session = $this->academic_session->where('start_date', '<=', today())->where('end_date', '>=', today())->first();

		// $employee = $this->employee->where(\DB::raw('concat_ws(prefix," ",LPAD(code, ' . config('config.employee_code_digit') . ', 0))'), '=', $user_id)->first();

		// if ($employee) {
		// 	$this->updateEmployeeAttendance($employee);
		// }

		$admissions = $this->admission->all()->pluck('id', 'admission_number')->all();

		if (isset($admissions[$user_id])) {
			$status = $this->student_attendance->updateApiAttendance([
				'admission_id'        => $admissions[$user_id], 
				'academic_session_id' => $academic_session->id,
				'date_time'           => $date_time->toDateTimeString()
			]);

			$text .= $status;
			$this->logApi($text);
		}

		return ['status' => 'done'];
	}

	/**
	 * Log Api data
	 * @param  string $text
	 * @return void
	 */
	private function logApi($text)
	{
        $file = 'biometric-api-log/'.date('Y-m-d').'.log';
        \Storage::append($file, $text);
	}
}