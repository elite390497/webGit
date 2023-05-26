<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.edit_leave_request')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/leave/request')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.leave_request')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <leave-request-form :uuid="uuid"></leave-request-form>
        </div>
    </div>
</template>

<script>
    import leaveRequestForm from './form';

    export default {
        components : { leaveRequestForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('request-leave')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
