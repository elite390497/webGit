<?php
namespace App\Repositories\Auth;

use Carbon\Carbon;
use App\Jobs\SendSMS;
use App\Events\UserLogin;
use Illuminate\Support\Str;
use App\Models\Student\Student;
use App\Notifications\Activated;
use App\Models\Employee\Employee;
use App\Notifications\PasswordReset;
use App\Notifications\PasswordResetted;
use App\Repositories\Auth\UserRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Utility\IpFilterRepository;
use App\Repositories\Auth\LoginThrottleRepository;
use App\Repositories\Auth\TwoFactorSecurityRepository;
use App\Repositories\Academic\AcademicSessionRepository;
use App\Repositories\Configuration\ConfigurationRepository;

class AuthRepository
{
    protected $user;
    protected $throttle;
    protected $two_factor;
    protected $config;
    protected $ip_filter;
    protected $academic_session;
    protected $student;
    protected $employee;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        UserRepository $user,
        LoginThrottleRepository $throttle,
        TwoFactorSecurityRepository $two_factor,
        ConfigurationRepository $config,
        IpFilterRepository $ip_filter,
        AcademicSessionRepository $academic_session,
        Student $student,
        Employee $employee
    ) {
        $this->user       = $user;
        $this->throttle   = $throttle;
        $this->two_factor = $two_factor;
        $this->config     = $config;
        $this->ip_filter  = $ip_filter;
        $this->academic_session = $academic_session;
        $this->student = $student;
        $this->employee = $employee;
    }

    /**
     * Authenticate an user.
     *
     * @param array $params
     * @return array
     */
    public function auth($params = array())
    {
        $email_or_username = gv($params, 'email_or_username');

        $this->throttle->validate();

        $token = $this->validateLogin($params);

        if (filter_var($email_or_username, FILTER_VALIDATE_EMAIL)) {
            $auth_user = $this->user->findByEmail($email_or_username);
        } else {
            $auth_user = $this->user->findByUsername($email_or_username);
        }

        $name = $this->validateStatus($auth_user);

        event(new UserLogin($auth_user));

        $two_factor_code = $this->two_factor->set($auth_user);

        $this->checkPreference($auth_user);

        $auth_user = $auth_user->fresh();
        $payload = auth()->payload();

        return $this->prepareLoginData([
            'token' => $token,
            'name' => $name,
            'expires_on' => $payload->get('exp'),
            'auth_user' => $auth_user
        ]);
    }

    public function checkPreference($auth_user)
    {
        $user_preference = $auth_user->userPreference;

        if (!isset($user_preference) || $user_preference === '' || $user_preference === null) {
            $user_preference = new \App\UserPreference;
            $user_preference->user()->associate($auth_user);
            $user_preference->save();
        }

        $user_preference->color_theme = ($user_preference->color_theme) ? : config('config.color_theme');
        $user_preference->direction = ($user_preference->direction) ? : config('config.direction');
        $user_preference->locale = ($user_preference->locale) ? : config('config.locale');
        $user_preference->sidebar = ($user_preference->sidebar) ? : config('config.sidebar');
        $user_preference->academic_session_id = $user_preference->academic_session_id ? : optional($this->academic_session->default())->id;
        $user_preference->save();
    }

    /**
     * Validate login credentials.
     *
     * @param array $params
     * @return auth token
     */
    public function validateLogin($params = array())
    {
        $email_or_username = gv($params, 'email_or_username');
        $password          = gv($params, 'password');

        if (filter_var($email_or_username, FILTER_VALIDATE_EMAIL)) {
            $credentials = array('email' => $email_or_username, 'password' => $password);
        } else {
            $credentials = array('username' => $email_or_username, 'password' => $password);
        }

        $ttl = request('device_name') ? config('config.mobile_token_lifetime') : config('config.token_lifetime');

        if (! $token = auth()->setTTL($ttl)->attempt($credentials)) {
            $this->throttle->update();

            throw ValidationException::withMessages(['email_or_username' => trans('auth.failed')]);
        }

        $this->throttle->clearCache();

        return $token;
    }

    /**
     * Validate authenticated user status.
     *
     * @param authenticated user
     * @return null
     */
    public function validateStatus($auth_user)
    {
        if ($auth_user->status === 'pending_activation') {
            throw ValidationException::withMessages(['email_or_username' => trans('auth.pending_activation')]);
        }

        if ($auth_user->status === 'pending_approval') {
            throw ValidationException::withMessages(['email_or_username' => trans('auth.pending_approval')]);
        }

        if ($auth_user->status === 'disapproved') {
            throw ValidationException::withMessages(['email_or_username' => trans('auth.not_activated')]);
        }

        if ($auth_user->status === 'banned') {
            throw ValidationException::withMessages(['email_or_username' => trans('auth.account_banned')]);
        }

        if ($auth_user->status != 'activated') {
            throw ValidationException::withMessages(['email_or_username' => trans('auth.not_activated')]);
        }

        if (!$auth_user->hasPermissionTo('enable-login')) {
            throw ValidationException::withMessages(['email_or_username' => trans('auth.login_permission_disabled')]);
        }

        $user_roles = $auth_user->getRoleNames()->all();

        if (in_array(config('system.default_role.student'), $user_roles)) {
            $student = $auth_user->Student;

            $valid_student = $this->student->filterById($student->id)->whereHas('studentRecords', function ($q) {
                $q->whereNull('date_of_exit')->whereIsPromoted(0);
            })->first();

            if (! $valid_student) {
                throw ValidationException::withMessages(['email_or_username' => trans('student.login_permission_disabled')]);
            }

            return $student->name;
        } elseif (in_array(config('system.default_role.parent'), $user_roles)) {
            $parent = $auth_user->Parent;
            $student_ids = $parent->Students->pluck('id')->all();

            $valid_student = $this->student->whereIn('id', $student_ids)->whereHas('studentRecords', function ($q) {
                $q->whereNull('date_of_exit')->whereIsPromoted(0);
            })->count();

            if (! $valid_student) {
                throw ValidationException::withMessages(['email_or_username' => trans('student.login_permission_disabled')]);
            }

            return $parent->first_guardian_name;
        } elseif (
            count(array_diff($user_roles, [config('system.default_role.admin'),config('system.default_role.student'),config('system.default_role.parent')]))
        ) {
            $employee = $auth_user->Employee;

            $valid_employee = $this->employee->filterById($employee->id)->whereHas('employeeTerms', function ($q) {
                $q->whereNull('date_of_leaving');
            })->first();

            if (! $valid_employee) {
                throw ValidationException::withMessages(['email_or_username' => trans('employee.login_permission_disabled')]);
            }

            return $employee->name;
        } else {
            return optional($auth_user->Employee)->name;
        }
    }

    /**
     * Get user for OTP
     * @param  numeric $mobile
     * @return User|void
     */
    private function getUserForOTP($mobile)
    {
        $user = \App\User::whereHas('employee', function($q) use($mobile) {
            $q->where('contact_number', $mobile)
                ->orWhere('alternate_contact_number', $mobile);
        })->first();

        if ($user) {
            return $user;
        }

        $user = \App\User::whereHas('student', function($q) use($mobile) {
            $q->where('contact_number', $mobile);
        })->first();

        if ($user) {
            return $user;
        }

        $user = \App\User::whereHas('parent', function($q) use($mobile) {
            $q->where('first_guardian_contact_number_1', $mobile)
                ->orWhere('first_guardian_contact_number_2', $mobile)
                ->orWhere('second_guardian_contact_number_1', $mobile)
                ->orWhere('second_guardian_contact_number_2', $mobile);
        })->first();

        if ($user) {
            return $user;
        }

        throw ValidationException::withMessages(['message' => trans('auth.could_not_find_user_with_mobile')]);
    }

    /**
     * Generate OTP
     * @param  numeric $mobile
     * @return void
     */
    private function generateOTP($mobile)
    {
        $key = 'otp_from_mobile_'.$mobile;

        if (\Cache::has($key)) {
            \Cache::increment($key, 1);
        } else {
            \Cache::put($key, 1, 5 * 10);
        }

        if (\Cache::get($key) > 3) {
            throw ValidationException::withMessages(['message' => trans('auth.max_otp_request_limit_crossed')]);
        }

        $user = $this->getUserForOTP($mobile);

        $otp = generateOTP();
        
        $sms = 'Your login OTP is '.$otp.'. Do not share OTP with any one. '. config('app.name');
        if ($mobile) {
            SendSMS::dispatch([$mobile], $sms);
        }

        \Cache::put('otp_'.$user->id, $otp, 10 * 60);
    }

    /**
     * Check OTP
     * @param  array $params
     * @return array
     */
    public function otp($params = array())
    {
        if (! config('config.login_with_otp')) {
            throw ValidationException::withMessages(['message' => trans('general.permission_denied')]);
        }

        $mobile = gv($params, 'mobile');
        $otp = gv($params, 'otp');

        if (! $otp) {
            $this->generateOTP($mobile);

            return -1;
        }

        $auth_user = $this->getUserForOTP($mobile);

        if ($otp != \Cache::get('otp_'.$auth_user->id)) {
            throw ValidationException::withMessages(['message' => trans('auth.invalid_otp')]);
        }

        \Cache::forget('otp_'.$auth_user->id);
        \Cache::forget('otp_from_mobile_'.$mobile);

        $ttl = request('device_name') ? config('config.mobile_token_lifetime') : config('config.token_lifetime');

        $token = auth()->setTTL($ttl)->login($auth_user);

        $name = $this->validateStatus($auth_user);

        event(new UserLogin($auth_user));

        $this->checkPreference($auth_user);
        $payload = auth()->payload();

        return $this->prepareLoginData([
            'token' => $token,
            'name' => $name,
            'expires_on' => $payload->get('exp'),
            'auth_user' => $auth_user
        ]);
    }

    /**
     * Prepare login data
     * @param  array  $params
     * @return array
     */
    private function prepareLoginData($params = array())
    {
        $auth_user                   = $params['auth_user'];
        $token                       = $params['token'];
        $name                        = $params['name'];
        $auth_user->user_roles       = $auth_user->roles()->pluck('name')->all();
        $auth_user->user_permissions = $auth_user->getAllPermissions()->pluck('name')->all();

        \Cache::put('locale', $auth_user->userPreference->locale, 1440 * 60);
        \Cache::put('direction', $auth_user->userPreference->direction, 1440 * 60);

        $reload = (config('app.locale') != cache('locale') || config('config.direction') != cache('direction')) ? 1 : 0;

        $config            = $this->config->getConfig();
        $academic_sessions = $this->academic_session->getAll();
        $default_academic_session = $auth_user->userPreference->academic_session_id ? $auth_user->userPreference->academicSession : $academic_sessions->firstWhere('is_default',1);

        activity('login')->log('login');

        $auth_user['name'] = $name;

        return [
            'message'           => trans('auth.logged_in'),
            'token'             => $token,
            'expires_on'        => Carbon::createFromTimestamp(gv($params, 'expires_on'))->toDateTimeString(),
            'user'              => $auth_user,
            'reload'            => $reload,
            'config'            => $config,
            'academic_sessions' => $academic_sessions,
            'default_academic_session' => $default_academic_session
        ];
    }

    /**
     * Get configuration
     * @return array
     */
    public function getConfig()
    {
        return $this->config->getConfig();
    }

    /**
     * Check for registration availability.
     *
     * @return null
     */
    public function validateRegistrationStatus()
    {
        if (! config('config.registration')) {
            throw ValidationException::withMessages(['message' => trans('general.feature_not_available')]);
        }
    }

    /**
     * Check for email verification availability.
     *
     * @return null
     */
    public function validateEmailVerificationStatus()
    {
        if (! config('config.email_verification')) {
            throw ValidationException::withMessages(['message' => trans('general.feature_not_available')]);
        }
    }

    /**
     * Check for account approval availability.
     *
     * @return null
     */
    public function validateAccountApprovalStatus()
    {
        if (! config('config.account_approval')) {
            throw ValidationException::withMessages(['message' => trans('general.feature_not_available')]);
        }
    }

    /**
     * Check for reset password availability.
     *
     * @return null
     */
    public function validateResetPasswordStatus()
    {
        if (! config('config.reset_password')) {
            throw ValidationException::withMessages(['message' => trans('general.feature_not_available')]);
        }
    }

    /**
     * Validate user for reset password.
     *
     * @param email $email
     * @return User
     */
    public function validateUserAndStatusForResetPassword($email = null)
    {
        $user = $this->user->findByEmail($email);

        if (! $user) {
            throw ValidationException::withMessages(['email' => trans('passwords.user')]);
        }

        if ($user->status != 'activated') {
            throw ValidationException::withMessages(['email' => trans('passwords.account_not_activated')]);
        }

        return $user;
    }

    /**
     * Request password reset token of user.
     *
     * @param array
     * @return null
     */
    public function password($params = array())
    {
        $email = gv($params, 'email');

        $this->validateResetPasswordStatus();

        $user = $this->validateUserAndStatusForResetPassword($email);

        $token = rand(100000, 99999999);
        \DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        $user->notify(new PasswordReset($user, $token));
    }

    /**
     * Validate reset password token.
     *
     * @param string $token
     * @param email $email
     * @return null
     */
    public function validateResetPasswordToken($token, $email)
    {
        $reset = \DB::table('password_resets')->where('email', '=', $email)->where('token', '=', $token)->first();

        if (! $reset) {
            throw ValidationException::withMessages(['message' => trans('passwords.token')]);
        }

        if (date("Y-m-d H:i:s", strtotime($reset->created_at . "+".config('config.reset_password_token_lifetime')." minutes")) < date('Y-m-d H:i:s')) {
            throw ValidationException::withMessages(['email' => trans('passwords.token_expired')]);
        }
    }

    /**
     * Reset password of user.
     *
     * @param array
     * @return null
     */
    public function reset($params = array())
    {
        $email = gv($params, 'email');
        $token = gv($params, 'token');
        $password = gv($params, 'password');

        $this->validateResetPasswordStatus();
    
        $user = $this->validateUserAndStatusForResetPassword($email);

        $this->validateResetPasswordToken($token, $email);

        $this->resetPassword($password, $user);

        \DB::table('password_resets')->where('email', '=', $email)->where('token', '=', $token)->delete();

        $user->notify(new PasswordResetted($user));
    }

    /**
     * Update user password.
     *
     * @param string $password
     * @param User $user
     * @return null
     */
    public function resetPassword($password, $user = null)
    {
        $user = ($user) ? : \Auth::user();
        $user->password = bcrypt($password);
        $user->save();
    }

    /**
     * Validate current password of user.
     *
     * @param string $password
     * @return null
     */
    public function validateCurrentPassword($password)
    {
        if (!\Hash::check($password, \Auth::user()->password)) {
            throw ValidationException::withMessages(['password' => trans('passwords.lock_screen_password_mismatch')]);
        }
    }

    /**
     * Validate two factor security.
     *
     * @param numeric $two_factor_code
     * @return null
     */
    public function security($two_factor_code)
    {
        $user = \Auth::user();

        if ($two_factor_code != \Cache::get('tfc_'.$user->id)) {
            throw ValidationException::withMessages(['message' => trans('auth.invalid_two_factor_code')]);
        }
    }
}