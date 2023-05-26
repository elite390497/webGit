<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.edit_account_transfer')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/finance/transaction/account/transfer')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('finance.account_transfer')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <account-transfer-form :uuid="uuid"></account-transfer-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import accountTransferForm from './form';

    export default {
        components : { accountTransferForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-account-transfer')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
