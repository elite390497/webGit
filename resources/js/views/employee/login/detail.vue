<template>
	<div v-if="employee.id">
        <div class="row">
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('employee.enable_employee_login')" :value="enable_employee_login ? trans('list.yes') : trans('list.no')" />
            	<template v-if="enable_employee_login">
            		<view-label :label="trans('configuration.role')" :value="role" />
            		<view-label :label="trans('auth.email')" :value="employee_email" />
            		<view-label :label="trans('auth.username')" :value="employee_username" />
            		<view-label :label="trans('auth.password')" value="xxxxxxxxxx" />
            	</template>
            </div>
        </div>
	</div>	
</template>

<script>
	export default {
        props: {
            employee: {
                type: Object,
                default() {
                    return {
                    	user: {}
                    }
                }
            }
        },
		data(){
			return {
				enable_employee_login: false,
				employee_email: '',
				employee_username: '',
				role: ''
			}
		},
		mounted(){
			this.updateData(this.employee);
		},
		methods: {
			updateData(employee){
				let role = employee.user_id ? employee.user.roles[0].name : null;
				this.enable_employee_login = (employee.user_id && employee.user.status == 'activated') ? true : false;
				this.employee_email = employee.user_id ? employee.user.email : ''; 
				this.employee_username = employee.user_id ? employee.user.username : ''; 
				this.role = role && employee.user_id ? helper.ucword(role) : '';
			}
		},
		watch: {
			employee(employee){
				this.updateData(employee);
			}
		}
	}
</script>