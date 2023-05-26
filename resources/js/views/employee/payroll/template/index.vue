<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.payroll_template')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="payroll_templates.total">{{trans('general.total_result_found',{count : payroll_templates.total, from: payroll_templates.from, to: payroll_templates.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="payroll_templates.total" @click="$router.push('/employee/payroll/template/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_payroll_template')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
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
                        <help-button @clicked="help_topic = 'employee.payroll.template'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.payroll_template_name')}}</label>
                                    <input class="form-control" name="name" v-model="filter.name">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getPayrollTemplates">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="payroll_templates.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.payroll_template_name')}}</th>
                                    <th>{{trans('employee.payroll_template_status')}}</th>
                                    <th>{{trans('employee.payroll_template_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="payroll_template in payroll_templates.data">
                                    <td v-text="payroll_template.name">
                                    <td v-html="getStatus(payroll_template)">
                                    <td v-text="payroll_template.description">
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view')" @click.prevent="showAction(payroll_template)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_payroll_template')" @click.prevent="editPayrollTemplate(payroll_template)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="payroll_template.id" v-confirm="{ok: confirmDelete(payroll_template)}" v-tooltip="trans('employee.delete_payroll_template')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!payroll_templates.total" module="employee" title="payroll_template_module_title" description="payroll_template_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" @click="$router.push('/employee/payroll/template/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="payroll_templates" @updateRecords="getPayrollTemplates"></pagination-record>
                </div>
            </div>
        </div>
        <payroll-template-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></payroll-template-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import payrollTemplateDetail from './show'

    export default {
        components : {payrollTemplateDetail},
        data() {
            return {
                payroll_templates: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.employee.payroll_template_name
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showFilterPanel: false,
                showUuid: '',
                help_topic: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('manage-payroll-template')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPayrollTemplates();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(payroll_template){
                this.showUuid = payroll_template.uuid;
                this.showModal = true;
            },
            getPayrollTemplates(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/payroll/template?page=' + page + url)
                    .then(response => {
                        this.payroll_templates = response.payroll_templates;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editPayrollTemplate(payroll_template){
                this.$router.push('/employee/payroll/template/'+payroll_template.uuid+'/edit');
            },
            confirmDelete(payroll_template){
                return dialog => this.deletePayrollTemplate(payroll_template);
            },
            deletePayrollTemplate(payroll_template){
                let loader = this.$loading.show();
                axios.delete('/api/employee/payroll/template/'+payroll_template.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPayrollTemplates();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/employee/payroll/template/print',{filter: this.filter})
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
                axios.post('/api/employee/payroll/template/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStatus(payroll_template){
                if (payroll_template.is_active) 
                    return '<span class="label label-success">'+i18n.employee.payroll_template_status_active+'</span>';
                else
                    return '<span class="label label-danger">'+i18n.employee.payroll_template_status_inactive+'</span>';
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
            'filter.sort_by': function(val){
                this.getPayrollTemplates();
            },
            'filter.order': function(val){
                this.getPayrollTemplates();
            },
            'filter.page_length': function(val){
                this.getPayrollTemplates();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>