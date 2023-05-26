<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('frontend.edit_page')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/frontend/page')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('frontend.page')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <page-form :uuid="uuid"></page-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import pageForm from './form';

    export default {
        components : { pageForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.frontendConfigurationAccessible()){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
