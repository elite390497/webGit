<template>
    <form @submit.prevent="proceed" @keydown="feeConcessionForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.fee_concession_name')}}</label>
                    <input class="form-control" type="text" v-model="feeConcessionForm.name" name="name" :placeholder="trans('finance.fee_concession_name')">
                    <show-error :form-name="feeConcessionForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.fee_concession_description')}}</label>
                    <input class="form-control" type="text" v-model="feeConcessionForm.description" name="description" :placeholder="trans('finance.fee_concession_description')">
                    <show-error :form-name="feeConcessionForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="row" v-for="fee_head in feeConcessionForm.fee_heads">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="" class="m-t-10">{{fee_head.fee_head_name}}</label>
                </div>
            </div>
            <div class="col-12 col-sm-2">
                <div class="form-group">
                    <template v-if="fee_head.type">
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" :name="`discount_${fee_head.fee_head_id}`" :placeholder="trans('finance.fee_concession_discount')" v-model="fee_head.amount"></currency-input>
                    </template>
                    <template v-else>
                        <div class="input-group mb-3">
                            <input class="form-control" type="text" v-model="fee_head.amount" :name="`discount_${fee_head.fee_head_id}`" :placeholder="trans('finance.fee_concession_discount')">
                            <div class="input-group-append">
                                <span class="input-group-text" id="basic-addon1">%</span>
                            </div>
                        </div>
                    </template>
                    <show-error :form-name="feeConcessionForm" :prop-name="`discount_${fee_head.fee_head_id}`"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-2">
                <div class="form-group">
                    <switches class="m-l-20 m-t-10" v-model="fee_head.type" theme="bootstrap" color="success" v-tooltip="fee_head.type ? trans('finance.turn_off_for_discount_in_percent') : trans('finance.turn_on_for_discount_in_amount')"></switches>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/finance/fee/concession" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                feeConcessionForm: new Form({
                    name : '',
                    description : '',
                    fee_heads: []
                }),
                default_currency: helper.getConfig('default_currency'),
                fee_heads: []
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-fee-concession') && !helper.hasPermission('edit-fee-concession')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/fee/concession/pre-requisite')
                    .then(response => {
                        this.fee_heads = response;
                        this.populateFeeHeads();

                        if(this.id)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            store(){
                let loader = this.$loading.show();
                this.feeConcessionForm.post('/api/fee/concession')
                    .then(response => {
                        toastr.success(response.message);
                        this.feeConcessionForm.fee_heads = [];
                        this.populateFeeHeads();
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
                axios.get('/api/fee/concession/'+this.id)
                    .then(response => {
                        this.feeConcessionForm.name = response.name;
                        this.feeConcessionForm.description = response.description;
                        this.feeConcessionForm.fee_heads.forEach(fee_head => {
                            let head = response.fee_concession_details.find( o => o.fee_head_id == fee_head.fee_head_id);
                            fee_head.amount = (head) ? head.amount : 0;
                            fee_head.type = (head && head.type == 'amount') ? 1 : 0;
                        })
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/finance/fee/concession');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.feeConcessionForm.patch('/api/fee/concession/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/fee/concession');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config);
            },
            populateFeeHeads(){
                this.fee_heads.forEach(fee_head => {
                    this.feeConcessionForm.fee_heads.push({
                        fee_head_id: fee_head.id,
                        fee_head_name: fee_head.name+' ('+fee_head.fee_group.name+')',
                        amount: 0,
                        type: 0
                    })
                });
            }
        }
    }
</script>
