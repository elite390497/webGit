<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('institute.edit_document')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/institute/document')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('institute.document')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <institute-document-form :id="id"></institute-document-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import instituteDocumentForm from './form';

    export default {
        components : { instituteDocumentForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-institute-document')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>