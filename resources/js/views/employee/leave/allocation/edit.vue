<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.edit_leave_allocation')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/leave/allocation')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.leave_allocation')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <leave-allocation-form :uuid="uuid"></leave-allocation-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import leaveAllocationForm from './form';

    export default {
        components : { leaveAllocationForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('manage-leave-allocation')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
