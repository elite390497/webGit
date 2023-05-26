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
                                                        {{installment.late_fee_balance}}
                                                    </td>
                                                    <td class="text-right" v-text="getInstallmentTotal(installment)"></td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>{{trans('general.total')}}</th>
                                                    <th colspan="2"></th>
                                                    <th class="text-right">{{formatCurrency(getGrandTotal)}}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div>
                                        <h4 class="card-title">{{trans('finance.choose_payment_gateway')}}</h4>
                                        <div class="radio radio-success" v-if="getConfig('razorpay') && razorpay_loaded">
                                            <input type="radio" name="payment_gateway" id="razorpay" value="razorpay" @change="setPaymentGateway('razorpay')">
                                            <label for="razorpay"> 
                                                Razorpay 
                                            </label>
                                        </div>
                                        <div class="radio radio-success" v-if="getConfig('billdesk')">
                                            <input type="radio" name="payment_gateway" id="billdesk" value="billdesk" @change="setPaymentGateway('billdesk')">
                                            <label for="billdesk"> Billdesk </label>
                                        </div>
                                        <div class="radio radio-success" v-if="getConfig('stripe')">
                                            <input type="radio" name="payment_gateway" id="stripe" value="stripe" @change="setPaymentGateway('stripe')">
                                            <label for="stripe"> Stripe </label>
                                        </div>
                                        <div class="radio radio-success" v-if="getConfig('paystack')">
                                            <input type="radio" name="payment_gateway" id="paystack" value="paystack" @change="setPaymentGateway('paystack')">
                                            <label for="paystack"> Paystack </label>
                                        </div>
                                        <div class="radio radio-success" v-if="getConfig('paypal')">
                                            <input type="radio" name="payment_gateway" id="paypal" value="paypal" @change="setPaymentGateway('paypal')">
                                            <label for="paypal"> Paypal </label>
                                        </div>

                                        <p>{{handlingFeeAmount}}</p>
                                        <p>{{totalAmount}}</p>

                                        <template v-if="payment_gateway == 'razorpay'">
                                            <button type="button" class="btn btn-info" @click="callRazorpay">{{trans('general.proceed')}}</button>
                                        </template>

                                        <template v-if="payment_gateway == 'paypal'">
                                            <button type="button" class="btn btn-info" @click="callPaypal" v-if="paypalButton">{{trans('general.proceed')}}</button>
                                        </template>

                                        <template v-if="payment_gateway == 'stripe'">
                                            <div class="row m-t-40">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <input class="form-control" type="number" maxlength="16" value="" v-model="stripe.card_number" :placeholder="trans('finance.card_number')">
                                                    </div>
                                                </div>
                                                <div class="col-3">
                                                    <div class="form-group">
                                                        <input class="form-control" type="number" value="" v-model="stripe.month" :placeholder="trans('finance.card_expiry_month')">
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <input class="form-control" type="number" value="" v-model="stripe.year" :placeholder="trans('finance.card_expiry_year')">
                                                    </div>
                                                </div>
                                                <div class="col-1">
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <input class="form-control" type="number" value="" v-model="stripe.cvc" :placeholder="trans('finance.card_cvc')">
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="button" @click="stripeCheckout" class="btn btn-info waves-effect waves-light pull-right" v-if="stripeButton"><span>{{trans('general.proceed')}}</span></button>
                                        </template>
                                    </div>
                                </form>
                            </div>
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
                default_currency: helper.getConfig('default_currency'),
                payment_gateway: '',
                razorpay_loaded: 0,
                stripe_loaded: 0,
                total: 0,
                stripe: {
                    card_number: '',
                    month: '',
                    year: '',
                    cvc: ''
                },
                stripeButton: true,
                paypalButton: true,
                feePaymentForm: new Form({
                    amount: 0,
                    installment_id: '',
                    date: '',
                    installments: []
                })
            }
        },
        mounted(){
            this.loadFeePayment(this.feePayment);

            if ((this.default_currency.name == 'INR' || !helper.getConfig('mode')) && this.getConfig('razorpay')) {
                this.injectRazorpay();
            }
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            loadFeePayment(feePayment){
                this.feePaymentForm.amount = feePayment.amount;
                this.feePaymentForm.installment_id = feePayment.fee_payment_installment_id;
                this.feePaymentForm.date = feePayment.date;
                this.feePaymentForm.installments = [];
                this.total = 0;
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
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            setPaymentGateway(gateway){
                this.payment_gateway = gateway;
            },
            stripeCheckout(){
                let loader = this.$loading.show();
                this.stripeButton = false;
                Stripe.setPublishableKey(this.getConfig('stripe_publishable_key'));
                Stripe.card.createToken({
                    number: this.stripe.card_number,
                    cvc: this.stripe.cvc,
                    exp_month: this.stripe.month,
                    exp_year: this.stripe.year
                }, this.stripeResponseHandler);
                loader.hide();
            },
            stripeResponseHandler(status, response) {
                if(status == 200){
                    let loader = this.$loading.show();
                    axios.post('/api/student/'+this.uuid+'/payment/'+this.id+'/stripe',{
                            stripeToken: response.id,
                            amount: this.total * 100,
                            fee: this.feePaymentForm.amount,
                            handling_fee: this.handlingFee,
                            fee_installment_id: this.feePaymentForm.installment_id,
                            installments: this.feePaymentForm.installments
                        })
                        .then(response => {
                            loader.hide();
                            toastr.success(response.message);
                            this.$emit('completed');
                            this.stripeButton = true;
                        })
                        .catch(error => {
                            loader.hide();
                            helper.showErrorMsg(error);
                            this.stripeButton = true;
                        })
                } else {
                    toastr.error(response.error.message);
                    this.stripeButton = true;
                }
            },
            injectRazorpay() {
                let vm = this;
                var result = $.Deferred(),
                script = document.createElement("script");

                script.async = "async";
                script.type = "text/javascript";
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = script.onreadystatechange = function(_, isAbort) {
                    if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                        if (isAbort)
                            result.reject();
                        else 
                            result.resolve();
                    }
                    vm.razorpay_loaded = 1;
                };

                script.onerror = function() {
                    result.reject();
                };

                document.head.appendChild(script);

                return result.promise();
            },
            callRazorpay(){
                let vm = this;
                var options = {
                    key: this.getConfig('razorpay_key'),
                    protocol: 'https',
                    hostname: 'api.razorpay.com',
                    amount: this.total * 100,
                    name: helper.getConfig('institute_name'),
                    description: i18n.finance.fee_payment,
                    image: this.getLogo,
                    prefill: {
                        email: "",
                        contact: "",
                        name: ""
                    },
                    notes:{
                        student_record_id: this.id,
                        fee: this.feePaymentForm.amount,
                        handling_fee: this.handlingFee
                    },
                    handler: function (transaction, response){
                        vm.completeRazorpay(transaction.razorpay_payment_id)
                    }
                };

                window.rzpay = new Razorpay(options);
                rzpay.open();
            },
            completeRazorpay(transaction_id){
                let loader = this.$loading.show();
                axios.post('/api/student/'+this.uuid+'/payment/'+this.id+'/rzp',{
                        transaction_id: transaction_id,
                        installments: this.feePaymentForm.installments,
                        fee_installment_id: this.feePaymentForm.installment_id
                    })
                    .then(response => {
                        loader.hide();
                        toastr.success(response.message);
                        this.$emit('completed');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            callPaypal(){
                this.paypalButton = false;
                let loader = this.$loading.show();
                axios.post('/api/student/'+this.uuid+'/payment/'+this.id+'/paypal',{
                        amount: this.total,
                        fee: this.feePaymentForm.amount,
                        handling_fee: this.handlingFee,
                        fee_installment_id: this.feePaymentForm.installment_id,
                        installments: this.feePaymentForm.installments
                    })
                    .then(response => {
                        loader.hide();
                        window.location = response;
                    })
                    .catch(error => {
                        loader.hide();
                        this.paypalButton = true
                        helper.showErrorMsg(error);
                    })
                ;
            }
        },
        computed: {
            getLogo(){
                return helper.getLogo();
            },
            handlingFee(){
                let handling_fee = 0;

                if (!this.payment_gateway)
                    return handling_fee;

                if (! helper.getConfig(this.payment_gateway+'_charge_handling_fee'))
                    return handling_fee;

                if(helper.getConfig(this.payment_gateway+'_fixed_handling_fee'))
                    handling_fee = helper.getConfig(this.payment_gateway+'_handling_fee');
                else {
                    let percentage = helper.getConfig(this.payment_gateway+'_handling_fee');
                    handling_fee = this.feePaymentForm.amount * (percentage / 100);
                }

                return helper.formatNumber(handling_fee);
            },
            handlingFeeAmount(){
                if (! helper.getConfig(this.payment_gateway+'_charge_handling_fee'))
                    return;

                return i18n.finance.handling_fee+' '+helper.formatCurrency(this.handlingFee);
            },
            totalAmount(){
                return i18n.finance.payable_amount+' '+helper.formatCurrency(this.total);
            },
            getGrandTotal(){
                let total = 0;
                total = total;

                if(!Array.isArray(this.feePaymentForm.installments))
                    return total;

                this.feePaymentForm.installments.forEach(installment => {
                    total += (installment.installment_balance + parseInt(installment.late_fee_balance));
                })  
                total = (total) ? (total + this.handlingFee) : total;
                this.total = total; 
                return total;
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
<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>