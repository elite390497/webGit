<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('inventory.stock_purchase')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="stock_purchases.total">{{trans('general.total_result_found',{count : stock_purchases.total, from: stock_purchases.from, to: stock_purchases.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="stock_purchases.total && !showCreatePanel && hasPermission('create-stock-purchase')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('inventory.add_new_stock_purchase')}}</span></button>
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
                        <help-button @clicked="help_topic = 'inventory.stock.purchase'"></help-button>
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
                                    <label for="">{{trans('inventory.vendor')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_vendors" name="vendor_id" id="vendor_id" :options="vendors" :placeholder="trans('inventory.select_vendor')" @select="onVendorSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVendorRemove" :selected="selected_vendors">
                                        <div class="multiselect__option" slot="afterList" v-if="!vendors.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_start_date" :end-date.sync="filter.date_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getStockPurchases">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-stock-purchase')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('inventory.add_new_stock_purchase')}}</h4>
                        <stock-purchase-form @completed="getStockPurchases" @cancel="showCreatePanel = !showCreatePanel"></stock-purchase-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="stock_purchases.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('inventory.vendor')}}</th>
                                    <th>{{trans('inventory.stock_purchase_number')}}</th>
                                    <th>{{trans('inventory.stock_purchase_date')}}</th>
                                    <th>{{trans('inventory.stock_purchase_total')}}</th>
                                    <th>{{trans('inventory.stock_purchase_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stock_purchase in stock_purchases.data">
                                    <td v-text="stock_purchase.vendor.name"></td>
                                    <td>{{stock_purchase.number}}</td>
                                    <td>{{stock_purchase.date | moment}}</td>
                                    <td>{{formatCurrency(stock_purchase.total)}}</td>
                                    <td v-text="stock_purchase.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('inventory.stock_purchase_detail')" @click="$router.push('/inventory/stock/purchase/'+stock_purchase.id)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-stock-purchase')" v-tooltip="trans('inventory.edit_stock_purchase')" @click.prevent="editStockPurchase(stock_purchase)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-stock-purchase')" :key="stock_purchase.id" v-confirm="{ok: confirmDelete(stock_purchase)}" v-tooltip="trans('inventory.delete_stock_purchase')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!stock_purchases.total" module="inventory" title="stock_purchase_module_title" description="stock_purchase_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-stock-purchase')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="stock_purchases" @updateRecords="getStockPurchases"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import stockPurchaseForm from './form'

    export default {
        components : { stockPurchaseForm },
        data() {
            return {
                stock_purchases: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date',
                    order: 'desc',
                    vendor_id: [],
                    date_start_date: '',
                    date_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date',
                        translation: i18n.inventory.stock_purchase_date
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                vendors: [],
                selected_vendors: null,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-stock-purchase')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getStockPurchases();
            helper.showDemoNotification(['inventory']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getStockPurchases(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_start_date = helper.toDate(this.filter.date_start_date);
                this.filter.date_end_date = helper.toDate(this.filter.date_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/stock/purchase?page=' + page + url)
                    .then(response => {
                        this.stock_purchases = response.stock_purchases;
                        this.vendors = response.filters.vendors;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editStockPurchase(stock_purchase){
                this.$router.push('/inventory/stock/purchase/'+stock_purchase.id+'/edit');
            },
            confirmDelete(stock_purchase){
                return dialog => this.deleteStockPurchase(stock_purchase);
            },
            deleteStockPurchase(stock_purchase){
                let loader = this.$loading.show();
                axios.delete('/api/stock/purchase/'+stock_purchase.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getStockPurchases();
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
                axios.post('/api/stock/purchase/print',{filter: this.filter})
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
                axios.post('/api/stock/purchase/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onVendorSelect(selectedOption){
                this.filter.vendor_id.push(selectedOption.id);
            },
            onVendorRemove(removedOption){
                this.filter.vendor_id.splice(this.filter.vendor_id.indexOf(removedOption.id), 1);
            },
            formatCurrency(amount) {
                return helper.formatCurrency(amount);
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getStockPurchases();
            },
            'filter.order': function(val){
                this.getStockPurchases();
            },
            'filter.page_length': function(val){
                this.getStockPurchases();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>