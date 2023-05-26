<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.id_card_template')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="id_card_templates.total">{{trans('general.total_result_found',{count : id_card_templates.total, from: id_card_templates.from, to: id_card_templates.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="id_card_templates.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.id_card_template')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.academic.id_card_template'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.id_card_template')}}</h4>
                        <id-card-template-form @completed="getIdCardTemplates" @cancel="showCreatePanel = !showCreatePanel"></id-card-template-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="id_card_templates.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.id_card_template_name')}}</th>
                                    <th>{{trans('academic.id_card_template_type')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="id_card_template in id_card_templates.data">
                                    <td v-text="id_card_template.name"></td>
                                    <td v-text="id_card_template.type == 'student' ? trans('student.student') : trans('employee.employee')"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <router-link :to="`/configuration/academic/id-card/template/${id_card_template.id}`" class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" ><i class="fas fa-arrow-circle-right"></i></router-link>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('academic.id_card_template')" @click.prevent="editIdCardTemplate(id_card_template)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="id_card_template.id" v-confirm="{ok: confirmDelete(id_card_template)}" v-tooltip="trans('academic.id_card_template')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!id_card_templates.total" module="academic" title="id_card_template_module_title" description="id_card_template_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="id_card_templates" @updateRecords="getIdCardTemplates" @change.native="getIdCardTemplates"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import idCardTemplateForm from './form'

    export default {
        components : { idCardTemplateForm },
        data() {
            return {
                id_card_templates: {
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
                        translation: i18n.academic.id_card_template_name
                    },
                    {
                        value: 'type',
                        translation: i18n.academic.id_card_template_type
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

            this.getIdCardTemplates();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getIdCardTemplates(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/academic/id-card/template?page=' + page + url)
                    .then(response => {
                        this.id_card_templates = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editIdCardTemplate(id_card_template){
                this.$router.push('/configuration/academic/id-card/template/'+id_card_template.id+'/edit');
            },
            confirmDelete(id_card_template){
                return dialog => this.deleteIdCardTemplate(id_card_template);
            },
            deleteIdCardTemplate(id_card_template){
                let loader = this.$loading.show();
                axios.delete('/api/academic/id-card/template/'+id_card_template.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getIdCardTemplates();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/academic/id-card/template/print',{filter: this.filter})
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
                axios.post('/api/academic/id-card/template/pdf',{filter: this.filter})
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
                this.getIdCardTemplates();
            },
            'filter.order': function(val){
                this.getIdCardTemplates();
            },
            'filter.page_length': function(val){
                this.getIdCardTemplates();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
