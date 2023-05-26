<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('student.student')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('student.registration')}}</h4>
                            <p class="card-text font-80pc">{{trans('student.registration_module_description')}}</p>
                            <router-link to="/student/registration" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('student.registration')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('student.list_student')}}</h4>
                            <p class="card-text font-80pc">{{trans('student.admission_module_description')}}</p>
                            <router-link to="/student/card-view" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('student.list_student')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('student.promotion')}}</h4>
                            <p class="card-text font-80pc">{{trans('student.promotion_module_description')}}</p>
                            <router-link to="/student/promotion" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('student.promotion')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('student.termination')}}</h4>
                            <p class="card-text font-80pc">{{trans('student.termination_module_description')}}</p>
                            <router-link to="/student/termination" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('student.termination')})}}</router-link>
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