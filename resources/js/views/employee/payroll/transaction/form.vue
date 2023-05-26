<template>
    <div class="m-t-10">
        <form @submit.prevent="proceed" @keydown="payrollTransactionForm.errors.clear($event.target.name)">
            <div class="row">
                <template v-if="!uuid">
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('employee.payroll_transaction_head')}}</label>
                            <select v-model="payrollTransactionForm.head" class="custom-select col-12" name="head" @change="onPayrollTransactionHeadChange">
                              <option v-for="option in payroll_transaction_heads" v-bind:value="option.value">
                                {{ option.text }}
                              </option>
                            </select>
                            <show-error :form-name="payrollTransactionForm" prop-name="head"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('employee.employee')}}</label>
                            <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="payrollTransactionForm.errors.clear('employee_id')" @remove="payrollTransactionForm.employee_id = ''">
                                <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
                            <show-error :form-name="payrollTransactionForm" prop-name="employee_id"></show-error>
                            <span class="help-block font-80pc" v-if="payrollTransactionForm.head == 'salary' && payrollTransactionForm.employee_id">
                                <span v-if="payroll.id" class="text-success">{{trans('employee.payroll_transaction_unpaid_payroll_info', {number: payroll.number, balance: formatCurrency(payroll.balance), period: getUnpaidPayrollPeriod})}}</span>
                                <span v-else class="text-danger">{{trans('employee.payroll_transaction_no_unpaid_payroll')}}</span>
                            </span>
                            <span class="help-block font-80pc" v-if="payrollTransactionForm.head == 'advance_return' && payrollTransactionForm.employee_id">
                                {{trans('employee.payroll_transaction_advance_returnable', {balance: formatCurrency(advance_balance)})}}
                            </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <p class="m-t-20">
                                {{trans('employee.payroll_transaction_'+payroll_transaction.head)}}
                            </p>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <p class="m-t-20" v-if="payroll_transaction.id">
                                {{getEmployeeNameWithCode(payroll_transaction.employee)}} <br />
                                {{getEmployeeDesignationOnDate(payroll_transaction.employee, payroll_transaction.date_of_transaction)}} <br />
                            </p>
                        </div>
                    </div>
                </template>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.account')}}</label>
                        <v-select label="name" v-model="selected_account" name="account_id" id="account_id" :options="accounts" :placeholder="trans('finance.select_account')" @select="onAccountSelect" @close="payrollTransactionForm.errors.clear('account_id')" @remove="payrollTransactionForm.account_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="payrollTransactionForm" prop-name="account_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.amount')}}</label>
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="amount" :placeholder="trans('finance.amount')" v-model="payrollTransactionForm.amount" @input.native="payrollTransactionForm.errors.clear('amount')"></currency-input>
                        <show-error :form-name="payrollTransactionForm" prop-name="amount"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.date_of_transaction')}}</label>
                        <datepicker v-model="payrollTransactionForm.date_of_transaction" :bootstrapStyling="true" @selected="payrollTransactionForm.errors.clear('date_of_transaction')" :placeholder="trans('finance.date_of_transaction')"></datepicker>
                        <show-error :form-name="payrollTransactionForm" prop-name="date_of_transaction"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.payment_method')}}</label>
                        <v-select label="name" v-model="selected_payment_method" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('finance.select_payment_method')" @select="onPaymentMethodSelect" @close="payrollTransactionForm.errors.clear('payment_method_id')" @remove="payrollTransactionForm.payment_method_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="payrollTransactionForm" prop-name="payment_method_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_number')">
                    <div class="form-group">
                        <label for="">{{trans('finance.instrument_number')}}</label>
                        <input class="form-control" type="text" v-model="payrollTransactionForm.instrument_number" name="instrument_number" :placeholder="trans('finance.instrument_number')">
                        <show-error :form-name="payrollTransactionForm" prop-name="instrument_number"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_date')">
                    <div class="form-group">
                        <label for="">{{trans('finance.instrument_date')}}</label>
                        <datepicker v-model="payrollTransactionForm.instrument_date" :bootstrapStyling="true" @selected="payrollTransactionForm.errors.clear('instrument_date')" :placeholder="trans('finance.instrument_date')"></datepicker>
                        <show-error :form-name="payrollTransactionForm" prop-name="instrument_date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_bank_detail')">
                    <div class="form-group">
                        <label for="">{{trans('finance.instrument_bank_detail')}}</label>
                        <input class="form-control" type="text" v-model="payrollTransactionForm.instrument_bank_detail" name="instrument_bank_detail" :placeholder="trans('finance.instrument_bank_detail')">
                        <show-error :form-name="payrollTransactionForm" prop-name="instrument_bank_detail"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_clearing_date')">
                    <div class="form-group">
                        <label for="">{{trans('finance.instrument_clearing_date')}}</label>
                        <datepicker v-model="payrollTransactionForm.instrument_clearing_date" :bootstrapStyling="true" @selected="payrollTransactionForm.errors.clear('instrument_clearing_date')" :placeholder="trans('finance.instrument_clearing_date')"></datepicker>
                        <show-error :form-name="payrollTransactionForm" prop-name="instrument_clearing_date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('reference_number')">
                    <div class="form-group">
                        <label for="">{{trans('finance.reference_number')}}</label>
                        <input class="form-control" type="text" v-model="payrollTransactionForm.reference_number" name="reference_number" :placeholder="trans('finance.reference_number')">
                        <show-error :form-name="payrollTransactionForm" prop-name="reference_number"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('employee.payroll_transaction_remarks')}}</label>
                        <autosize-textarea v-model="payrollTransactionForm.remarks" rows="1" name="remarks" :placeholder="trans('employee.payroll_transaction_remarks')"></autosize-textarea>
                        <show-error :form-name="payrollTransactionForm" prop-name="remarks"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="payrollTransactionForm.upload_token" module="transaction" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/employee/payroll/transaction" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>

    export default {
        components : {},
        props:['uuid'],
        data() {
            return {
                payrollTransactionForm: new Form({
                    employee_id: '',
                    head: 'salary',
                    account_id: '',
                    amount: '',
                    date_of_transaction: '',
                    payment_method_id: '',
                    instrument_number: '',
                    instrument_date: '',
                    instrument_clearing_date: '',
                    instrument_bank_detail: '',
                    reference_number: '',
                    remarks: '',
                    upload_token: ''
                }),
                payroll_transaction: {},
                advance_balance: 0,
                payroll: {},
                employees: [],
                selected_employee: null,
                accounts: [],
                selected_account: null,
                payment_methods: [],
                selected_payment_method: null,
                payment_method_details: [],
                payment_method_detail: {},
                module_id: '',
                clearAttachment: true,
                default_currency: helper.getConfig('default_currency'),
                payroll_transaction_heads: [
                    {
                        text: i18n.employee.payroll_transaction_salary,
                        value: 'salary'
                    },
                    {
                        text: i18n.employee.payroll_transaction_advance,
                        value: 'advance'
                    },
                    {
                        text: i18n.employee.payroll_transaction_advance_return,
                        value: 'advance_return'
                    },
                    {
                        text: i18n.employee.payroll_transaction_other_payment,
                        value: 'other_payment'
                    },
                    {
                        text: i18n.employee.payroll_transaction_other_receipt,
                        value: 'other_receipt'
                    }
                ]
            }
        },
        mounted(){
            if(!helper.hasPermission('create-payroll-transaction') && !helper.hasPermission('edit-payroll-transaction')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else
                this.payrollTransactionForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
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
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/transaction/pre-requisite')
                    .then(response => {
                        loader.hide();
                        this.employees = response.employees;
                        this.accounts = response.accounts;
                        this.payment_methods = response.payment_methods;
                        this.payment_method_details = response.payment_method_details;
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            fetchUnpaidPayroll(){
                if (this.payrollTransactionForm.head != 'salary' || ! this.payrollTransactionForm.employee_id)
                    return;

                let loader = this.$loading.show();
                axios.post('/api/employee/payroll/unpaid', {
                        employee_id: this.payrollTransactionForm.employee_id
                    })
                    .then(response => {
                        this.payroll = response.payroll || {};
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            fetchAdvanceBalance(){
                if (this.payrollTransactionForm.head != 'advance_return' || ! this.payrollTransactionForm.employee_id)
                    return;

                let loader = this.$loading.show();
                axios.post('/api/employee/payroll/transaction/advance/balance', {
                        employee_id: this.payrollTransactionForm.employee_id
                    })
                    .then(response => {
                        this.advance_balance = response.balance || 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onPayrollTransactionHeadChange(){
                this.payrollTransactionForm.errors.clear('head');
                this.fetchUnpaidPayroll();
                this.fetchAdvanceBalance();
            },
            onEmployeeSelect(selectedOption){
                this.payrollTransactionForm.employee_id = selectedOption.id;
                this.fetchUnpaidPayroll();
                this.fetchAdvanceBalance();
            },
            onAccountSelect(selectedOption){
                this.payrollTransactionForm.account_id = selectedOption.id;
            },
            onPaymentMethodSelect(selectedOption){
                this.payrollTransactionForm.payment_method_id = selectedOption.id;
                this.payment_method_detail = this.payment_method_details.find(o => o.id == selectedOption.id);
            },
            formatCurrency(price){
                return helper.formatCurrency(price);
            },
            formatNumber(number){
                return helper.formatNumber(number, this.default_currency.decimal_place)
            },
            getPaymentMethodDetail(field){
                return helper.getPaymentMethodDetail(this.payment_method_detail, field);
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.payrollTransactionForm.post('/api/employee/payroll/transaction')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.clearAttachment = !this.clearAttachment;
                        this.payrollTransactionForm.upload_token = this.$uuid.v4();
                        this.selected_employee = null;
                        this.selected_transaction_category = null;
                        this.selected_account = null;
                        this.selected_payment_method = null;
                        this.payment_method_detail = null;
                        this.payrollTransactionForm.head = 'salary';
                        this.$emit('completed');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/transaction/'+this.uuid)
                    .then(response => {
                        this.payroll_transaction = response.payroll_transaction;
                        this.payrollTransactionForm.head = response.payroll_transaction.head;
                        this.payrollTransactionForm.employee_id = response.payroll_transaction.employee_id;
                        this.selected_employee = response.selected_employee;
                        this.payrollTransactionForm.account_id = response.payroll_transaction.account_id;
                        this.selected_account = response.payroll_transaction.account_id ? {id: response.payroll_transaction.account_id, name: response.payroll_transaction.account.name} : null;
                        this.payrollTransactionForm.amount = this.formatNumber(response.payroll_transaction.amount);
                        this.payrollTransactionForm.date_of_transaction = response.payroll_transaction.date;
                        this.payrollTransactionForm.payment_method_id = response.payroll_transaction.payment_method_id;
                        this.selected_payment_method = response.payroll_transaction.payment_method_id ? {id: response.payroll_transaction.payment_method_id, name: response.payroll_transaction.payment_method.name} : null;
                        this.payrollTransactionForm.instrument_number = response.payroll_transaction.instrument_number;
                        this.payrollTransactionForm.instrument_date = response.payroll_transaction.instrument_date;
                        this.payrollTransactionForm.instrument_clearing_date = response.payroll_transaction.instrument_clearing_date;
                        this.payrollTransactionForm.instrument_bank_detail = response.payroll_transaction.instrument_bank_detail;
                        this.payrollTransactionForm.reference_number = response.payroll_transaction.reference_number;
                        this.payrollTransactionForm.remarks = response.payroll_transaction.remarks;
                        this.payrollTransactionForm.upload_token = response.payroll_transaction.upload_token;
                        this.module_id = response.payroll_transaction.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/employee/payroll/transaction');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.payrollTransactionForm.patch('/api/employee/payroll/transaction/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/employee/payroll/transaction');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        computed: {
            getUnpaidPayrollPeriod(){
                return helper.formatDate(this.payroll.start_date)+' '+i18n.general.to+' '+helper.formatDate(this.payroll.end_date);
            }
        }
    }
</script>