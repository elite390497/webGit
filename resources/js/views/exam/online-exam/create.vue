<template>
	<div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.add_new_online_exam')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/online-exam')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.online_exam')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <online-exam-form></online-exam-form>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
    import onlineExamForm from './form';

	export default {
		components: {onlineExamForm},
		data() {
			return {

			}
		},
		mounted(){
            if(!helper.hasPermission('create-online-exam')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
		},
		methods: {

		},
		computed: {

		},
		filters: {

		},
		watch: {
			
		}
	}
</script>