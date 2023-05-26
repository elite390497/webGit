<template>
	<div>
        <div class="row">
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.first_name')" :value="employee.first_name" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.middle_name')" :value="employee.middle_name" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.last_name')" :value="employee.last_name" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.gender')" :value="employee.gender" :to-uppercase-word="true" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.marital_status')" :value="employee.marital_status" :to-uppercase-word="true" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label type="date" :label="trans('employee.date_of_birth')" :value="employee.date_of_birth" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label type="date" :label="trans('employee.date_of_anniversary')" :value="employee.date_of_anniversary" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.unique_identification_number')" :value="employee.unique_identification_number" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.father_name')" :value="employee.father_name" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.mother_name')" :value="employee.mother_name" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.nationality')" :value="employee.nationality" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('employee.mother_tongue')" :value="employee.mother_tongue" />
        	</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.caste')" :value="employee.caste_id ? employee.caste.name : ''" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.category')" :value="employee.category_id ? employee.category.name : ''" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.religion')" :value="employee.religion_id ? employee.religion.name : ''" />
			</div>
			<div class="col-12 col-sm-4">
        		<view-label :label="trans('misc.blood_group')" :value="employee.blood_group_id ? employee.blood_group.name : ''" />
			</div>
	        <hr v-if="custom_fields.length" />
			<view-custom-field :fields="custom_fields" :customValues="custom_values"></view-custom-field>
		</div>
	</div>
</template>

<script>
	export default {
		components: {},
		props: ['employee'],
		data() {
			return {
				custom_fields: [],
				custom_values: []
			}
		},
		mounted(){
            if(!helper.hasPermission('list-employee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
	        this.get(this.employee);
		},
		methods: {
			getPreRequisite(){
	            let loader = this.$loading.show();
	            axios.get('/api/employee/basic/pre-requisite?form_type=employee_basic')
	            	.then(response => {
	            		this.custom_fields = response.custom_fields;
	            		loader.hide();
	            	})
	            	.catch(error => {
	            		loader.hide();
	            		helper.showErrorMsg(error);
	            	});	
			},
			get(employee){
	          	this.custom_values = employee.options && employee.options.hasOwnProperty('custom_values') ? employee.options.custom_values : [];
	        }
		},
		watch: { 
      		employee(employee) {
      			this.get(employee);
	        }
	    }
	}
</script>