<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.social_network')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/dashboard')"><i class="fas fa-home"></i> <span class="d-none d-sm-inline">{{trans('general.home')}}</span></button>
                        <help-button @clicked="help_topic = 'configuration.social_network'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.social_network_link',{name: "Facebook"})}}</label>
                                    <input class="form-control" type="text" v-model="configForm.facebook_link" name="facebook_link" :placeholder="trans('configuration.facebook_link')">
                                    <show-error :form-name="configForm" prop-name="facebook_link"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.social_network_link',{name: "Twitter"})}}</label>
                                    <input class="form-control" type="text" v-model="configForm.twitter_link" name="twitter_link" :placeholder="trans('configuration.twitter_link')">
                                    <show-error :form-name="configForm" prop-name="twitter_link"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.social_network_link',{name: "LinkedIn"})}}</label>
                                    <input class="form-control" type="text" v-model="configForm.linkedin_link" name="linkedin_link" :placeholder="trans('configuration.linkedin_link')">
                                    <show-error :form-name="configForm" prop-name="linkedin_link"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.social_network_link',{name: "Google Plus"})}}</label>
                                    <input class="form-control" type="text" v-model="configForm.google_plus_link" name="google_plus_link" :placeholder="trans('configuration.google_plus_link')">
                                    <show-error :form-name="configForm" prop-name="google_plus_link"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.social_network_link',{name: "Youtube"})}}</label>
                                    <input class="form-control" type="text" v-model="configForm.youtube_link" name="youtube_link" :placeholder="trans('configuration.youtube_link')">
                                    <show-error :form-name="configForm" prop-name="youtube_link"></show-error>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    export default {
        components : { },
        data() {
            return {
                configForm: new Form({
                    facebook_link: '',
                    twitter_link: '',
                    linkedin_link: '',
                    google_plus_link: '',
                    youtube_link: '',
                    config_type: ''
                },false),
                help_topic: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getConfiguration();
        },
        methods: {
            getConfiguration(){
                let loader = this.$loading.show();
                axios.get('/api/configuration')
                    .then(response => {
                        this.configForm = helper.formAssign(this.configForm, response);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            submit(){
                let loader = this.$loading.show();
                this.configForm.config_type = 'social_network';
                this.configForm.post('/api/configuration')
                    .then(response => {
                        this.$store.dispatch('setConfig',{loaded: false});
                        toastr.success(response.message);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
