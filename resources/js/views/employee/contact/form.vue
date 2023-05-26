<template>
	<div>
	    <form @submit.prevent="submit" @keydown="contactForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('employee.contact_number')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.contact_number" name="contact_number" :placeholder="trans('employee.contact_number')">
	                    <show-error :form-name="contactForm" prop-name="contact_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for=""><small>{{trans('employee.alternate_contact_number')}}</small></label>
	                    <input class="form-control" type="text" v-model="contactForm.alternate_contact_number" name="alternate_contact_number" :placeholder="trans('employee.alternate_contact_number')">
	                    <show-error :form-name="contactForm" prop-name="alternate_contact_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('employee.email')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.email" name="email" :placeholder="trans('employee.email')">
	                    <show-error :form-name="contactForm" prop-name="email"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for=""><small>{{trans('employee.alternate_email')}}</small></label>
	                    <input class="form-control" type="text" v-model="contactForm.alternate_email" name="alternate_email" :placeholder="trans('employee.alternate_email')">
	                    <show-error :form-name="contactForm" prop-name="alternate_email"></show-error>
	                </div>
	            </div>
	        </div>
	        <hr />
	        <h5 class="card-title m-t-30">{{trans('employee.emergency_contact')}}</h5>
	        <div class="row">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.emergency_contact_name')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.emergency_contact_name" name="emergency_contact_name" :placeholder="trans('employee.emergency_contact_name')">
	                    <show-error :form-name="contactForm" prop-name="emergency_contact_name"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.emergency_contact_number')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.emergency_contact_number" name="emergency_contact_number" :placeholder="trans('employee.emergency_contact_number')">
	                    <show-error :form-name="contactForm" prop-name="emergency_contact_number"></show-error>
	                </div>
	            </div>
	        </div>
	        <hr />
	        <h5 class="card-title m-t-30">{{trans('employee.present_address')}}</h5>
	        <div class="row">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.address_line_1')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_address_line_1" name="present_address_line_1" :placeholder="trans('employee.address_line_1')">
	                    <show-error :form-name="contactForm" prop-name="present_address_line_1"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.address_line_2')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_address_line_2" name="present_address_line_2" :placeholder="trans('employee.address_line_2')">
	                    <show-error :form-name="contactForm" prop-name="present_address_line_2"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.city')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_city" name="present_city" :placeholder="trans('employee.city')">
	                    <show-error :form-name="contactForm" prop-name="present_city"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.state')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_state" name="present_state" :placeholder="trans('employee.state')">
	                    <show-error :form-name="contactForm" prop-name="present_state"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.zipcode')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_zipcode" name="present_zipcode" :placeholder="trans('employee.zipcode')">
	                    <show-error :form-name="contactForm" prop-name="present_zipcode"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.country')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_country" name="present_country" :placeholder="trans('employee.country')">
	                    <show-error :form-name="contactForm" prop-name="present_country"></show-error>
	                </div>
	            </div>
	        </div>
	        <hr />
	        <h5 class="card-title m-t-30">{{trans('employee.permanent_address')}}</h5>
	        <div class="form-group">
	            <switches class="m-l-20" v-model="contactForm.same_as_present_address" theme="bootstrap" color="success" @change.native="updatePermanentAddress"></switches> {{trans('employee.same_as_present_address')}}
	        </div>
	        <div class="row" v-if="!contactForm.same_as_present_address">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.address_line_1')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_address_line_1" name="permanent_address_line_1" :placeholder="trans('employee.address_line_1')">
	                    <show-error :form-name="contactForm" prop-name="permanent_address_line_1"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.address_line_2')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_address_line_2" name="permanent_address_line_2" :placeholder="trans('employee.address_line_2')">
	                    <show-error :form-name="contactForm" prop-name="permanent_address_line_2"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.city')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_city" name="permanent_city" :placeholder="trans('employee.city')">
	                    <show-error :form-name="contactForm" prop-name="permanent_city"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.state')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_state" name="permanent_state" :placeholder="trans('employee.state')">
	                    <show-error :form-name="contactForm" prop-name="permanent_state"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.zipcode')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_zipcode" name="permanent_zipcode" :placeholder="trans('employee.zipcode')">
	                    <show-error :form-name="contactForm" prop-name="permanent_zipcode"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.country')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_country" name="permanent_country" :placeholder="trans('employee.country')">
	                    <show-error :form-name="contactForm" prop-name="permanent_country"></show-error>
	                </div>
	            </div>
	        </div>
	        <custom-field :fields="custom_fields" :customValues="custom_values" :formErrors="customFieldFormErrors" @updateCustomValues="updateCustomValues"></custom-field>
            <div class="card-footer text-right">
        		<button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
	   	</form>
	</div>
