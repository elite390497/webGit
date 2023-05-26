<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_group')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="fee_groups.total">{{trans('general.total_result_found',{count : fee_groups.total, from: fee_groups.from, to: fee_groups.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="fee_groups.total && !showCreatePanel && hasPermission('create-fee-group')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_fee_group')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/finance/fee/head')" v-if="hasPermission('list-fee-head')"><i class="fas fa-list"></i> {{trans('finance.fee_head')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/finance/fee/allocation')" v-if="hasPermission('list-fee-allocation')"><i class="fas fa-box-open"></i> {{trans('finance.fee_allocation')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'finance.fee.group'"></help-button>
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
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('finance.fee_group_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.name" name="name" :placeholder="trans('finance.fee_group_name')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getFeeGroups">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-fee-group')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_fee_group')}}</h4>
                        <fee-group-form @completed="getFeeGroups" @cancel="showCreatePanel = !showCreatePanel"></fee-group-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="fee_groups.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.fee_group_name')}}</th>
                                    <th>{{trans('finance.fee_head')}}</th>
                                    <th>{{trans('transport.has_transport')}}</th>
                                    <th>{{trans('finance.fee_group_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fee_group in fee_groups.data">
                                    <td v-text="fee_group.name"></td>
                                    <td>
                                        <div v-if="fee_group.fee_heads.length">
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="fee_head in fee_group.fee_heads">{{fee_head.name}}</li>
                                            </ul>
                                        </div>
                                        <div v-else>
                                            -
                                        </div>
                                    </td>
                                    <td>
                                        <span v-if="fee_group.options.has_transport"><i class="fas fa-check"></i></span>
                                        <span v-else><i class="fas fa-times"></i></span>
                                    </td>
                                    <td v-text="fee_group.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-fee-group')" v-tooltip="trans('finance.edit_fee_group')" @click.prevent="editFeeGroup(fee_group)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-fee-group')" :key="fee_group.id" v-confirm="{ok: confirmDelete(fee_group)}" v-tooltip="trans('finance.delete_fee_group')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!fee_groups.total" module="finance" title="fee_group_module_title" description="fee_group_module_description" icon="check-circle">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-fee-group')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="fee_groups" @updateRecords="getFeeGroups"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import feeGroupForm from './form'

    export default {
        components : { feeGroupForm },
        data() {
            return {
                fee_groups: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.finance.fee_group_name
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-fee-group')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getFeeGroups();
            helper.showDemoNotification(['finance']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getFeeGroups(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/fee/group?page=' + page + url)
                    .then(response => {
                        this.fee_groups = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editFeeGroup(fee_group){
                this.$router.push('/finance/fee/group/'+fee_group.id+'/edit');
            },
            confirmDelete(fee_group){
                return dialog => this.deleteFeeGroup(fee_group);
            },
            deleteFeeGroup(fee_group){
                let loader = this.$loading.show();
                axios.delete('/api/fee/group/'+fee_group.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getFeeGroups();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/fee/group/print',{filter: this.filter})
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
                axios.post('/api/fee/group/pdf',{filter: this.filter})
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
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getFeeGroups();
            },
            'filter.order': function(val){
                this.getFeeGroups();
            },
            'filter.page_length': function(val){
                this.getFeeGroups();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>