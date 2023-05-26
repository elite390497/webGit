<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.mail_configuration')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/dashboard')"><i class="fas fa-home"></i> <span class="d-none d-sm-inline">{{trans('general.home')}}</span></button>
                        <help-button @clicked="help_topic = 'configuration.mail'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <mail-form></mail-form>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import mailForm from './form'

    export default {
        components: {mailForm},
        data(){
            return {
                help_topic: ''
            }
        }
    }
</script>
