<template>
    <div class="card card-form">
        <div class="card-body">
			<h4 class="card-title">{{trans('student.pay_registration_fee')}} {{formatCurrency(registration.registration_fee)}}</h4>
		    <form @submit.prevent="submit" @keydown="registrationFeeForm.errors.clear($event.target.name)">
		        <div class="row">
		            <div class="col-12 col-sm-6">
		                <div class="form-group">
		                    <label for="">{{trans('finance.account')}}</label>
		                    <v-select label="name" v-model="selected_account" name="account_id" id="account_id" :options="accounts" :placeholder="trans('account.select_account')" @select="onAccountSelect" @close="registrationFeeForm.errors.clear('account_id')" @remove="registrationFeeForm.account_id = ''">
                                <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
		                    <show-error :form-name="registrationFeeForm" prop-name="account_id"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-6">
		                <div class="form-group">
		                    <label for="">{{trans('finance.date_of_payment')}}</label>
		                    <datepicker v-model="registrationFeeForm.date" :bootstrapStyling="true" @selected="registrationFeeForm.errors.clear('date')" :placeholder="trans('student.date_of_payment')"></datepicker>
		                    <show-error :form-name="registrationFeeForm" prop-name="date"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-6">
		                <div class="form-group">
		                    <label for="">{{trans('finance.payment_method')}}</label>
		                    <v-select label="name" v-model="selected_payment_method" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('payment_method.select_payment_method')" @select="onPaymentMethodSelect" @close="registrationFeeForm.errors.clear('payment_method_id')" @remove="onPaymentMethodRemove">
                                <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
		                    <show-error :form-name="registrationFeeForm" prop-name="payment_method_id"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_number')">
		                <div class="form-group">
		                    <label for="">{{trans('finance.instrument_number')}}</label>
                    		<input class="form-control" type="text" v-model="registrationFeeForm.instrument_number" name="instrument_number" :placeholder="trans('finance.instrument_number')">
		                    <show-error :form-name="registrationFeeForm" prop-name="instrument_number"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_date')">
		                <div class="form-group">
		                    <label for="">{{trans('finance.instrument_date')}}</label>
		                    <datepicker v-model="registrationFeeForm.instrument_date" :bootstrapStyling="true" @selected="registrationFeeForm.errors.clear('instrument_date')" :placeholder="trans('finance.instrument_date')"></datepicker>
		                    <show-error :form-name="registrationFeeForm" prop-name="instrument_date"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_bank_detail')">
		                <div class="form-group">
		                    <label for="">{{trans('finance.instrument_bank_detail')}}</label>
                    		<input class="form-control" type="text" v-model="registrationFeeForm.instrument_bank_detail" name="instrument_bank_detail" :placeholder="trans('finance.instrument_bank_detail')">
		                    <show-error :form-name="registrationFeeForm" prop-name="instrument_bank_detail"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_clearing_date')">
		                <div class="form-group">
		                    <label for="">{{trans('finance.instrument_clearing_date')}}</label>
		                    <datepicker v-model="registrationFeeForm.instrument_clearing_date" :bootstrapStyling="true" @selected="registrationFeeForm.errors.clear('instrument_clearing_date')" :placeholder="trans('finance.instrument_clearing_date')"></datepicker>
		                    <show-error :form-name="registrationFeeForm" prop-name="instrument_clearing_date"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('reference_number')">
		                <div class="form-group">
		                    <label for="">{{trans('finance.reference_number')}}</label>
                    		<input class="form-control" type="text" v-model="registrationFeeForm.reference_number" name="reference_number" :placeholder="trans('finance.reference_number')">
		                    <show-error :form-name="registrationFeeForm" prop-name="reference_number"></show-error>
		                </div>
		            </div>
		            <div class="col-12 col-sm-12">
		                <div class="form-group">
		                    <label for="">{{trans('student.registration_fee_remarks')}}</label>
		                    <autosize-textarea v-model="registrationFeeForm.remarks" rows="2" name="remarks" :placeholder="trans('student.registration_fee_remarks')"></autosize-textarea>
		                    <show-error :form-name="registrationFeeForm" prop-name="remarks"></show-error>
		                </div>
		            </div>
		        </div>
                <div class="card-footer text-right">
                    <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                </div>
		    </form>
		</div>
	</div>
</template>

<script>
	export default {
		components: {},
		props: ['registration'],
		data() {
			return {
                registrationFeeForm: new Form({
                    account_id: '',
                    payment_method_id: '',
                    date: '',
                    instrument_date: '',
                    instrument_number: '',
                    instrument_clearing_date: '',
                    instrument_bank_detail: '',
                    reference_number: '',
                    remarks: ''
                }),
                selected_account: null,
                accounts: [],
                payment_methods: [],
                selected_payment_method: null,
                payment_method_details: [],
                payment_method_detail: {}
			}
		},
		mounted() {
			this.getPreRequisite();
		},
		methods: {
			getPreRequisite(){
				let loader = this.$loading.show();
	            axios.get('/api/registration/fee/pre-requisite')
	                .then(response => {
	                    this.accounts = response.accounts;
	                    this.payment_methods = response.payment_methods;
	                    this.payment_method_details = response.payment_method_details;
	                    loader.hide();
	                })
	                .catch(error => {
	                    loader.hide();
	                    helper.showErrorMsg(error);
	                });
			},
			getPaymentMethodDetail(field){
				return helper.getPaymentMethodDetail(this.payment_method_detail, field);
			},
			onAccountSelect(selectedOption){
				this.registrationFeeForm.account_id = selectedOption.id;
			},
			onPaymentMethodSelect(selectedOption){
				this.registrationFeeForm.payment_method_id = selectedOption.id;
				this.payment_method_detail = this.payment_method_details.find(o => o.id == selectedOption.id);
			},
			onPaymentMethodRemove(removedOption){
				this.registrationFeeForm.payment_method_id = '';
				this.payment_method_detail = null;
			},
			formatCurrency(amount){
				return helper.formatCurrency(amount);
			},
			submit(){
				let loader = this.$loading.show();
				this.registrationFeeForm.post('/api/registration/'+this.registration.id+'/fee/payment')
					.then(response => {
						toastr.success(response.message);
						this.selected_account = null;
						this.$emit('completed');
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			}
		}
	}
</script>