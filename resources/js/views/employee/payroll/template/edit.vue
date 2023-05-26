<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.edit_payroll_template')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/payroll/template')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.payroll_template')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <payroll-template-form :uuid="uuid"></payroll-template-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import payrollTemplateForm from './form';

    export default {
        components : { payrollTemplateForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('manage-payroll-template')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
