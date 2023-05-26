<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_head')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="fee_heads.total">{{trans('general.total_result_found',{count : fee_heads.total, from: fee_heads.from, to: fee_heads.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="fee_heads.total && !showCreatePanel && hasPermission('create-fee-head')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_fee_head')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/finance/fee/group')" v-if="hasPermission('list-fee-group')"><i class="fas fa-object-group"></i> {{trans('finance.fee_group')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/finance/fee/allocation')" v-if="hasPermission('list-fee-allocation')"><i class="fas fa-box-open"></i> {{trans('finance.fee_allocation')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'finance.fee.head'"></help-button>
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
                                    <v-select label="name" track-by="id" v-model="selected_fee_groups" name="fee_group_id" id="fee_group_id" :options="fee_groups" :placeholder="trans('academic.select_fee_group')" @select="onFeeGroupSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onFeeGroupRemove" :selected="selected_fee_groups">
                                        <div class="multiselect__option" slot="afterList" v-if="!fee_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getFeeHeads">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-fee-head')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_fee_head')}}</h4>
                        <fee-head-form @completed="getFeeHeads" @cancel="showCreatePanel = !showCreatePanel"></fee-head-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="fee_heads.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.fee_head_name')}}</th>
                                    <th>{{trans('finance.fee_group')}}</th>
                                    <th>{{trans('finance.fee_head_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fee_head in fee_heads.data">
                                    <td v-text="fee_head.name"></td>
                                    <td v-text="fee_head.fee_group.name"></td>
                                    <td v-text="fee_head.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-fee-head')" v-tooltip="trans('finance.edit_fee_head')" @click.prevent="editFeeHead(fee_head)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-fee-head')" :key="fee_head.id" v-confirm="{ok: confirmDelete(fee_head)}" v-tooltip="trans('finance.delete_fee_head')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!fee_heads.total" module="finance" title="fee_head_module_title" description="fee_head_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-fee-head')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="fee_heads" @updateRecords="getFeeHeads"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import feeHeadForm from './form'

    export default {
        components : { feeHeadForm },
        data() {
            return {
                fee_heads: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    fee_group_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.finance.fee_head_name
                    }
                ],
                fee_groups: [],
                selected_fee_groups: null,
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-fee-head')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getFeeHeads();
            helper.showDemoNotification(['finance']);
        },
        methods: {
            getConfig(config) {
                return helper.getConfig(config)
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getFeeHeads(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/fee/head?page=' + page + url)
                    .then(response => {
                        this.fee_heads = response.fee_heads;
                        this.fee_groups = response.filters.fee_groups;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editFeeHead(fee_head){
                this.$router.push('/finance/fee/head/'+fee_head.id+'/edit');
            },
            confirmDelete(fee_head){
                return dialog => this.deleteFeeHead(fee_head);
            },
            deleteFeeHead(fee_head){
                let loader = this.$loading.show();
                axios.delete('/api/fee/head/'+fee_head.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getFeeHeads();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/fee/head/print',{filter: this.filter})
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
                axios.post('/api/fee/head/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onFeeGroupSelect(selectedOption){
                this.filter.fee_group_id.push(selectedOption.id);
            },
            onFeeGroupRemove(removedOption){
                this.filter.fee_group_id.splice(this.filter.fee_group_id.indexOf(removedOption.id), 1);
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
                this.getFeeHeads();
            },
            'filter.order': function(val){
                this.getFeeHeads();
            },
            'filter.page_length': function(val){
                this.getFeeHeads();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>