</template>

<script>
	export default {
        components: {},
		props: ['employee'],
		data() {
			return {
				contactForm: new Form({
					contact_number: '',
					email: '',
					present_address_line_1: '',
					present_address_line_2: '',
					present_city: '',
					present_state: '',
					present_zipcode: '',
					present_country: '',
					same_as_present_address: false,
					permanent_address_line_1: '',
					permanent_address_line_2: '',
					permanent_city: '',
					permanent_state: '',
					permanent_zipcode: '',
					permanent_country: '',
					emergency_contact_name: '',
					emergency_contact_number: '',
					custom_values: [],
					type: 'contact'
				},false),
				custom_fields: [],
				custom_values: [],
				customFieldFormErrors: {}
			}
		},
		mounted(){
            if(!helper.hasPermission('edit-employee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
		},
		methods: {
			getPreRequisite(){
	            let loader = this.$loading.show();
	            axios.get('/api/employee/basic/pre-requisite?form_type=employee_contact')
	            	.then(response => {
	            		this.custom_fields = response.custom_fields;
	            		this.get(this.employee);
	            		loader.hide();
	            	})
	            	.catch(error => {
	            		loader.hide();
	            		helper.showErrorMsg(error);
	            	});	
			},
			updateCustomValues(value) {
				this.contactForm.custom_values = value;
			},
			updatePermanentAddress(){
	          	this.contactForm.permanent_address_line_1 = this.contactForm.present_address_line_1;
	          	this.contactForm.permanent_address_line_2 = this.contactForm.present_address_line_2;
	          	this.contactForm.permanent_city = this.contactForm.present_city;
	          	this.contactForm.permanent_state = this.contactForm.present_state;
	          	this.contactForm.permanent_zipcode = this.contactForm.present_zipcode;
	          	this.contactForm.permanent_country = this.contactForm.present_country;
			},
			get(employee){
	          	this.contactForm.contact_number = employee.contact_number;
	          	this.contactForm.email = employee.email;
	          	this.contactForm.present_address_line_1 = employee.present_address_line_1;
	          	this.contactForm.present_address_line_2 = employee.present_address_line_2;
	          	this.contactForm.present_city = employee.present_city;
	          	this.contactForm.present_state = employee.present_state;
	          	this.contactForm.present_zipcode = employee.present_zipcode;
	          	this.contactForm.present_country = employee.present_country;
	          	this.contactForm.same_as_present_address = employee.same_as_present_address;
	          	this.contactForm.permanent_address_line_1 = employee.permanent_address_line_1;
	          	this.contactForm.permanent_address_line_2 = employee.permanent_address_line_2;
	          	this.contactForm.permanent_city = employee.permanent_city;
	          	this.contactForm.permanent_state = employee.permanent_state;
	          	this.contactForm.permanent_zipcode = employee.permanent_zipcode;
	          	this.contactForm.permanent_country = employee.permanent_country;
	          	this.contactForm.emergency_contact_name = employee.emergency_contact_name;
	          	this.contactForm.emergency_contact_number = employee.emergency_contact_number;
	          	this.custom_values = employee.options && employee.options.hasOwnProperty('custom_values') ? employee.options.custom_values : [];
			},
			submit(){
				let loader = this.$loading.show();
				this.contactForm.patch('/api/employee/'+this.employee.uuid)
					.then(response => {
						this.$emit('complete');
						toastr.success(response.message);
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						this.customFieldFormErrors = error;
						helper.showErrorMsg(error);
					})
			}
		},
		watch: { 
      		employee: function(employee) {
      			this.get(employee);
	        }
	    }
	}
</script>