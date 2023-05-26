<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.edit_schedule')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/exam/schedule')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.schedule')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <exam-schedule-form :id="id"></exam-schedule-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import examScheduleForm from './form';

    export default {
        components : { examScheduleForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-exam-schedule')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
