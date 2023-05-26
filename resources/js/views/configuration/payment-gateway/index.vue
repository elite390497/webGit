<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.payment_gateway')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/dashboard')"><i class="fas fa-home"></i> <span class="d-none d-sm-inline">{{trans('general.home')}}</span></button>
                        <help-button @clicked="help_topic = 'configuration.payment_gateway'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-md-4">
                                <div class="form-group">
	                                <label class="custom-control custom-checkbox">
	                                    <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.paypal" name="paypal">
	                                    <span class="custom-control-label">Paypal</span>
	                                </label>
                                </div>
                                <template v-if="configForm.paypal">
                                    <div class="form-group">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.paypal_mode" name="paypal_mode">
                                            <span class="custom-control-label">Paypal Live Mode</span>
                                        </label>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Paypal Client Id</label>
                                        <input class="form-control" type="text" value="" v-model="configForm.paypal_client_id" name="paypal_client_id" placeholder="Paypal Client Id">
                                        <show-error :form-name="configForm" prop-name="paypal_client_id"></show-error>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Paypal Client Secret</label>
                                        <input class="form-control" type="text" value="" v-model="configForm.paypal_client_secret" name="paypal_client_secret" placeholder="Paypal Client Secret">
                                        <show-error :form-name="configForm" prop-name="paypal_client_secret"></show-error>
                                    </div>
                                    <div class="form-group">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.paypal_charge_handling_fee" name="paypal_charge_handling_fee">
                                            <span class="custom-control-label">{{trans('finance.charge_gateway_handling_fee')}}</span>
                                        </label>
                                    </div>
                                    <template v-if="configForm.paypal_charge_handling_fee">
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.paypal_fixed_handling_fee" name="paypal_fixed_handling_fee">
                                                <span class="custom-control-label">{{trans('finance.fixed_gateway_handling_fee')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label for="">{{trans('finance.gateway_handling_fee', {gateway : 'Paypal'})}}</label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" value="" v-model="configForm.paypal_handling_fee" name="paypal_handling_fee" :placeholder="trans('finance.gateway_handling_fee', {gateway : 'Paypal'})">
                                                <div class="input-group-append">
                                                    <span class="input-group-text" v-if="configForm.paypal_fixed_handling_fee">{{default_currency.symbol}}</span>
                                                    <span class="input-group-text" v-else>%</span>
                                                </div>
                                            </div>
                                            <show-error :form-name="configForm" prop-name="paypal_handling_fee"></show-error>
                                        </div>
                                    </template>
                                </template>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="form-group">
	                                <label class="custom-control custom-checkbox">
	                                    <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.stripe" name="stripe">
	                                    <span class="custom-control-label">Stripe</span>
	                                </label>
                                </div>
                                <template v-if="configForm.stripe">
                                    <div class="form-group">
    	                                <label class="custom-control custom-checkbox">
    	                                    <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.stripe_mode" name="stripe_mode">
    	                                    <span class="custom-control-label">Stripe Live Mode</span>
    	                                </label>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Stripe Publishable Key</label>
                                        <input class="form-control" type="text" value="" v-model="configForm.stripe_publishable_key" name="stripe_publishable_key" placeholder="Stripe Publishable Key">
                                        <show-error :form-name="configForm" prop-name="stripe_publishable_key"></show-error>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Stripe Private Key</label>
                                        <input class="form-control" type="text" value="" v-model="configForm.stripe_private_key" name="stripe_private_key" placeholder="Stripe Private Key">
                                        <show-error :form-name="configForm" prop-name="stripe_private_key"></show-error>
                                    </div>
                                    <div class="form-group">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.stripe_charge_handling_fee" name="stripe_charge_handling_fee">
                                            <span class="custom-control-label">{{trans('finance.charge_gateway_handling_fee')}}</span>
                                        </label>
                                    </div>
                                    <template v-if="configForm.stripe_charge_handling_fee">
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.stripe_fixed_handling_fee" name="stripe_fixed_handling_fee">
                                                <span class="custom-control-label">{{trans('finance.fixed_gateway_handling_fee')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label for="">{{trans('finance.gateway_handling_fee', {gateway : 'Stripe'})}}</label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" value="" v-model="configForm.stripe_handling_fee" name="stripe_handling_fee" :placeholder="trans('finance.gateway_handling_fee', {gateway : 'Stripe'})">
                                                <div class="input-group-append">
                                                    <span class="input-group-text" v-if="configForm.stripe_fixed_handling_fee">{{default_currency.symbol}}</span>
                                                    <span class="input-group-text" v-else>%</span>
                                                </div>
                                            </div>
                                            <show-error :form-name="configForm" prop-name="stripe_handling_fee"></show-error>
                                        </div>
                                    </template>
                                </template>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="form-group">
	                                <label class="custom-control custom-checkbox">
	                                    <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.razorpay" name="razorpay">
	                                    <span class="custom-control-label">Razorpay</span>
	                                </label>
                                </div>
                                <template v-if="configForm.razorpay">
                                    <div class="form-group">
    	                                <label class="custom-control custom-checkbox">
    	                                    <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.razorpay_mode" name="razorpay_mode">
    	                                    <span class="custom-control-label">Razorpay Live Mode</span>
    	                                </label>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Razorpay Key</label>
                                        <input class="form-control" type="text" value="" v-model="configForm.razorpay_key" name="razorpay_key" placeholder="Razorpay Key">
                                        <show-error :form-name="configForm" prop-name="razorpay_key"></show-error>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Razorpay Secret</label>
                                        <input class="form-control" type="text" value="" v-model="configForm.razorpay_secret" name="razorpay_secret" placeholder="Razorpay Secret">
                                        <show-error :form-name="configForm" prop-name="razorpay_secret"></show-error>
                                    </div>
                                    <div class="form-group">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.razorpay_charge_handling_fee" name="razorpay_charge_handling_fee">
                                            <span class="custom-control-label">{{trans('finance.charge_gateway_handling_fee')}}</span>
                                        </label>
                                    </div>
                                    <template v-if="configForm.razorpay_charge_handling_fee">
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.razorpay_fixed_handling_fee" name="razorpay_fixed_handling_fee">
                                                <span class="custom-control-label">{{trans('finance.fixed_gateway_handling_fee')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label for="">{{trans('finance.gateway_handling_fee', {gateway : 'Razorpay'})}}</label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" value="" v-model="configForm.razorpay_handling_fee" name="razorpay_handling_fee" :placeholder="trans('finance.gateway_handling_fee', {gateway : 'Razorpay'})">
                                                <div class="input-group-append">
                                                    <span class="input-group-text" v-if="configForm.razorpay_fixed_handling_fee">{{default_currency.symbol}}</span>
                                                    <span class="input-group-text" v-else>%</span>
                                                </div>
                                            </div>
                                            <show-error :form-name="configForm" prop-name="razorpay_handling_fee"></show-error>
                                        </div>
                                    </template>
                                </template>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
        components : { },
        data() {
            return {
                configForm: new Form({
                    config_type: '',
                    paypal: 0,
                    paypal_mode: 0,
                    paypal_client_id: '',
                    paypal_client_secret: '',
                    paypal_charge_handling_fee: 0,
                    paypal_fixed_handling_fee: 0,
                    paypal_handling_fee: '',
                    stripe: 0,
                    stripe_mode: 0,
                    stripe_publishable_key: '',
                    stripe_private_key: '',
                    stripe_charge_handling_fee: 0,
                    stripe_fixed_handling_fee: 0,
                    stripe_handling_fee: '',
                    razorpay: 0,
                    razorpay_mode: 0,
                    razorpay_key: '',
                    razorpay_secret: '',
                    razorpay_charge_handling_fee: 0,
                    razorpay_fixed_handling_fee: 0,
                    razorpay_handling_fee: ''
                },false),
                default_currency: helper.getConfig('default_currency'),
                help_topic: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/home');
            }

            this.getConfiguration();
        },
        methods: {
            getConfiguration(){
                let loader = this.$loading.show();
                axios.get('/api/configuration')
                    .then(response => {
                        this.configForm = helper.formAssign(this.configForm, response);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            submit(){
                let loader = this.$loading.show();
                this.configForm.config_type = 'payment_gateway';
                this.configForm.post('/api/configuration')
                    .then(response => {
                        loader.hide();
                        this.$store.dispatch('setConfig',{loaded: false});
                        toastr.success(response.message);
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
	}
</script>