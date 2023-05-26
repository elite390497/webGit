<template>
	<div>
        <div class="row">
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('student.contact_number')" :value="student.contact_number" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('student.email')" :value="student.email" />
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('student.emergency_contact_name')" :value="student.emergency_contact_name" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('student.emergency_contact_number')" :value="student.emergency_contact_number" />
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('student.present_address')" :value="student.present_address" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('student.permanent_address')" :value="student.same_as_present_address ? trans('student.same_as_present_address') : student.permanent_address" />
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
			get(student){
	          	this.custom_values = student.options && student.options.hasOwnProperty('custom_values') ? student.options.custom_values : [];
			}
		},
		watch: { 
      		student: function(student) {
      			this.get(student);
	        }
	    }
	}
</script>