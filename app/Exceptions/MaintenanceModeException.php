<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class MaintenanceModeException extends ExceptionHandler
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
        return response()->json(['message' => config('config.maintenance_mode_message')], 422);

        return parent::render($request);
    }
}