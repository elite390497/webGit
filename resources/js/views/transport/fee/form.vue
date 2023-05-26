<template>
    <div>
        <form @submit.prevent="proceed" @keydown="transportFeeForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('transport.fee_name')}}</label>
                        <input class="form-control" type="text" v-model="transportFeeForm.name" name="name" :placeholder="trans('transport.fee_name')">
                        <show-error :form-name="transportFeeForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('transport.fee_description')}}</label>
                        <input class="form-control" type="text" v-model="transportFeeForm.description" name="description" :placeholder="trans('transport.fee_description')">
                        <show-error :form-name="transportFeeForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row" v-for="transport_circle in transportFeeForm.transport_circles">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="" class="m-t-10">{{transport_circle.transport_circle_name+' ('+trans('finance.per_installment')+')'}}</label>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" :name="`amount_${transport_circle.transport_circle_id}`" :placeholder="trans('transport.amount')" v-model="transport_circle.amount"></currency-input>
                        <show-error :form-name="transportFeeForm" :prop-name="`amount_${transport_circle.transport_circle_id}`"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <button type="button" class="btn btn-info" v-if="hasPermission('access-configuration')" @click="showTransportCircleModal = true">{{trans('transport.add_new_circle')}}</button>
                    </div>
                    <div class="col-12 col-sm-6 text-right">
                        <router-link to="/transport/fee" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
                        <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                        <button type="submit" class="btn btn-info waves-effect waves-light">
                            <span v-if="id">{{trans('general.update')}}</span>
                            <span v-else>{{trans('general.save')}}</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <transition name="modal" v-if="showTransportCircleModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('transport.add_new_circle')}}
                                <span class="float-right pointer" @click="showTransportCircleModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <transport-circle-form @completed="getPreRequisite" @cancel="showTransportCircleModal = false"></transport-circle-form>
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
    import transportCircleForm from '../circle/form'

    export default {
        components: {transportCircleForm},
        data() {
            return {
                transportFeeForm: new Form({
                    name : '',
                    description : '',
                    transport_circles: []
                }),
                default_currency: helper.getConfig('default_currency'),
                transport_circles: [],
                showTransportCircleModal: false
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-transport-fee') && !helper.hasPermission('edit-transport-fee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                this.showTransportCircleModal = false;
                axios.get('/api/transport/fee/pre-requisite')
                    .then(response => {
                        this.transport_circles = response;
                        this.populateTransportCircle();

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
                this.transportFeeForm.post('/api/transport/fee')
                    .then(response => {
                        toastr.success(response.message);
                        this.transportFeeForm.transport_circles = [];
                        this.populateTransportCircle();
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
                axios.get('/api/transport/fee/'+this.id)
                    .then(response => {
                        this.transportFeeForm.name = response.name;
                        this.transportFeeForm.description = response.description;
                        this.transportFeeForm.transport_circles.forEach(transport_circle => {
                            let head = response.transport_fee_details.find( o => o.transport_circle_id == transport_circle.transport_circle_id);
                            transport_circle.amount = (head) ? head.amount : 0;
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/transport/fee');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.transportFeeForm.patch('/api/transport/fee/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/transport/fee');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config);
            },
            populateTransportCircle(){
                this.transport_circles.forEach(transport_circle => {
                    if (this.transportFeeForm.transport_circles.findIndex(o => o.transport_circle_id == transport_circle.id) < 0) {
                        this.transportFeeForm.transport_circles.push({
                            transport_circle_id: transport_circle.id,
                            transport_circle_name: transport_circle.name,
                            amount: 0
                        })
                    }
                });
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>
