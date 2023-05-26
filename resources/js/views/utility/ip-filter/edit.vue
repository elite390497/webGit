<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('utility.edit_ip_filter')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/utility/ip-filter')"><i class="fas fa-ellipsis-v"></i> <span class="d-none d-sm-inline">{{trans('utility.ip_filter')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <ip-filter-form :id="id"></ip-filter-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ipFilterForm from './form';

    export default {
        components : { ipFilterForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(!helper.featureAvailable('ip_filter')){
                helper.featureNotAvailableMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
