<template>
	<div>
	    <form @submit.prevent="proceed" @keydown="feeAllocationForm.errors.clear($event.target.name)">
	        <div class="row" v-if="!uuid">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('academic.batch')}}</label>
                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="feeAllocationForm.errors.clear('batch_id')" @remove="feeAllocationForm.batch_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="feeAllocationForm" prop-name="batch_id"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-4" v-if="!uuid">
                    <div class="form-group">
                        <div>{{trans('finance.is_course_fee')}}</div>
                        <switches class="m-t-20" v-model="feeAllocationForm.is_course_fee" theme="bootstrap" color="success"></switches> 
                        <show-error :form-name="feeAllocationForm" prop-name="is_course_fee"></show-error>
                    </div>
                </div>
	        </div>
            <template v-if="fee_allocation && !ruuid">
                <h4 v-if="fee_allocation.course_id">{{fee_allocation.course.name}}</h4>
                <h4 class="card-title" v-else>{{fee_allocation.batch.course.name+' '+fee_allocation.batch.name}}</h4>
                <br />
            </template>
            <template v-if="feeAllocationForm.batch_id || ruuid">
    	        <div v-for="fee_group in feeAllocationForm.fee_groups" class="m-b-20 p-4">
    	            <h4>{{fee_group.fee_group_name}}</h4>
    	            <div style="padding:0px;" v-if="fee_group.installments.length">
    	                <fieldset v-for="(installment,index) in fee_group.installments">
    	                    <legend>
    	                        {{trans('finance.fee_installment')}} - {{index+1}} 
    	                        <span class="has-error m-l-10 " style="cursor:pointer;" :key="fee_group.fee_group_id+'_'+index" v-confirm="{ok: confirmDeleteInstallment(fee_group.fee_group_id,index)}" v-tooltip="trans('finance.delete_fee_installment')"><i class="fa fa-times-circle"></i></span>
    	                    </legend>
    	                    <div class="row" style="padding:0 20px;">
                                <div class="col-12 col-sm-6">
                                    <div class="row">
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.fee_installment_title')}}</label>
                                                <input class="form-control" type="text" v-model="installment.title" :name="getTitleName(fee_group.fee_group_id,index)" :placeholder="trans('finance.fee_installment_title')">
                                                <show-error :form-name="feeAllocationForm" :prop-name="getTitleName(fee_group.fee_group_id,index)"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.fee_installment_due_date')}}</label>
                                                <datepicker v-model="installment.due_date" :bootstrapStyling="true" :placeholder="trans('finance.fee_installment_due_date')" @selected="feeAllocationForm.errors.clear(getDueDateName(fee_group.fee_group_id,index))" :name="getDueDateName(fee_group.fee_group_id,index)"></datepicker>
                                                <show-error :form-name="feeAllocationForm" :prop-name="getDueDateName(fee_group.fee_group_id,index)"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-4">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.late_fee_applicable')}}</label> <br />
                                                <switches class="m-l-20" v-model="installment.late_fee_applicable" theme="bootstrap" color="success"></switches> 
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-4" v-if="installment.late_fee_applicable">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.late_fee_frequency')}}</label>
                                                <select v-model="installment.late_fee_frequency" class="custom-select col-12" :name="getLateFeeFrequencyName(fee_group.fee_group_id,index)">
                                                  <option v-for="option in late_fee_frequencies" v-bind:value="option.value">
                                                    {{ option.text }}
                                                  </option>
                                                </select>
                                                <show-error :form-name="feeAllocationForm" :prop-name="getLateFeeFrequencyName(fee_group.fee_group_id,index)"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-4" v-if="installment.late_fee_applicable">
                                            <div class="form-group">
                                                <label for="">{{trans('finance.late_fee')}}</label>
                                                <input class="form-control" type="text" v-model="installment.late_fee" :name="getLateFeeName(fee_group.fee_group_id,index)" :placeholder="trans('finance.late_fee')">
                                                <show-error :form-name="feeAllocationForm" :prop-name="getLateFeeName(fee_group.fee_group_id,index)"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <div class="row">
            	                        <div class="col-12 col-sm-6" v-for="fee_head in installment.fee_heads">
                                            <div class="form-group">
                                                <label for="">{{fee_head.name}}</label>
                                                <div class="input-group mb-3">
                                                    <input class="form-control" type="text" v-model="fee_head.amount" :name="getFeeName(fee_group.fee_group_id,index,fee_head.id)" :placeholder="trans('finance.fee_installment_amount')">
                                                    <div class="input-group-append">
                                                        <div class="input-group-text">
                                                            <input type="checkbox" v-model="fee_head.is_optional" v-tooltip="trans('finance.fee_is_optional')">
                                                        </div>
                                                    </div>
                                                </div>
                                                <show-error :form-name="feeAllocationForm" :prop-name="getFeeName(fee_group.fee_group_id,index,fee_head.id)"></show-error>
                                            </div>
            	                        </div>
                                        <div class="col-12 col-sm-6" v-if="fee_group.has_transport">
                                            <div class="form-group">
                                                <label for="">{{trans('transport.transport')}}</label>
                                                <v-select label="name" v-model="installment.selected_transport_fee" :name="getTransportFeeName(fee_group.fee_group_id,index)" :id="getTransportFeeName(fee_group.fee_group_id,index)" :options="transport_fees" :placeholder="trans('general.select_one')" @select="onTransportFeeSelect" @close="" @remove="installment.transport_fee_id = ''">
                                                    <div class="multiselect__option" slot="afterList" v-if="!transport_fees.length">
                                                        {{trans('general.no_option_found')}}
                                                    </div>
                                                </v-select>
                                                <show-error :form-name="feeAllocationForm" :prop-name="getTransportFeeName(fee_group.fee_group_id,index)"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    	                    </div>
    	                </fieldset>
    	            </div>
    	            <button type="button" class="btn btn-info btn-sm pull-right" @click="addInstallment(fee_group.fee_group_id)">{{trans('finance.add_fee_installment')}}</button>
    	            <div class="clearfix"></div>
    	        </div>
                <div class="card-footer text-right">
                    <router-link to="/finance/fee/allocation" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                    <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                </div>
            </template>
	    </form>
	</div>
