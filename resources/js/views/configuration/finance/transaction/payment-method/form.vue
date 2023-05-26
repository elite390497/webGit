<template>
    <form @submit.prevent="proceed" @keydown="paymentMethodForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('finance.payment_method_name')}}</label>
                    <input class="form-control" type="text" v-model="paymentMethodForm.name" name="name" :placeholder="trans('finance.payment_method_name')">
                    <show-error :form-name="paymentMethodForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('finance.payment_method_description')}}</label>
                    <input class="form-control" type="text" v-model="paymentMethodForm.description" name="description" :placeholder="trans('finance.payment_method_description')">
                    <show-error :form-name="paymentMethodForm" prop-name="description"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('finance.requires_instrument_number')}}</div>
                    <switches class="m-t-20" v-model="paymentMethodForm.requires_instrument_number" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('finance.requires_instrument_date')}}</div>
                    <switches class="m-t-20" v-model="paymentMethodForm.requires_instrument_date" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('finance.requires_instrument_bank_detail')}}</div>
                    <switches class="m-t-20" v-model="paymentMethodForm.requires_instrument_bank_detail" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('finance.requires_instrument_clearing_date')}}</div>
                    <switches class="m-t-20" v-model="paymentMethodForm.requires_instrument_clearing_date" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('finance.requires_reference_number')}}</div>
                    <switches class="m-t-20" v-model="paymentMethodForm.requires_reference_number" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <switches class="m-l-20" v-model="paymentMethodForm.is_default" theme="bootstrap" color="success"></switches> {{trans('finance.payment_method_is_default')}}
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <router-link to="/configuration/finance/payment/method" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                paymentMethodForm: new Form({
                    name : '',
                    description : '',
                    requires_instrument_number: false,
                    requires_instrument_date: false,
                    requires_instrument_clearing_date: false,
                    requires_instrument_bank_detail: false,
                    requires_reference_number: false,
                    is_default: 0
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.paymentMethodForm.post('/api/finance/payment/method')
                    .then(response => {
                        toastr.success(response.message);
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
                axios.get('/api/finance/payment/method/'+this.id)
                    .then(response => {
                        this.paymentMethodForm.name = response.name;
                        this.paymentMethodForm.description = response.description;
                        this.paymentMethodForm.is_default = response.is_default;
                        this.paymentMethodForm.requires_instrument_number = response.options.requires_instrument_number;
                        this.paymentMethodForm.requires_instrument_date = response.options.requires_instrument_date;
                        this.paymentMethodForm.requires_instrument_clearing_date = response.options.requires_instrument_clearing_date;
                        this.paymentMethodForm.requires_instrument_bank_detail = response.options.requires_instrument_bank_detail;
                        this.paymentMethodForm.requires_reference_number = response.options.requires_reference_number;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/finance/payment/method');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.paymentMethodForm.patch('/api/finance/payment/method/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/finance/payment/method');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
