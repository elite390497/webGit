<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.edit_vehicle_performance_criteria')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/transport/vehicle/performance/criteria')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('transport.vehicle_performance_criteria')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <vehicle-performance-criteria-form :id="id"></vehicle-performance-criteria-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vehiclePerformanceCriteriaForm from './form';

    export default {
        components : { vehiclePerformanceCriteriaForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-vehicle')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
