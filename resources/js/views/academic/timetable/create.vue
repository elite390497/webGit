<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.timetable')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/academic/timetable')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('academic.timetable')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <timetable-form @completed=""></timetable-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import timetableForm from './form'

    export default {
        components: {timetableForm},
        mounted(){
            if(!helper.hasPermission('create-timetable')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>