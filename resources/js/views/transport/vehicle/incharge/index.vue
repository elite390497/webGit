<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_incharge')}} </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'transport.vehicle-incharge'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_vehicle" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('transport.select_vehicle')" @select="onVehicleSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVehicleRemove" :selected="selected_vehicle">
                                        <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <switches class="m-t-10" v-model="filter.show_history" theme="bootstrap" color="success"></switches> {{trans('transport.show_vehicle_incharge_history')}}
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getDetail">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card p-4">
                <div class="card-body font-80pc">
                    <form @submit.prevent="submit" @keydown="vehicleInchargeForm.errors.clear($event.target.name)">
                        <div :class="['row p-3', vehicle.show ? 'hover' : '']" v-for="(vehicle, index) in vehicleInchargeForm.vehicles" @mouseover="showAction(index)" @mouseout="hideAction(index)" >
                            <div class="col-12 col-sm-4">
                                {{vehicle.name}}
                                <span class="m-l-10" v-show="hasPermission('store-vehicle-incharge')">
                                    <i class="fas fa-edit opaque-on-hover" style="cursor:pointer;" v-if="!vehicle.change" @click="showEditPanel(vehicle)"></i>
                                    <i class="fas fa-times-circle" style="cursor:pointer;" v-if="vehicle.change" @click="hideEditPanel(vehicle)"></i>
                                </span>
                            </div>
                            <div class="col-12 col-sm-4">
                                <span v-if="vehicle.vehicle_incharges.length">
                                    {{getCurrentVehicleInchargeName(vehicle.vehicle_incharges)}} 
                                    {{getCurrentVehicleInchargeDesignation(vehicle.vehicle_incharges)}}
                                    <i class="fas fa-times-circle" v-show="vehicle.show" style="cursor:pointer;color:red;" :key="vehicle.vehicle_incharges[0].id" v-confirm="{ok: confirmDelete(vehicle.vehicle_incharges[0])}" v-tooltip="trans('transport.delete_vehicle_incharge')" v-if="hasPermission('delete-vehicle-incharge')"></i>
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="col-12 col-sm-4" v-if="filter.show_history">
                                <ul style="list-style:none;padding:0;margin:0;" v-if="vehicle.vehicle_incharges.length">
                                    <li v-for="(vehicle_incharge,idx) in vehicle.vehicle_incharges">
                                        ({{idx+1}}) 
                                        {{getEmployeeName(vehicle_incharge.employee)+' '+trans('general.from')}} {{vehicle_incharge.date_effective | moment}} 
                                    </li>
                                </ul>
                                <span v-if="!vehicle.vehicle_incharges.length">-</span>
                            </div>

                            <div class="col-12 my-4" v-if="vehicle.change">
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <v-select label="name" v-model="vehicle.selected_employee" :name="getEmployeeFieldName(index)" :id="getEmployeeFieldName(index)" :options="vehicle_incharges" :placeholder="trans('transport.select_vehicle_incharge')" @select="onEmployeeSelect" @close="vehicleInchargeForm.errors.clear(getEmployeeFieldName(index))" @remove="vehicle.employee_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!vehicle_incharges.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                        <show-error :form-name="vehicleInchargeForm" :prop-name="getEmployeeFieldName(index)"></show-error>
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <datepicker v-model="vehicle.date_effective" :bootstrapStyling="true" :name="getDateEffectiveFieldName(index)" @selected="vehicleInchargeForm.errors.clear(getDateEffectiveFieldName(index))" :placeholder="trans('transport.date_effective')"></datepicker>
                                        <show-error :form-name="vehicleInchargeForm" :prop-name="getDateEffectiveFieldName(index)"></show-error> 
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <autosize-textarea v-model="vehicle.description" rows="1" :name="getDescriptionFieldName(index)" :placeholder="trans('transport.vehicle_incharge_description')"></autosize-textarea>
                                        <show-error :form-name="vehicleInchargeForm" :prop-name="getDescriptionFieldName(index)"></show-error>     
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button v-if="edit_count" type="submit" class="btn btn-info waves-effect waves-light pull-right">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
	export default {
        components: {},
		data(){
			return {
				vehicleInchargeForm: new Form({
					vehicles: []
				},false),
				vehicles: [],
				vehicle_incharges: [],
                edit_count: 0,
                filter: {
                    vehicle_id: [],
                    show_history: true
                },
                selected_vehicle: null,
                showFilterPanel: false,
                help_topic: ''
			}
		},
		mounted(){
            this.getDetail();
            helper.showDemoNotification(['transport']);
		},
		methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getDetail(){
                let loader = this.$loading.show();
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle/incharge?options=1'+url)
                    .then(response => {
                        this.vehicles = response.vehicles;
                        this.vehicleInchargeForm.vehicles = [];
                        this.vehicles.forEach(vehicle => {
                            this.vehicleInchargeForm.vehicles.push({
                                vehicle_incharges: vehicle.vehicle_incharges,
                                vehicle_id: vehicle.id,
                                name: vehicle.name+' '+vehicle.registration_number,
                                change: false,
                                date_effective: '',
                                selected_employee: null,
                                employee_id: '',
                                description: '',
                                show: false,
                            })
                        })
                        this.vehicle_incharges = response.vehicle_incharges;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            showAction(index){
                let vehicle = this.vehicleInchargeForm.vehicles[index];
                vehicle.show = true;
            },
            hideAction(index){
                let vehicle = this.vehicleInchargeForm.vehicles[index];
                vehicle.show = false;
            },
            getDateEffectiveFieldName(index){
                return index+'_date_effective';
            },
            getDescriptionFieldName(index){
                return index+'_description';
            },
            getEmployeeFieldName(index){
                return index+'_employee_id';
            },
            onEmployeeSelect(selectedOption, id){
                let index = id.split('_')[0];
                this.vehicleInchargeForm.vehicles[index].employee_id = selectedOption.id;
            },
            submit(){
                let loader = this.$loading.show();
                this.vehicleInchargeForm.post('/api/vehicle/incharge')
                    .then(response => {
                        toastr.success(response.message);
                        this.getDetail();
                        this.edit_count = 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getEmployeeName(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            showEditPanel(vehicle){
                vehicle.change = true;
                this.edit_count++;
            },
            hideEditPanel(vehicle){
                vehicle.change = false;
                this.edit_count--;
            },
            getCurrentVehicleInchargeName(vehicle_incharges){
                let vehicle_incharge = this.getCurrentVehicleIncharge(vehicle_incharges);
                return (typeof vehicle_incharge != 'undefined') ? this.getEmployeeName(vehicle_incharge.employee) : '-';
            },
            getCurrentVehicleInchargeDesignation(vehicle_incharges){
                let vehicle_incharge = this.getCurrentVehicleIncharge(vehicle_incharges);
                return vehicle_incharge.length ? helper.getEmployeeDesignationOnDate(vehicle_incharge[0].employee, vehicle_incharge.date_effective) : '';
            },
            getCurrentVehicleIncharge(vehicle_incharges){
                let vehicle_incharge = vehicle_incharges.find(o => o.date_effective <= helper.today());

                if (typeof vehicle_incharge == 'undefined')
                    vehicle_incharge = vehicle_incharges[0];

                return vehicle_incharge;
            },
            confirmDelete(vehicle_incharge){
                return dialog => this.deleteVehicleIncharge(vehicle_incharge);
            },
            deleteVehicleIncharge(vehicle_incharge){
                let loader = this.$loading.show();
                axios.delete('/api/vehicle/incharge/'+vehicle_incharge.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.edit_count = 0;
                        this.getDetail();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/incharge/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/incharge/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onVehicleSelect(selectedOption){
                this.filter.vehicle_id.push(selectedOption.id);
            },
            onVehicleRemove(removedOption){
                this.filter.vehicle_id.splice(this.filter.vehicle_id.indexOf(removedOption.id), 1);
            }
		},
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
	}
</script>