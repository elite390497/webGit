<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.payroll_transaction')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="payroll_transactions.total">{{trans('general.total_result_found',{count : payroll_transactions.total, from: payroll_transactions.from, to: payroll_transactions.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="payroll_transactions.total && !showCreatePanel && hasPermission('create-payroll-transaction')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_payroll_transaction')}}</span></button>
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
                        <help-button @clicked="help_topic = 'employee.payroll.transaction'"></help-button>
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
                                    <label for="">{{trans('employee.employee')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_employees" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeRemove" :selected="selected_employees">
                                        <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getPayrollTransactions">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-payroll-transaction')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('employee.add_new_payroll_transaction')}}</h4>
                        <payroll-transaction-form @completed="getPayrollTransactions" @cancel="showCreatePanel = !showCreatePanel"></payroll-transaction-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="payroll_transactions.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.voucher_number')}}</th>
                                    <th>{{trans('employee.employee')}}</th>
                                    <th>{{trans('employee.payroll_transaction_head')}}</th>
                                    <th>{{trans('finance.account')}}</th>
                                    <th>{{trans('finance.payment_method')}}</th>
                                    <th>{{trans('finance.amount')}}</th>
                                    <th>{{trans('finance.date_of_transaction')}}</th>
                                    <th>{{trans('general.created_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="payroll_transaction in payroll_transactions.data">
                                    <td v-text="getVoucherNumber(payroll_transaction)"></td>
                                    <td>
                                        {{getEmployeeNameWithCode(payroll_transaction.employee)}} <br > {{getEmployeeDesignationOnDate(payroll_transaction.employee, payroll_transaction.date)}}
                                    </td>
                                    <td>
                                        {{trans('employee.payroll_transaction_'+payroll_transaction.head)}}
                                        <span v-if="payroll_transaction.head == 'salary'">({{'#'+getPayrollNumber(payroll_transaction.payroll)}})</span>
                                    </td>
                                    <td v-text="payroll_transaction.account.name"></td>
                                    <td>
                                        <span v-text="payroll_transaction.payment_method.name"></span>
                                        <span v-if="payroll_transaction.instrument_number">
                                            <br /> {{trans('finance.instrument_number')}} <u>{{payroll_transaction.instrument_number}} </u>
                                        </span>
                                        <span v-if="payroll_transaction.instrument_date">
                                            <br /> {{trans('finance.instrument_date')}} <u>{{payroll_transaction.instrument_date | moment}} </u>
                                        </span>
                                        <span v-if="payroll_transaction.instrument_bank_detail">
                                            <br /> {{trans('finance.instrument_bank_detail')}} <u>{{payroll_transaction.instrument_bank_detail}} </u>
                                        </span>
                                        <span v-if="payroll_transaction.instrument_clearing_date">
                                            <br /> {{trans('finance.instrument_clearing_date')}} <u>{{payroll_transaction.instrument_clearing_date | moment}} </u>
                                        </span>
                                        <span v-if="payroll_transaction.reference_number">
                                            <br /> {{trans('finance.reference_number')}} <u>{{payroll_transaction.reference_number}}</u>
                                        </span>
                                    </td>
                                    <td>{{formatCurrency(payroll_transaction.amount)}}</td>
                                    <td>{{payroll_transaction.date | moment}}</td>
                                    <td>{{getEmployeeNameWithCode(payroll_transaction.user.employee)}} <br > {{getEmployeeDesignationOnDate(payroll_transaction.user.employee, payroll_transaction.date)}}</td>
                                    <td>{{payroll_transaction.created_at | momentDateTime}}</td>

                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-payroll-transaction')" v-tooltip="trans('employee.edit_payroll_transaction')" @click.prevent="editPayrollTransaction(payroll_transaction)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('cancel-payroll-transaction')" :key="payroll_transaction.id" v-confirm="{ok: confirmDelete(payroll_transaction)}" v-tooltip="trans('employee.delete_payroll_transaction')"><i class="fas fa-times"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!payroll_transactions.total" module="employee" title="payroll_transaction_module_title" description="payroll_transaction_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-payroll-transaction')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="payroll_transactions" @updateRecords="getPayrollTransactions"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import payrollTransactionForm from './form'

    export default {
        components : {payrollTransactionForm},
        data() {
            return {
                payroll_transactions: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    employee_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date',
                        translation: i18n.finance.date_of_transaction
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                employees: [],
                selected_employees: null,
                showCreatePanel: false,
                showFilterPanel: false,
                showUuid: '',
                help_topic: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-payroll-transaction')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPayrollTransactions();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getVoucherNumber(transaction){
                return helper.getVoucherNumber(transaction);
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            getPayrollNumber(payroll){
                return helper.getPayrollNumber(payroll);
            },
            showAction(payroll_transaction){
                this.showUuid = payroll_transaction.uuid;
                this.showModal = true;
            },
            getPayrollTransactions(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/payroll/transaction?page=' + page + url)
                    .then(response => {
                        this.payroll_transactions = response.payroll_transactions;
                        this.employees = response.filters.employees;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editPayrollTransaction(payroll_transaction){
                this.$router.push('/employee/payroll/transaction/'+payroll_transaction.uuid+'/edit');
            },
            confirmDelete(payroll_transaction){
                return dialog => this.deletePayrollTransaction(payroll_transaction);
            },
            deletePayrollTransaction(payroll_transaction){
                let loader = this.$loading.show();
                axios.delete('/api/employee/payroll/transaction/'+payroll_transaction.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPayrollTransactions();
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
                axios.post('/api/employee/payroll/transaction/print',{filter: this.filter})
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
                axios.post('/api/employee/payroll/transaction/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onEmployeeSelect(selectedOption){
                this.filter.employee_id.push(selectedOption.id);
            },
            onEmployeeRemove(removedOption){
                this.filter.employee_id.splice(this.filter.employee_id.indexOf(removedOption.id), 1);
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
                this.getPayrollTransactions();
            },
            'filter.order': function(val){
                this.getPayrollTransactions();
            },
            'filter.page_length': function(val){
                this.getPayrollTransactions();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>