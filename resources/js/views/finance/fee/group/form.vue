<template>
    <form @submit.prevent="proceed" @keydown="feeGroupForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.fee_group_name')}}</label>
                    <input class="form-control" type="text" v-model="feeGroupForm.name" name="name" :placeholder="trans('finance.fee_group_name')">
                    <show-error :form-name="feeGroupForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.fee_group_description')}}</label>
                    <input class="form-control" type="text" v-model="feeGroupForm.description" name="description" :placeholder="trans('finance.fee_group_description')">
                    <show-error :form-name="feeGroupForm" prop-name="description"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <div>{{trans('transport.has_transport')}}</div>
                    <switches class="m-t-20" v-model="feeGroupForm.has_transport" theme="bootstrap" color="success"></switches> 
                    <show-error :form-name="feeGroupForm" prop-name="has_transport"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/finance/fee/group" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                feeGroupForm: new Form({
                    name : '',
                    description : '',
                    has_transport: false
                })
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-fee-group') && !helper.hasPermission('edit-fee-group')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

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
                this.feeGroupForm.post('/api/fee/group')
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
                axios.get('/api/fee/group/'+this.id)
                    .then(response => {
                        this.feeGroupForm.name = response.name;
                        this.feeGroupForm.description = response.description;
                        this.feeGroupForm.has_transport = response.options.has_transport;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/finance/fee/group');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.feeGroupForm.patch('/api/fee/group/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/fee/group');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config);
            }
        }
    }
</script>
