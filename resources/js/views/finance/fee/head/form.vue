<template>
    <form @submit.prevent="proceed" @keydown="feeHeadForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.fee_head_name')}}</label>
                    <input class="form-control" type="text" v-model="feeHeadForm.name" name="name" :placeholder="trans('finance.fee_head_name')">
                    <show-error :form-name="feeHeadForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.fee_group')}}</label>
                    <v-select label="name" v-model="selected_fee_group" name="fee_group_id" id="fee_group_id" :options="fee_groups" :placeholder="trans('finance.select_fee_group')" @select="onFeeGroupSelect" @close="feeHeadForm.errors.clear('fee_group_id')" @remove="feeHeadForm.fee_group_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!fee_groups.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="feeHeadForm" prop-name="fee_group_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.fee_head_description')}}</label>
                    <autosize-textarea v-model="feeHeadForm.description" rows="1" name="description" :placeholder="trans('finance.fee_head_description')"></autosize-textarea>
                    <show-error :form-name="feeHeadForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/finance/fee/head" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                feeHeadForm: new Form({
                    name: '',
                    fee_group_id: '',
                    description: ''
                }),
                fee_groups: [],
                selected_fee_group: null
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-fee-head') && !helper.hasPermission('edit-fee-head')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.id)
                this.get();

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
                axios.get('/api/fee/head/pre-requisite')
                    .then(response => {
                        this.fee_groups = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            store(){
                let loader = this.$loading.show();
                this.feeHeadForm.post('/api/fee/head')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_fee_group = null;
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
                axios.get('/api/fee/head/'+this.id)
                    .then(response => {
                        this.feeHeadForm.name = response.fee_head.name;
                        this.feeHeadForm.fee_group_id = response.fee_head.fee_group_id;
                        this.feeHeadForm.description = response.fee_head.description;
                        this.selected_fee_group = response.selected_fee_group;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/finance/fee/head');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.feeHeadForm.patch('/api/fee/head/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/fee/head');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onFeeGroupSelect(selectedOption){
                this.feeHeadForm.fee_group_id = selectedOption.id;
            }
        }
    }
</script>
