<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('resource.edit_lesson_plan')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/resource/lesson/plan')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('resource.lesson_plan')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <lesson-plan-form :uuid="uuid"></lesson-plan-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import lessonPlanForm from './form';

    export default {
        components : { lessonPlanForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-lesson-plan')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
