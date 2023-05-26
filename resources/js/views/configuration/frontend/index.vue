<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('frontend.frontend_configuration')}}</h3>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <h4 class="card-title">{{trans('employee.teacher')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.show_teacher_contact_number" value="1" name="show_teacher_contact_number">
                                        <span class="custom-control-label">{{trans('frontend.show_teacher_contact_number')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="show_teacher_contact_number"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.show_teacher_email" value="1" name="show_teacher_email">
                                        <span class="custom-control-label">{{trans('frontend.show_teacher_email')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="show_teacher_email"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox m-t-20">
                                        <input type="checkbox" class="custom-control-input" v-model="configForm.show_teacher_date_of_joining" value="1" name="show_teacher_date_of_joining">
                                        <span class="custom-control-label">{{trans('frontend.show_teacher_date_of_joining')}}</span>
                                    </label>
                                    <show-error :form-name="configForm" prop-name="show_teacher_date_of_joining"></show-error>
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
                    show_teacher_contact_number: 0,
                    show_teacher_email: 0,
                    show_teacher_date_of_joining: 0,
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
                this.configForm.config_type = 'frontend';
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
