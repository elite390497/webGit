<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.salary_structure')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/payroll/salary')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.salary_structure')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <salary-structure-form></salary-structure-form>
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
