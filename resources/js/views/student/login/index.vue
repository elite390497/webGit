<template>
	<div v-if="student.id">
	    <form @submit.prevent="submit" @keydown="userForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label class="custom-control custom-checkbox">
	                        <input type="checkbox" class="custom-control-input" v-model="userForm.enable_parent_login">
	                        <span class="custom-control-label">{{trans('student.enable_parent_login')}}</span>
	                    </label>
	                </div>
	                <template v-if="userForm.enable_parent_login">
		                <div class="form-group">
		                	<label for="">{{trans('auth.email')}}</label>
		                    <input class="form-control" type="text" v-model="userForm.parent_email" name="parent_email" :placeholder="trans('student.parent_email')">
		                    <show-error :form-name="userForm" prop-name="parent_email"></show-error>
		                </div>
		                <div class="form-group">
		                	<label for="">{{trans('auth.username')}}</label>
		                    <input class="form-control" type="text" v-model="userForm.parent_username" name="parent_username" :placeholder="trans('student.parent_username')">
		                    <show-error :form-name="userForm" prop-name="parent_username"></show-error>
		                </div>
		                <div class="form-group" v-if="student.parent.user_id">
		                    <label class="custom-control custom-checkbox">
		                        <input type="checkbox" class="custom-control-input" v-model="userForm.change_parent_password">
		                        <span class="custom-control-label">{{trans('auth.change_password')}}</span>
		                    </label>
		                </div>
		                <template v-if="userForm.change_parent_password">
			                <div class="form-group">
			                	<label for="">{{trans('auth.password')}}</label>
			                    <input class="form-control" type="password" v-model="userForm.parent_password" name="parent_password" :placeholder="trans('student.parent_password')">
			                    <show-error :form-name="userForm" prop-name="parent_password"></show-error>
			                </div>
			                <div class="form-group">
			                	<label for="">{{trans('auth.confirm_password')}}</label>
			                    <input class="form-control" type="password" v-model="userForm.parent_password_confirmation" name="parent_password_confirmation" :placeholder="trans('auth.confirm_password')">
			                    <show-error :form-name="userForm" prop-name="parent_password_confirmation"></show-error>
			                </div>
			            </template>
		            </template>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label class="custom-control custom-checkbox">
	                        <input type="checkbox" class="custom-control-input" v-model="userForm.enable_student_login">
	                        <span class="custom-control-label">{{trans('student.enable_student_login')}}</span>
	                    </label>
	                </div>
	                <template v-if="userForm.enable_student_login">
		                <div class="form-group">
		                	<label for="">{{trans('auth.email')}}</label>
		                    <input class="form-control" type="text" v-model="userForm.student_email" name="student_email" :placeholder="trans('student.student_email')">
		                    <show-error :form-name="userForm" prop-name="student_email"></show-error>
		                </div>
		                <div class="form-group">
		                	<label for="">{{trans('auth.username')}}</label>
		                    <input class="form-control" type="text" v-model="userForm.student_username" name="student_username" :placeholder="trans('student.student_username')">
		                    <show-error :form-name="userForm" prop-name="student_username"></show-error>
		                </div>
		                <div class="form-group" v-if="student.user_id">
		                    <label class="custom-control custom-checkbox">
		                        <input type="checkbox" class="custom-control-input" v-model="userForm.change_student_password">
		                        <span class="custom-control-label">{{trans('auth.change_password')}}</span>
		                    </label>
		                </div>
		                <template v-if="userForm.change_student_password">
			                <div class="form-group">
			                	<label for="">{{trans('auth.password')}}</label>
			                    <input class="form-control" type="password" v-model="userForm.student_password" name="student_password" :placeholder="trans('student.student_password')">
			                    <show-error :form-name="userForm" prop-name="student_password"></show-error>
			                </div>
			                <div class="form-group">
			                	<label for="">{{trans('auth.confirm_password')}}</label>
			                    <input class="form-control" type="password" v-model="userForm.student_password_confirmation" name="student_password_confirmation" :placeholder="trans('auth.confirm_password')">
			                    <show-error :form-name="userForm" prop-name="student_password_confirmation"></show-error>
			                </div>
			            </template>
		            </template>
	            </div>
	        </div>
            <div class="text-right" :class="footer ? 'card-footer' : ''">
	        	<button type="submit" class="btn btn-info">{{trans('general.save')}}</button>
            </div>
	    </form>
	</div>	
</template>

<script>
	export default {
		props: ['student','footer'],
		data(){
			return {
				userForm: new Form({
					enable_parent_login: false,
					enable_student_login: false,
					change_student_password: true,
					change_parent_password: true,
					student_email: '',
					student_username: '',
					parent_email: '',
					parent_username: '',
					parent_password: '',
					parent_password_confirmation: '',
					student_password: '',
					student_password_confirmation: ''
				})
			}
		},
		mounted(){
			this.updateLoginForm(this.student);
		},
		methods: {
			submit(){
				let loader = this.$loading.show();
				this.userForm.patch('/api/student/'+this.student.uuid+'/user/login')
					.then(response => {
						toastr.success(response.message);
						this.userForm.change_student_password = true;
						this.userForm.change_parent_password = true;
						this.$emit('completed');
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			updateLoginForm(student){
				this.userForm.enable_student_login = (student.user_id && student.user.status == 'activated') ? true : false;
				this.userForm.enable_parent_login = (student.parent.user_id && student.parent.user.status == 'activated') ? true : false;
				this.userForm.student_email = student.user_id ? student.user.email : ''; 
				this.userForm.student_username = student.user_id ? student.user.username : ''; 
				this.userForm.parent_email = student.parent.user_id ? student.parent.user.email : '';
				this.userForm.parent_username = student.parent.user_id ? student.parent.user.username : '';
			}
		},
		watch: {
			student(student){
				this.updateLoginForm(student);
			}
		}
	}
</script>