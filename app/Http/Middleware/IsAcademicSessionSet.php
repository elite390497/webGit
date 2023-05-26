<?php

namespace App\Http\Middleware;

use Closure;

class IsAcademicSessionSet
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
        $user_preference = \Auth::check() ? \Auth::user()->UserPreference : null;
        if ($user_preference && ! $user_preference->academic_session_id) {
            return response()->json(['error' => trans('academic.choose_session_detail')], 422);
        }

        return $next($request);
    }
}
