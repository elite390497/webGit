<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.mail_driver')}}</label>
                                    <select v-model="configForm.driver" class="custom-select col-12" name="driver" @change="configForm.errors.clear('driver')">
                                      <option v-for="option in mail_drivers" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="driver"></show-error>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('configuration.mail_from_name')}}</label>
                                            <input class="form-control" type="text" v-model="configForm.from_name" name="from_name" :placeholder="trans('configuration.mail_from_name')">
                                            <show-error :form-name="configForm" prop-name="from_name"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('configuration.mail_from_address')}}</label>
                                            <input class="form-control" type="text" v-model="configForm.from_address" name="from_address" :placeholder="trans('configuration.mail_from_address')">
                                            <show-error :form-name="configForm" prop-name="from_address"></show-error>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" v-if="!setupWizard" class="btn btn-info waves-effect waves-light m-t-10">{{trans('general.save')}}</button>
                            </div>
                            <div class="col-12 col-sm-8">
                                <div v-if="configForm.driver === 'mailgun'">
                                    <div class="row">
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mailgun_domain')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.mailgun_domain" name="mailgun_domain" :placeholder="trans('configuration.mailgun_domain')">
                                                <show-error :form-name="configForm" prop-name="mailgun_domain"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mailgun_secret')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.mailgun_secret" name="mailgun_secret" :placeholder="trans('configuration.mailgun_secret')">
                                                <show-error :form-name="configForm" prop-name="mailgun_secret"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="configForm.driver === 'mandrill'">
                                    <div class="row">
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mandrill_secret')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.mandrill_secret" name="mandrill_secret" :placeholder="trans('configuration.mandrill_secret')">
                                                <show-error :form-name="configForm" prop-name="mandrill_secret"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="configForm.driver === 'smtp'">
                                    <div class="row">
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.smtp_host')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.smtp_host" name="smtp_host" :placeholder="trans('configuration.smtp_host')">
                                                <show-error :form-name="configForm" prop-name="smtp_host"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.smtp_port')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.smtp_port" name="smtp_port" :placeholder="trans('configuration.smtp_port')">
                                                <show-error :form-name="configForm" prop-name="smtp_port"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.smtp_username')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.smtp_username" name="smtp_username" :placeholder="trans('configuration.smtp_username')">
                                                <show-error :form-name="configForm" prop-name="smtp_username"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.smtp_password')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.smtp_password" name="smtp_password" :placeholder="trans('configuration.smtp_password')">
                                                <show-error :form-name="configForm" prop-name="smtp_password"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.smtp_encryption')}}</label>
                                                <select v-model="configForm.smtp_encryption" class="custom-select col-12" name="smtp_encryption" @change="configForm.errors.clear('smtp_encryption')">
                                                  <option value=null selected>{{trans('general.select_one')}}</option>
                                                  <option v-for="option in encryptions" v-bind:value="option.value">
                                                    {{ option.text }}
                                                  </option>
                                                </select>
                                                <show-error :form-name="configForm" prop-name="smtp_encryption"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="configForm.driver === 'mailgun'">
                                    <div class="row">
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mailgun_host')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.mailgun_host" name="mailgun_host" :placeholder="trans('configuration.mailgun_host')">
                                                <show-error :form-name="configForm" prop-name="mailgun_host"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mailgun_port')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.mailgun_port" name="mailgun_port" :placeholder="trans('configuration.mailgun_port')">
                                                <show-error :form-name="configForm" prop-name="mailgun_port"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mailgun_username')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.mailgun_username" name="mailgun_username" :placeholder="trans('configuration.mailgun_username')">
                                                <show-error :form-name="configForm" prop-name="mailgun_username"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mailgun_password')}}</label>
                                                <input class="form-control" type="text" v-model="configForm.mailgun_password" name="mailgun_password" :placeholder="trans('configuration.mailgun_password')">
                                                <show-error :form-name="configForm" prop-name="mailgun_password"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('configuration.mailgun_encryption')}}</label>
                                                <select v-model="configForm.smtp_encryption" class="custom-select col-12" name="smtp_encryption" @change="configForm.errors.clear('smtp_encryption')">
                                                  <option value=null selected>{{trans('general.select_one')}}</option>
                                                  <option v-for="option in encryptions" v-bind:value="option.value">
                                                    {{ option.text }}
                                                  </option>
                                                </select>
                                                <show-error :form-name="configForm" prop-name="mailgun_encryption"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            setupWizard: {
                default: false
            },
            configurations: {
                required: false
            }
        },
        components : { },
        data() {
            return {
                configForm: new Form({
                    driver : '',
                    from_name: '',
                    from_address: '',
                    smtp_host: '',
                    smtp_port: '',
                    smtp_username: '',
                    smtp_password: '',
                    smtp_encryption: '',
                    mailgun_host: '',
                    mailgun_port: '',
                    mailgun_username: '',
                    mailgun_password: '',
                    mailgun_encryption: '',
                    mailgun_domain: '',
                    mailgun_secret: '',
                    mandrill_secret: '',
                    config_type: ''
                }, false),
                mail_drivers: [],
                encryptions: [
                    {
                        text: 'SSL',
                        value: 'ssl'
                    },
                    {
                        text: 'TLS',
                        value: 'tls'
                    }
                ]
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getPreRequisite();

            if(!this.setupWizard)
                this.getConfiguration();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/configuration/variable?type=mail')
                    .then(response => {
                        this.mail_drivers = response.mail_drivers;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
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
                this.configForm.config_type = 'mail';
                return this.configForm.post('/api/configuration')
                    .then(response => {
                        this.$store.dispatch('setConfig',{loaded: false});
                        toastr.success(response.message);
                        loader.hide();
                        return true;
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        return false;
                    });
            }
        },
        watch: {
            configurations(val){
                if (val)
                    helper.formAssign(this.configForm,val);
            }
        }
    }
</script>