</template>

<script>

    export default {
        components : {},
        props:['uuid','ruuid'],
        data() {
            return {
                batches: [],
                fee_groups: [],
                fee_heads: [],
                transport_fees: [],
                late_fee_frequencies: [],
                selected_batch: null,
                feeAllocationForm: new Form({
                    is_course_fee: false,
                    batch_id: '',
                    fee_groups: []
                }),
                fee_allocation: null
            };
        },
        mounted(){
            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/fee/allocation/pre-requisite')
                    .then(response => {
                        this.batches = response.batches;
                        this.fee_groups = response.fee_groups;
                        this.fee_heads = response.fee_heads;
                        this.transport_fees = response.transport_fees;
                        this.late_fee_frequencies = response.late_fee_frequencies;

                        this.fee_groups.forEach(fee_group => {

                            this.feeAllocationForm.fee_groups.push({
                                fee_group_id: fee_group.id,
                                fee_group_name: fee_group.name,
                                has_transport: (fee_group.options) ? fee_group.options.has_transport : 0,
                                installments: []
                            });
                            
                            if(!this.uuid && !this.ruuid)
                                this.addInstallment(fee_group.id);
                        });

                        if(this.uuid || this.ruuid)
                            this.getFeeAllocation();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            addInstallment(fee_group_id){
                let fee_group = this.feeAllocationForm.fee_groups.find( o => o.fee_group_id == fee_group_id);

                let heads = this.addFeeHead(fee_group_id);

                fee_group.installments.push({
                    uuid: this.$uuid.v4(),
                    due_date: '',
                    title: '',
                    fee_heads: heads,
                    late_fee_applicable: false,
                    late_fee_frequency: '1',
                    late_fee: '',
                    selected_transport_fee: null,
                    transport_fee_id: ''
                });
            },
            addFeeHead(fee_group_id){
                let heads = [];
                this.fee_heads.forEach(fee_head => {
                    if(fee_head.fee_group_id == fee_group_id)
                        heads.push({
                            id: fee_head.id,
                            amount: '',
                            name: fee_head.name,
                            is_optional: false
                        });
                })
                return heads;
            },
            confirmDeleteInstallment(fee_group_id, index){
                return dialog => this.deleteInstallment(fee_group_id, index);
            },
            deleteInstallment(fee_group_id, index){
                let fee_group = this.feeAllocationForm.fee_groups.find( o => o.fee_group_id == fee_group_id);
                fee_group.installments.splice(index, 1);
            },
            getTitleName(fee_group_id,index){
                return fee_group_id+'_'+index+'_title';
            },
            getDueDateName(fee_group_id,index){
                return fee_group_id+'_'+index+'_due_date';
            },
            getFeeName(fee_group_id,index,fee_id){
                return fee_group_id+'_'+index+'_'+fee_id+'_fee';
            },
            getLateFeeFrequencyName(fee_group_id,index){
                return fee_group_id+'_'+index+'_late_fee_frequency';
            },
            getLateFeeName(fee_group_id,index){
                return fee_group_id+'_'+index+'_late_fee';
            },
            getTransportFeeName(fee_group_id,index){
                return fee_group_id+'_'+index+'_transport_fee';
            },
            getFeeAllocation(){
                let loader = this.$loading.show();
                axios.get('/api/fee/allocation/'+(this.ruuid || this.uuid))
                    .then(response => {
                        this.fee_allocation = response;

                        if (response.paid_count && ! this.ruuid) {
                            toastr.error(i18n.finance.cannot_modify_fee_allocation);
                            loader.hide();
                            this.$router.push('/finance/fee/allocation');
                        }

                        if (! this.ruuid) {
                            this.selected_batch = {'name':response.batch.course.name+' '+response.batch.name, 'id':response.batch_id};
                            this.feeAllocationForm.batch_id = response.batch_id;
                        }

                        this.feeAllocationForm.fee_groups.forEach(fee_group => {
                            let fee_allocation_group = response.fee_allocation_groups.find( o => o.fee_group_id === fee_group.fee_group_id);

                            fee_allocation_group.fee_installments.forEach(installment => {

                                let heads = this.addFeeHead(fee_group.fee_group_id);

                                installment.fee_installment_details.forEach(fee_installment_detail => {
                                    let installment_detail = heads.find( o => o.id === fee_installment_detail.fee_head_id);
                                    installment_detail.amount = fee_installment_detail.amount ? fee_installment_detail.amount : '';
                                    installment_detail.is_optional = fee_installment_detail.is_optional ? 1 : 0;
                                });

                                fee_group.installments.push({
                                    uuid: installment.uuid,
                                    due_date: installment.due_date,
                                    title: installment.title,
                                    fee_heads: heads,
                                    late_fee_applicable: installment.late_fee_applicable,
                                    late_fee_frequency: installment.late_fee_frequency,
                                    late_fee: installment.late_fee,
                                    transport_fee_id: installment.transport_fee_id,
                                    selected_transport_fee: (installment.transport_fee_id) ? {id: installment.transport_fee_id, name: installment.transport_fee.name} : null
                                });
                            });
                        });
                        loader.hide();

                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.feeAllocationForm.post('/api/fee/allocation')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/fee/allocation');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.feeAllocationForm.patch('/api/fee/allocation/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/finance/fee/allocation');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onBatchSelect(selectedOption){
                this.feeAllocationForm.batch_id = selectedOption.id;
            },
            onTransportFeeSelect(selectedOption, id){
                let field_id = id.split("_");
                let fee_group_id = field_id[0];
                let index = field_id[1];
                let fee_group = this.feeAllocationForm.fee_groups.find( o => o.fee_group_id == fee_group_id);
                let installment = fee_group.installments[index];
                installment.transport_fee_id = selectedOption.id;
            }
        }
    }
</script>