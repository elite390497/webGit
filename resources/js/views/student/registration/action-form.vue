<template>
    <div class="card card-form">
        <div class="card-body">
			<h4 class="card-title">{{trans('student.registration_action')}}</h4>
            <form @submit.prevent="submit" @keydown="actionForm.errors.clear($event.target.name)">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('student.registration_status')}}</label>
                            <select placeholder="Select Mari" v-model="actionForm.status" class="custom-select col-12" name="status" @change="actionForm.errors.clear('status')">
                              <option v-for="option in options" v-bind:value="option.value">
                                {{ option.text }}
                              </option>
                            </select>
                            <show-error :form-name="actionForm" prop-name="status"></show-error>
                        </div>
                    </div>
                </div>
                <template v-if="actionForm.status == 'rejected'">
	                <div class="row">
	                    <div class="col-12 col-sm-12">
			                <div class="form-group">
			                    <label for="">{{trans('student.rejection_remarks')}}</label>
			                    <autosize-textarea v-model="actionForm.rejection_remarks" rows="2" name="rejection_remarks" :placeholder="trans('student.rejection_remarks')"></autosize-textarea>
			                    <show-error :form-name="actionForm" prop-name="rejection_remarks"></show-error>
			                </div>
	                    </div>
	                </div>
		            <div class="card-footer text-right">
		                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
		            </div>
                </template>
                <template v-if="actionForm.status == 'allotted'">
	                <div class="row">
			            <div class="col-12 col-sm-6">
			                <div class="form-group">
			                    <label for="">{{trans('student.admission_number')}}</label>
				                <div class="row">
						            <div class="col-12 col-sm-4">
			                    		<input class="form-control" type="text" v-model="actionForm.admission_number_prefix" name="admission_number_prefix" :placeholder="trans('student.admission_number_prefix')">
			                    	</div>
						            <div class="col-12 col-sm-8">
			                    		<input class="form-control" type="text" v-model="actionForm.admission_number" name="admission_number" :placeholder="trans('student.admission_number')">
						            </div>
						        </div>
			                    <show-error :form-name="actionForm" prop-name="admission_number"></show-error>
			                </div>
			            </div>
	                    <div class="col-12 col-sm-6">
			                <div class="form-group">
			                    <label for="">{{trans('academic.batch')}}</label>
	                            <select v-model="actionForm.batch_id" class="custom-select col-12" @change="fetchStrength">
	                            	<option value=null selected>{{trans('academic.select_batch')}}</option>
									<option v-for="batch in registration.course.batches" v-bind:value="batch.id">
										{{ registration.course.name+' '+batch.name }}
									</option>
	                            </select>
	                            <div class="help-block" v-if="actionForm.batch_id && batch_current_strength >= 0">{{trans('academic.current_strength')+': '+batch_current_strength}}</div>
	                            <show-error :form-name="actionForm" prop-name="batch_id"></show-error>
			                </div>
			            </div>
	                    <div class="col-12 col-sm-6">
			                <div class="form-group">
			                    <label for="">{{trans('transport.circle')}}</label>
	                            <select v-model="actionForm.transport_circle_id" class="custom-select col-12" name="transport_circle_id" @change="actionForm.errors.clear('transport_circle_id')">
	                            	<option value=null selected>{{trans('transport.no_transport_circle')}}</option>
									<option v-for="transport_circle in transport_circles" v-bind:value="transport_circle.id">
										{{ transport_circle.name }}
									</option>
	                            </select>
	                            <show-error :form-name="actionForm" prop-name="transport_circle_id"></show-error>
			                </div>
			            </div>
	                    <div class="col-12 col-sm-6">
			                <div class="form-group">
			                    <label for="">{{trans('finance.fee_concession')}}</label>
	                            <select v-model="actionForm.fee_concession_id" class="custom-select col-12" name="fee_concession_id" @change="actionForm.errors.clear('fee_concession_id')">
	                            	<option value=null selected>{{trans('finance.no_fee_concession')}}</option>
									<option v-for="fee_concession in fee_concessions" v-bind:value="fee_concession.id">
										{{ fee_concession.name }}
									</option>
	                            </select>
	                            <show-error :form-name="actionForm" prop-name="fee_concession_id"></show-error>
			                </div>
			            </div>
	                    <div class="col-12 col-sm-6">
			                <div class="form-group">
			                    <label for="">{{trans('student.date_of_admission')}}</label>
			                    <datepicker v-model="actionForm.date_of_admission" :bootstrapStyling="true" @selected="actionForm.errors.clear('date_of_admission')" :placeholder="trans('student.date_of_admission')"></datepicker>
			                    <show-error :form-name="actionForm" prop-name="date_of_admission"></show-error>
			                </div>
			            </div>
	                    <div class="col-12 col-sm-6">
			                <div class="form-group">
			                    <label for="">{{trans('student.admission_remarks')}}</label>
			                    <autosize-textarea v-model="actionForm.admission_remarks" rows="1" name="admission_remarks" :placeholder="trans('student.admission_remarks')"></autosize-textarea>
			                    <show-error :form-name="actionForm" prop-name="admission_remarks"></show-error>
			                </div>
	                    </div>
	                </div>
		            <div class="card-footer text-right">
		                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
		            </div>
                </template>
            </form>
        </div>
    </div>
</template>

<script>
	export default {
		components: {},
		props: ['registration'],
		data() {
			return {
				actionForm: new Form({
					status: '',
					batch_id: null,
					admission_number_prefix: '',
					admission_number: '',
					date_of_admission: '',
					rejection_remarks: '',
					admission_remarks: '',
					transport_circle_id: null,
					fee_concession_id: null
				}),
				admission_numbers: [],
				batch_current_strength: 0,
				options: [ 
					{
						value: 'pending',
						text: i18n.student.registration_status_pending
					},
					{
						value: 'rejected',
						text: i18n.student.registration_status_rejected
					},
					{
						value: 'allotted',
						text: i18n.student.registration_status_allotted
					}
				],
				transport_circles: [],
				fee_concessions: [],
				batches: []	
			}
		},
		mounted(){
			this.actionForm.status = this.registration.status;
			this.actionForm.date_of_admission = moment().format();

			this.getPreRequisite();
		},
		methods: {
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/registration/status/pre-requisite')
					.then(response => {
						this.transport_circles = response.transport_circles;
						this.fee_concessions = response.fee_concessions;
						this.admission_numbers = response.admission_numbers;
						this.actionForm.admission_number_prefix = helper.getConfig('admission_number_prefix');
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					});
			},
			submit(){
				let loader = this.$loading.show();
				this.actionForm.post('/api/registration/'+this.registration.id+'/update/status')
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
			fetchStrength(){
				let loader = this.$loading.show();

				if (!this.actionForm.batch_id) {
					this.batch_current_strength = 0;
					loader.hide();
					return;
				}

				this.actionForm.errors.clear('batch_id');
				axios.post('/api/batch/'+this.actionForm.batch_id+'/strength')
					.then(response => {
						this.batch_current_strength = response;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			}
		},
		watch: {
			registration(registration) {
				this.actionForm.status = registration.status;
			},
			'actionForm.admission_number_prefix': function(val) {
				let admission = this.admission_numbers.find(o => o.prefix == val);

				if (typeof admission == 'undefined')
					this.actionForm.admission_number = helper.formatWithPadding(1,helper.getConfig('admission_number_digit'));
				else 
					this.actionForm.admission_number = helper.formatWithPadding((admission.number + 1),helper.getConfig('admission_number_digit'));
			}
		}
	}
</script>