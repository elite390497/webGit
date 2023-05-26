<template>
    <form @submit.prevent="submit" @keydown="registrationForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('academic.course')}}</label>
                    <v-select label="name" v-model="selected_course" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" @close="registrationForm.errors.clear('course_id')" @remove="registrationForm.course_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <span class="help-block" v-if="enable_registration_fee && registration_fee >= 0">{{trans('student.registration_fee')}} {{formatCurrency(registration_fee)}}</span>
                    <show-error :form-name="registrationForm" prop-name="course_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('student.date_of_registration')}}</label>
                    <datepicker v-model="registrationForm.date_of_registration" :bootstrapStyling="true" @selected="registrationForm.errors.clear('date_of_registration')" :placeholder="trans('student.date_of_registration')"></datepicker>
                    <show-error :form-name="registrationForm" prop-name="date_of_registration"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6" v-if="registration.registration_fee_status == 'unpaid' || registration.registration_fee_status == null">
                <div class="form-group">
                    <label for="">{{trans('student.registration_fee')}}</label>
                    <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="registration_fee" :placeholder="trans('stduent.registration_fee')" v-model="registrationForm.registration_fee" @input.native="registrationForm.errors.clear('registration_fee')"></currency-input>
                    <show-error :form-name="registrationForm" prop-name="registration_fee"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('student.previous_institute')}}</label>
                    <v-select label="name" v-model="selected_previous_institute" name="previous_institute_id" id="previous_institute_id" :options="previous_institutes" :placeholder="trans('academic.select_institute')" @select="onPreviousInstituteSelect" @close="registrationForm.errors.clear('previous_institute_id')" @remove="registrationForm.previous_institute_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!previous_institutes.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="registrationForm" prop-name="previous_institute_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-12">
                <div class="form-group">
                    <label for="">{{trans('student.registration_remarks')}}</label>
                    <autosize-textarea v-model="registrationForm.registration_remarks" rows="2" name="registration_remarks" :placeholder="trans('student.registration_remarks')"></autosize-textarea>
                    <show-error :form-name="registrationForm" prop-name="registration_remarks"></show-error>
                </div>
            </div>
        </div>
        <custom-field :fields="custom_fields" :customValues="custom_values" :clear="clearCustomField" :formErrors="customFieldFormErrors" @updateCustomValues="updateCustomValues"></custom-field>
        <div class="card-footer text-right">
            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
        </div>
    </form>
</template>

<script>
	export default {
		props: ['registration'],
		components: {},
		data() {
			return {
				registrationForm: new Form({
					course_id: '',
					date_of_registration: '',
					registration_remarks: '',
                    previous_institute_id: '',
					registration_fee: 0,
                    custom_values: [],
				}),
				courses: [],
                course_details: [],
                previous_institutes: [],
				selected_course: null,
                selected_previous_institute: null,
                default_currency: helper.getConfig('default_currency'),
                registration_fee: 0,
                enable_registration_fee: 0,
                custom_fields: [],
                custom_values: [],
                clearCustomField: false,
                customFieldFormErrors: {}
			}
		},
		mounted(){
            this.getPreRequisite();

            this.registrationForm.course_id = this.registration.course_id;
            this.registrationForm.previous_institute_id = this.registration.previous_institute_id;
            this.selected_course = {id: this.registration.course_id, name: this.registration.course.name};
            this.selected_previous_institute = this.registration.previous_institute_id ? {id: this.registration.previous_institute_id, name: this.registration.previous_institute.name} : null;
            this.registrationForm.date_of_registration = this.registration.date_of_registration;
            this.registrationForm.registration_remarks = this.registration.registration_remarks;
            this.registrationForm.registration_fee = this.registration.registration_fee;
            this.custom_values = this.registration.options && this.registration.options.hasOwnProperty('custom_values') ? this.registration.options.custom_values : [];
            // this.setRegistration(this.registration.course_id);
		},
		methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/registration/pre-requisite')
                    .then(response => {
                        this.courses = response.courses;
                        this.course_details = response.course_details;
                        this.previous_institutes = response.previous_institutes;
                        this.custom_fields = response.custom_fields;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            updateCustomValues(value) {
                this.registrationForm.custom_values = value;
            },
			submit(){
                let loader = this.$loading.show();
				this.registrationForm.patch('/api/registration/'+this.registration.id)
					.then(response => {
						toastr.success(response.message);
						this.$emit('completed');
                        this.$emit('close');
                        loader.hide();
					})
					.catch(error => {
                        loader.hide();
                        this.customFieldFormErrors = error;
						helper.showErrorMsg(error);
					})

			},
            onCourseSelect(selectedOption){
                this.registrationForm.course_id = selectedOption.id;
                this.setRegistration(selectedOption.id);
                this.registrationForm.registration_fee = this.registration_fee;
            },
            onPreviousInstituteSelect(selectedOption){
                this.registrationForm.previous_institute_id = selectedOption.id;
            },
            setRegistration(course_id){
                let course = this.course_details.find(o => o.course_id == course_id);
                this.enable_registration_fee = (course != 'undefined') ? course.enable_registration_fee : 0;
                this.registration_fee = (this.enable_registration_fee) ? course.registration_fee : 0
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            }
		}
	}
</script>
