<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.edit_visitor_log')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/reception/visitor/log')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('reception.visitor_log')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <visitor-log-form :uuid="uuid"></visitor-log-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import visitorLogForm from './form';

    export default {
        components : { visitorLogForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-visitor-log')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
