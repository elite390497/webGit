<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.generate_payroll')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/payroll/list')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.list_payroll')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
                    <payroll-form></payroll-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import payrollForm from './form';

    export default {
        components : { payrollForm },
        data() {
            return {
            }
        },
        mounted(){
            if(!helper.hasPermission('generate-payroll')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
