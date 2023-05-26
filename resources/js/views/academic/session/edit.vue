<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.edit_session')}}
                        <button class="btn btn-info btn-sm" @click="$router.push('/academic/session')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('academic.session')}}</span></button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <academic-session-form :id="id"></academic-session-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import academicSessionForm from './form';

    export default {
        components : { academicSessionForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-academic-session')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
