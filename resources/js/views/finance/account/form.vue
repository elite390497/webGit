<template>
    <form @submit.prevent="proceed" @keydown="accountForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="row">
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('finance.account_name')}}</label>
                            <input class="form-control" type="text" v-model="accountForm.name" name="name" :placeholder="trans('finance.account_name')">
                            <show-error :form-name="accountForm" prop-name="name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('finance.account_prefix')}}</label>
                            <input class="form-control" type="text" v-model="accountForm.prefix" name="prefix" :placeholder="trans('finance.account_prefix')">
                            <show-error :form-name="accountForm" prop-name="prefix"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('finance.account_opening_balance')}}</label>
                            <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="opening_balance" :placeholder="trans('finance.account_opening_balance')" v-model="accountForm.opening_balance" @input.native="accountForm.errors.clear('opening_balance')"></currency-input>
                            <show-error :form-name="accountForm" prop-name="opening_balance"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <div class="radio radio-success">
                                <input type="radio" value="bank" id="type_bank" v-model="accountForm.type" :checked="accountForm.type == 'bank'" name="type" @click="accountForm.errors.clear('type')">
                                <label for="type_bank">{{trans('finance.bank')}}</label>
                            </div>
                            <div class="radio radio-success">
                                <input type="radio" value="cash" id="type_cash" v-model="accountForm.type" :checked="accountForm.type == 'cash'" name="type" @click="accountForm.errors.clear('type')">
                                <label for="type_cash">{{trans('finance.cash')}}</label>
                            </div>
                            <show-error :form-name="accountForm" prop-name="type"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <switches class="m-l-20" v-model="accountForm.is_active" theme="bootstrap" color="success"></switches> {{trans('finance.account_is_active')}}
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <switches class="m-l-20" v-model="accountForm.is_default" theme="bootstrap" color="success"></switches> {{trans('finance.account_is_default')}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6" v-if="accountForm.type == 'bank'">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('finance.account_number')}}</label>
                            <input class="form-control" type="text" v-model="accountForm.account_number" name="account_number" :placeholder="trans('finance.account_number')">
                            <show-error :form-name="accountForm" prop-name="account_number"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('finance.bank_name')}}</label>
                            <input class="form-control" type="text" v-model="accountForm.bank_name" name="bank_name" :placeholder="trans('finance.bank_name')">
                            <show-error :form-name="accountForm" prop-name="bank_name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('finance.branch_name')}}</label>
                            <input class="form-control" type="text" v-model="accountForm.branch_name" name="branch_name" :placeholder="trans('finance.branch_name')">
                            <show-error :form-name="accountForm" prop-name="branch_name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('finance.bank_identification_code')}}</label>
                            <input class="form-control" type="text" v-model="accountForm.bank_identification_code" name="bank_identification_code" :placeholder="trans('finance.bank_identification_code')">
                            <show-error :form-name="accountForm" prop-name="bank_identification_code"></show-error>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/finance/account" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
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
                accountForm: new Form({
                    name : '',
                    prefix: '',
                    opening_balance : '',
                    type: '',
                    account_number: '',
                    bank_name: '',
                    bank_identification_code: '',
                    branch_name: '',
                    is_active: false,
                    is_default: 0
                }),
                default_currency: helper.getConfig('default_currency')
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.getAccount();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateAccount();
                else
                    this.storeAccount();
            },
            storeAccount(){
                let loader = this.$loading.show();
                this.accountForm.post('/api/account')
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
            getAccount(){
                let loader = this.$loading.show();
                axios.get('/api/account/'+this.id)
                    .then(response => {
                        this.accountForm.name = response.name;
                        this.accountForm.prefix = response.prefix;
                        this.accountForm.opening_balance = this.formatNumber(response.opening_balance);
                        this.accountForm.type = response.type;
                        this.accountForm.account_number = response.account_number;
                        this.accountForm.bank_name = response.bank_name;
                        this.accountForm.branch_name = response.branch_name;
                        this.accountForm.bank_identification_code = response.bank_identification_code;
                        this.accountForm.is_active = response.is_active;
                        this.accountForm.is_default = response.is_default;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/finance/account');
                    });
            },
            updateAccount(){
                let loader = this.$loading.show();
                this.accountForm.patch('/api/account/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/account');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            formatCurrency(price){
                return helper.formatCurrency(price);
            },
            formatNumber(number){
                return helper.formatNumber(number, this.default_currency.decimal_place)
            }
        }
    }
</script>
