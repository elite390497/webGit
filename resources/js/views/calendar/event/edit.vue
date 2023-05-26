<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('calendar.edit_event')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/calendar/event')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('calendar.event')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body">
                    <event-form :uuid="uuid"></event-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import eventForm from './form';

    export default {
        components : { eventForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-event')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
