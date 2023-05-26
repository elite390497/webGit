<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.fee')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="transport_fees.total">{{trans('general.total_result_found',{count : transport_fees.total, from: transport_fees.from, to: transport_fees.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="transport_fees.total && !showCreatePanel && hasPermission('create-transport-fee')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_fee')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/transport/circle')" v-if="hasPermission('list-transport-circle')"><i class="fas fa-circle-notch"></i> {{trans('transport.transport_circle')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'transport.fee'"></help-button>
                        
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
                                    <label for="">{{trans('transport.fee_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.name" name="name" :placeholder="trans('transport.fee_name')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getTransportFees">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-transport-fee')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_fee')}}</h4>
                        <transport-fee-form @completed="getTransportFees" @cancel="showCreatePanel = !showCreatePanel"></transport-fee-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="transport_fees.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.fee_name')}}</th>
                                    <th>{{trans('transport.circle')}}</th>
                                    <th>{{trans('transport.fee_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transport_fee in transport_fees.data">
                                    <td v-text="transport_fee.name"></td>
                                    <td>
                                        <div class="table-responsive">
                                            <table class="table table-borderless">
                                                <tbody>
                                                    <tr v-for="transport_fee_detail in transport_fee.transport_fee_details">
                                                        <td>{{transport_fee_detail.transport_circle.name}}</td>
                                                        <td>{{formatCurrency(transport_fee_detail.amount)}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                    <td v-text="transport_fee.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-transport-fee')" v-tooltip="trans('transport.edit_fee')" @click.prevent="editTransportFee(transport_fee)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-transport-fee')" :key="transport_fee.id" v-confirm="{ok: confirmDelete(transport_fee)}" v-tooltip="trans('transport.delete_fee')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!transport_fees.total" module="transport" title="fee_module_title" description="fee_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-transport-fee')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="transport_fees" @updateRecords="getTransportFees"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import transportFeeForm from './form'

    export default {
        components : { transportFeeForm },
        data() {
            return {
                transport_fees: {
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
                        translation: i18n.transport.fee_name
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-transport-fee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getTransportFees();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getTransportFees(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/transport/fee?page=' + page + url)
                    .then(response => {
                        this.transport_fees = response
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editTransportFee(transport_fee){
                this.$router.push('/transport/fee/'+transport_fee.id+'/edit');
            },
            confirmDelete(transport_fee){
                return dialog => this.deleteTransportFee(transport_fee);
            },
            deleteTransportFee(transport_fee){
                let loader = this.$loading.show();
                axios.delete('/api/transport/fee/'+transport_fee.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getTransportFees();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            formatCurrency(price){
                return helper.formatCurrency(price);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/transport/fee/print',{filter: this.filter})
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
                axios.post('/api/transport/fee/pdf',{filter: this.filter})
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
                this.getTransportFees();
            },
            'filter.order': function(val){
                this.getTransportFees();
            },
            'filter.page_length': function(val){
                this.getTransportFees();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>