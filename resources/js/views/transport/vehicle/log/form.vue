<template>
    <form @submit.prevent="proceed" @keydown="vehicleLogForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle')}}</label>
                    <v-select label="name" v-model="selected_vehicle" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('transport.select_vehicle')" @select="onVehicleSelect" @close="vehicleLogForm.errors.clear('vehicle_id')" @remove="vehicleLogForm.vehicle_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="vehicleLogForm" prop-name="vehicle_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_log_date_of_log')}}</label>
                    <datepicker v-model="vehicleLogForm.date_of_log" :bootstrapStyling="true" @selected="vehicleLogForm.errors.clear('date_of_log')" :placeholder="trans('transport.vehicle_log_date_of_log')"></datepicker>
                    <show-error :form-name="vehicleLogForm" prop-name="date_of_log"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_log_log')}}</label>
                    <input class="form-control" type="text" v-model="vehicleLogForm.log" name="log" :placeholder="trans('transport.vehicle_log_log')">
                    <show-error :form-name="vehicleLogForm" prop-name="log"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_log_description')}}</label>
                    <autosize-textarea v-model="vehicleLogForm.description" rows="1" name="description" :placeholder="trans('transport.vehicle_log_description')"></autosize-textarea>
                    <show-error :form-name="vehicleLogForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/transport/vehicle/log" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                vehicleLogForm: new Form({
                    vehicle_id : '',
                    date_of_log : '',
                    log: '',
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
                axios.get('/api/vehicle/log/pre-requisite')
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
                this.vehicleLogForm.post('/api/vehicle/log')
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
                axios.get('/api/vehicle/log/'+this.id)
                    .then(response => {
                        this.vehicleLogForm.vehicle_id = response.vehicle_log.vehicle_id;
                        this.vehicleLogForm.date_of_log = response.vehicle_log.date_of_log;
                        this.vehicleLogForm.log = response.vehicle_log.log;
                        this.vehicleLogForm.description = response.vehicle_log.description;
                        this.selected_vehicle = response.selected_vehicle;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/transport/vehicle/log');
                    });
            },
            updateVehicleLog(){
                let loader = this.$loading.show();
                this.vehicleLogForm.patch('/api/vehicle/log/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/transport/vehicle/log');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onVehicleSelect(selectedOption){
                this.vehicleLogForm.vehicle_id = selectedOption.id;
            }
        }
    }
</script>
