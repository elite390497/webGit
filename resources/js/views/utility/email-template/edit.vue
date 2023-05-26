<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('utility.edit_email_template')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/email-template')"><i class="far fa-envelope"></i> <span class="d-none d-sm-inline">{{trans('utility.email_template')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body">
                    <form @submit.prevent="submit" @keydown="templateForm.errors.clear($event.target.name)">
                        <div class="form-group">
                            <label for="">{{trans('utility.email_template_subject')}}</label>
                            <input class="form-control" type="text" v-model="templateForm.subject" name="subject" :placeholder="trans('utility.email_template_subject')">
                            <show-error :form-name="templateForm" prop-name="subject"></show-error>
                        </div>
                        <div class="form-group">
                            <html-editor name="body" :model.sync="templateForm.body" isUpdate="true" @clearErrors="templateForm.errors.clear('body')"></html-editor>
                            <show-error :form-name="templateForm" prop-name="body"></show-error>
                        </div>
                        <div class="help-block">{{trans('utility.available_fields')}}: {{fields}}</div>
                        
                        <div class="card-footer text-right">
                            <button type="submit" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
                            <button type="button" class="btn btn-danger waves-effect waves-light pull-right m-t-10 " @click="$router.push('/utility/email-template')">{{trans('general.cancel')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                id:this.$route.params.id,
                templateForm: new Form({
                    help_topic: '',
                    body: '',
                }),
                fields: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(!helper.featureAvailable('email_template')){
                helper.featureNotAvailableMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/email-template/'+this.id)
                    .then(response => {
                        this.templateForm.subject = response.email_template.subject;
                        this.templateForm.body = response.email_template.body;
                        this.fields = response.fields;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/utility/email-template');
                    })
            },
            submit(){
                let loader = this.$loading.show();
                this.templateForm.patch('/api/email-template/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/utility/email-template');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
