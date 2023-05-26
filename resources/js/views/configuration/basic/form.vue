<template>
    <div class="row">
        <div :class="['col-12', !setupWizard ? 'col-sm-7' : '', 'p-0', 'pl-3']">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-8">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.institute_name')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.institute_name" name="institute_name" :placeholder="trans('configuration.institute_name')">
                                    <show-error :form-name="configForm" prop-name="institute_name"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.institute_running_body')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.institute_running_body" name="institute_running_body" :placeholder="trans('configuration.institute_running_body')">
                                    <show-error :form-name="configForm" prop-name="institute_running_body"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.institute_foundation_date')}}</label>
                                    <datepicker v-model="configForm.institute_foundation_date" :bootstrapStyling="true" @selected="configForm.errors.clear('institute_foundation_date')" :placeholder="trans('configuration.institute_foundation_date')"></datepicker>
                                    <show-error :form-name="configForm" prop-name="institute_foundation_date"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.institute_recognition_body')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.institute_recognition_body" name="institute_recognition_body" :placeholder="trans('configuration.institute_recognition_body')">
                                    <show-error :form-name="configForm" prop-name="institute_recognition_body"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.institute_recognition_number')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.institute_recognition_number" name="institute_recognition_number" :placeholder="trans('configuration.institute_recognition_number')">
                                    <show-error :form-name="configForm" prop-name="institute_recognition_number"></show-error>
                                </div>
                            </div>
                        </div>
                        <h4 class="card-title">{{trans('configuration.contact_information')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.address_line_1')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.address_line_1" name="address_line_1" :placeholder="trans('configuration.address_line_1')">
                                    <show-error :form-name="configForm" prop-name="address_line_1"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.address_line_2')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.address_line_2" name="address_line_2" :placeholder="trans('configuration.address_line_2')">
                                    <show-error :form-name="configForm" prop-name="address_line_2"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.city')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.city" name="city" :placeholder="trans('configuration.city')">
                                    <show-error :form-name="configForm" prop-name="city"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.state')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.state" name="state" :placeholder="trans('configuration.state')">
                                    <show-error :form-name="configForm" prop-name="state"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.zipcode')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.zipcode" name="zipcode" :placeholder="trans('configuration.zipcode')">
                                    <show-error :form-name="configForm" prop-name="zipcode"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.country')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.country" name="country" :placeholder="trans('configuration.country')">
                                    <show-error :form-name="configForm" prop-name="country"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.phone')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.phone" name="phone" :placeholder="trans('configuration.phone')">
                                    <show-error :form-name="configForm" prop-name="phone"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.fax')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.fax" name="fax" :placeholder="trans('configuration.fax')">
                                    <show-error :form-name="configForm" prop-name="fax"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.email')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.email" name="email" :placeholder="trans('configuration.email')">
                                    <show-error :form-name="configForm" prop-name="email"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.website')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.website" name="website" :placeholder="trans('configuration.website')">
                                    <show-error :form-name="configForm" prop-name="website"></show-error>
                                </div>
                            </div>
                        </div>
                        <button v-if="!setupWizard" type="submit" class="btn btn-info waves-effect waves-light m-t-10 pull-right">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-5 hidden-sm-down p-0 pr-3" v-if="!setupWizard">
            <div class="card border-left">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <upload-image id="logo" :button-text="trans('general.choose_logo')" upload-path="/configuration/logo" remove-path="/configuration/logo/remove" :image-source="logo" @uploaded="updateLogo" @removed="updateLogo"></upload-image>
                        </div>
                        <div class="col-12 col-sm-6">
                            <upload-image id="icon" :button-text="trans('general.choose_icon')" upload-path="/configuration/icon" remove-path="/configuration/icon/remove" :image-source="icon" @uploaded="updateIcon" @removed="updateIcon"></upload-image>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-sm custom-show-table">
                            <tbody>
                                <tr v-for="(config,key) in configForm" v-if="key != 'config_type' && key != 'errors' && key != 'originalData' && key != 'autoReset'">
                                    <td>{{trans('configuration.'+key)}}</td>
                                    <td>
                                        <span v-if="key == 'institute_foundation_date'">{{configForm[key] | moment}}</span>
                                        <span v-else>{{configForm[key]}}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
        components : {},
        data() {
            return {
                configForm: new Form({
                    institute_name : '',
                    institute_running_body: '',
                    institute_recognition_number: '',
                    institute_recognition_body: '',
                    institute_foundation_date: '',
                    address_line_1: '',
                    address_line_2: '',
                    city: '',
                    state: '',
                    zipcode: '',
                    country: '',
                    phone: '',
                    fax: '',
                    email: '',
                    website: '',
                    config_type: ''
                }, false),
                icon: '',
                logo: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.icon = helper.getConfig('icon');
            this.logo = helper.getConfig('logo');

            if(!this.setupWizard)
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
                this.configForm.config_type = 'basic';
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
            updateLogo(val){
                this.$store.dispatch('setConfig',{
                    logo: val
                });
            },
            updateIcon(val){
                this.$store.dispatch('setConfig',{
                    icon: val
                });
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
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