<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\UnauthorizedException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function report(Throwable $exception)
    {
        if (app()->bound('sentry') && $this->shouldReport($exception)) {
            app('sentry')->captureException($exception);
        }
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof FileNotFoundException) {
            return response()->view('errors.file-not-found', compact('exception'), 500);
        } else if ($exception instanceof AuthenticationException) {
            return response()->json(['message' => trans('auth.session_expired'), 'login' => 1], 401);
        } else if ($exception instanceof AuthorizationException) {
            return response()->json(['message' => trans('user.permission_denied')], 403);
        } else if ($exception instanceof UnauthorizedException) {
            return response()->json(['message' => trans('user.permission_denied')], 403);
        } else if ($exception instanceof MethodNotAllowedHttpException) {
            return response()->json(['message' => trans('general.something_wrong')], 403);
        }

        return parent::render($request, $exception);
    }
}
