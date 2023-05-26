<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.edit_fee_head')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/finance/fee/head')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('finance.fee_head')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <fee-head-form :id="id"></fee-head-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import feeHeadForm from './form';

    export default {
        components : { feeHeadForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-fee-head')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
