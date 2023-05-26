<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.edit_salary_structure')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/payroll/salary')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.salary_structure')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <salary-structure-form :uuid="uuid"></salary-structure-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import salaryStructureForm from './form';

    export default {
        components : { salaryStructureForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('define-employee-salary')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
