<template>
	<div>
	    <form @submit.prevent="submit" @keydown="contactForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.contact_number')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.contact_number" name="contact_number" :placeholder="trans('student.contact_number')">
	                    <show-error :form-name="contactForm" prop-name="contact_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.email')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.email" name="email" :placeholder="trans('student.email')">
	                    <show-error :form-name="contactForm" prop-name="email"></show-error>
	                </div>
	            </div>
	        </div>
	        <hr />
	        <h5 class="card-title">{{trans('student.emergency_contact')}}</h5>
	        <div class="row">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.emergency_contact_name')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.emergency_contact_name" name="emergency_contact_name" :placeholder="trans('student.emergency_contact_name')">
	                    <show-error :form-name="contactForm" prop-name="emergency_contact_name"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.emergency_contact_number')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.emergency_contact_number" name="emergency_contact_number" :placeholder="trans('student.emergency_contact_number')">
	                    <show-error :form-name="contactForm" prop-name="emergency_contact_number"></show-error>
	                </div>
	            </div>
	        </div>
	        <hr />
	        <h5 class="card-title">{{trans('student.present_address')}}</h5>
	        <div class="row">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.address_line_1')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_address_line_1" name="present_address_line_1" :placeholder="trans('student.address_line_1')">
	                    <show-error :form-name="contactForm" prop-name="present_address_line_1"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.address_line_2')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_address_line_2" name="present_address_line_2" :placeholder="trans('student.address_line_2')">
	                    <show-error :form-name="contactForm" prop-name="present_address_line_2"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.city')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_city" name="present_city" :placeholder="trans('student.city')">
	                    <show-error :form-name="contactForm" prop-name="present_city"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.state')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_state" name="present_state" :placeholder="trans('student.state')">
	                    <show-error :form-name="contactForm" prop-name="present_state"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.zipcode')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_zipcode" name="present_zipcode" :placeholder="trans('student.zipcode')">
	                    <show-error :form-name="contactForm" prop-name="present_zipcode"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.country')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.present_country" name="present_country" :placeholder="trans('student.country')">
	                    <show-error :form-name="contactForm" prop-name="present_country"></show-error>
	                </div>
	            </div>
	        </div>
	        <hr />
	        <h5 class="card-title">{{trans('student.permanent_address')}}</h5>
	        <div class="form-group">
	            <switches class="m-l-20" v-model="contactForm.same_as_present_address" theme="bootstrap" color="success" @change.native="updatePermanentAddress"></switches> {{trans('student.same_as_present_address')}}
	        </div>
	        <div class="row" v-if="!contactForm.same_as_present_address">
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.address_line_1')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_address_line_1" name="permanent_address_line_1" :placeholder="trans('student.address_line_1')">
	                    <show-error :form-name="contactForm" prop-name="permanent_address_line_1"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.address_line_2')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_address_line_2" name="permanent_address_line_2" :placeholder="trans('student.address_line_2')">
	                    <show-error :form-name="contactForm" prop-name="permanent_address_line_2"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.city')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_city" name="permanent_city" :placeholder="trans('student.city')">
	                    <show-error :form-name="contactForm" prop-name="permanent_city"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.state')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_state" name="permanent_state" :placeholder="trans('student.state')">
	                    <show-error :form-name="contactForm" prop-name="permanent_state"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.zipcode')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_zipcode" name="permanent_zipcode" :placeholder="trans('student.zipcode')">
	                    <show-error :form-name="contactForm" prop-name="permanent_zipcode"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.country')}}</label>
	                    <input class="form-control" type="text" v-model="contactForm.permanent_country" name="permanent_country" :placeholder="trans('student.country')">
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
		props: ['student'],
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
            if(!helper.hasPermission('edit-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
		},
		methods: {
			getPreRequisite(){
	            let loader = this.$loading.show();
	            axios.get('/api/student/pre-requisite?form_type=student_contact')
	            	.then(response => {
	            		this.custom_fields = response.custom_fields;
	            		this.get(this.student);
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
			get(student){
	          	this.contactForm.contact_number = student.contact_number;
	          	this.contactForm.email = student.email;
	          	this.contactForm.present_address_line_1 = student.present_address_line_1;
	          	this.contactForm.present_address_line_2 = student.present_address_line_2;
	          	this.contactForm.present_city = student.present_city;
	          	this.contactForm.present_state = student.present_state;
	          	this.contactForm.present_zipcode = student.present_zipcode;
	          	this.contactForm.present_country = student.present_country;
	          	this.contactForm.same_as_present_address = student.same_as_present_address;
	          	this.contactForm.permanent_address_line_1 = student.permanent_address_line_1;
	          	this.contactForm.permanent_address_line_2 = student.permanent_address_line_2;
	          	this.contactForm.permanent_city = student.permanent_city;
	          	this.contactForm.permanent_state = student.permanent_state;
	          	this.contactForm.permanent_zipcode = student.permanent_zipcode;
	          	this.contactForm.permanent_country = student.permanent_country;
	          	this.contactForm.emergency_contact_name = student.emergency_contact_name;
	          	this.contactForm.emergency_contact_number = student.emergency_contact_number;
	          	this.custom_values = student.options && student.options.hasOwnProperty('custom_values') ? student.options.custom_values : [];
			},
			submit(){
				let loader = this.$loading.show();
				this.contactForm.patch('/api/student/'+this.student.uuid)
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
      		student: function(student) {
      			this.get(student);
	        }
	    }
	}
</script>