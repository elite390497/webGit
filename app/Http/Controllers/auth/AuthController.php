<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\OtpRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Academic\AcademicSession;
use App\Repositories\Auth\AuthRepository;
use App\Repositories\Auth\UserRepository;
use App\Http\Requests\Auth\PasswordRequest;
use App\Http\Requests\Auth\TwoFactorRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Repositories\Configuration\ConfigurationRepository;

class AuthController extends Controller
{
    protected $request;
    protected $repo;
    protected $user;
    protected $module = 'user';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        AuthRepository $repo,
        UserRepository $user
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->user = $user;
        
        $this->middleware('prohibited.test.mode')->only('changePassword');
    }

    /**
     * Used to authenticate user
     * @post ("/api/auth/login")
     * @param ({
     *      @Parameter("email_or_username", type="string", required="true", description="Email or Username of User"),
     *      @Parameter("password", type="password", required="true", description="Password of User"),
     * })
     * @return authentication token
     */
    public function login(LoginRequest $request)
    {
        $data = $this->repo->auth($this->request->all());

        return $this->success($data);
    }

    /**
     * Used to authenticate user
     * @post ("/api/auth/login/otp")
     * @param ({
     *      @Parameter("mobile", type="numeric", required="true", description="Mobile of User"),
     * })
     * @return authentication token
     */
    public function otp(OtpRequest $request)
    {
        $data = $this->repo->otp($this->request->all());

        if ($data === -1) {
            return $this->success(['message' => trans('auth.otp_generated')]);
        }

        return $this->success($data);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return $this->success(auth()->user());
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->success(auth()->refresh());
    }

    /**
     * Used to logout user
     * @post ("/api/auth/logout")
     * @return Response
     */
    public function logout()
    {
        $auth_user = auth()->user();

        \Cache::forget('direction');
        \Cache::forget('locale');

        activity('logout')->log('logout');

        auth()->logout();

        return $this->success(['message' => trans('auth.logged_out'), 'config' => $this->repo->getConfig()]);
    }

    /**
     * Used to request password reset token for user
     * @post ("/api/auth/password")
     * @param ({
     *      @Parameter("email", type="email", required="true", description="Registered Email of User"),
     * })
     * @return Response
     */
    public function password(PasswordRequest $request)
    {
        $this->repo->password($this->request->all());

        return $this->success(['message' => trans('passwords.sent')]);
    }

    /**
     * Used to validate user password
     * @post ("/api/auth/validate-password-reset")
     * @param ({
     *      @Parameter("token", type="string", required="true", description="Reset Password Token"),
     * })
     * @return Response
     */
    public function validatePasswordReset()
    {
        $this->repo->validateResetPasswordToken(request('token'), request('email'));

        return $this->success(['message' => '']);
    }

    /**
     * Used to reset user password
     * @post ("/api/auth/reset")
     * @param ({
     *      @Parameter("token", type="string", required="true", description="Reset Password Token"),
     *      @Parameter("email", type="email", required="true", description="Email of User"),
     *      @Parameter("password", type="password", required="true", description="New Password of User"),
     *      @Parameter("password_confirmation", type="password", required="true", description="New Confirm Password of User"),
     * })
     * @return Response
     */
    public function reset(ResetPasswordRequest $request)
    {
        $this->repo->reset($this->request->all());

        return $this->success(['message' => trans('passwords.reset')]);
    }

    /**
     * Used to change user password
     * @post ("/api/change-password")
     * @param ({
     *      @Parameter("current_password", type="password", required="true", description="Current Password of User"),
     *      @Parameter("new_password", type="password", required="true", description="New Password of User"),
     *      @Parameter("new_password_confirmation", type="password", required="true", description="New Confirm Password of User"),
     * })
     * @return Response
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        $this->repo->validateCurrentPassword(request('current_password'));

        $this->repo->resetPassword(request('new_password'));

        return $this->success(['message' => trans('passwords.change')]);
    }

    /**
     * Used to verify password during Screen Lock
     * @post ("/api/auth/lock")
     * @param ({
     *      @Parameter("password", type="password", required="true", description="Password of User"),
     * })
     * @return Response
     */
    public function lock(LoginRequest $request)
    {
        $this->repo->validateCurrentPassword(request('password'));

        return $this->success(['message' => trans('auth.lock_screen_verified')]);
    }

    /**
     * Used to verify two factor security
     * @post ("/api/auth/security")
     * @param ({
     *      @Parameter("two_factor_code", type="numeric", required="true", description="Two factor code"),
     * })
     * @return Response
     */
    public function security(TwoFactorRequest $request)
    {
        $this->repo->security(request('two_factor_code'));

        return $this->success(['message' => trans('auth.two_factor_security_verified')]);
    }
}
