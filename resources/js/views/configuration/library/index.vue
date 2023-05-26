<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('library.library_configuration')}}</h3>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.library_max_book_issue_to_student')}}</label>
                                    <div class="input-group">
                                        <input class="form-control" type="number" v-model="configForm.library_max_book_issue_to_student" name="library_max_book_issue_to_student" :placeholder="trans('library.library_max_book_issue_to_student')">
                                        <div class="input-group-append">
                                            <span class="input-group-text">{{trans('library.book')}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="configForm" prop-name="library_max_book_issue_to_student"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.library_max_book_issue_to_employee')}}</label>
                                    <div class="input-group">
                                        <input class="form-control" type="number" v-model="configForm.library_max_book_issue_to_employee" name="library_max_book_issue_to_employee" :placeholder="trans('library.library_max_book_issue_to_employee')">
                                        <div class="input-group-append">
                                            <span class="input-group-text">{{trans('library.book')}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="configForm" prop-name="library_max_book_issue_to_employee"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.library_return_due_day_for_student')}}</label>
                                    <div class="input-group">
                                        <input class="form-control" type="number" v-model="configForm.library_return_due_day_for_student" name="library_return_due_day_for_student" :placeholder="trans('library.library_return_due_day_for_student')">
                                        <div class="input-group-append">
                                            <span class="input-group-text">{{trans('general.days')}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="configForm" prop-name="library_return_due_day_for_student"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.library_return_due_day_for_employee')}}</label>
                                    <div class="input-group">
                                        <input class="form-control" type="number" v-model="configForm.library_return_due_day_for_employee" name="library_return_due_day_for_employee" :placeholder="trans('library.library_return_due_day_for_employee')">
                                        <div class="input-group-append">
                                            <span class="input-group-text">{{trans('general.days')}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="configForm" prop-name="library_return_due_day_for_employee"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.library_late_fee_applicable_student" value="1" name="library_late_fee_applicable_student">
                                        <span class="custom-control-label">{{trans('library.library_late_fee_applicable_student')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="library_late_fee_applicable_student"></show-error>
                                </div>
                            </div>
                            <template v-if="configForm.library_late_fee_applicable_student">
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('library.library_late_fee_frequency_student')}}</label>
                                        <select v-model="configForm.library_late_fee_frequency_student" class="custom-select col-12" name="library_late_fee_frequency_student" @change="configForm.errors.clear('library_late_fee_frequency_student')">
                                          <option value=null selected>{{trans('general.select_one')}}</option>
                                          <option v-for="option in late_fee_frequencies" v-bind:value="option.value">
                                            {{ option.text }}
                                          </option>
                                        </select>
                                        <show-error :form-name="configForm" prop-name="library_late_fee_frequency_student"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('library.library_late_fee_charge_student')}}</label>
                                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="library_late_fee_charge_student" :placeholder="trans('library.library_late_fee_charge_student')" v-model="configForm.library_late_fee_charge_student" @input.native="configForm.errors.clear('library_late_fee_charge_student')"></currency-input>
                                        <show-error :form-name="configForm" prop-name="library_late_fee_charge_student"></show-error>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.library_late_fee_applicable_employee" value="1" name="library_late_fee_applicable_employee">
                                        <span class="custom-control-label">{{trans('library.library_late_fee_applicable_employee')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="library_late_fee_applicable_employee"></show-error>
                                </div>
                            </div>
                            <template v-if="configForm.library_late_fee_applicable_employee">
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('library.library_late_fee_frequency_employee')}}</label>
                                        <select v-model="configForm.library_late_fee_frequency_employee" class="custom-select col-12" name="library_late_fee_frequency_employee" @change="configForm.errors.clear('library_late_fee_frequency_employee')">
                                          <option value=null selected>{{trans('general.select_one')}}</option>
                                          <option v-for="option in late_fee_frequencies" v-bind:value="option.value">
                                            {{ option.text }}
                                          </option>
                                        </select>
                                        <show-error :form-name="configForm" prop-name="library_late_fee_frequency_employee"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('library.library_late_fee_charge_employee')}}</label>
                                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="library_late_fee_charge_employee" :placeholder="trans('library.library_late_fee_charge_employee')" v-model="configForm.library_late_fee_charge_employee" @input.native="configForm.errors.clear('library_late_fee_charge_employee')"></currency-input>
                                        <show-error :form-name="configForm" prop-name="library_late_fee_charge_employee"></show-error>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="text-right">
                            <button type="submit" class="btn btn-info waves-effect waves-light m-t-10">{{trans('general.save')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        components : { },
        data() {
            return {
                configForm: new Form({
                    library_max_book_issue_to_student: '',
                    library_max_book_issue_to_employee: '',
                    library_return_due_day_for_student: '',
                    library_return_due_day_for_employee: '',
                    library_late_fee_frequency_student: '',
                    library_late_fee_applicable_student: 0,
                    library_late_fee_charge_student: '',
                    library_late_fee_frequency_employee: '',
                    library_late_fee_applicable_employee: 0,
                    library_late_fee_charge_employee: '',
                    config_type: ''
                },false),
                default_currency: helper.getConfig('default_currency'),
                late_fee_frequencies: []
            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
            this.getConfiguration();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/configuration/variable?type=library')
                    .then(response => {
                        this.late_fee_frequencies = response.late_fee_frequencies;
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
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            submit(){
                let loader = this.$loading.show();
                this.configForm.config_type = 'library';
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
