<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class IpRestrictedException extends ExceptionHandler
{
    /**
     * Report the exception.
     *
     * @return void
     */
    public function report(Throwable $exception)
    {
        //
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        return view()->make('errors.ip-restricted');
    }
}