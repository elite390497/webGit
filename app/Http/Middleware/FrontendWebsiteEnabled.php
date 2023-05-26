<?php

namespace App\Http\Middleware;

use Closure;

class FrontendWebsiteEnabled
{
    /**
     * Used to check a feature is available or not.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  feature  type="string"  required="true"
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (! config('config.frontend_website')) {
            return response()->json(['error' => trans('general.invalid_action')], 422);
        }

        return $next($request);
    }
}
