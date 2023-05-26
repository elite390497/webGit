<template>
    <div class="card">
        <div class="card-body p-4">
            <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="row">
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.default_color_theme')}}</label>
                                    <select v-model="configForm.color_theme" class="custom-select col-12" name="color_theme" @change="configForm.errors.clear('color_theme')">
                                      <option v-for="option in systemConfigVariables.color_themes" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="color_theme"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.default_direction')}}</label>
                                    <select v-model="configForm.direction" class="custom-select col-12" name="direction" @change="configForm.errors.clear('direction')">
                                      <option v-for="option in systemConfigVariables.directions" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="direction"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.default_sidebar')}}</label>
                                    <select v-model="configForm.sidebar" class="custom-select col-12" name="sidebar" @change="configForm.errors.clear('sidebar')">
                                      <option v-for="option in systemConfigVariables.sidebar" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="sidebar"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4" v-if="getConfig('multilingual')">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.default_locale')}}</label>
                                    <select v-model="configForm.locale" class="custom-select col-12" name="locale" @change="configForm.errors.clear('locale')">
                                      <option v-for="option in systemConfigVariables.locales" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="locale"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.date_format')}}</label>
                                    <select v-model="configForm.date_format" class="custom-select col-12" name="date_format" @change="configForm.errors.clear('date_format')">
                                      <option v-for="option in systemConfigVariables.date_formats" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="date_format"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.time_format')}}</label>
                                    <select v-model="configForm.time_format" class="custom-select col-12" name="time_format" @change="configForm.errors.clear('time_format')">
                                      <option v-for="option in systemConfigVariables.time_formats" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="time_format"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.notification_position')}}</label>
                                    <select v-model="configForm.notification_position" class="custom-select col-12" name="notification_position" @change="configForm.errors.clear('notification_position')">
                                      <option v-for="option in systemConfigVariables.notification_positions" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="notification_position"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.timezone')}}</label>
                                    <select v-model="configForm.timezone" class="custom-select col-12" name="timezone" @change="configForm.errors.clear('timezone')">
                                      <option v-for="option in systemConfigVariables.timezones" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="timezone"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('calendar.first_day_of_week')}}</label>
                                    <select v-model="configForm.first_day_of_week" class="custom-select col-12" name="first_day_of_week" @change="configForm.errors.clear('first_day_of_week')">
                                      <option v-for="option in systemConfigVariables.days" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="first_day_of_week"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.currency')}}</label>
                                    <select v-model="configForm.currency" class="custom-select col-12" name="currency" @change="configForm.errors.clear('currency')">
                                      <option v-for="option in systemConfigVariables.currencies" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="currency"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.page_length')}}</label>
                                    <select v-model="configForm.page_length" class="custom-select col-12" name="page_length" @change="configForm.errors.clear('page_length')">
                                      <option v-for="option in getConfig('pagination')" v-bind:value="option">
                                        {{ option+' '+trans('general.per_page') }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="page_length"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-8" v-if="getConfig('show_footer_credit')">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.footer_credit')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.footer_credit" name="footer_credit" :placeholder="trans('configuration.footer_credit')">
                                    <show-error :form-name="configForm" prop-name="footer_credit"></show-error>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.biometric_auth_token')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.biometric_auth_token" name="biometric_auth_token" :placeholder="trans('configuration.biometric_auth_token')">
                                    <show-error :form-name="configForm" prop-name="biometric_auth_token"></show-error>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="row">
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.https')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.https" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.error_display')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.error_display" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.multilingual')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.multilingual" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('frontend.enable_frontend_website')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.frontend_website" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('student.enable_online_registration')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.online_registration" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="">{{trans('student.online_registration_header')}}</label>
                                    <autosize-textarea row="1" class="form-control" v-model="configForm.online_registration_header" :placeholder="trans('configuration.online_registration_header')" rows="2" name="online_registration_header"></autosize-textarea>
                                    <show-error :form-name="configForm" prop-name="online_registration_header"></show-error>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="">{{trans('student.online_registration_success_message')}}</label>
                                    <autosize-textarea row="1" class="form-control" v-model="configForm.online_registration_success_message" :placeholder="trans('configuration.online_registration_success_message')" rows="2" name="online_registration_success_message"></autosize-textarea>
                                    <show-error :form-name="configForm" prop-name="online_registration_success_message"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('utility.ip_filter')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.ip_filter" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('utility.email_log')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.email_log" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('utility.email_template')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.email_template" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div> -->
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('utility.todo')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.todo" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('utility.backup')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.backup" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.maintenance_mode')}}</label>
                                    <div>
                                        <switches class="" v-model="configForm.maintenance_mode" theme="bootstrap" color="success"></switches>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group" v-if="configForm.maintenance_mode">
                                    <label for="">{{trans('configuration.maintenance_mode_message')}}</label>
                                    <autosize-textarea row="1" class="form-control" v-model="configForm.maintenance_mode_message" :placeholder="trans('configuration.maintenance_mode_message')" rows="1" name="maintenance_mode_message"></autosize-textarea>
                                    <show-error :form-name="configForm" prop-name="maintenance_mode_message"></show-error>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" v-if="!setupWizard" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
            </form>
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
                    color_theme: '',
                    direction: '',
                    sidebar: '',
                    date_format: '',
                    time_format: '',
                    notification_position: '',
                    timezone: '',
                    first_day_of_week: '',
                    page_length: 10,
                    locale: '',
                    currency: '',
                    footer_credit: '',
                    biometric_auth_token: '',
                    https: 0,
                    error_display: 0,
                    frontend_website: 0,
                    online_registration: 0,
                    multilingual: 0,
                    ip_filter: 0,
                    email_log: 0,
                    email_template: 0,
                    todo: 0,
                    backup: 0,
                    maintenance_mode: 0,
                    maintenance_mode_message: '',
                    online_registration_header: '',
                    online_registration_success_message: '',
                    config_type: ''
                }, false),
                systemConfigVariables: {
                    color_themes: [],
                    directions: [],
                    sidebar: [],
                    date_formats: [],
                    time_formats: [],
                    notification_positions: [],
                    timezones: [],
                    locales: [],
                    currencies: [],
                    days: []
                },
                direction: '',
                locale: '',
                sidebar: ''
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
                axios.get('/api/configuration/variable?type=system')
                    .then(response => {
                        this.systemConfigVariables.color_themes = response.color_themes;
                        this.systemConfigVariables.directions = response.directions;
                        this.systemConfigVariables.currencies = response.currencies;
                        this.systemConfigVariables.sidebar = response.sidebar;
                        this.systemConfigVariables.date_formats = response.date_formats;
                        this.systemConfigVariables.time_formats = response.time_formats;
                        this.systemConfigVariables.days = response.days;
                        this.systemConfigVariables.notification_positions = response.notification_positions;
                        this.systemConfigVariables.timezones = response.timezones;
                        this.systemConfigVariables.locales = response.locales;
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfiguration(){
                let loader = this.$loading.show();
                axios.get('/api/configuration')
                    .then(response => {
                        this.configForm = helper.formAssign(this.configForm, response);
                        this.direction = response.direction;
                        this.locale = response.locale;
                        this.sidebar = response.sidebar;
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            submit(){
                let loader = this.$loading.show();
                this.configForm.config_type = 'system';
                this.configForm.https = (this.configForm.https) ? 1 : 0;
                this.configForm.error_display = (this.configForm.error_display) ? 1 : 0;
                this.configForm.frontend_website = (this.configForm.frontend_website) ? 1 : 0;
                this.configForm.online_registration = (this.configForm.online_registration) ? 1 : 0;
                this.configForm.multilingual = (this.configForm.multilingual) ? 1 : 0;
                this.configForm.ip_filter = (this.configForm.ip_filter) ? 1 : 0;
                this.configForm.email_log = (this.configForm.email_log) ? 1 : 0;
                this.configForm.email_template = (this.configForm.email_template) ? 1 : 0;
                this.configForm.todo = (this.configForm.todo) ? 1 : 0;
                this.configForm.backup = (this.configForm.backup) ? 1 : 0;
                this.configForm.maintenance_mode = (this.configForm.maintenance_mode) ? 1 : 0;
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
            },
            getConfig(config){
                return helper.getConfig(config);
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