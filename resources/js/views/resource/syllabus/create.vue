<template>
	<div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('resource.add_new_syllabus')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/resource/syllabus')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('resource.syllabus')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <syllabus-form></syllabus-form>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
    import syllabusForm from './form';

	export default {
		components: {syllabusForm},
		data() {
			return {

			}
		},
		mounted(){
            if(!helper.hasPermission('create-syllabus')){
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