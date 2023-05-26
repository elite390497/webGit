<?php

namespace App\Providers;

use App\Traits\ModelRelation;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    use ModelRelation;
    
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        JsonResource::withoutWrapping();
        Schema::defaultStringLength(191);

        Activity::saving(function (Activity $activity) {
            $activity->properties = $activity->properties->put('ip', getClientIp());
            $activity->properties = $activity->properties->put('user_agent', \Request::header('User-Agent'));
        });
        
        Relation::morphMap($this->relations());
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
