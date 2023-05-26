<template>
    <div>
        <form @submit.prevent="proceed" @keydown="accountTransferForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.from_account')}} </label> 
                        <v-select label="name" v-model="selected_from_account" name="from_account_id" id="from_account_id" :options="accounts" :placeholder="trans('finance.select_from_account')" @select="onFromAccountSelect" @close="accountTransferForm.errors.clear('from_account_id')" @remove="accountTransferForm.from_account_id = ''" :disabled="uuid ? true : false">
                            <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="accountTransferForm" prop-name="from_account_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.to_account')}} </label> 
                        <v-select label="name" v-model="selected_to_account" name="to_account_id" id="to_account_id" :options="accounts" :placeholder="trans('finance.select_to_account')" @select="onToAccountSelect" @close="accountTransferForm.errors.clear('to_account_id')" @remove="accountTransferForm.to_account_id = ''" :disabled="uuid ? true : false">
                            <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="accountTransferForm" prop-name="to_account_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.amount')}}</label>
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="amount" :placeholder="trans('finance.amount')" v-model="accountTransferForm.amount" @input.native="accountTransferForm.errors.clear('amount')"></currency-input>
                        <show-error :form-name="accountTransferForm" prop-name="amount"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.date_of_account_transfer')}}</label>
                        <datepicker v-model="accountTransferForm.date_of_account_transfer" :bootstrapStyling="true" @selected="accountTransferForm.errors.clear('date_of_account_transfer')" :placeholder="trans('finance.date_of_account_transfer')"></datepicker>
                        <show-error :form-name="accountTransferForm" prop-name="date_of_account_transfer"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('finance.payment_method')}} </label> 
                        <v-select label="name" v-model="selected_payment_method" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('finance.select_payment_method')" @select="onPaymentMethodSelect" @close="accountTransferForm.errors.clear('payment_method_id')" @remove="accountTransferForm.payment_method_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="accountTransferForm" prop-name="payment_method_id"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_number')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_number')}}</label>
                		<input class="form-control" type="text" v-model="accountTransferForm.instrument_number" name="instrument_number" :placeholder="trans('finance.instrument_number')">
	                    <show-error :form-name="accountTransferForm" prop-name="instrument_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_date')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_date')}}</label>
	                    <datepicker v-model="accountTransferForm.instrument_date" :bootstrapStyling="true" @selected="accountTransferForm.errors.clear('instrument_date')" :placeholder="trans('finance.instrument_date')"></datepicker>
	                    <show-error :form-name="accountTransferForm" prop-name="instrument_date"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_bank_detail')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_bank_detail')}}</label>
                		<input class="form-control" type="text" v-model="accountTransferForm.instrument_bank_detail" name="instrument_bank_detail" :placeholder="trans('finance.instrument_bank_detail')">
	                    <show-error :form-name="accountTransferForm" prop-name="instrument_bank_detail"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('instrument_clearing_date')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.instrument_clearing_date')}}</label>
	                    <datepicker v-model="accountTransferForm.instrument_clearing_date" :bootstrapStyling="true" @selected="accountTransferForm.errors.clear('instrument_clearing_date')" :placeholder="trans('finance.instrument_clearing_date')"></datepicker>
	                    <show-error :form-name="accountTransferForm" prop-name="instrument_clearing_date"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3" v-if="getPaymentMethodDetail('reference_number')">
	                <div class="form-group">
	                    <label for="">{{trans('finance.reference_number')}}</label>
                		<input class="form-control" type="text" v-model="accountTransferForm.reference_number" name="reference_number" :placeholder="trans('finance.reference_number')">
	                    <show-error :form-name="accountTransferForm" prop-name="reference_number"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-9">
                    <div class="form-group">
                        <label for="">{{trans('finance.account_transfer_description')}}</label>
                        <autosize-textarea v-model="accountTransferForm.description" rows="1" name="description" :placeholder="trans('finance.account_transfer_description')"></autosize-textarea>
                        <show-error :form-name="accountTransferForm" prop-name="description"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="accountTransferForm.upload_token" module="account-transfer" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
	        </div>
            <div class="card-footer text-right">
                <router-link to="/finance/transaction/account/transfer" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
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
        components: {},
        data() {
            return {
                accountTransferForm: new Form({
                    from_account_id: '',
                    to_account_id: '',
                    payment_method_id: '',
                    instrument_number: '',
                    instrument_date: '',
                    instrument_clearing_date: '',
                    instrument_bank_detail: '',
                    reference_number: '',
                    amount: '',
                    date_of_account_transfer: '',
                    description: '',
                    upload_token: ''
                }),
                accounts: [],
                selected_from_account: null,
                selected_to_account: null,
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
            if(!helper.hasPermission('create-account-transfer') && !helper.hasPermission('edit-account-transfer')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else
                this.accountTransferForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                this.showTransactionCategoryModal = false;
                axios.get('/api/account/transfer/pre-requisite')
                    .then(response => {
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
                this.accountTransferForm.post('/api/account/transfer')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.accountTransferForm.upload_token = this.$uuid.v4();
                        this.selected_from_account = null;
                        this.selected_to_account = null;
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
                axios.get('/api/account/transfer/'+this.uuid)
                    .then(response => {
                        this.accountTransferForm.amount = this.formatNumber(response.account_transfer.amount);
                        this.accountTransferForm.date_of_account_transfer = response.account_transfer.date_of_account_transfer;
                        this.accountTransferForm.description = response.account_transfer.description;
                        this.accountTransferForm.from_account_id = response.account_transfer.from_account_id;
                        this.selected_account = response.account_transfer.from_account_id ? {id: response.account_transfer.from_account_id, name: response.account_transfer.from_account.name} : null;
                        this.accountTransferForm.to_account_id = response.account_transfer.to_account_id;
                        this.selected_account = response.account_transfer.to_account_id ? {id: response.account_transfer.to_account_id, name: response.account_transfer.to_account.name} : null;
                        this.accountTransferForm.payment_method_id = response.account_transfer.transaction.payment_method_id;
                        this.selected_payment_method = response.account_transfer.transaction.payment_method_id ? {id: response.account_transfer.transaction.payment_method_id, name: response.account_transfer.transaction.payment_method.name} : null;
                        this.accountTransferForm.instrument_number = response.account_transfer.transaction.instrument_number;
                        this.accountTransferForm.instrument_date = response.account_transfer.transaction.instrument_date;
                        this.accountTransferForm.instrument_clearing_date = response.account_transfer.transaction.instrument_clearing_date;
                        this.accountTransferForm.instrument_bank_detail = response.account_transfer.transaction.instrument_bank_detail;
                        this.accountTransferForm.reference_number = response.account_transfer.transaction.reference_number;
                        this.accountTransferForm.upload_token = response.account_transfer.upload_token;
                        this.module_id = response.account_transfer.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/finance/transaction/account/transfer');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.accountTransferForm.patch('/api/account/transfer/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/transaction/account/transfer');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onFromAccountSelect(selectedOption){
                this.accountTransferForm.from_account_id = selectedOption.id;
            },
            onToAccountSelect(selectedOption){
                this.accountTransferForm.to_account_id = selectedOption.id;
            },
            onPaymentMethodSelect(selectedOption){
                this.accountTransferForm.payment_method_id = selectedOption.id;
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
