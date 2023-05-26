<template>
	<div v-if="student.id">
        <div class="row">
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.enable_parent_login')" :value="enable_parent_login ? trans('list.yes') : trans('list.no')" />
            	<template v-if="enable_parent_login">
            		<view-label :label="trans('auth.email')" :value="parent_email" />
            		<view-label :label="trans('auth.username')" :value="parent_username" />
            		<view-label :label="trans('auth.password')" value="xxxxxxxxxx" />
            	</template>
            </div>
            <div class="col-12 col-sm-6">
            	<view-label :label="trans('student.enable_student_login')" :value="enable_student_login ? trans('list.yes') : trans('list.no')" />
            	<template v-if="enable_student_login">
            		<view-label :label="trans('auth.email')" :value="student_email" />
            		<view-label :label="trans('auth.username')" :value="student_username" />
            		<view-label :label="trans('auth.password')" value="xxxxxxxxxx" />
            	</template>
            </div>
        </div>
	</div>	
</template>

<script>
	export default {
        props: {
            student: {
                type: Object,
                default() {
                    return {
                    	parent: {
                    		user: {}
                    	},
                    	user: {}
                    }
                }
            }
        },
		data(){
			return {
				enable_parent_login: false,
				enable_student_login: false,
				student_email: '',
				student_username: '',
				parent_email: ''
			}
		},
		mounted(){
			this.updateData(this.student);
		},
		methods: {
			updateData(student){
				this.enable_student_login = (student.user_id && student.user.status == 'activated') ? true : false;
				this.enable_parent_login = (student.parent.user_id && student.parent.user.status == 'activated') ? true : false;
				this.student_email = student.user_id ? student.user.email : ''; 
				this.student_username = student.user_id ? student.user.username : ''; 
				this.parent_email = student.parent.user_id ? student.parent.user.email : '';
				this.parent_username = student.parent.user_id ? student.parent.user.username : '';
			}
		},
		watch: {
			student(student){
				this.updateData(student);
			}
		}
	}
</script>