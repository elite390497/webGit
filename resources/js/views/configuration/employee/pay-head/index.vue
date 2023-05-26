<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.pay_head')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="pay_heads.total">{{trans('general.total_result_found',{count : pay_heads.total, from: pay_heads.from, to: pay_heads.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="pay_heads.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_pay_head')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.employee.pay-head'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('employee.add_new_pay_head')}}</h4>
                        <pay-head-form @completed="getPayHeads" @cancel="showCreatePanel = !showCreatePanel"></pay-head-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="pay_heads.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.pay_head_name')}}</th>
                                    <th>{{trans('employee.pay_head_alias')}}</th>
                                    <th>{{trans('employee.pay_head_type')}}</th>
                                    <th>{{trans('employee.pay_head_status')}}</th>
                                    <th>{{trans('employee.pay_head_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="pay_head in pay_heads.data">
                                    <td v-text="pay_head.name"></td>
                                    <td v-text="pay_head.alias"></td>
                                    <td v-text="trans('employee.pay_head_type_'+pay_head.type)"></td>
                                    <td v-html="getStatus(pay_head)"></td>
                                    <td v-text="pay_head.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_pay_head')" @click.prevent="editPayHead(pay_head)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="pay_head.id" v-confirm="{ok: confirmDelete(pay_head)}" v-tooltip="trans('employee.delete_pay_head')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!pay_heads.total" module="employee" title="pay_head_module_title" description="pay_head_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="pay_heads" @updateRecords="getPayHeads" @change.native="getPayHeads"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import payHeadForm from './form'

    export default {
        components : { payHeadForm },
        data() {
            return {
                pay_heads: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.employee.pay_head_name
                    },
                    {
                        value: 'alias',
                        translation: i18n.employee.pay_head_alias
                    },
                    {
                        value: 'type',
                        translation: i18n.employee.pay_head_type
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

            this.getPayHeads();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getPayHeads(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/pay/head?page=' + page + url)
                    .then(response => {
                        this.pay_heads = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editPayHead(pay_head){
                this.$router.push('/configuration/employee/pay/head/'+pay_head.id+'/edit');
            },
            confirmDelete(pay_head){
                return dialog => this.deletePayHead(pay_head);
            },
            deletePayHead(pay_head){
                let loader = this.$loading.show();
                axios.delete('/api/employee/pay/head/'+pay_head.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPayHeads();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/employee/pay/head/print',{filter: this.filter})
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
                axios.post('/api/employee/pay/head/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStatus(pay_head){
                if (pay_head.is_active) 
                    return '<span class="label label-success">'+i18n.employee.pay_head_status_active+'</span>';
                else
                    return '<span class="label label-danger">'+i18n.employee.pay_head_status_inactive+'</span>';
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getPayHeads();
            },
            'filter.order': function(val){
                this.getPayHeads();
            },
            'filter.page_length': function(val){
                this.getPayHeads();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
