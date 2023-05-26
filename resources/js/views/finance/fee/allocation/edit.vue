<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.edit_fee_allocation')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/finance/fee/allocation')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('finance.fee_allocation')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <fee-allocation-form :uuid="uuid"></fee-allocation-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import feeAllocationForm from './form';

    export default {
        components : { feeAllocationForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-fee-allocation')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
