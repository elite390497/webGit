<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.edit_enquiry')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/reception/enquiry')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('reception.enquiry')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <enquiry-form :uuid="uuid"></enquiry-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import enquiryForm from './form';

    export default {
        components : { enquiryForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-enquiry')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
