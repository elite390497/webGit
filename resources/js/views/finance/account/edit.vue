<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.edit_account')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/finance/account')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('finance.account')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <h4 class="card-title">{{trans('finance.edit_account')}}</h4>
                    <account-form :id="id"></account-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import accountForm from './form';

    export default {
        components : { accountForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-account')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
