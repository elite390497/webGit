<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('calendar.calendar')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('calendar.holiday')}}</h4>
                            <p class="card-text font-80pc">{{trans('calendar.holiday_module_description')}}</p>
                            <router-link to="/calendar/holiday" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('calendar.holiday')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('calendar.event')}}</h4>
                            <p class="card-text font-80pc">{{trans('calendar.event_module_description')}}</p>
                            <router-link to="/calendar/event" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('calendar.event')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('calendar.celebration')}}</h4>
                            <p class="card-text font-80pc">{{trans('calendar.birthday_module_description')}}</p>
                            <router-link to="/calendar/celebration/birthday" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('calendar.celebration')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>