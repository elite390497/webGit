<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('student.student_configuration')}}</h3>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.admission_number_prefix')}}</label>
                                       <input class="form-control" type="text" v-model="configForm.admission_number_prefix" name="admission_number_prefix" :placeholder="trans('student.admission_number_prefix')">
                                    <show-error :form-name="configForm" prop-name="admission_number_prefix"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.admission_number_digit')}}</label>
                                       <input class="form-control" type="number" v-model="configForm.admission_number_digit" name="admission_number_digit" :placeholder="trans('student.admission_number_digit')">
                                    <show-error :form-name="configForm" prop-name="admission_number_digit"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.transfer_certificate_prefix')}}</label>
                                       <input class="form-control" type="text" v-model="configForm.transfer_certificate_prefix" name="transfer_certificate_prefix" :placeholder="trans('student.transfer_certificate_prefix')">
                                    <show-error :form-name="configForm" prop-name="transfer_certificate_prefix"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.transfer_certificate_digit')}}</label>
                                       <input class="form-control" type="number" v-model="configForm.transfer_certificate_digit" name="transfer_certificate_digit" :placeholder="trans('student.transfer_certificate_digit')">
                                    <show-error :form-name="configForm" prop-name="transfer_certificate_digit"></show-error>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.allow_to_modify_student_attendance" value="1" name="allow_to_modify_student_attendance">
                                        <span class="custom-control-label">{{trans('student.allow_to_modify_student_attendance')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="allow_to_modify_student_attendance"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="configForm.allow_to_modify_student_attendance">
                                <div class="form-group">
                                    <label for="">{{trans('student.days_allowed_to_modify_student_attendance')}}</label>
                                    <div class="input-group">
                                       <input class="form-control" type="number" v-model="configForm.days_allowed_to_modify_student_attendance" name="days_allowed_to_modify_student_attendance" :placeholder="trans('student.days_allowed_to_modify_student_attendance')">
                                       <div class="input-group-append">
                                            <span class="input-group-text">{{trans('general.days')}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="configForm" prop-name="days_allowed_to_modify_student_attendance"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.allow_to_mark_student_advance_attendance" value="1" name="allow_to_mark_student_advance_attendance">
                                        <span class="custom-control-label">{{trans('student.allow_to_mark_student_advance_attendance')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="allow_to_mark_student_advance_attendance"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="configForm.allow_to_mark_student_advance_attendance">
                                <div class="form-group">
                                    <label for="">{{trans('student.days_allowed_to_mark_student_advance_attendance')}}</label>
                                    <div class="input-group">
                                       <input class="form-control" type="number" v-model="configForm.days_allowed_to_mark_student_advance_attendance" name="days_allowed_to_mark_student_advance_attendance" :placeholder="trans('student.days_allowed_to_mark_student_advance_attendance')">
                                       <div class="input-group-append">
                                            <span class="input-group-text">{{trans('general.days')}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="configForm" prop-name="days_allowed_to_mark_student_advance_attendance"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.late_attendance_time')}}</label>
                                    <div class="input-group">
                                       <input class="form-control" type="number" v-model="configForm.student_late_attendance_time" name="late_attendance_time" :placeholder="trans('student.late_attendance_time')">
                                       <div class="input-group-append">
                                            <span class="input-group-text">{{trans('general.minutes')}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="configForm" prop-name="student_late_attendance_time"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="form-group text-right">
                            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
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
                    admission_number_prefix: '',
                    admission_number_digit: '',
                    transfer_certificate_prefix: '',
                    transfer_certificate_digit: '',
                    allow_to_modify_student_attendance: '',
                    days_allowed_to_modify_student_attendance: '',
                    allow_to_mark_student_advance_attendance: '',
                    days_allowed_to_mark_student_advance_attendance: '',
                    student_late_attendance_time: '',
                    config_type: ''
                },false)
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
                this.configForm.config_type = 'student';
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
