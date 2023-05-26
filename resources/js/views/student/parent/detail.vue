<template>
	<div>
        <div class="row mb-4">
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('general.relation')" :value="student.parent.first_guardian_relation" :to-uppercase-word="true" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('general.relation')" :value="student.parent.second_guardian_relation" :to-uppercase-word="true" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_name')" :value="student.parent.first_guardian_name" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_name')" :value="student.parent.second_guardian_name" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_date_of_birth')" :value="student.parent.first_guardian_date_of_birth" type="date" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_date_of_birth')" :value="student.parent.second_guardian_date_of_birth" type="date" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_qualification')" :value="student.parent.first_guardian_qualification" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_qualification')" :value="student.parent.second_guardian_qualification" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_occupation')" :value="student.parent.first_guardian_occupation" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_occupation')" :value="student.parent.second_guardian_occupation" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_annual_income')" :value="student.parent.first_guardian_annual_income" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_annual_income')" :value="student.parent.second_guardian_annual_income" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_email')" :value="student.parent.first_guardian_email" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_email')" :value="student.parent.second_guardian_email" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_contact_number_1')" :value="student.parent.first_guardian_contact_number_1" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_contact_number_1')" :value="student.parent.second_guardian_contact_number_1" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_contact_number_2')" :value="student.parent.first_guardian_contact_number_2" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_contact_number_2')" :value="student.parent.second_guardian_contact_number_2" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.first_guardian_unique_identification_number')" :value="student.parent.first_guardian_unique_identification_number" />
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.second_guardian_unique_identification_number')" :value="student.parent.second_guardian_unique_identification_number" />
            </div>
            <div class="col-12 col-sm-6">
                <span class="align-items-center student-thumb">
                    <template v-if="!student.parent.first_guardian_photo">
                        <img v-if="student.parent.first_guardian_relation == 'father' || (student.gender == 'female' && student.parent.first_guardian_relation == 'spouse')" src="/images/avatar_male.png" class="img-circle avatar">
                        <img v-else-if="student.parent.first_guardian_relation == 'mother' || (student.gender == 'male' && student.parent.first_guardian_relation == 'spouse')" src="/images/avatar_female.png" class="img-circle avatar">
                        <img v-else src="/images/avatar_male.png" class="img-circle avatar">
                    </template>
                    <template v-else>
                        <img :src="`/${student.parent.first_guardian_photo}`" class="img-circle avatar">
                    </template>
                </span>
            </div>
            <div class="col-12 col-sm-6">
                <span class="align-items-center student-thumb">
                    <template v-if="!student.parent.second_guardian_photo">
                        <img v-if="student.parent.second_guardian_relation == 'father' || (student.gender == 'female' && student.parent.second_guardian_relation == 'spouse')" src="/images/avatar_male.png" class="img-circle avatar">
                        <img v-else-if="student.parent.second_guardian_relation == 'mother' || (student.gender == 'male' && student.parent.second_guardian_relation == 'spouse')" src="/images/avatar_female.png" class="img-circle avatar">
                        <img v-else src="/images/avatar_male.png" class="img-circle avatar">
                    </template>
                    <template v-else>
                        <img :src="`/${student.parent.second_guardian_photo}`" class="img-circle avatar">
                    </template>
                </span>
            </div>

            <!--<div class="col-12 col-sm-6">
            	<upload-image id="first_guardian_photo" :upload-path="`/student/first-guardian/photo/${student.uuid}`" :remove-path="`/student/first-guardian/photo/remove/${student.uuid}`" :image-source="first_guardian_photo" @uploaded="updateFirstGuardian" @removed="updateFirstGuardian"></upload-image>
            </div>
            <div class="col-12 col-sm-6">
            	<upload-image id="second_guardian_photo" :upload-path="`/student/second-guardian/photo/${student.uuid}`" :remove-path="`/student/second-guardian/photo/remove/${student.uuid}`" :image-source="second_guardian_photo" @uploaded="updateSecondGuardian" @removed="updateSecondGuardian"></upload-image>
            </div> -->
        </div>

		<hr v-if="custom_fields.length" />
		<view-custom-field :fields="custom_fields" :customValues="custom_values"></view-custom-field>
	</div>
</template>

<script>
	export default {
		components: {},
		props: {
			student: {
				type: Object,
				default() {
					return {
						parent: {}
					}
				}
			}
		},
		data() {
			return {
                custom_fields: [],
                custom_values: []
			}
		},
		mounted(){
            if(!helper.hasPermission('list-student') && !helper.hasPermission('list-class-teacher-wise-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getParents();
		},
		methods: {
			getParents(){
				let loader = this.$loading.show();
				axios.get('/api/student/pre-requisite?form_type=student_parent')
					.then(response => {
						this.custom_fields = response.custom_fields;
						this.get(this.student);
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			get(student){
				let parent = student.parent;
		        this.custom_values = parent && parent.options && parent.options.hasOwnProperty('custom_values') ? parent.options.custom_values : [];
	          }
		},
		watch: { 
      		student(student) {
      			this.get(student);
	        }
	    }
	}
</script>

<style>
	.avatar {
		max-height: 150px;
		max-width: 150px;
	}
</style>