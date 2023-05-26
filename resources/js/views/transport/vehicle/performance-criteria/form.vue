<template>
    <form @submit.prevent="proceed" @keydown="vehiclePerformanceCriteriaForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle')}}</label>
                    <v-select label="name" v-model="selected_vehicle" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('transport.select_vehicle')" @select="onVehicleSelect" @close="vehiclePerformanceCriteriaForm.errors.clear('vehicle_id')" @remove="vehiclePerformanceCriteriaForm.vehicle_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="vehicle_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_performance_criteria_date_effective')}}</label>
                    <datepicker v-model="vehiclePerformanceCriteriaForm.date_effective" :bootstrapStyling="true" @selected="vehiclePerformanceCriteriaForm.errors.clear('date_effective')" :placeholder="trans('transport.vehicle_performance_criteria_date_effective')"></datepicker>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="date_effective"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_performance_criteria_mileage_range')}} ({{trans('transport.unit_km_per_liter')}})</label>
                    <div class="input-group mb-3">
                        <input type="text" v-model="vehiclePerformanceCriteriaForm.min_mileage" class="form-control">
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{trans('general.to')}}</span>
                        </div>
                        <input type="text" v-model="vehiclePerformanceCriteriaForm.max_mileage" class="form-control">
                    </div>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="min_mileage"></show-error>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="max_mileage"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_performance_criteria_run_range')}} ({{trans('transport.unit_km')}})</label>
                    <div class="input-group mb-3">
                        <input type="text" v-model="vehiclePerformanceCriteriaForm.min_run" class="form-control">
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{trans('general.to')}}</span>
                        </div>
                        <input type="text" v-model="vehiclePerformanceCriteriaForm.max_run" class="form-control">
                    </div>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="min_run"></show-error>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="max_run"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_performance_criteria_service_charge_range')}} ({{trans('transport.vehicle_performance_criteria_service_charge_range_per_month')}})</label>
                    <div class="input-group mb-3">
                        <input type="text" v-model="vehiclePerformanceCriteriaForm.min_service_charge" class="form-control">
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{trans('general.to')}}</span>
                        </div>
                        <input type="text" v-model="vehiclePerformanceCriteriaForm.max_service_charge" class="form-control">
                    </div>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="min_service_charge"></show-error>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="max_service_charge"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_performance_criteria_description')}}</label>
                    <autosize-textarea v-model="vehiclePerformanceCriteriaForm.description" rows="1" name="description" :placeholder="trans('transport.vehicle_performance_criteria_description')"></autosize-textarea>
                    <show-error :form-name="vehiclePerformanceCriteriaForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/transport/vehicle/performance/criteria" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                vehiclePerformanceCriteriaForm: new Form({
                    vehicle_id : '',
                    date_effective : '',
                    max_mileage: '',
                    min_mileage: '',
                    min_run: '',
                    max_run: '',
                    min_service_charge: '',
                    max_service_charge: '',
                    description: ''
                }),
                vehicles: [],
                selected_vehicle: null
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.getVehicleLog();

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateVehicleLog();
                else
                    this.storeVehicleLog();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/performance/criteria/pre-requisite')
                    .then(response => {
                        this.vehicles = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            storeVehicleLog(){
                let loader = this.$loading.show();
                this.vehiclePerformanceCriteriaForm.post('/api/vehicle/performance/criteria')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_vehicle = null;
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getVehicleLog(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/performance/criteria/'+this.id)
                    .then(response => {
                        this.vehiclePerformanceCriteriaForm.vehicle_id = response.vehicle_performance_criteria.vehicle_id;
                        this.vehiclePerformanceCriteriaForm.date_effective = response.vehicle_performance_criteria.date_effective;
                        this.vehiclePerformanceCriteriaForm.min_mileage = response.vehicle_performance_criteria.min_mileage;
                        this.vehiclePerformanceCriteriaForm.max_mileage = response.vehicle_performance_criteria.max_mileage;
                        this.vehiclePerformanceCriteriaForm.min_run = response.vehicle_performance_criteria.min_run;
                        this.vehiclePerformanceCriteriaForm.max_run = response.vehicle_performance_criteria.max_run;
                        this.vehiclePerformanceCriteriaForm.min_service_charge = response.vehicle_performance_criteria.min_service_charge;
                        this.vehiclePerformanceCriteriaForm.max_service_charge = response.vehicle_performance_criteria.max_service_charge;
                        this.vehiclePerformanceCriteriaForm.description = response.vehicle_performance_criteria.description;
                        this.selected_vehicle = response.selected_vehicle;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/transport/vehicle/performance/criteria');
                    });
            },
            updateVehicleLog(){
                let loader = this.$loading.show();
                this.vehiclePerformanceCriteriaForm.patch('/api/vehicle/performance/criteria/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/transport/vehicle/performance/criteria');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onVehicleSelect(selectedOption){
                this.vehiclePerformanceCriteriaForm.vehicle_id = selectedOption.id;
            }
        }
    }
</script>
