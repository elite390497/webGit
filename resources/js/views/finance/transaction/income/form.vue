<template>
    <div>
        <form @submit.prevent="proceed" @keydown="incomeForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.transaction_category')}} </label> <button type="button" class="btn btn-xs btn-info pull-right" v-if="hasPermission('access-configuration')" @click="showTransactionCategoryModal = true">{{trans('general.add_new')}}</button>
                        <v-select label="name" v-model="selected_transaction_category" name="transaction_category_id" id="transaction_category_id" :options="transaction_categories" :placeholder="trans('finance.select_transaction_category')" @select="onTransactionCategorySelect" @close="incomeForm.errors.clear('transaction_category_id')" @remove="incomeForm.transaction_category_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!transaction_categories.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="incomeForm" prop-name="transaction_category_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.account')}} </label>
                        <v-select label="name" v-model="selected_account" name="account_id" id="account_id" :options="accounts" :placeholder="trans('finance.select_account')" @select="onAccountSelect" @close="incomeForm.errors.clear('account_id')" @remove="incomeForm.account_id = ''" :disabled="uuid ? true : false">
                            <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="incomeForm" prop-name="account_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.amount')}}</label>
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="amount" :placeholder="trans('finance.amount')" v-model="incomeForm.amount" @input.native="incomeForm.errors.clear('amount')"></currency-input>
                        <show-error :form-name="incomeForm" prop-name="amount"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.date_of_income')}}</label>
                        <datepicker v-model="incomeForm.date_of_income" :bootstrapStyling="true" @selected="incomeForm.errors.clear('date_of_income')" :placeholder="trans('finance.date_of_income')"></datepicker>
                        <show-error :form-name="incomeForm" prop-name="date_of_income"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.payment_method')}} </label> 
                        <v-select label="name" v-model="selected_payment_method" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('finance.select_payment_method')" @select="onPaymentMethodSelect" @close="incomeForm.errors.clear('payment_method_id')" @remove="incomeForm.payment_method_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="incomeForm" prop-name="payment_method_id"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_number')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_number')}}</label>
                		<input class="form-control" type="text" v-model="incomeForm.instrument_number" name="instrument_number" :placeholder="trans('finance.instrument_number')">
	                    <show-error :form-name="incomeForm" prop-name="instrument_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_date')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_date')}}</label>
	                    <datepicker v-model="incomeForm.instrument_date" :bootstrapStyling="true" @selected="incomeForm.errors.clear('instrument_date')" :placeholder="trans('finance.instrument_date')"></datepicker>
	                    <show-error :form-name="incomeForm" prop-name="instrument_date"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_bank_detail')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_bank_detail')}}</label>
                		<input class="form-control" type="text" v-model="incomeForm.instrument_bank_detail" name="instrument_bank_detail" :placeholder="trans('finance.instrument_bank_detail')">
	                    <show-error :form-name="incomeForm" prop-name="instrument_bank_detail"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_clearing_date')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_clearing_date')}}</label>
	                    <datepicker v-model="incomeForm.instrument_clearing_date" :bootstrapStyling="true" @selected="incomeForm.errors.clear('instrument_clearing_date')" :placeholder="trans('finance.instrument_clearing_date')"></datepicker>
	                    <show-error :form-name="incomeForm" prop-name="instrument_clearing_date"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('reference_number')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.reference_number')}}</label>
                		<input class="form-control" type="text" v-model="incomeForm.reference_number" name="reference_number" :placeholder="trans('finance.reference_number')">
	                    <show-error :form-name="incomeForm" prop-name="reference_number"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-9">
                    <div class="form-group">
                        <label for="">{{trans('finance.income_description')}}</label>
                        <autosize-textarea v-model="incomeForm.description" rows="1" name="description" :placeholder="trans('finance.income_description')"></autosize-textarea>
                        <show-error :form-name="incomeForm" prop-name="description"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="incomeForm.upload_token" module="income" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
	        </div>
            <div class="card-footer text-right">
                <router-link to="/finance/transaction/income" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>

        <transition name="modal" v-if="showTransactionCategoryModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('finance.add_new_transaction_category')}}
                                <span class="float-right pointer" @click="showTransactionCategoryModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <transaction-category-form @completed="getPreRequisite" @cancel="showTransactionCategoryModal = false"></transaction-category-form>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    import transactionCategoryForm from '../../../configuration/finance/transaction/category/form'

    export default {
        components: {transactionCategoryForm},
        data() {
            return {
                incomeForm: new Form({
                    transaction_category_id: '',
                    account_id: '',
                    payment_method_id: '',
                    instrument_number: '',
                    instrument_date: '',
                    instrument_clearing_date: '',
                    instrument_bank_detail: '',
                    reference_number: '',
                    amount: '',
                    date_of_income: '',
                    description: '',
                    upload_token: ''
                }),
                transaction_categories: [],
                selected_transaction_category: null,
                accounts: [],
                selected_account: null,
                payment_methods: [],
                selected_payment_method: null,
                payment_method_details: [],
                payment_method_detail: {},
                module_id: '',
                clearAttachment: true,
                showTransactionCategoryModal: false,
                default_currency: helper.getConfig('default_currency')
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-income') && !helper.hasPermission('edit-income')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else
                this.incomeForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                this.showTransactionCategoryModal = false;
                axios.get('/api/income/pre-requisite')
                    .then(response => {
                        this.transaction_categories = response.transaction_categories;
                        this.accounts = response.accounts;
                        this.payment_methods = response.payment_methods;
                        this.payment_method_details = response.payment_method_details;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.incomeForm.post('/api/income')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.incomeForm.upload_token = this.$uuid.v4();
                        this.selected_transaction_category = null;
                        this.selected_account = null;
                        this.selected_payment_method = null;
                        this.payment_method_detail = null;
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/income/'+this.uuid)
                    .then(response => {
                        this.incomeForm.amount = this.formatNumber(response.income.amount);
                        this.incomeForm.date_of_income = response.income.date_of_income;
                        this.incomeForm.description = response.income.description;
                        this.incomeForm.transaction_category_id = response.income.transaction_category_id;
                        this.selected_transaction_category = response.income.transaction_category_id ? {id: response.income.transaction_category_id, name: response.income.transaction_category.name} : null;
                        this.incomeForm.account_id = response.income.transaction.account_id;
                        this.selected_account = response.income.transaction.account_id ? {id: response.income.transaction.account_id, name: response.income.transaction.account.name} : null;
                        this.incomeForm.payment_method_id = response.income.transaction.payment_method_id;
                        this.selected_payment_method = response.income.transaction.payment_method_id ? {id: response.income.transaction.payment_method_id, name: response.income.transaction.payment_method.name} : null;
                        this.incomeForm.instrument_number = response.income.transaction.instrument_number;
                        this.incomeForm.instrument_date = response.income.transaction.instrument_date;
                        this.incomeForm.instrument_clearing_date = response.income.transaction.instrument_clearing_date;
                        this.incomeForm.instrument_bank_detail = response.income.transaction.instrument_bank_detail;
                        this.incomeForm.reference_number = response.income.transaction.reference_number;
                        this.incomeForm.upload_token = response.income.upload_token;
                        this.module_id = response.income.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/finance/transaction/income');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.incomeForm.patch('/api/income/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/transaction/income');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onTransactionCategorySelect(selectedOption){
                this.incomeForm.transaction_category_id = selectedOption.id;
            },
            onAccountSelect(selectedOption){
                this.incomeForm.account_id = selectedOption.id;
            },
            onPaymentMethodSelect(selectedOption){
                this.incomeForm.payment_method_id = selectedOption.id;
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
            }
        }
    }
</script>
