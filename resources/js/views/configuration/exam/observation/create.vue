<template>
	<div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.add_new_observation')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/configuration/exam/observation')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.observation')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <observation-form></observation-form>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
    import observationForm from './form';

	export default {
		components: {observationForm},
		data() {
			return {

			}
		},
		mounted(){
            if(!helper.hasPermission('access-configuration')){
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