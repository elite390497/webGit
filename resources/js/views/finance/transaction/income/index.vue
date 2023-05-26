<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.income')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="incomes.total">{{trans('general.total_result_found',{count : incomes.total, from: incomes.from, to: incomes.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="incomes.total && !showCreatePanel && hasPermission('create-income')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_income')}}</span></button>
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
                        <help-button @clicked="help_topic = 'finance.transaction.income'"></help-button>
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
                                    <label for="">{{trans('finance.transaction_category')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_transaction_categories" name="transaction_category_id" id="transaction_category_id" :options="transaction_categories" :placeholder="trans('finance.select_transaction_category')" @select="onTransactionCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onTransactionCategoryRemove" :selected="selected_transaction_categories">
                                        <div class="multiselect__option" slot="afterList" v-if="!transaction_categories.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.account')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_accounts" name="account_id" id="account_id" :options="accounts" :placeholder="trans('finance.select_account')" @select="onAccountSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onAccountRemove" :selected="selected_accounts">
                                        <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.payment_method')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_payment_methods" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('finance.select_payment_method')" @select="onPaymentMethodSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onPaymentMethodRemove" :selected="selected_payment_methods">
                                        <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_income_start_date" :end-date.sync="filter.date_of_income_end_date" :label="trans('finance.date_of_income_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getIncomes">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-income')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_income')}}</h4>
                        <income-form @completed="getIncomes" @cancel="showCreatePanel = !showCreatePanel"></income-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="incomes.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.voucher_number')}}</th>
                                    <th>{{trans('finance.income_category')}}</th>
                                    <th>{{trans('finance.account')}}</th>
                                    <th>{{trans('finance.payment_method')}}</th>
                                    <th>{{trans('finance.amount')}}</th>
                                    <th>{{trans('finance.date_of_income')}}</th>
                                    <th>{{trans('general.created_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="income in incomes.data">
                                    <td v-text="getVoucherNumber(income.transaction)"></td>
                                    <td v-text="income.transaction_category.name"></td>
                                    <td v-text="income.transaction.account.name"></td>
                                    <td v-text="income.transaction.payment_method.name"></td>
                                    <td>{{formatCurrency(income.amount)}}</td>
                                    <td>{{income.date_of_income | moment}}</td>
                                    <td>{{getEmployeeName(income.user.employee)}} <br > {{getEmployeeDesignationOnDate(income.user.employee, income.date_of_income)}}</td>
                                    <td>{{income.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <a :href="`/finance/transaction/income/${income.uuid}/print?token=${authToken}`" target="_blank" class="btn btn-success btn-sm" v-tooltip="trans('general.print')"><i class="fas fa-print"></i></a>
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" @click.prevent="showAction(income)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <template v-if="!income.is_cancelled">
                                                <button class="btn btn-info btn-sm" v-if="hasPermission('edit-income')" v-tooltip="trans('finance.edit_income')" @click.prevent="editIncome(income)"><i class="fas fa-edit"></i></button>
                                                <button class="btn btn-danger btn-sm" v-if="hasPermission('cancel-income')" :key="income.id" v-confirm="{ok: confirmCancel(income)}" v-tooltip="trans('finance.cancel_income')"><i class="fas fa-times"></i></button>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!incomes.total" module="finance" title="income_module_title" description="income_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-income')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="incomes" @updateRecords="getIncomes"></pagination-record>
                </div>
            </div>
        </div>
        <income-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></income-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import incomeForm from './form'
    import incomeDetail from './show'
    
    export default {
        components : { incomeForm,incomeDetail},
        data() {
            return {
                incomes: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_income',
                    order: 'desc',
                    transaction_category_id: [],
                    account_id: [],
                    payment_method_id: [],
                    date_of_income_start_date: '',
                    date_of_income_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_income',
                        translation: i18n.finance.date_of_income
                    },
                    {
                        value: 'amount',
                        translation: i18n.finance.amount
                    }
                ],
                transaction_categories: [],
                selected_transaction_categories: null,
                accounts: [],
                selected_accounts: null,
                payment_methods: [],
                selected_payment_methods: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-income')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getIncomes();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(income){
                this.showUuid = income.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getVoucherNumber(transaction){
                return helper.getVoucherNumber(transaction);
            },
            getIncomes(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_income_start_date = helper.toDate(this.filter.date_of_income_start_date);
                this.filter.date_of_income_end_date = helper.toDate(this.filter.date_of_income_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/income?page=' + page + url)
                    .then(response => {
                        this.incomes = response.incomes;
                        this.transaction_categories = response.filters.transaction_categories;
                        this.accounts = response.filters.accounts;
                        this.payment_methods = response.filters.payment_methods;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editIncome(income){
                this.$router.push('/finance/transaction/income/'+income.uuid+'/edit');
            },
            confirmCancel(income){
                return dialog => this.cancelIncome(income);
            },
            cancelIncome(income){
                let loader = this.$loading.show();
                axios.delete('/api/income/'+income.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getIncomes();
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
                axios.post('/api/income/print',{filter: this.filter})
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
                axios.post('/api/income/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onTransactionCategorySelect(selectedOption){
                this.filter.transaction_category_id.push(selectedOption.id);
            },
            onTransactionCategoryRemove(removedOption){
                this.filter.transaction_category_id.splice(this.filter.transaction_category_id.indexOf(removedOption.id), 1);
            },
            onAccountSelect(selectedOption){
                this.filter.account_id.push(selectedOption.id);
            },
            onAccountRemove(removedOption){
                this.filter.account_id.splice(this.filter.account_id.indexOf(removedOption.id), 1);
            },
            onPaymentMethodSelect(selectedOption){
                this.filter.payment_method.push(selectedOption.id);
            },
            onPaymentMethodRemove(removedOption){
                this.filter.payment_method.splice(this.filter.payment_method.indexOf(removedOption.id), 1);
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
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
                this.getIncomes();
            },
            'filter.order': function(val){
                this.getIncomes();
            },
            'filter.page_length': function(val){
                this.getIncomes();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>