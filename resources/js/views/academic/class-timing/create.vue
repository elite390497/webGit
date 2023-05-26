<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.add_new_class_timing')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/academic/class/timing')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('academic.class_timing')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body">
                	<class-timing-form></class-timing-form>
                </div>
            </div>
        </div>
    </div>	
</template>

<script>
	import classTimingForm from './form'

	export default {
		components: {classTimingForm}
	}
</script>