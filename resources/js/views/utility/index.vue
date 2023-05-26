<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('utility.utility')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('utility.todo')}}</h4>
                            <p class="card-text font-80pc">{{trans('utility.todo_module_description')}}</p>
                            <router-link to="/utility/todo" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('utility.todo')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('utility.backup')}}</h4>
                            <p class="card-text font-80pc">{{trans('utility.backup_module_description')}}</p>
                            <router-link to="/utility/backup" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('utility.backup')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('utility.ip_filter')}}</h4>
                            <p class="card-text font-80pc">{{trans('utility.ip_filter_module_description')}}</p>
                            <router-link to="/utility/ip-filter" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('utility.ip_filter')})}}</router-link>
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