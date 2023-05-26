<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('employee.employee')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.employee_list')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.employee_module_description')}}</p>
                            <router-link to="/employee/card-view" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.employee_list')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.attendance')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.attendance_module_description')}}</p>
                            <router-link to="/employee/attendance" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.attendance')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.leave')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.leave_module_description')}}</p>
                            <router-link to="/employee/leave" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.leave')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.payroll')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.payroll_module_description')}}</p>
                            <router-link to="/employee/payroll" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.payroll')})}}</router-link>
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