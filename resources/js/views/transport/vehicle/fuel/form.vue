<template>
	<div>
        <form @submit.prevent="proceed" @keydown="vehicleFuelForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle')}}</label>
                        <v-select label="name" v-model="selected_vehicle" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('general.select_one')" @select="onVehicleSelect" @close="vehicleFuelForm.errors.clear('vehicle_id')" @remove="vehicleFuelForm.vehicle_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="vehicleFuelForm" prop-name="vehicle_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_fuel_quantity')}}</label>
                        <input class="form-control" type="text" v-model="vehicleFuelForm.quantity" name="quantity" :placeholder="trans('transport.vehicle_fuel_quantity')">
                        <show-error :form-name="vehicleFuelForm" prop-name="quantity"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_fuel_price_per_unit')}}</label>
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="price_per_unit" :placeholder="trans('transport.vehicle_fuel_price_per_unit')" v-model="vehicleFuelForm.price_per_unit" @input.native="vehicleFuelForm.errors.clear('price_per_unit')"></currency-input>
                        <show-error :form-name="vehicleFuelForm" prop-name="price_per_unit"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('transport.date_of_fueling')}}</label>
	                    <datepicker v-model="vehicleFuelForm.date_of_fueling" :bootstrapStyling="true" @selected="vehicleFuelForm.errors.clear('date_of_fueling')" :placeholder="trans('academic.date_of_fueling')"></datepicker>
	                    <show-error :form-name="vehicleFuelForm" prop-name="date_of_fueling"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_log_log')}}</label>
                        <input class="form-control" type="text" v-model="vehicleFuelForm.log" name="log" :placeholder="trans('transport.vehicle_log_log')">
                        <show-error :form-name="vehicleFuelForm" prop-name="log"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-9">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_fuel_description')}}</label>
                        <autosize-textarea v-model="vehicleFuelForm.description" rows="2" name="description" :placeholder="trans('vehicle.vehicle_fuel_description')"></autosize-textarea>
                        <show-error :form-name="vehicleFuelForm" prop-name="description"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <label>&nbsp;</label>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_fuel')" :token="vehicleFuelForm.upload_token" module="vehicle_fuel" :clear-file="clearAttachment" :module-id="id"></file-upload-input>
                    </div>
                </div>
            </div>

            <div class="card-footer text-right">
                <router-link to="/transport/vehicle/fuel" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
                <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="id">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>

    export default {
        components:{},
        props: ['id'],
        data() {
            return {
                vehicleFuelForm: new Form({
                    quantity : '',
                    vehicle_id: '',
                    price_per_unit: '',
                    date_of_fueling: '',
                    log: '',
                    description : '',
                    upload_token: ''
                }),
                default_currency: helper.getConfig('default_currency'),
                vehicles: [],
                selected_vehicle: null,
                clearAttachment: false
            };
        },
        mounted() {
            this.vehicleFuelForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();

            if (this.id)
                this.getFuel();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateFuel();
                else
                    this.storeFuel();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/fuel/pre-requisite')
                    .then(response => {
                        this.vehicles = response.vehicles;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            storeFuel(){
                let loader = this.$loading.show();
                this.vehicleFuelForm.post('/api/vehicle/fuel')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.$emit('completed');
                        this.vehicleFuelForm.upload_token = this.$uuid.v4();
                        this.selected_vehicle = null;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getFuel(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/fuel/'+this.id)
                    .then(response => {
                        this.vehicleFuelForm.quantity = response.vehicle_fuel.quantity;
                        this.vehicleFuelForm.price_per_unit = response.vehicle_fuel.price_per_unit;
                        this.vehicleFuelForm.vehicle_id = response.vehicle_fuel.vehicle_id;
                        this.vehicleFuelForm.date_of_fueling = response.vehicle_fuel.date_of_fueling;
                        this.vehicleFuelForm.log = response.vehicle_fuel.log;
                        this.selected_vehicle = {id: response.vehicle_fuel.vehicle_id, name: response.vehicle_fuel.vehicle.name};
                        this.vehicleFuelForm.description = response.vehicle_fuel.description;
                        this.vehicleFuelForm.upload_token = response.vehicle_fuel.upload_token;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/vehicle/fuel');
                    });
            },
            updateFuel(){
                let loader = this.$loading.show();
                this.vehicleFuelForm.patch('/api/vehicle/fuel/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                        this.$router.push('/transport/vehicle/fuel');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onFuelTypeSelect(selectedOption){
            	this.vehicleFuelForm.vehicle_fuel_type_id = selectedOption.id;
            },
            onVehicleSelect(selectedOption){
            	this.vehicleFuelForm.vehicle_id = selectedOption.id;
            }
        }
    }
</script>
