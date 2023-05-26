<template>
	<div>
        <div class="row">
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.first_name')" :value="student.first_name" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.middle_name')" :value="student.middle_name" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.last_name')" :value="student.last_name" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.gender')" :value="student.gender" :to-uppercase-word="true" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label type="date" :label="trans('student.date_of_birth')" :value="student.date_of_birth" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.birth_place')" :value="student.birth_place" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.unique_identification_number')" :value="student.unique_identification_number" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.nationality')" :value="student.nationality" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('student.mother_tongue')" :value="student.mother_tongue" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.caste')" :value="student.caste_id ? student.caste.name : ''" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.category')" :value="student.category_id ? student.category.name : ''" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.religion')" :value="student.religion_id ? student.religion.name : ''" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.blood_group')" :value="student.blood_group_id ? student.blood_group.name : ''" />
			</div>
		</div>
        <hr v-if="custom_fields.length" />
		<view-custom-field :fields="custom_fields" :customValues="custom_values"></view-custom-field>
	</div>
</template>

<script>
	export default {
		components: {},
		props: ['student'],
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

            this.getPreRequisite();
		},
		methods: {
			getPreRequisite(){
	            let loader = this.$loading.show();
	            axios.get('/api/student/pre-requisite?form_type=student_basic')
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
			get(student){
	          	this.custom_values = student.options && student.options.hasOwnProperty('custom_values') ? student.options.custom_values : [];
	        }
		},
		watch: { 
      		student(student) {
      			this.get(student);
	        }
	    }
	}
</script>