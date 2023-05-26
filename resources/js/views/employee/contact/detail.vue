<template>
	<div>
        <div class="row">
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.contact_number')" :value="employee.contact_number" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.alternate_contact_number')" :value="employee.alternate_contact_number" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.email')" :value="employee.email" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.alternate_email')" :value="employee.alternate_email" />
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.emergency_contact_name')" :value="employee.emergency_contact_name" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.emergency_contact_number')" :value="employee.emergency_contact_number" />
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.present_address')" :value="employee.present_address" />
            </div>
            <div class="col-12 col-sm-4">
            	<view-label :label="trans('employee.permanent_address')" :value="employee.same_as_present_address ? trans('employee.same_as_present_address') : employee.permanent_address" />
            </div>
        </div>
        <hr v-if="custom_fields.length" />
        <view-custom-field :fields="custom_fields" :customValues="custom_values"></view-custom-field>
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
			get(employee){
	          	this.custom_values = employee.options && employee.options.hasOwnProperty('custom_values') ? employee.options.custom_values : [];
			},
		},
		watch: { 
      		employee: function(employee) {
      			this.get(employee);
	        }
	    }
	}
</script>