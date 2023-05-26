<template>
    <form @submit.prevent="proceed" @keydown="vehicleForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_name')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.name" name="name" :placeholder="trans('transport.vehicle_name')">
                            <show-error :form-name="vehicleForm" prop-name="name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_registration_number')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.registration_number" name="registration_number" :placeholder="trans('transport.vehicle_registration_number')">
                            <show-error :form-name="vehicleForm" prop-name="registration_number"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_max_seating_capacity')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.max_seating_capacity" name="max_seating_capacity" :placeholder="trans('transport.vehicle_max_seating_capacity')">
                            <show-error :form-name="vehicleForm" prop-name="max_seating_capacity"></show-error>
                        </div>
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_max_allowed')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.max_allowed" name="max_allowed" :placeholder="trans('transport.vehicle_max_allowed')">
                            <show-error :form-name="vehicleForm" prop-name="max_allowed"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_make')}}</label>
                            <vue-monthly-picker v-model="vehicleForm.make" name="make" :placeHolder="trans('transport.vehicle_make')" dateFormat="YYYY-MM "></vue-monthly-picker>
                        </div>
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_model')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.model" name="model" :placeholder="trans('transport.vehicle_model')">
                            <show-error :form-name="vehicleForm" prop-name="model"></show-error>
                        </div>  
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <div>{{trans('transport.vehicle_is_active')}}</div>
                            <switches class="m-t-10" v-model="vehicleForm.is_active" theme="bootstrap" color="success"></switches>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <div class="radio radio-success">
                                <input type="radio" value="1" id="owned" v-model="vehicleForm.is_owned" :checked="vehicleForm.is_owned" name="is_owned" @click="vehicleForm.errors.clear('is_owned')">
                                <label for="owned">{{trans('transport.vehicle_owned')}}</label>
                            </div>
                            <div class="radio radio-success">
                                <input type="radio" value="0" id="contract" v-model="vehicleForm.is_owned" :checked="!vehicleForm.is_owned" name="is_owned" @click="vehicleForm.errors.clear('is_owned')">
                                <label for="contract">{{trans('transport.vehicle_contract')}}</label>
                            </div>
                            <show-error :form-name="vehicleForm" prop-name="is_owned"></show-error>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_owner_name')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.owner_name" name="owner_name" :placeholder="trans('transport.vehicle_owner_name')">
                            <show-error :form-name="vehicleForm" prop-name="owner_name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_owner_company_name')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.owner_company_name" name="owner_company_name" :placeholder="trans('transport.vehicle_owner_company_name')">
                            <show-error :form-name="vehicleForm" prop-name="owner_company_name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_owner_phone')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.owner_phone" name="owner_phone" :placeholder="trans('transport.vehicle_owner_phone')">
                            <show-error :form-name="vehicleForm" prop-name="owner_phone"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_owner_email')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.owner_email" name="owner_email" :placeholder="trans('transport.vehicle_owner_email')">
                            <show-error :form-name="vehicleForm" prop-name="owner_email"></show-error>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_fuel_type')}}</label>
                            <v-select label="name" v-model="selected_vehicle_fuel_type" name="vehicle_fuel_type_id" id="vehicle_fuel_type_id" :options="vehicle_fuel_types" :placeholder="trans('general.select_one')" @select="onFuelTypeSelect" @close="vehicleForm.errors.clear('vehicle_fuel_type_id')" @remove="vehicleForm.vehicle_fuel_type_id = ''">
                                <div class="multiselect__option" slot="afterList" v-if="!vehicle_fuel_types.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
                            <show-error :form-name="vehicleForm" prop-name="vehicle_fuel_type_id"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('transport.max_fuel_capacity')}}</label>
                            <input class="form-control" type="text" v-model="vehicleForm.max_fuel_capacity" name="max_fuel_capacity" :placeholder="trans('transport.max_fuel_capacity')">
                            <show-error :form-name="vehicleForm" prop-name="max_fuel_capacity"></show-error>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('transport.vehicle_advance_info')}}</div>
                    <switches class="m-t-10" v-model="vehicleForm.advance_info" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <template v-if="vehicleForm.advance_info">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_chasis_number')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.chasis_number" name="chasis_number" :placeholder="trans('transport.vehicle_chasis_number')">
                        <show-error :form-name="vehicleForm" prop-name="chasis_number"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_engine_number')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.engine_number" name="engine_number" :placeholder="trans('transport.vehicle_engine_number')">
                        <show-error :form-name="vehicleForm" prop-name="engine_number"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_cubic_capacity')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.cubic_capacity" name="cubic_capacity" :placeholder="trans('transport.vehicle_cubic_capacity')">
                        <show-error :form-name="vehicleForm" prop-name="cubic_capacity"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_class')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.class" name="class" :placeholder="trans('transport.vehicle_class')">
                        <show-error :form-name="vehicleForm" prop-name="class"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_registration_place')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.registration_place" name="registration_place" :placeholder="trans('transport.vehicle_registration_place')">
                        <show-error :form-name="vehicleForm" prop-name="registration_place"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_registration_date')}}</label>
                        <datepicker v-model="vehicleForm.registration_date" :bootstrapStyling="true" @selected="vehicleForm.errors.clear('registration_date')" :placeholder="trans('transport.vehicle_registration_date')"></datepicker>
                        <show-error :form-name="vehicleForm" prop-name="registration_date"></show-error>
                    </div>
                </div>
            </template>
        </div>
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('transport.vehicle_disposal_info')}}</div>
                    <switches class="m-t-10" v-model="vehicleForm.disposal_info" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <template v-if="vehicleForm.disposal_info">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_sale_date')}}</label>
                        <datepicker v-model="vehicleForm.sale_date" :bootstrapStyling="true" @selected="vehicleForm.errors.clear('sale_date')" :placeholder="trans('transport.vehicle_sale_date')"></datepicker>
                        <show-error :form-name="vehicleForm" prop-name="sale_date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_selling_price')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.selling_price" name="selling_price" :placeholder="trans('transport.vehicle_selling_price')">
                        <show-error :form-name="vehicleForm" prop-name="selling_price"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_buyer_name')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.buyer_name" name="buyer_name" :placeholder="trans('transport.vehicle_buyer_name')">
                        <show-error :form-name="vehicleForm" prop-name="buyer_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_buyer_contact_number')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.buyer_contact_number" name="buyer_contact_number" :placeholder="trans('transport.vehicle_buyer_contact_number')">
                        <show-error :form-name="vehicleForm" prop-name="buyer_contact_number"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_buyer_address')}}</label>
                        <input class="form-control" type="text" v-model="vehicleForm.buyer_address" name="buyer_address" :placeholder="trans('transport.vehicle_buyer_address')">
                        <show-error :form-name="vehicleForm" prop-name="buyer_address"></show-error>
                    </div>
                </div>
            </template>
        </div>

        <div class="card-footer text-right">
            <router-link to="/transport/vehicle" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                vehicleForm: new Form({
                    name : '',
                    registration_number : '',
                    make: '',
                    model: '',
                    max_seating_capacity: '',
                    max_allowed: '',
                    is_owned: '',
                    owner_name: '',
                    owner_company_name: '',
                    owner_phone: '',
                    owner_email: '',
                    vehicle_fuel_type_id: '',
                    max_fuel_capacity: '',
                    is_active: false,
                    advance_info: false,
                    disposal_info: false,
                    chasis_number: '',
                    engine_number: '',
                    cubic_capacity: '',
                    class: '',
                    registration_date: '',
                    registration_place: '',
                    sale_date: '',
                    selling_price: '',
                    buyer_name: '',
                    buyer_contact_number: '',
                    buyer_address: ''
                }),
                vehicle_fuel_types: [],
                selected_vehicle_fuel_type: null
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.getVehicle();

            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/pre-requisite')
                    .then(response => {
                        this.vehicle_fuel_types = response.vehicle_fuel_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            proceed(){
                if(this.id)
                    this.updateVehicle();
                else
                    this.storeVehicle();
            },
            storeVehicle(){
                let loader = this.$loading.show();
                this.vehicleForm.make = moment(this.vehicleForm.make).format('YYYY-MM');
                this.vehicleForm.post('/api/vehicle')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getVehicle(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/'+this.id)
                    .then(response => {
                        this.vehicleForm.name = response.name;
                        this.vehicleForm.registration_number = response.registration_number;
                        this.vehicleForm.make = response.make;
                        this.vehicleForm.model = response.model;
                        this.vehicleForm.is_owned = response.is_owned;
                        this.vehicleForm.max_seating_capacity = response.max_seating_capacity;
                        this.vehicleForm.max_allowed = response.max_allowed;
                        this.vehicleForm.owner_name = response.owner_name;
                        this.vehicleForm.owner_company_name = response.owner_company_name;
                        this.vehicleForm.owner_phone = response.owner_phone;
                        this.vehicleForm.owner_email = response.owner_email;
                        this.vehicleForm.vehicle_fuel_type_id = response.vehicle_fuel_type_id;
                        this.selected_vehicle_fuel_type = response.vehicle_fuel_type_id ? {id: response.vehicle_fuel_type_id, name: response.vehicle_fuel_type.name} : null;
                        this.vehicleForm.max_fuel_capacity = response.max_fuel_capacity;
                        this.vehicleForm.is_active = response.is_active;

                        let advance_info = response.options && response.options.hasOwnProperty("advance") ? response.options.advance : {
                            chasis_number: '',
                            engine_number: '',
                            cubic_capacity: '',
                            class: '',
                            registration_date: '',
                            registration_place: ''
                        };
                        let disposal_info = response.options && response.options.hasOwnProperty("disposal") ? response.options.disposal : {
                            sale_date: '',
                            selling_price: '',
                            buyer_name: '',
                            buyer_contact_number: '',
                            buyer_address: ''
                        };
                        this.vehicleForm.chasis_number = advance_info.chasis_number; 
                        this.vehicleForm.engine_number = advance_info.engine_number; 
                        this.vehicleForm.cubic_capacity = advance_info.cubic_capacity; 
                        this.vehicleForm.class = advance_info.class; 
                        this.vehicleForm.registration_date = advance_info.registration_date; 
                        this.vehicleForm.registration_place = advance_info.registration_place; 
                        this.vehicleForm.sale_date = disposal_info.sale_date; 
                        this.vehicleForm.selling_price = disposal_info.selling_price; 
                        this.vehicleForm.buyer_name = disposal_info.buyer_name; 
                        this.vehicleForm.buyer_contact_number = disposal_info.buyer_contact_number; 
                        this.vehicleForm.buyer_address = disposal_info.buyer_address; 
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/transport/vehicle');
                    });
            },
            updateVehicle(){
                let loader = this.$loading.show();
                this.vehicleForm.make = moment(this.vehicleForm.make).format('YYYY-MM');
                this.vehicleForm.patch('/api/vehicle/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/transport/vehicle');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onFuelTypeSelect(selectedOption){
                this.vehicleForm.vehicle_fuel_type_id = selectedOption.id;
            },
            onVehicleSelect(selectedOption){
                this.vehicleForm.vehicle_id = selectedOption.id;
            }
        }
    }
</script>