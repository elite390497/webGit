<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_fuel')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="vehicle_fuels.total">{{trans('general.total_result_found',{count : vehicle_fuels.total, from: vehicle_fuels.from, to: vehicle_fuels.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="vehicle_fuels.total && !showCreatePanel && hasPermission('create-vehicle-fuel')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle_fuel')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'transport.vehicle.fuel'"></help-button>
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
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_vehicle" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('transport.select_vehicle')" @select="onVehicleSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVehicleRemove" :selected="selected_vehicle">
                                        <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_fuel_type')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_vehicle_fuel_type" name="vehicle_fuel_type_id" id="vehicle_fuel_type_id" :options="vehicle_fuel_types" :placeholder="trans('transport.select_vehicle_fuel_type')" @select="onVehicleFuelTypeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVehicleFuelTypeRemove" :selected="selected_vehicle_fuel_type">
                                        <div class="multiselect__option" slot="afterList" v-if="!vehicle_fuel_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_fueling_start_date" :end-date.sync="filter.date_of_fueling_end_date" :label="trans('transport.date_of_fueling_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVehicleFuels">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-vehicle-fuel')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle_fuel')}}</h4>
                        <vehicle-fuel-form @completed="getVehicleFuels" @cancel="showCreatePanel = !showCreatePanel"></vehicle-fuel-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="vehicle_fuels.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle')}}</th>
                                    <th>{{trans('transport.vehicle_fuel_type')}}</th>
                                    <th>{{trans('transport.vehicle_fuel_quantity')}}</th>
                                    <th>{{trans('transport.vehicle_fuel_price_per_unit')}}</th>
                                    <th>{{trans('general.total')}}</th>
                                    <th>{{trans('transport.date_of_fueling')}}</th>
                                    <th>{{trans('transport.vehicle_log_log')}}</th>
                                    <th>{{trans('transport.vehicle_fuel_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vehicle_fuel in vehicle_fuels.data">
                                    <td>{{vehicle_fuel.vehicle.name+' ('+vehicle_fuel.vehicle.registration_number+')'}}</td>
                                    <td>{{vehicle_fuel.vehicle_fuel_type.name}}</td>
                                    <td>{{formatNumber(vehicle_fuel.quantity,getConfig('vehicle_fuel_quantity_decimal_place'))}}</td>
                                    <td>{{formatCurrency(vehicle_fuel.price_per_unit)}}</td>
                                    <td>{{formatCurrency(vehicle_fuel.quantity * vehicle_fuel.price_per_unit)}}</td>
                                    <td>{{vehicle_fuel.date_of_fueling | moment}}</td>
                                    <td>
                                        <span v-if="vehicle_fuel.log">
                                            {{vehicle_fuel.log+' '+trans('transport.unit_km')}}
                                        </span>
                                    </td>
                                    <td>{{vehicle_fuel.description}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('transport.view_vehicle_fuel')" @click.prevent="showDetailAction(vehicle_fuel)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle_fuel')" @click.prevent="editVehicleLog(vehicle_fuel)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="vehicle_fuel.id" v-confirm="{ok: confirmDelete(vehicle_fuel)}" v-tooltip="trans('transport.delete_vehicle_fuel')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2">{{trans('general.total')}}</td>
                                    <td>{{formatNumber(total_quantity, getConfig('vehicle_fuel_quantity_decimal_place'))}}</td>
                                    <td>{{formatCurrency(average_price_per_unit)}} <small>({{trans('general.average')}})</small></td>
                                    <td>{{formatCurrency(total_price)}}</td>
                                    <td colspan="3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <module-info v-if="!vehicle_fuels.total" module="transport" title="vehicle_fuel_module_title" description="vehicle_fuel_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-vehicle-fuel')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="vehicle_fuels" @updateRecords="getVehicleFuels"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showDetailModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                <span v-if="vehicle_fuel.vehicle">{{vehicle_fuel.vehicle.name+' ('+vehicle_fuel.vehicle.registration_number+')'}}</span>
                                <span class="float-right pointer" @click="showDetailModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <h4 class="card-title" v-if="vehicle_fuel.vehicle_fuel_type">{{vehicle_fuel.vehicle_fuel_type.name}} ({{formatNumber(vehicle_fuel.quantity,getConfig('vehicle_fuel_quantity_decimal_place'))}} @ {{formatCurrency(vehicle_fuel.price_per_unit)+' '+trans('transport.vehicle_fuel_price_per_unit')}} = {{formatCurrency(vehicle_fuel.quantity * vehicle_fuel.price_per_unit)}})</h4>
                                <div>
                                    {{trans('transport.date_of_fueling')}}: {{vehicle_fuel.date_of_fueling | moment}}
                                </div>
                                <div class="m-t-20" v-html="vehicle_fuel.description"></div>
                                <div v-if="attachments.length">
                                    <ul class="m-t-10 upload-file-list">
                                        <li class="upload-file-list-item" v-for="attachment in attachments">
                                            <a :href="`/transport/vehicle/fuel/${vehicle_fuel.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                        </li>
                                    </ul>
                                </div>
                                <hr />
                                <p>
                                    <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{vehicle_fuel.created_at | momentDateTime}}</small>
                                    <span class="pull-right">
                                        <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{vehicle_fuel.updated_at | momentDateTime}}</small>
                                    </span>
                                </p>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import vehicleFuelForm from './form'

    export default {
        components : { vehicleFuelForm},
        data() {
            return {
                vehicle_fuels: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_fueling',
                    order: 'desc',
                    vehicle_id: [],
                    vehicle_fuel_type_id: [],
                    date_of_fueling_start_date: moment().startOf('month').format('YYYY-MM-DD'),
                    date_of_fueling_end_date: moment().endOf('month').format('YYYY-MM-DD'),
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'vehicle_id',
                        translation: i18n.transport.vehicle
                    },
                    {
                        value: 'date_of_fueling',
                        translation: i18n.transport.date_of_fueling
                    },
                    {
                        value: 'quantity',
                        translation: i18n.transport.vehicle_fuel_quantity
                    },
                    {
                        value: 'price_per_unit',
                        translation: i18n.transport.vehicle_fuel_price_per_unit
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                vehicles: [],
                selected_vehicle: null,
                vehicle_fuel_types: [],
                selected_vehicle_fuel_type: null,
                showCreatePanel: false,
                showFilterPanel: false,
                viewId: '',
                vehicle_fuel: {},
                attachments: [],
                total_price: 0,
                total_quantity: 0,
                average_price_per_unit: 0,
                showDetailModal: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-vehicle-fuel') || !helper.hasPermission('create-vehicle-fuel')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-vehicle-fuel'))
                this.getVehicleFuels();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getVehicleFuels(page){
                let loader = this.$loading.show();

                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_fueling_start_date = helper.toDate(this.filter.date_of_fueling_start_date);
                this.filter.date_of_fueling_end_date = helper.toDate(this.filter.date_of_fueling_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle/fuel?page=' + page + url)
                    .then(response => {
                        this.vehicle_fuels = response.vehicle_fuels;
                        this.vehicles = response.filters.vehicles;
                        this.vehicle_fuel_types = response.filters.vehicle_fuel_types;
                        this.total_price = response.total_price;
                        this.total_quantity = response.total_quantity;
                        this.average_price_per_unit = response.average_price_per_unit;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getVehicleFuel(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/fuel/'+this.viewId)
                    .then(response => {
                        this.vehicle_fuel = response.vehicle_fuel;
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });

            },
            editVehicleLog(vehicle_fuel){
                this.$router.push('/transport/vehicle/fuel/'+vehicle_fuel.id+'/edit');
            },
            confirmDelete(vehicle_fuel){
                return dialog => this.deleteVehicleLog(vehicle_fuel);
            },
            deleteVehicleLog(vehicle_fuel){
                let loader = this.$loading.show();
                axios.delete('/api/vehicle/fuel/'+vehicle_fuel.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVehicleFuels();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/fuel/print',{filter: this.filter})
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
                axios.post('/api/vehicle/fuel/pdf',{filter: this.filter})
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
            },
            onVehicleFuelTypeSelect(selectedOption){
                this.filter.vehicle_fuel_type_id.push(selectedOption.id);
            },
            onVehicleFuelTypeRemove(removedOption){
                this.filter.vehicle_fuel_type_id.splice(this.filter.vehicle_fuel_type_id.indexOf(removedOption.id), 1);
            },
            showDetailAction(vehicle_fuel){
                this.viewId = vehicle_fuel.id;
                this.showDetailModal = true;
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            formatNumber(amount,decimal_place){
                return helper.formatNumber(amount, decimal_place);
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
        watch: {
            'filter.sort_by': function(val){
                this.getVehicleFuels();
            },
            'filter.order': function(val){
                this.getVehicleFuels();
            },
            'filter.page_length': function(val){
                this.getVehicleFuels();
            },
            viewId(val){
                if (val)
                    this.getVehicleFuel();
                else {
                    this.vehicle_fuel = {};
                    this.attachments = [];
                }
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
