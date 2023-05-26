<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('auth.authentication')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/dashboard')"><i class="fas fa-home"></i> <span class="d-none d-sm-inline">{{trans('general.home')}}</span></button>
                        <help-button @clicked="help_topic = 'configuration.authentication'"></help-button>
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
                                <div class="row">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('auth.token_lifetime')+' '+trans('auth.in_minute')}}</label>
                                            <input class="form-control" type="number" v-model="configForm.token_lifetime" name="token_lifetime" :placeholder="trans('auth.token_lifetime')">
                                            <show-error :form-name="configForm" prop-name="token_lifetime"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for=""><small>{{trans('auth.reset_password_token_lifetime')+' '+trans('auth.in_minute')}}</small></label>
                                            <input class="form-control" type="number" v-model="configForm.reset_password_token_lifetime" name="reset_password_token_lifetime" :placeholder="trans('auth.reset_password_token_lifetime')">
                                            <show-error :form-name="configForm" prop-name="reset_password_token_lifetime"></show-error>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('auth.reset_password')}}</label>
                                            <div>
                                                <switches v-model="configForm.reset_password" theme="bootstrap" color="success"></switches>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('auth.login_with_otp')}}</label>
                                            <div>
                                                <switches v-model="configForm.login_with_otp" theme="bootstrap" color="success"></switches>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('auth.two_factor_security')}}</label>
                                            <div>
                                                <switches v-model="configForm.two_factor_security" theme="bootstrap" color="success"></switches>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group" v-if="configForm.two_factor_security">
                                            <label for="">{{trans('auth.two_factor_security_method')}}</label>
                                            <div class="radio radio-info p-l-0">
                                                <div class="form-check form-check-inline ">
                                                    <input class="form-check-input" type="radio" value="sms" id="two_factor_security_via_sms" v-model="configForm.two_factor_security_method" :checked="configForm.two_factor_security_method == 'sms'" name="two_factor_security_method" @click="configForm.errors.clear('two_factor_security_method')">
                                                    <label class="form-check-label" for="two_factor_security_via_sms"> {{trans('auth.two_factor_security_via_sms')}}</label>
                                                </div>
                                                <div class="form-check form-check-inline ">
                                                    <input class="form-check-input" type="radio" value="email" id="two_factor_security_via_email" v-model="configForm.two_factor_security_method" :checked="configForm.two_factor_security_method == 'email'" name="two_factor_security_method" @click="configForm.errors.clear('two_factor_security_method')">
                                                    <label class="form-check-label" for="two_factor_security_via_email"> {{trans('auth.two_factor_security_via_email')}}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('auth.lock_screen')}}</label>
                                            <div>
                                                <switches v-model="configForm.lock_screen" theme="bootstrap" color="success"></switches>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group" v-if="configForm.lock_screen">
                                            <label for="">{{trans('auth.lock_screen_timeout')+' '+trans('auth.in_minute')}}</label>
                                            <input class="form-control" type="number" v-model="configForm.lock_screen_timeout" name="lock_screen_timeout" :placeholder="trans('auth.lock_screen_timeout')">
                                            <show-error :form-name="configForm" prop-name="lock_screen_timeout"></show-error>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <div class="form-group">
                                            <label for="">{{trans('auth.login_throttle')}}</label>
                                            <div>
                                                <switches v-model="configForm.login_throttle" theme="bootstrap" color="success"></switches>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-8" v-if="configForm.login_throttle">
                                        <div class="row">
                                            <div class="col-12 col-sm-6">
                                                <div class="form-group">
                                                    <label for=""><small>{{trans('auth.login_throttle_attempt')}}</small></label>
                                                    <input class="form-control" type="number" v-model="configForm.login_throttle_attempt" name="login_throttle_attempt" :placeholder="trans('auth.login_throttle_attempt')">
                                                    <show-error :form-name="configForm" prop-name="login_throttle_attempt"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-6">
                                                <div class="form-group">
                                                    <label for=""><small>{{trans('auth.login_throttle_timeout')+' '+trans('auth.in_minute')}}</small></label>
                                                    <input class="form-control" type="number" v-model="configForm.login_throttle_timeout" name="login_throttle_timeout" :placeholder="trans('auth.login_throttle_timeout')">
                                                    <show-error :form-name="configForm" prop-name="login_throttle_timeout"></show-error>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-info waves-effect waves-light m-t-10 pull-right">{{trans('general.save')}}</button>
                            </div>
                            <div class="col-12 col-sm-6">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    export default {
        components : {  },
        data() {
            return {
                configForm: new Form({
                    config_type: '',
                    token_lifetime: '',
                    reset_password_token_lifetime: '',
                    reset_password: 0,
                    login_with_otp: 0,
                    two_factor_security: 0,
                    two_factor_security_method: '',
                    reset_password_recaptcha: 0,
                    lock_screen: 0,
                    lock_screen_timeout: '',
                    login_throttle: 0,
                    login_throttle_attempt: '',
                    login_throttle_timeout: '',
                    providers: []
                },false),
                social_login_providers: [],
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
                this.configForm.config_type = 'authentication';
                this.configForm.reset_password = (this.configForm.reset_password) ? 1 : 0;
                this.configForm.two_factor_security = (this.configForm.two_factor_security) ? 1 : 0;
                this.configForm.lock_screen = (this.configForm.lock_screen) ? 1 : 0;
                this.configForm.login_throttle = (this.configForm.login_throttle) ? 1 : 0;
                this.configForm.post('/api/configuration')
                    .then(response => {
                        this.$store.dispatch('setConfig',{loaded: false});
                        toastr.success(response.message);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            }
        }
    }
</script>
