<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.edit_fee')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/transport/fee')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('transport.edit_fee')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <transport-fee-form :id="id"></transport-fee-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import transportFeeForm from './form';

    export default {
        components : { transportFeeForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-transport-fee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
