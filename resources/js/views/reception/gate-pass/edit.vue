<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.edit_gate_pass')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/reception/gate/pass')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('reception.gate_pass')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <gate-pass-form :uuid="uuid"></gate-pass-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import gatePassForm from './form';

    export default {
        components : { gatePassForm },
        data() {
            return {
                uuid:this.$route.params.uuid
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-gate-pass')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>