<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('inventory.edit_stock_transfer')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/inventory/stock/transfer')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('inventory.stock_transfer')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <stock-transfer-form :id="id"></stock-transfer-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import stockTransferForm from './form';

    export default {
        components : { stockTransferForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-stock-transfer')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>