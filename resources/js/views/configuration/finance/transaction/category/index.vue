<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.transaction_category')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="transaction_categories.total">{{trans('general.total_result_found',{count : transaction_categories.total, from: transaction_categories.from, to: transaction_categories.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="transaction_categories.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_transaction_category')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.finance.transaction.category'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_transaction_category')}}</h4>
                        <transaction-category-form @completed="getTransactionCategories" @cancel="showCreatePanel = !showCreatePanel"></transaction-category-form>
                    </div>
                </div>
            </transition>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="transaction_categories.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.transaction_category_name')}}</th>
                                    <th>{{trans('finance.transaction_category_type')}}</th>
                                    <th>{{trans('finance.transaction_category_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transaction_category in transaction_categories.data">
                                    <td v-text="transaction_category.name"></td>
                                    <td>
                                        {{trans('finance.'+transaction_category.type)}}
                                    </td>
                                    <td v-text="transaction_category.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('finance.edit_transaction_category')" @click.prevent="editTransactionCategory(transaction_category)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="transaction_category.id" v-confirm="{ok: confirmDelete(transaction_category)}" v-tooltip="trans('finance.delete_transaction_category')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!transaction_categories.total" module="finance" title="transaction_category_module_title" description="transaction_category_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="transaction_categories" @updateRecords="getTransactionCategories" @change.native="getTransactionCategories"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import transactionCategoryForm from './form'

    export default {
        components : { transactionCategoryForm },
        data() {
            return {
                transaction_categories: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.finance.transaction_category_name
                    },
                    {
                        value: 'type',
                        translation: i18n.finance.transaction_category_type
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

            this.getTransactionCategories();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getTransactionCategories(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/finance/transaction/category?page=' + page + url)
                    .then(response => {
                        this.transaction_categories = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editTransactionCategory(transaction_category){
                this.$router.push('/configuration/finance/transaction/category/'+transaction_category.id+'/edit');
            },
            confirmDelete(transaction_category){
                return dialog => this.deleteTransactionCategory(transaction_category);
            },
            deleteTransactionCategory(transaction_category){
                let loader = this.$loading.show();
                axios.delete('/api/finance/transaction/category/'+transaction_category.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getTransactionCategories();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/finance/transaction/category/print',{filter: this.filter})
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
                axios.post('/api/finance/transaction/category/pdf',{filter: this.filter})
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
                this.getTransactionCategories();
            },
            'filter.order': function(val){
                this.getTransactionCategories();
            },
            'filter.page_length': function(val){
                this.getTransactionCategories();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
