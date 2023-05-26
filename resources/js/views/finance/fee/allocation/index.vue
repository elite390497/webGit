<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_allocation')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="fee_allocations.total">{{trans('general.total_result_found',{count : fee_allocations.total, from: fee_allocations.from, to: fee_allocations.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="fee_allocations.total && hasPermission('create-fee-allocation')" @click="$router.push('/finance/fee/allocation/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_fee_allocation')}}</span></button>
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
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/finance/fee/head')" v-if="hasPermission('list-fee-head')"><i class="fas fa-list"></i> {{trans('finance.fee_head')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'finance.fee.allocation'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}
                        </h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getFeeAllocations">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="fee_allocations.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.course')+'/'+trans('academic.batch')}}</th>
                                    <th></th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th>{{trans('general.updated_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fee_allocation in fee_allocations.data">
                                    <td>
                                        <span v-if="fee_allocation.course_id">{{fee_allocation.course.name}}</span>
                                        <span v-else>{{fee_allocation.batch.course.name+' '+fee_allocation.batch.name}}</span>
                                    </td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-for="fee_allocation_group in fee_allocation.fee_allocation_groups"><small> <i class="fas fa-check"></i> {{fee_allocation_group.fee_group.name+' ('+fee_allocation_group.fee_installments.length+' '+trans('finance.installment')+')'}}</small></li>
                                        </ul>
                                    </td>
                                    <td>{{fee_allocation.created_at | momentDateTime}}</td>
                                    <td>{{fee_allocation.updated_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('finance.view_fee_allocation')" @click="$router.push('/finance/fee/allocation/'+fee_allocation.uuid)">
                                                <i class="fas fa-arrow-circle-right" v-if="!fee_allocation.paid_count"></i> <i class="fas fa-lock" v-else></i> {{trans('general.view')}}
                                            </button>
                                            <button type="button" class="btn btn-sm btn-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu">
                                                <template v-if="!fee_allocation.paid_count">
                                                    <button class="dropdown-item custom-dropdown-menu" v-if="hasPermission('edit-fee-allocation')" v-tooltip="trans('finance.edit_fee_allocation')" @click.prevent="editFeeAllocation(fee_allocation)"><i class="fas fa-edit"></i> {{trans('general.edit')}}</button>

                                                    <button class="dropdown-item custom-dropdown-menu" v-if="hasPermission('create-fee-allocation') && !fee_allocation.course_id" v-tooltip="trans('finance.copy_batch_fee_allocation')" :key="`copy_${fee_allocation.id}`" v-confirm="{ok: confirmCopy(fee_allocation)}"><i class="fas fa-copy"></i> {{trans('general.copy')}}</button>

                                                    <button class="dropdown-item custom-dropdown-menu" v-if="hasPermission('delete-fee-allocation')" :key="`delete_${fee_allocation.id}`" v-confirm="{ok: confirmDelete(fee_allocation)}" v-tooltip="trans('finance.delete_fee_allocation')"><i class="fas fa-trash"></i> {{trans('general.delete')}}</button>
                                                </template>

                                                <button class="dropdown-item custom-dropdown-menu" v-if="hasPermission('create-fee-allocation')" v-tooltip="trans('finance.duplicate_fee_allocation')" @click="$router.push('/finance/fee/allocation/create/'+fee_allocation.uuid)"><i class="fas fa-clone"></i> {{trans('finance.duplicate_fee_allocation')}}</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!fee_allocations.total" module="finance" title="fee_allocation_module_title" description="fee_allocation_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('create-fee-allocation')" @click="$router.push('/finance/fee/allocation/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="fee_allocations" @updateRecords="getFeeAllocations"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                fee_allocations: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'asc',
                    batch_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                batches: [],
                selected_batches: null,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-fee-allocation')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getFeeAllocations();
            helper.showDemoNotification(['finance_fee_allocation']);
        },
        methods: {
            getConfig(config) {
                return helper.getConfig(config)
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getFeeAllocations(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/fee/allocation?page=' + page + url)
                    .then(response => {
                        this.fee_allocations = response.fee_allocations;
                        this.batches = response.filters.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editFeeAllocation(fee_allocation){
                this.$router.push('/finance/fee/allocation/'+fee_allocation.uuid+'/edit');
            },
            confirmDelete(fee_allocation){
                return dialog => this.deleteFeeAllocation(fee_allocation);
            },
            deleteFeeAllocation(fee_allocation){
                let loader = this.$loading.show();
                axios.delete('/api/fee/allocation/'+fee_allocation.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getFeeAllocations();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmCopy(fee_allocation){
                return dialog => this.copyFeeAllocation(fee_allocation);
            },
            copyFeeAllocation(fee_allocation){
                let loader = this.$loading.show();
                axios.post('/api/fee/allocation/'+fee_allocation.uuid+'/copy')
                    .then(response => {
                        toastr.success(response.message);
                        this.getFeeAllocations();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/fee/allocation/print',{filter: this.filter})
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
                axios.post('/api/fee/allocation/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
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
            'filter.sort_by': function(val) {
                this.getFeeAllocations();
            },
            'filter.order': function(val) {
                this.getFeeAllocations();
            },
            'filter.page_length': function(val) {
                this.getFeeAllocations();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>