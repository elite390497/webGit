<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('academic.academic')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('academic.session')}}</h4>
                            <p class="card-text font-80pc">{{trans('academic.session_module_description')}}</p>
                            <router-link to="/academic/session" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.session')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('academic.course')}}</h4>
                            <p class="card-text font-80pc">{{trans('academic.course_module_description')}}</p>
                            <router-link to="/academic/course" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.course')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('academic.batch')}}</h4>
                            <p class="card-text font-80pc">{{trans('academic.batch_module_description')}}</p>
                            <router-link to="/academic/batch" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.batch')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('academic.subject')}}</h4>
                            <p class="card-text font-80pc">{{trans('academic.subject_module_description')}}</p>
                            <router-link to="/academic/subject" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.subject')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
        
	}
</script>