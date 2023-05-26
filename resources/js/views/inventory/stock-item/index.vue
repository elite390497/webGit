<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('inventory.stock_item')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="stock_items.total">{{trans('general.total_result_found',{count : stock_items.total, from: stock_items.from, to: stock_items.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="stock_items.total && !showCreatePanel && hasPermission('create-stock-item')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('inventory.add_new_stock_item')}}</span></button>
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
                        <help-button @clicked="help_topic = 'inventory.stock.item'"></help-button>
                        
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
                                    <label for="">{{trans('inventory.stock_category')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_stock_category" name="stock_category_id" id="stock_category_id" :options="stock_categories" :placeholder="trans('inventory.select_stock_category')" @select="onStockCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onStockCategoryRemove" :selected="selected_stock_category">
                                        <div class="multiselect__option" slot="afterList" v-if="!stock_categories.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('inventory.stock_item_name')}}</label>
                                    <input class="form-control" name="name" v-model="filter.name">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getStockItems">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-stock-item')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('inventory.add_new_stock_item')}}</h4>
                        <stock-item-form @completed="getStockItems" @cancel="showCreatePanel = !showCreatePanel"></stock-item-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="stock_items.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('inventory.stock_item_name')}}</th>
                                    <th>{{trans('inventory.stock_item_code')}}</th>
                                    <th>{{trans('inventory.stock_item_opening_quantity')}}</th>
                                    <th>{{trans('inventory.stock_item_net_quantity')}}</th>
                                    <th>{{trans('inventory.stock_category')}}</th>
                                    <th>{{trans('inventory.stock_item_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stock_item in stock_items.data">
                                    <td>{{stock_item.name}}</td>
                                    <td>{{stock_item.code}}</td>
                                    <td>{{stock_item.opening_quantity}}</td>
                                    <td>{{stock_item.net_quantity}}</td>
                                    <td>{{stock_item.category.name}}</td>
                                    <td>{{stock_item.description}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('inventory.edit_stock_item')" @click.prevent="editStockCategory(stock_item)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="stock_item.id" v-confirm="{ok: confirmDelete(stock_item)}" v-tooltip="trans('inventory.delete_stock_item')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!stock_items.total" module="inventory" title="stock_item_module_title" description="stock_item_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-stock-item')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="stock_items" @updateRecords="getStockItems"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import stockItemForm from './form'

    export default {
        components : { stockItemForm},
        data() {
            return {
                stock_items: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'desc',
                    stock_category_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.inventory.stock_item_name
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                stock_categories: [],
                selected_stock_category: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-stock-item') || !helper.hasPermission('create-stock-item')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-stock-item'))
                this.getStockItems();
            helper.showDemoNotification(['inventory']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getStockItems(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/stock/item?page=' + page + url)
                    .then(response => {
                        this.stock_items = response.stock_items;
                        this.stock_categories = response.filters.stock_categories;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editStockCategory(stock_item){
                this.$router.push('/inventory/stock/item/'+stock_item.id+'/edit');
            },
            confirmDelete(stock_item){
                return dialog => this.deleteStockCategory(stock_item);
            },
            deleteStockCategory(stock_item){
                let loader = this.$loading.show();
                axios.delete('/api/stock/item/'+stock_item.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getStockItems();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/stock/item/print',{filter: this.filter})
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
                axios.post('/api/stock/item/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onStockCategorySelect(selectedOption){
                this.filter.stock_category_id.push(selectedOption.id);
            },
            onStockCategoryRemove(removedOption){
                this.filter.stock_category_id.splice(this.filter.stock_category_id.indexOf(removedOption.id), 1);
            },
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
                this.getStockItems();
            },
            'filter.order': function(val){
                this.getStockItems();
            },
            'filter.page_length': function(val){
                this.getStockItems();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>