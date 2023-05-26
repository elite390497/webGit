<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('employee.employee_configuration')}}</h3>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.employee_code_prefix')}}</label>
                                       <input class="form-control" type="text" v-model="configForm.employee_code_prefix" name="employee_code_prefix" :placeholder="trans('employee.employee_code_prefix')">
                                    <show-error :form-name="configForm" prop-name="employee_code_prefix"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.employee_code_digit')}}</label>
                                       <input class="form-control" type="number" v-model="configForm.employee_code_digit" name="employee_code_digit" :placeholder="trans('employee.employee_code_digit')">
                                    <show-error :form-name="configForm" prop-name="employee_code_digit"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.allow_employee_date_of_joining_out_of_session" value="1" name="allow_employee_date_of_joining_out_of_session">
                                        <span class="custom-control-label">{{trans('employee.allow_employee_date_of_joining_out_of_session')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="allow_employee_date_of_joining_out_of_session"></show-error>
                                </div>
                            </div>
                        </div>
                        <h4 class="card-title">{{trans('employee.leave_configuration')}}</h4>

                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.leave_holiday_calculation_mode')}}</label>
                                    <select v-model="configForm.leave_holiday_calculation_mode" class="custom-select col-12" name="leave_holiday_calculation_mode" @change="configForm.errors.clear('leave_holiday_calculation_mode')">
                                      <option v-for="option in leave_holiday_calculation_modes" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="leave_holiday_calculation_mode"></show-error>
                                </div>
                            </div>
                        </div>
                        <h4 class="card-title">{{trans('employee.payroll_configuration')}}</h4>

                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.per_day_salary_calculation_basis')}}</label>
                                    <select v-model="configForm.per_day_salary_calculation_basis" class="custom-select col-12" name="per_day_salary_calculation_basis" @change="configForm.errors.clear('per_day_salary_calculation_basis')">
                                      <option v-for="option in per_day_salary_calculation_basis_options" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="per_day_salary_calculation_basis"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="configForm.per_day_salary_calculation_basis == 'user_defined'">
                                <div class="form-group">
                                    <label for="">{{trans('employee.user_defined_per_day_salary_calculation_basis')}}</label>
                                       <input class="form-control" type="number" v-model="configForm.user_defined_per_day_salary_calculation_basis" name="user_defined_per_day_salary_calculation_basis" :placeholder="trans('employee.user_defined_per_day_salary_calculation_basis')">
                                    <show-error :form-name="configForm" prop-name="user_defined_per_day_salary_calculation_basis"></show-error>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
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
                    employee_code_prefix: '',
                    employee_code_digit: '',
                    leave_holiday_calculation_mode: '',
                    per_day_salary_calculation_basis: '',
                    user_defined_per_day_salary_calculation_basis: '',
                    allow_employee_date_of_joining_out_of_session: '',
                    config_type: ''
                },false),
                leave_holiday_calculation_modes: [
                    {
                        text: i18n.employee.leave_holiday_calculation_mode_ignore,
                        value: 'ignore'
                    },
                    {
                        text: i18n.employee.leave_holiday_calculation_mode_include,
                        value: 'include'
                    },
                    {
                        text: i18n.employee.leave_holiday_calculation_mode_include_if_enclosed,
                        value: 'include_if_enclosed'
                    }
                ],
                per_day_salary_calculation_basis_options: [
                    {
                        text: i18n.employee.salary_structure_calendar_period,
                        value: 'calendar_period'
                    },
                    {
                        text: i18n.employee.salary_structure_user_defined,
                        value: 'user_defined'
                    }
                ]
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
                this.configForm.config_type = 'employee';
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
