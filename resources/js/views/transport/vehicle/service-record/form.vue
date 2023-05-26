<template>
	<div>
        <form @submit.prevent="proceed" @keydown="vehicleServiceRecordForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle')}}</label>
                        <v-select label="name" v-model="selected_vehicle" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('general.select_one')" @select="onVehicleSelect" @close="vehicleServiceRecordForm.errors.clear('vehicle_id')" @remove="vehicleServiceRecordForm.vehicle_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="vehicleServiceRecordForm" prop-name="vehicle_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_service_center')}}</label>
                        <v-select label="name" v-model="selected_vehicle_service_center" name="vehicle_service_center_id" id="vehicle_service_center_id" :options="vehicle_service_centers" :placeholder="trans('general.select_one')" @select="onVehicleServiceCenterSelect" @close="vehicleServiceRecordForm.errors.clear('vehicle_service_center_id')" @remove="vehicleServiceRecordForm.vehicle_service_center_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="vehicleServiceRecordForm" prop-name="vehicle_service_center_id"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('transport.date_of_service')}}</label>
	                    <datepicker v-model="vehicleServiceRecordForm.date_of_service" :bootstrapStyling="true" @selected="vehicleServiceRecordForm.errors.clear('date_of_service')" :placeholder="trans('transport.date_of_service')"></datepicker>
	                    <show-error :form-name="vehicleServiceRecordForm" prop-name="date_of_service"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_service_record_amount')}}</label>
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="amount" :placeholder="trans('transport.vehicle_service_record_amount')" v-model="vehicleServiceRecordForm.amount" @input.native="vehicleServiceRecordForm.errors.clear('amount')"></currency-input>
                        <show-error :form-name="vehicleServiceRecordForm" prop-name="amount"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_log_log')}}</label>
                        <input class="form-control" type="text" v-model="vehicleServiceRecordForm.log" name="log" :placeholder="trans('transport.vehicle_log_log')">
                        <show-error :form-name="vehicleServiceRecordForm" prop-name="log"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('transport.vehicle_service_record_next_due_date')}}</label>
	                    <datepicker v-model="vehicleServiceRecordForm.next_due_date" :bootstrapStyling="true" @selected="vehicleServiceRecordForm.errors.clear('vehicle_service_record_next_due_date')" :placeholder="trans('transport.vehicle_service_record_next_due_date')"></datepicker>
	                    <show-error :form-name="vehicleServiceRecordForm" prop-name="next_due_date"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_service_record_description')}}</label>
                        <autosize-textarea v-model="vehicleServiceRecordForm.description" rows="2" name="description" :placeholder="trans('vehicle.vehicle_service_record_description')"></autosize-textarea>
                        <show-error :form-name="vehicleServiceRecordForm" prop-name="description"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <label></label>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="vehicleServiceRecordForm.upload_token" module="vehicle_service_record" :clear-file="clearAttachment" :module-id="id"></file-upload-input>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/transport/vehicle/service/record" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                vehicleServiceRecordForm: new Form({
                    amount : '',
                    log: '',
                    next_due_date: '',
                    vehicle_id: '',
                    vehicle_service_center_id: '',
                    date_of_service: '',
                    description : '',
                    upload_token: ''
                }),
                default_currency: helper.getConfig('default_currency'),
                vehicles: [],
                vehicle_service_centers: [],
                selected_vehicle: null,
                selected_vehicle_service_center: null,
                clearAttachment: false
            };
        },
        mounted() {
            this.vehicleServiceRecordForm.upload_token = this.$uuid.v4();

            let loader = this.$loading.show();
            axios.get('/api/vehicle/service/record/pre-requisite')
            	.then(response => {
            		this.vehicles = response.vehicles;
                    this.vehicle_service_centers = response.vehicle_service_centers;
                    loader.hide();
            	})
            	.catch(error => {
                    loader.hide();
            		helper.showErrorMsg(error);
            	})

            if (this.id)
                this.getServiceRecord();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateServiceRecord();
                else
                    this.storeServiceRecord();
            },
            storeServiceRecord(){
                let loader = this.$loading.show();
                this.vehicleServiceRecordForm.post('/api/vehicle/service/record')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.$emit('completed');
                        this.vehicleServiceRecordForm.upload_token = this.$uuid.v4();
                        this.selected_vehicle = null;
                        this.selected_vehicle_service_center = null;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getServiceRecord(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/service/record/'+this.id)
                    .then(response => {
                        this.vehicleServiceRecordForm.amount = response.vehicle_service_record.amount;
                        this.vehicleServiceRecordForm.log = response.vehicle_service_record.log;
                        this.vehicleServiceRecordForm.vehicle_id = response.vehicle_service_record.vehicle_id;
                        this.vehicleServiceRecordForm.vehicle_service_center_id = response.vehicle_service_record.vehicle_service_center_id;
                        this.vehicleServiceRecordForm.date_of_service = response.vehicle_service_record.date_of_service;
                        this.vehicleServiceRecordForm.next_due_date = response.vehicle_service_record.next_due_date;
                        this.selected_vehicle = {id: response.vehicle_service_record.vehicle_id, name: response.vehicle_service_record.vehicle.name};
                        this.selected_vehicle_service_center = response.vehicle_service_record.vehicle_service_center_id ?  {id: response.vehicle_service_record.vehicle_service_center_id, name: response.vehicle_service_record.vehicle_service_center.name} : null;
                        this.vehicleServiceRecordForm.description = response.vehicle_service_record.description;
                        this.vehicleServiceRecordForm.upload_token = response.vehicle_service_record.upload_token;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/transport/vehicle/service/record');
                    });
            },
            updateServiceRecord(){
                let loader = this.$loading.show();
                this.vehicleServiceRecordForm.patch('/api/vehicle/service/record/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                        this.$router.push('/transport/vehicle/service/record');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onVehicleSelect(selectedOption){
            	this.vehicleServiceRecordForm.vehicle_id = selectedOption.id;
            },
            onVehicleServiceCenterSelect(selectedOption){
                this.vehicleServiceRecordForm.vehicle_service_center_id = selectedOption.id;
            }
        }
    }
</script>
