<template>
    <section id="wrapper">
        <div class="install guest-page">
            <div class="install-box card guest-box" v-show="!is_processing">
                <form-wizard color="#55CE63" :title="name" :subtitle="trans('install.sub_title')" :nextButtonText="trans('install.next_button_content')" :backButtonText="trans('install.back_button_content')" :finishButtonText="trans('install.finish_button_content')" @on-complete="finishInstallation">
                    <tab-content :title="trans('install.pre_requisite')" :before-change="preRequisiteFulfill">
                        <h4 class="card-title">{{trans('install.server_requirements')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3" v-if="server_checks.length" v-for="server_check in server_checks">
                                <p style="font-size: 13px;padding:5px;" :class="['alert','alert-'+(server_check.type === 'error' ? 'danger' : 'success')]"><i :class="['fa','fa-'+((server_check.type === 'error') ? 'times' : 'check')]"></i> {{server_check.message}}</p>
                            </div>
                        </div>
                        <h4 class="card-title">{{trans('install.folder_permissions')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3" v-if="folder_checks.length" v-for="folder_check in folder_checks">
                                <p style="font-size: 13px;padding:5px;" :class="['alert','alert-'+(folder_check.type === 'error' ? 'danger' : 'success')]"><i :class="['fa','fa-'+((folder_check.type === 'error') ? 'times' : 'check')]"></i> {{folder_check.message}}</p>
                            </div>
                        </div>
                    </tab-content>
                    <tab-content :title="trans('install.database_setup')" :before-change="validateDatabase">
                        <form class="form-horizontal" @keydown="installForm.errors.clear($event.target.name)">
                            <div class="row">
                                <div class="col-6">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('install.db_port')}}</label>
                                                <input type="text" name="db_port" class="form-control" :placeholder="trans('install.db_port')" v-model="installForm.db_port">
                                                <show-error :form-name="installForm" prop-name="db_port"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('install.db_host')}}</label>
                                                <input type="text" name="db_host" class="form-control" :placeholder="trans('install.db_host')" v-model="installForm.db_host">
                                                <show-error :form-name="installForm" prop-name="db_host"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group ">
                                        <label for="">{{trans('install.db_database')}}</label>
                                        <input type="text" name="db_database" class="form-control" :placeholder="trans('install.db_database')" v-model="installForm.db_database">
                                        <show-error :form-name="installForm" prop-name="db_database"></show-error>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group ">
                                        <label for="">{{trans('install.db_username')}}</label>
                                        <input type="text" name="db_username" class="form-control" :placeholder="trans('install.db_username')" v-model="installForm.db_username">
                                        <show-error :form-name="installForm" prop-name="db_username"></show-error>
                                    </div>
                                    <div class="form-group ">
                                        <label for="">{{trans('install.db_password')}}</label>
                                        <input type="password" name="db_password" class="form-control" :placeholder="trans('install.db_password')" v-model="installForm.db_password">
                                        <show-error :form-name="installForm" prop-name="db_password"></show-error>
                                    </div>
                                </div>
                            </div>
                            <p style="font-size: 80%; cursor: pointer;" @click="showDBAdvanceOption = ! showDBAdvanceOption">
                                <i class="fa fa-chevron-down" v-if="! showDBAdvanceOption"></i> 
                                <i class="fa fa-chevron-up" v-if="showDBAdvanceOption"></i> 
                            Advanced</p>
                            <div class="form-group" v-show="showDBAdvanceOption">
                                <label class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" v-model="installForm.db_imported" value="1" name="db_imported">
                                    <span class="custom-control-label" style="font-size: 80%;">{{trans('install.db_import_instruction')}}</span>
                                </label>
                            </div>
                        </form>
                    </tab-content>
                    <tab-content :title="trans('install.admin_setup')" :before-change="validateAdmin">
                        <form class="form-horizontal" @keydown="installForm.errors.clear($event.target.name)">
                            <div class="row">
                                <div class="col-6">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('user.first_name')}}</label>
                                                <input type="text" name="first_name" class="form-control" :placeholder="trans('user.first_name')" v-model="installForm.first_name">
                                                <show-error :form-name="installForm" prop-name="first_name"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('user.last_name')}}</label>
                                                <input type="text" name="last_name" class="form-control" :placeholder="trans('user.last_name')" v-model="installForm.last_name">
                                                <show-error :form-name="installForm" prop-name="last_name"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group ">
                                        <label for="">{{trans('user.email')}}</label>
                                        <input type="text" name="email" class="form-control" :placeholder="trans('user.email')" v-model="installForm.email">
                                        <show-error :form-name="installForm" prop-name="email"></show-error>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('auth.username')}}</label>
                                                <input type="text" name="username" class="form-control" :placeholder="trans('auth.username')" v-model="installForm.username">
                                                <show-error :form-name="installForm" prop-name="username"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('user.contact_number')}}</label>
                                                <input type="text" name="contact_number" class="form-control" :placeholder="trans('user.contact_number')" v-model="installForm.contact_number">
                                                <show-error :form-name="installForm" prop-name="contact_number"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('user.password')}}</label>
                                                <input type="password" name="password" class="form-control" :placeholder="trans('user.password')" v-model="installForm.password">
                                                <show-error :form-name="installForm" prop-name="password"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group ">
                                                <label for="">{{trans('user.password_confirmation')}}</label>
                                                <input type="password" name="password_confirmation" class="form-control" :placeholder="trans('user.password_confirmation')" v-model="installForm.password_confirmation">
                                                <show-error :form-name="installForm" prop-name="password_confirmation"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </tab-content>
                    <tab-content :title="trans('install.ready_to_go')" :before-change="validateAccessCode">
                        <p class="alert alert-success"><i class="fas fa-check"></i> {{trans('install.ready_to_go_message')}}</p>
                        <h4 class="card-subtitle text-center">{{trans('install.verify_purchase')}}</h4>
                        <form class="form-horizontal" @keydown="installForm.errors.clear($event.target.name)">
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group ">
                                        <input type="text" name="access_code" class="form-control" :placeholder="trans('install.access_code')" v-model="installForm.access_code">
                                        <show-error :form-name="installForm" prop-name="access_code"></show-error>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group ">
                                        <input type="text" name="envato_email" class="form-control" :placeholder="trans('install.envato_email')" v-model="installForm.envato_email">
                                        <show-error :form-name="installForm" prop-name="envato_email"></show-error>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" v-model="installForm.seed" value="1" name="seed">
                                    <span class="custom-control-label">{{trans('install.import_configuration_data')}}</span>
                                </label>
                            </div>
                        </form>

                        <div class="row justify-content-center">
                            <div class="col-6 text-center">
                                <a :href="verifier" target="_blank" class="btn btn-info btn-block">{{trans('install.get_access_code')}}</a>
                            </div>
                        </div>
                    </tab-content>
                </form-wizard>
            </div>
            <div class="install-box card" v-show="is_processing">
                <div class="card-body p-4">
                    <h4 class="card-title text-center">Installation in Progress</h4>
                    <p class="alert alert-info m-t-20">We are installing application for you, this process may take several minutes depending upon your server configuration. Please do not refresh this page or click on any link. You will be automatically redirected to login page once installation completes. <br /><br /> While installation is going on, read some inspirational quotes from great personalities all over the world!</p>

                    <quotes></quotes>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </section>
