<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('resource.resource')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('resource.assignment')}}</h4>
                            <p class="card-text font-80pc">{{trans('resource.assignment_module_description')}}</p>
                            <router-link to="/resource/assignment" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('resource.assignment')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('resource.notes')}}</h4>
                            <p class="card-text font-80pc">{{trans('resource.notes_module_description')}}</p>
                            <router-link to="/resource/notes" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('resource.notes')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('resource.lesson_plan')}}</h4>
                            <p class="card-text font-80pc">{{trans('resource.lesson_plan_module_description')}}</p>
                            <router-link to="/resource/lesson/plan" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('resource.lesson_plan')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('resource.syllabus')}}</h4>
                            <p class="card-text font-80pc">{{trans('resource.syllabus_module_description')}}</p>
                            <router-link to="/resource/syllabus" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('resource.syllabus')})}}</router-link>
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