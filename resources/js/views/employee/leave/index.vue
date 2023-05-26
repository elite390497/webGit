<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('employee.leave')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3" v-if="hasPermission('manage-leave-allocation')">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.leave_allocation')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.leave_allocation_module_description')}}</p>
                            <router-link to="/employee/leave/allocation" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.leave_allocation')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.leave_request')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.leave_request_module_description')}}</p>
                            <router-link to="/employee/leave/request" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.leave_request')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            }
        }
    }
</script>