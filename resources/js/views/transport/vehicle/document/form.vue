<template>
	<div>
        <form @submit.prevent="proceed" @keydown="vehicleDocumentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle')}}</label>
                        <v-select label="name" v-model="selected_vehicle" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('general.select_one')" @select="onVehicleSelect" @close="vehicleDocumentForm.errors.clear('vehicle_id')" @remove="vehicleDocumentForm.vehicle_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="vehicleDocumentForm" prop-name="vehicle_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-9">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_document_title')}}</label>
                        <input class="form-control" type="text" v-model="vehicleDocumentForm.title" name="title" :placeholder="trans('transport.vehicle_document_title')">
                        <show-error :form-name="vehicleDocumentForm" prop-name="title"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_document_type')}}</label>
                        <v-select label="name" v-model="selected_vehicle_document_type" name="vehicle_document_type_id" id="vehicle_document_type_id" :options="vehicle_document_types" :placeholder="trans('general.select_one')" @select="onDocumentTypeSelect" @close="vehicleDocumentForm.errors.clear('vehicle_document_type_id')" @remove="vehicleDocumentForm.vehicle_document_type_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!vehicle_document_types.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="vehicleDocumentForm" prop-name="vehicle_document_type_id"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-3" v-if="expiry_date">
	                <div class="form-group">
	                    <label for="">{{trans('transport.date_of_expiry')}}</label>
	                    <datepicker v-model="vehicleDocumentForm.date_of_expiry" :bootstrapStyling="true" @selected="vehicleDocumentForm.errors.clear('date_of_expiry')" :placeholder="trans('transport.date_of_expiry')"></datepicker>
	                    <show-error :form-name="vehicleDocumentForm" prop-name="date_of_expiry"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('transport.vehicle_document_description')}}</label>
                        <autosize-textarea v-model="vehicleDocumentForm.description" rows="2" name="description" :placeholder="trans('vehicle.vehicle_document_description')"></autosize-textarea>
                        <show-error :form-name="vehicleDocumentForm" prop-name="description"></show-error>
                    </div>
                </div>
                <template v-if="insurance_document">
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_policy_number')}}</label>
                            <input class="form-control" type="text" v-model="vehicleDocumentForm.policy_number" name="policy_number" :placeholder="trans('transport.vehicle_policy_number')">
                            <show-error :form-name="vehicleDocumentForm" prop-name="policy_number"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_insurance_date')}}</label>
                            <datepicker v-model="vehicleDocumentForm.insurance_date" :bootstrapStyling="true" @selected="vehicleDocumentForm.errors.clear('insurance_date')" :placeholder="trans('transport.vehicle_insurance_date')"></datepicker>
                            <show-error :form-name="vehicleDocumentForm" prop-name="insurance_date"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_insurance_amount')}}</label>
                            <input class="form-control" type="text" v-model="vehicleDocumentForm.insurance_amount" name="insurance_amount" :placeholder="trans('transport.vehicle_insurance_amount')">
                            <show-error :form-name="vehicleDocumentForm" prop-name="insurance_amount"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_insured_amount')}}</label>
                            <input class="form-control" type="text" v-model="vehicleDocumentForm.insured_amount" name="insured_amount" :placeholder="trans('transport.vehicle_insured_amount')">
                            <show-error :form-name="vehicleDocumentForm" prop-name="insured_amount"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_insurance_company_name')}}</label>
                            <input class="form-control" type="text" v-model="vehicleDocumentForm.insurance_company_name" name="insurance_company_name" :placeholder="trans('transport.vehicle_insurance_company_name')">
                            <show-error :form-name="vehicleDocumentForm" prop-name="insurance_company_name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_insurance_agent_name')}}</label>
                            <input class="form-control" type="text" v-model="vehicleDocumentForm.insurance_agent_name" name="insurance_agent_name" :placeholder="trans('transport.vehicle_insurance_agent_name')">
                            <show-error :form-name="vehicleDocumentForm" prop-name="insurance_agent_name"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('transport.vehicle_insurance_agent_contact_number')}}</label>
                            <input class="form-control" type="text" v-model="vehicleDocumentForm.insurance_agent_contact_number" name="insurance_agent_contact_number" :placeholder="trans('transport.vehicle_insurance_agent_contact_number')">
                            <show-error :form-name="vehicleDocumentForm" prop-name="insurance_agent_contact_number"></show-error>
                        </div>
                    </div>
                </template>
            </div>
            <div class="row">
                <div class="col-12 col-sm-3">
                    <label>&nbsp;</label>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="vehicleDocumentForm.upload_token" module="vehicle_document" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/transport/vehicle/document" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                vehicleDocumentForm: new Form({
                    title : '',
                    vehicle_id: '',
                    vehicle_document_type_id: '',
                    date_of_expiry: '',
                    description : '',
                    policy_number : '',
                    insurance_date : '',
                    insurance_amount : '',
                    insured_amount : '',
                    insurance_company_name : '',
                    insurance_agent_name : '',
                    insurance_agent_contact_number : '',
                    upload_token: ''
                }),
                vehicles: [],
                selected_vehicle: null,
                selected_vehicle_document_type: null,
                vehicle_document_types: [],
                vehicle_document_type_details: [],
                clearAttachment: false,
                expiry_date: false,
                insurance_document: false,
                module_id: ''
            };
        },
        mounted() {
            this.vehicleDocumentForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();

            if (this.id)
                this.getDocument();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateDocument();
                else
                    this.storeDocument();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/document/pre-requisite')
                    .then(response => {
                        this.vehicles = response.vehicles;
                        this.vehicle_document_types = response.vehicle_document_types;
                        this.vehicle_document_type_details = response.vehicle_document_type_details;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            storeDocument(){
                let loader = this.$loading.show();
                this.vehicleDocumentForm.post('/api/vehicle/document')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.$emit('completed');
                        this.vehicleDocumentForm.upload_token = this.$uuid.v4();
                        this.selected_vehicle_document_type = null;
                        this.selected_vehicle = null;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getDocument(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/document/'+this.id)
                    .then(response => {
                        this.vehicleDocumentForm.title = response.vehicle_document.title;
                        this.vehicleDocumentForm.vehicle_id = response.vehicle_document.vehicle_id;
                        this.vehicleDocumentForm.date_of_expiry = response.vehicle_document.date_of_expiry;
                        this.vehicleDocumentForm.vehicle_document_type_id = response.vehicle_document.vehicle_document_type_id;
                        this.selected_vehicle_document_type = {id: response.vehicle_document.vehicle_document_type_id, name: response.vehicle_document.vehicle_document_type.name};
                        this.selected_vehicle = {id: response.vehicle_document.vehicle_id, name: response.vehicle_document.vehicle.name};
                        this.vehicleDocumentForm.description = response.vehicle_document.description;
                        this.vehicleDocumentForm.upload_token = response.vehicle_document.upload_token;
                        this.expiry_date = response.vehicle_document.vehicle_document_type.has_expiry_date ? true : false;
                        this.insurance_document = response.vehicle_document.vehicle_document_type.is_insurance_document ? true : false;
                        this.module_id = response.vehicle_document.id;

                        let insurance_info = response.vehicle_document.options && response.vehicle_document.options.hasOwnProperty("insurance") ? response.vehicle_document.options.insurance : {
                            policy_number : '',
                            insurance_date : '',
                            insurance_amount : '',
                            insured_amount : '',
                            insurance_company_name : '',
                            insurance_agent_name : '',
                            insurance_agent_contact_number : '',
                        };
                        this.vehicleDocumentForm.policy_number = insurance_info.policy_number; 
                        this.vehicleDocumentForm.insurance_date = insurance_info.insurance_date; 
                        this.vehicleDocumentForm.insurance_amount = insurance_info.insurance_amount; 
                        this.vehicleDocumentForm.insured_amount = insurance_info.insured_amount; 
                        this.vehicleDocumentForm.insurance_company_name = insurance_info.insurance_company_name; 
                        this.vehicleDocumentForm.insurance_agent_name = insurance_info.insurance_agent_name; 
                        this.vehicleDocumentForm.insurance_agent_contact_number = insurance_info.insurance_agent_contact_number; 

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/transport/vehicle/document');
                    });
            },
            updateDocument(){
                let loader = this.$loading.show();
                this.vehicleDocumentForm.patch('/api/vehicle/document/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                        this.$router.push('/transport/vehicle/document');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onDocumentTypeSelect(selectedOption){
            	this.vehicleDocumentForm.vehicle_document_type_id = selectedOption.id;
                let vehicle_document_type = this.vehicle_document_type_details.find(o => o.id == selectedOption.id);

                if (vehicle_document_type.has_expiry_date) {
                    this.expiry_date = true;
                } else {
                    this.expiry_date = false;
                }

                if (vehicle_document_type.is_insurance_document) {
                    this.insurance_document = true;
                } else {
                    this.insurance_document = false;
                }
            },
            onVehicleSelect(selectedOption){
            	this.vehicleDocumentForm.vehicle_id = selectedOption.id;
            }
        },
        watch: {
            'vehicleDocumentForm.vehicle_document_type_id': function(val){
                if (!val) {
                    this.expiry_date = false;
                }
            },
        }
    }
</script>
