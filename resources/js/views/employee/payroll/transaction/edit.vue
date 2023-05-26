<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.edit_payroll_transaction')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/payroll/transaction')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.list_payroll_transaction')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body card-form">
                    <payroll-transaction-form :uuid="uuid"></payroll-transaction-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import payrollTransactionForm from './form';

    export default {
        components : { payrollTransactionForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-payroll-transaction')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
