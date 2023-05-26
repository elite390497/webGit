<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('finance.fee_payment')}}
                            <span class="float-right pointer" @click="$emit('closeFeePaymentForm')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <h4>{{feePayment.fee_group_name}} <span class="pull-right">{{feePayment.date | moment}}</span></h4>
                            <div style="max-height:600px;">
                                <form @submit.prevent="submit" @keydown="feePaymentForm.errors.clear($event.target.name)">
                                    <div class="table-responsive p-2">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>{{trans('finance.fee_installment')}}</th>
                                                    <th class="text-right">{{trans('finance.installment_total')}}</th>
                                                    <th class="text-right">{{trans('finance.late_fee')}}</th>
                                                    <th class="text-right">{{trans('general.total')}}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="installment in feePaymentForm.installments">
                                                    <td v-text="installment.title"></td>
                                                    <td class="text-right" v-text="installment.installment_balance"></td>
                                                    <td class="text-right">
                                                        <template v-if="hasPermission('customize-late-fee')">
                                                            <input type="text" class="invoice-input" v-model="installment.late_fee_balance">
                                                        </template>
                                                        <template v-else>
                                                            {{installment.late_fee_balance}}
                                                        </template>
                                                    </td>
                                                    <td class="text-right" v-text="getInstallmentTotal(installment)"></td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td>{{trans('student.additional_fee_charge')}}</td>
                                                    <td colspan="2">
                                                        <div class="form-group">
                                                            <input class="invoice-input-left" type="text" v-model="feePaymentForm.additional_fee_charge_label" name="additional_fee_charge_label" :placeholder="trans('student.fee_label')">
                                                            <show-error :form-name="feePaymentForm" prop-name="additional_fee_charge_label"></show-error>
                                                        </div>
                                                    </td>
                                                    <td class="text-right">
                                                        <div class="form-group">
                                                            <input class="invoice-input" type="text" v-model="feePaymentForm.additional_fee_charge" name="additional_fee_charge" :placeholder="trans('student.additional_fee_charge')">
                                                            <show-error :form-name="feePaymentForm" prop-name="additional_fee_charge"></show-error>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>{{trans('student.additional_fee_discount')}}</td>
                                                    <td colspan="2">
                                                        <div class="form-group">
                                                            <input class="invoice-input-left" type="text" v-model="feePaymentForm.additional_fee_discount_label" name="additional_fee_discount_label" :placeholder="trans('student.fee_label')">
                                                            <show-error :form-name="feePaymentForm" prop-name="additional_fee_discount_label"></show-error>
                                                        </div>
                                                    </td>
                                                    <td class="text-right">
                                                        <div class="form-group">
                                                            <input class="invoice-input" type="text" v-model="feePaymentForm.additional_fee_discount" name="additional_fee_discount" :placeholder="trans('student.additional_fee_discount')">
                                                            <show-error :form-name="feePaymentForm" prop-name="additional_fee_discount"></show-error>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>{{trans('general.total')}}</th>
                                                    <th colspan="2"></th>
                                                    <th class="text-right">{{formatCurrency(getGrandTotal)}}</th>
                                                </tr>
                                                <tr v-if="hasPermission('make-partial-fee-payment')">
                                                    <th>{{trans('finance.amount')}}</th>
                                                    <th colspan="2"></th>
                                                    <th class="text-right">
                                                        <input class="invoice-input" type="text" v-model="feePaymentForm.amount" name="amount" :placeholder="trans('finance.amount')">
                                                        <show-error :form-name="feePaymentForm" prop-name="amount"></show-error>
                                                    </th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div class="row">
                                        <template v-if="feePaymentForm.amount">
                                            <div class="col-12 col-sm-6">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.account')}}</label>
                                                    <v-select label="name" v-model="selected_account" name="account_id" id="account_id" :options="accounts" :placeholder="trans('account.select_account')" @select="onAccountSelect" @close="feePaymentForm.errors.clear('account_id')" @remove="feePaymentForm.account_id = ''">
                                                        <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                                            {{trans('general.no_option_found')}}
                                                        </div>
                                                    </v-select>
                                                    <show-error :form-name="feePaymentForm" prop-name="account_id"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-6">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.payment_method')}}</label>
                                                    <v-select label="name" v-model="selected_payment_method" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('payment_method.select_payment_method')" @select="onPaymentMethodSelect" @close="feePaymentForm.errors.clear('payment_method_id')" @remove="onPaymentMethodRemove">
                                                        <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                                            {{trans('general.no_option_found')}}
                                                        </div>
                                                    </v-select>
                                                    <show-error :form-name="feePaymentForm" prop-name="payment_method_id"></show-error>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_number')">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.instrument_number')}}</label>
                                                <input class="form-control" type="text" v-model="feePaymentForm.instrument_number" name="instrument_number" :placeholder="trans('finance.instrument_number')">
                                                <show-error :form-name="feePaymentForm" prop-name="instrument_number"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_date')">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.instrument_date')}}</label>
                                                <datepicker v-model="feePaymentForm.instrument_date" :bootstrapStyling="true" @selected="feePaymentForm.errors.clear('instrument_date')" :placeholder="trans('finance.instrument_date')"></datepicker>
                                                <show-error :form-name="feePaymentForm" prop-name="instrument_date"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_bank_detail')">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.instrument_bank_detail')}}</label>
                                                <input class="form-control" type="text" v-model="feePaymentForm.instrument_bank_detail" name="instrument_bank_detail" :placeholder="trans('finance.instrument_bank_detail')">
                                                <show-error :form-name="feePaymentForm" prop-name="instrument_bank_detail"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('instrument_clearing_date')">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.instrument_clearing_date')}}</label>
                                                <datepicker v-model="feePaymentForm.instrument_clearing_date" :bootstrapStyling="true" @selected="feePaymentForm.errors.clear('instrument_clearing_date')" :placeholder="trans('finance.instrument_clearing_date')"></datepicker>
                                                <show-error :form-name="feePaymentForm" prop-name="instrument_clearing_date"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6" v-if="getPaymentMethodDetail('reference_number')">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.reference_number')}}</label>
                                                <input class="form-control" type="text" v-model="feePaymentForm.reference_number" name="reference_number" :placeholder="trans('finance.reference_number')">
                                                <show-error :form-name="feePaymentForm" prop-name="reference_number"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-12">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.fee_payment_remarks')}}</label>
                                                <autosize-textarea v-model="feePaymentForm.remarks" rows="2" name="remarks" :placeholder="trans('finance.fee_payment_remarks')"></autosize-textarea>
                                                <show-error :form-name="feePaymentForm" prop-name="remarks"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-info waves-effect waves-light pull-right">{{trans('general.save')}}</button>
                                </form>
                            </div>
                            <div class="clearfix"></div>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        components: {},
        props: ['id','uuid','feePayment'],
        data() {
            return {
                feePaymentForm: new Form({
                    amount: 0,
                    additional_fee_discount: 0,
                    additional_fee_charge: 0,
                    additional_fee_charge_label: '',
                    additional_fee_discount_label: '',
                    installments: [],
                    installment_id: '',
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
                total: 0,
                selected_account: null,
                accounts: [],
                payment_methods: [],
                selected_payment_method: null,
                payment_method_details: [],
                payment_method_detail: {}
            }
        },
        mounted() {
            this.loadFeePayment(this.feePayment);
            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            loadFeePayment(feePayment){
                this.feePaymentForm.date = feePayment.date;
                this.feePaymentForm.installment_id = feePayment.fee_payment_installment_id;
                this.feePaymentForm.amount = feePayment.amount;
                this.total = 0;
                this.feePaymentForm.installments = [];
                feePayment.installments.forEach(installment => {
                    this.feePaymentForm.installments.push({
                        fee_installment_id: installment.fee_installment_id,
                        title: installment.title,
                        installment_balance: installment.installment_balance,
                        late_fee_balance: installment.late_fee_balance
                    });
                })
            },
            getInstallmentTotal(installment){
                return (installment.installment_balance + parseInt(installment.late_fee_balance));
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/student/fee/pre-requisite')
                    .then(response => {
                        this.accounts = response.accounts;
                        this.payment_methods = response.payment_methods;
                        this.payment_method_details = response.payment_method_details;
                        this.selected_payment_method = response.selected_payment_method;
                        this.feePaymentForm.payment_method_id = response.selected_payment_method ? response.selected_payment_method.id : '';
                        this.selected_account = response.selected_account;
                        this.feePaymentForm.account_id = response.selected_account ? response.selected_account.id : '';
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
                this.feePaymentForm.account_id = selectedOption.id;
            },
            onPaymentMethodSelect(selectedOption){
                this.feePaymentForm.payment_method_id = selectedOption.id;
                this.payment_method_detail = this.payment_method_details.find(o => o.id == selectedOption.id);
            },
            onPaymentMethodRemove(removedOption){
                this.feePaymentForm.payment_method_id = '';
                this.payment_method_detail = null;
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            submit(){
                let loader = this.$loading.show();
                this.feePaymentForm.post('/api/student/'+this.uuid+'/payment/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        this.selected_account = null;
                        this.selected_payment_method = null;
                        this.feePaymentForm.installments = [];
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        computed: {
            getGrandTotal(){
                let total = 0;

                if(!Array.isArray(this.feePaymentForm.installments))
                    return total;

                this.feePaymentForm.installments.forEach(installment => {
                    total += (installment.installment_balance + parseInt(installment.late_fee_balance));
                })   
                return total + +this.feePaymentForm.additional_fee_charge - +this.feePaymentForm.additional_fee_discount;
            }
        },
        watch: {
            feePayment(val){
                this.loadFeePayment(val);
            },
            getGrandTotal(val){
                this.feePaymentForm.amount = val;
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
    }
</script>