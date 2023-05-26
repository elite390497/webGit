<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.certificate_template')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="certificate_templates.total">{{trans('general.total_result_found',{count : certificate_templates.total, from: certificate_templates.from, to: certificate_templates.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="certificate_templates.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_certificate_template')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'configuration.academic.certificate_template'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.add_new_certificate_template')}}</h4>
                        <certificate-template-form @completed="getCertificateTemplates" @cancel="showCreatePanel = !showCreatePanel"></certificate-template-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="certificate_templates.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.certificate_template_name')}}</th>
                                    <th>{{trans('academic.certificate_template_type')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="certificate_template in certificate_templates.data">
                                    <td v-text="certificate_template.name"></td>
                                    <td v-text="certificate_template.type == 'student' ? trans('student.student') : trans('employee.employee')"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('academic.edit_certificate_template')" @click.prevent="editCertificateTemplate(certificate_template)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="certificate_template.id" v-confirm="{ok: confirmDelete(certificate_template)}" v-tooltip="trans('academic.delete_certificate_template')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!certificate_templates.total" module="academic" title="certificate_template_module_title" description="certificate_template_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="certificate_templates" @updateRecords="getCertificateTemplates" @change.native="getCertificateTemplates"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import certificateTemplateForm from './form'

    export default {
        components : { certificateTemplateForm },
        data() {
            return {
                certificate_templates: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.academic.certificate_template_name
                    },
                    {
                        value: 'type',
                        translation: i18n.academic.certificate_template_type
                    }
                ],
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCertificateTemplates();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getCertificateTemplates(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/academic/certificate/template?page=' + page + url)
                    .then(response => {
                        this.certificate_templates = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCertificateTemplate(certificate_template){
                this.$router.push('/configuration/academic/certificate/template/'+certificate_template.id+'/edit');
            },
            confirmDelete(certificate_template){
                return dialog => this.deleteCertificateTemplate(certificate_template);
            },
            deleteCertificateTemplate(certificate_template){
                let loader = this.$loading.show();
                axios.delete('/api/academic/certificate/template/'+certificate_template.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCertificateTemplates();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/academic/certificate/template/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/academic/certificate/template/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getCertificateTemplates();
            },
            'filter.order': function(val){
                this.getCertificateTemplates();
            },
            'filter.page_length': function(val){
                this.getCertificateTemplates();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
