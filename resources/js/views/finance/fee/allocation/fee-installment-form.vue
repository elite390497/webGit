<template>
	<div>
	    <form @submit.prevent="submit" @keydown="feeInstallmentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12">
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('finance.fee_installment_title')}}</label>
                                <input class="form-control" type="text" v-model="feeInstallmentForm.title" name="title" :placeholder="trans('finance.fee_installment_title')" :disabled="paid_installment > 0">
                                <show-error :form-name="feeInstallmentForm" prop-name="title"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('finance.fee_installment_due_date')}}</label>
                                <datepicker v-model="feeInstallmentForm.due_date" :bootstrapStyling="true" :placeholder="trans('finance.fee_installment_due_date')" @selected="feeInstallmentForm.errors.clear('due_date')" name="due_date"></datepicker>
                                <show-error :form-name="feeInstallmentForm" prop-name="due_date"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4">
                            <div class="form-group">
                                <label for="">{{trans('finance.late_fee_applicable')}}</label> <br />
                                <switches class="m-l-20" v-model="feeInstallmentForm.late_fee_applicable" theme="bootstrap" color="success"></switches> 
                            </div>
                        </div>
                        <div class="col-12 col-sm-4" v-if="feeInstallmentForm.late_fee_applicable">
                            <div class="form-group">
                                <label for="">{{trans('finance.late_fee_frequency')}}</label>
                                <select v-model="feeInstallmentForm.late_fee_frequency" class="custom-select col-12" name="late_fee_frequency">
                                  <option value="0">{{trans('general.select_one')}}</option>
                                  <option v-for="option in late_fee_frequencies" v-bind:value="option.value">
                                    {{ option.text }}
                                  </option>
                                </select>
                                <show-error :form-name="feeInstallmentForm" prop-name="late_fee_frequency"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4" v-if="feeInstallmentForm.late_fee_applicable">
                            <div class="form-group">
                                <label for="">{{trans('finance.late_fee')}}</label>
                                <input class="form-control" type="text" v-model="feeInstallmentForm.late_fee" name="late_fee" :placeholder="trans('finance.late_fee')">
                                <show-error :form-name="feeInstallmentForm" prop-name="late_fee"></show-error>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6" v-for="(fee_head,index) in feeInstallmentForm.fee_heads">
                            <div class="form-group">
                                <label for="">{{fee_head.name}}</label>
                                <div class="input-group mb-3">
                                    <input class="form-control" type="text" v-model="fee_head.amount" :name="getFeeName(index,fee_head.id)" :placeholder="trans('finance.fee_installment_amount')" :disabled="paid_installment > 0">
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <input type="checkbox" v-model="fee_head.is_optional" v-tooltip="trans('finance.fee_is_optional')" :disabled="paid_installment > 0">
                                        </div>
                                    </div>
                                </div>
                                <show-error :form-name="feeInstallmentForm" :prop-name="getFeeName(index,fee_head.id)"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="fee_group.options && fee_group.options.has_transport">
                            <div class="form-group">
                                <label for="">{{trans('transport.transport')}}</label>
                                <v-select label="name" v-model="feeInstallmentForm.selected_transport_fee" name="transport_fee" id="transport_fee" :options="transport_fees" :placeholder="trans('general.select_one')" @select="onTransportFeeSelect" @close="" @remove="" :disabled="paid_installment > 0">
                                    <div class="multiselect__option" slot="afterList" v-if="!transport_fees.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="feeInstallmentForm" prop-name="transport_fee"></show-error>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
	    </form>
	</div>
</template>

<script>
	export default {
		components: {},
		props: ['iuuid'],
		data(){
			return {
				feeInstallmentForm: new Form({
					title: '',
					due_date: '',
					late_fee_applicable: '',
					late_fee_frequency: '',
					late_fee: '',
					fee_heads: [],
                    selected_transport_fee: null,
                    transport_fee_id: ''
				}),
				fee_group: {},
				paid_installment: 0,
                transport_fees: [],
                late_fee_frequencies: []
			}
		},
		mounted(){
            this.getPreRequisite();

            this.getInstallment();
		},
		methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/fee/installment/pre-requisite')
                    .then(response => {
                        this.late_fee_frequencies = response.late_fee_frequencies;
                        this.transport_fees = response.transport_fees;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getFeeName(index,fee_id){
                return index+'_'+fee_id+'_fee';
            },
            getTransportFeeName(index){
                return index+'_transport_fee';
            },
			getInstallment(){
                let loader = this.$loading.show();
				axios.get('/api/fee/installment/'+this.iuuid)
					.then(response => {
						this.feeInstallmentForm.fee_heads = [];
						this.feeInstallmentForm.title = response.title;
						this.feeInstallmentForm.due_date = response.due_date;
						this.feeInstallmentForm.late_fee_applicable = response.late_fee_applicable;
						this.feeInstallmentForm.late_fee_frequency = response.late_fee_frequency;
						this.feeInstallmentForm.late_fee = response.late_fee;
						this.feeInstallmentForm.transport_fee_id = response.transport_fee_id;
						this.feeInstallmentForm.selected_transport_fee = response.transport_fee_id ? {id: response.transport_fee_id, name: response.transport_fee.name} : null;
						this.paid_installment = response.paid_installment;
						this.fee_group = response.fee_allocation_group.fee_group;

						response.fee_installment_details.forEach(fee_installment_detail => {
							this.feeInstallmentForm.fee_heads.push({
								id: fee_installment_detail.fee_head_id,
								amount: fee_installment_detail.amount,
								is_optional: fee_installment_detail.is_optional,
								name: fee_installment_detail.fee_head.name
							})
						});
                        loader.hide();
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					})
				this.$emit('loaded');
			},
			submit(){
                let loader = this.$loading.show();
				this.feeInstallmentForm.patch('/api/fee/installment/'+this.iuuid)
					.then(response => {
						toastr.success(response.message);
						this.$emit('completed');
                        loader.hide();
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					})
			},
            onTransportFeeSelect(selectedOption, id){
                this.feeInstallmentForm.transport_fee_id = selectedOption.id;
            }
		}
	}
</script>