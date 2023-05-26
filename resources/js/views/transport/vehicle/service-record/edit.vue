<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.edit_vehicle_service_record')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/transport/vehicle/service/record')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('transport.vehicle_service_record')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <vehicle-service-record-form :id="id"></vehicle-service-record-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vehicleServiceRecordForm from './form';

    export default {
        components : { vehicleServiceRecordForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-vehicle-service-record')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
