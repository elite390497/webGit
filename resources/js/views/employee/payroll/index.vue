<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('employee.payroll')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3" v-if="hasPermission('manage-payroll-template')">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.payroll_template')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.payroll_template_module_description')}}</p>
                            <router-link to="/employee/payroll/template" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.payroll_template')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="hasPermission('define-employee-salary')">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.salary_structure')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.salary_structure_module_description')}}</p>
                            <router-link to="/employee/payroll/salary" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.salary_structure')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="hasPermission('list-payroll')">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.payroll')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.payroll_module_description')}}</p>
                            <router-link to="/employee/payroll/list" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.payroll')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="hasPermission('list-payroll-transaction')">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('employee.payroll_transaction')}}</h4>
                            <p class="card-text font-80pc">{{trans('employee.payroll_transaction_module_description')}}</p>
                            <router-link to="/employee/payroll/transaction" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.payroll_transaction')})}}</router-link>
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