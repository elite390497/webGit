<template>
	<div v-if="employee.id">
	    <form @submit.prevent="submit" @keydown="userForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label class="custom-control custom-checkbox">
	                        <input type="checkbox" class="custom-control-input" v-model="userForm.enable_employee_login">
	                        <span class="custom-control-label">{{trans('employee.enable_employee_login')}}</span>
	                    </label>
	                </div>
	                <template v-if="userForm.enable_employee_login">
		                <div class="form-group">
		                    <label for="">{{trans('configuration.role')}}</label>
		                    <v-select label="name" v-model="selected_role"name="role" id="role" :options="roles" :placeholder="trans('configuration.select_role')" @select="onRoleSelect" @close="userForm.errors.clear('role')" @remove="userForm.role = ''">
		                        <div class="multiselect__option" slot="afterList" v-if="!roles.length">
		                            {{trans('general.no_option_found')}}
		                        </div>
		                    </v-select>
		                    <show-error :form-name="userForm" prop-name="role"></show-error>
		                </div>
		                <div class="form-group">
		                	<label for="">{{trans('auth.email')}}</label>
		                    <input class="form-control" type="text" v-model="userForm.employee_email" name="employee_email" :placeholder="trans('employee.employee_email')">
		                    <show-error :form-name="userForm" prop-name="employee_email"></show-error>
		                </div>
		                <div class="form-group">
		                	<label for="">{{trans('auth.username')}}</label>
		                    <input class="form-control" type="text" v-model="userForm.employee_username" name="employee_username" :placeholder="trans('employee.employee_username')">
		                    <show-error :form-name="userForm" prop-name="employee_username"></show-error>
		                </div>
		                <div class="form-group" v-if="employee.user_id">
		                    <label class="custom-control custom-checkbox">
		                        <input type="checkbox" class="custom-control-input" v-model="userForm.change_employee_password">
		                        <span class="custom-control-label">{{trans('auth.change_password')}}</span>
		                    </label>
		                </div>
		                <template v-if="userForm.change_employee_password">
			                <div class="form-group">
			                	<label for="">{{trans('auth.password')}}</label>
			                    <input class="form-control" type="password" v-model="userForm.employee_password" name="employee_password" :placeholder="trans('employee.employee_password')">
			                    <show-error :form-name="userForm" prop-name="employee_password"></show-error>
			                </div>
			                <div class="form-group">
			                	<label for="">{{trans('auth.confirm_password')}}</label>
			                    <input class="form-control" type="password" v-model="userForm.employee_password_confirmation" name="employee_password_confirmation" :placeholder="trans('auth.confirm_password')">
			                    <show-error :form-name="userForm" prop-name="employee_password_confirmation"></show-error>
			                </div>
			            </template>
		            </template>
	            </div>
	        </div>
            <div class="card-footer text-right">
	        	<button type="submit" class="btn btn-info">{{trans('general.save')}}</button>
            </div>
	    </form>
	</div>	
</template>

<script>
	export default {
		components: {},
		props: ['employee'],
		data(){
			return {
				userForm: new Form({
					enable_employee_login: false,
					change_employee_password: true,
					employee_email: '',
					employee_username: '',
					employee_password: '',
					employee_password_confirmation: '',
					role: ''
				}),
				roles: [],
				selected_role: null
			}
		},
		mounted(){
			this.updateLoginForm(this.employee);

			this.getPreRequisite();
		},
		methods: {
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/role/employee/list')
					.then(response => {
						this.roles = response;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			submit(){
				let loader = this.$loading.show();
				this.userForm.patch('/api/employee/'+this.employee.uuid+'/user/login')
					.then(response => {
						toastr.success(response.message);
						this.userForm.change_employee_password = true;
						this.$emit('completed');
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			updateLoginForm(employee){
				let role = employee.user_id ? employee.user.roles[0].name : null;
				this.userForm.enable_employee_login = (employee.user_id && employee.user.status == 'activated') ? true : false;
				this.userForm.employee_email = employee.user_id ? employee.user.email : ''; 
				this.userForm.employee_username = employee.user_id ? employee.user.username : ''; 
				this.userForm.role = role && employee.user_id ? helper.ucword(role) : '';
				this.selected_role = role && employee.user_id ? {id: employee.user.roles[0].id, name: helper.ucword(role)} : null;
			},
			onRoleSelect(selectedOption){
				this.userForm.role = selectedOption.name;
			}
		},
		watch: {
			employee(employee){
				this.updateLoginForm(employee);
			}
		}
	}
</script>