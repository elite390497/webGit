<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('utility.email_template')}} 
                        <help-button @clicked="help_topic = 'email-template'"></help-button>
                        <span class="card-subtitle d-none d-sm-inline" v-if="email_templates.total">{{trans('general.total_result_found',{count : email_templates.total, from: email_templates.from, to: email_templates.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="email_templates.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('utility.add_new_email_template')}}</span></button>
                        <help-button @clicked="help_topic = 'utility.email-template'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('utility.add_new_email_template')}}</h4>
                        <form @submit.prevent="submit" @keydown="templateForm.errors.clear($event.target.name)">
                            <div class="row">
                                <div class="col-12 col-sm-6">
                                    <div class="form-group">
                                        <label for="">{{trans('utility.email_template_name')}}</label>
                                        <input class="form-control" type="text" v-model="templateForm.name" name="name" :placeholder="trans('utility.email_template_name')">
                                        <show-error :form-name="templateForm" prop-name="name"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6">                                    
                                    <div class="form-group">
                                        <label for="">{{trans('utility.email_template_category')}}</label>
                                        <v-select label="name" v-model="selected_category" name="category" id="category" :options="categories" :placeholder="trans('utility.email_template_category')" @select="templateForm.errors.clear('category')" @close="templateForm.category = selected_category.id" @remove="templateForm.category = ''">
                                            <div class="multiselect__option" slot="afterList" v-if="!categories.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="templateForm" prop-name="category"></show-error>
                                    </div>
                                </div>
                            </div>

                            <div class="card-footer text-right">
                                <button class="btn btn-danger " v-if="showCreatePanel" @click="showCreatePanel = !showCreatePanel">{{trans('general.cancel')}}</button>
                                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>

            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="email_templates.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('utility.email_template_name')}}</th>
                                    <th>{{trans('utility.email_template_category')}}</th>
                                    <th>{{trans('utility.email_template_subject')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="email_template in email_templates.data">
                                    <td v-text="email_template.name"></td>
                                    <td v-text="toWord(email_template.category)"></td>
                                    <td v-text="email_template.subject"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('utility.edit_email_template')" @click.prevent="editEmailTemplate(email_template)"><i class="fas fa-edit"></i></button>
                                            <button v-if="!email_template.is_default" :key="email_template.id" class="btn btn-danger btn-sm" v-confirm="{ok: confirmDelete(email_template)}" v-tooltip="trans('utility.delete_email_template')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!email_templates.total" module="utility" title="email_template_module_title" description="email_template_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="email_templates" @updateRecords="getEmailTemplates" @change.native="getEmailTemplates"></pagination-record>
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
                showCreatePanel: false,
                email_templates: {
                    total: 0,
                    data: []
                },
                filter: {
                    page_length: helper.getConfig('page_length')
                },
                templateForm: new Form({
                    name: '',
                    category: ''
                }),
                categories: [
                    {name: i18n.user.user, id: 'user'}
                ],
                selected_category: null,
                help_topic: ''
            };
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

            this.getEmailTemplates();
        },
        methods: {
            getEmailTemplates(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/email-template?page=' + page + url)
                    .then(response => {
                        this.email_templates = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editEmailTemplate(email_template){
                this.$router.push('/utility/email-template/'+email_template.id+'/edit');
            },
            confirmDelete(email_template){
                return dialog => this.deleteEmailTemplate(email_template);
            },
            deleteEmailTemplate(email_template){
                let loader = this.$loading.show();
                axios.delete('/api/email-template/'+email_template.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getEmailTemplates();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toWord(value){
                return helper.toWord(value);
            },
            submit(){
                let loader = this.$loading.show();
                this.templateForm.post('/api/email-template')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_category = null;
                        this.getEmailTemplates();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>