</template>

<script>
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import quotes from './quotes'

    export default {
        components: {FormWizard,TabContent,quotes},
        data(){
            return {
                name: '',
                server_checks: [],
                folder_checks: [],
                installForm: new Form({
                    db_host: 'localhost',
                    db_port: 3306,
                    db_database: '',
                    db_username: '',
                    db_password: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    username: '',
                    contact_number: '',
                    access_code: '',
                    envato_email: '',
                    db_imported: 0,
                    seed: 0
                },false),
                verifier: '',
                quotes: [],
                showDBAdvanceOption: false,
                is_processing: false,
                help_topic: ''
            }
        },
        mounted(){
            if(!helper.getConfig('failed_install'))
                this.$router.push('/login');

            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/install/pre-requisite')
                    .then(response => {
                        this.name = response.name;
                        this.server_checks = response.server_checks;
                        this.folder_checks = response.folder_checks;
                        this.verifier = response.verifier;
                        this.quotes = response.quotes;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
                },
            preRequisiteFulfill(){
                let server_error = this.server_checks.filter(server_check => server_check.type === 'error');
                let folder_error = this.folder_checks.filter(folder_check => folder_check.type === 'error');

                if(server_error.length){
                    toastr.error(i18n.install.fix_server_error)
                    return false;
                } else if(folder_error.length){
                    toastr.error(i18n.install.fix_folder_error)
                    return false;
                }

                return true;
            },
            validateDatabase(){
                return this.validate('database');
            },
            validateAdmin(){
                return this.validate('admin');
            },
            validateAccessCode(){
                return this.validate('access_code');
            },
            validate(option){
                let loader = this.$loading.show();
                return this.installForm.post('/api/install/validate/'+option)
                    .then(response => {
                        loader.hide();
                        return true;
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        return false;
                    })
            },
            finishInstallation(){
                toastr.success(i18n.install.installation_processing);
                this.is_processing = true;
                let loader = this.$loading.show();
                this.installForm.post('/api/install')
                    .then(response => {
                        this.$store.dispatch('resetConfig');
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/login');
                    })
                    .catch(error => {
                        toastr.clear();
                        loader.hide()
                        helper.showErrorMsg(error);
                        this.is_processing = false;
                    })
            },
            getConfig(config){
                return helper.getConfig(config);
            }
        }
    }
</script>
