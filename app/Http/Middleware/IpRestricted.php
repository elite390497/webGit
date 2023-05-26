<?php

namespace App\Http\Middleware;

use Closure;
use App\Exceptions\IpRestrictedException;
use App\Repositories\Utility\IpFilterRepository;

class IpRestricted
{
    protected $ip_filter;

    public function __construct(IpFilterRepository $ip_filter)
    {
        $this->ip_filter = $ip_filter;
    }

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
        if (!\Storage::exists('.app_installed')) {
            return $next($request);
        }

        $ip_filters = $this->ip_filter->getAll();

        if (config('config.ip_filter') && $ip_filters->count() && ! validateIp($ip_filters)) {
            throw new IpRestrictedException();
        }

        return $next($request);
    }
}
