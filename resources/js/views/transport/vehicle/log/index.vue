<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_log')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="vehicle_logs.total">{{trans('general.total_result_found',{count : vehicle_logs.total, from: vehicle_logs.from, to: vehicle_logs.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="vehicle_logs.total && !showCreatePanel && hasPermission('create-vehicle-log')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle_log')}}</span></button>
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
                        <help-button @clicked="help_topic = 'transport.vehicle.log'"></help-button>
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
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVehicleLogs">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-vehicle-log')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle_log')}}</h4>
                        <vehicle-log-form @completed="getVehicleLogs" @cancel="showCreatePanel = !showCreatePanel"></vehicle-log-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="vehicle_logs.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle')}}</th>
                                    <th>{{trans('transport.vehicle_log_date_of_log')}}</th>
                                    <th>{{trans('transport.vehicle_log_log')}}</th>
                                    <th>{{trans('transport.vehicle_log_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vehicle_log in vehicle_logs.data">
                                    <td>{{vehicle_log.vehicle.name+' ('+vehicle_log.vehicle.registration_number+')'}}</td>
                                    <td>{{vehicle_log.date_of_log | moment}}</td>
                                    <td>{{vehicle_log.log}}</td>
                                    <td v-text="vehicle_log.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle_log')" @click.prevent="editVehicleLog(vehicle_log)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="vehicle_log.id" v-confirm="{ok: confirmDelete(vehicle_log)}" v-tooltip="trans('transport.delete_vehicle_log')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!vehicle_logs.total" module="transport" title="vehicle_log_module_title" description="vehicle_log_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-vehicle-log')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="vehicle_logs" @updateRecords="getVehicleLogs"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import vehicleLogForm from './form'

    export default {
        components : { vehicleLogForm },
        data() {
            return {
                vehicle_logs: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_log',
                    order: 'desc',
                    vehicle_id: [],
                    date_of_log: '',
                    log: '',
                    start_date: '',
                    end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'vehicle_id',
                        translation: i18n.transport.vehicle
                    },
                    {
                        value: 'date_of_log',
                        translation: i18n.transport.vehicle_log_date_of_log
                    },
                    {
                        value: 'log',
                        translation: i18n.transport.vehicle_log_log
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                vehicles: [],
                selected_vehicle: null,
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-vehicle-log') || !helper.hasPermission('create-vehicle-log')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-vehicle-log'))
                this.getVehicleLogs();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getVehicleLogs(page){
                let loader = this.$loading.show();

                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle/log?page=' + page + url)
                    .then(response => {
                        this.vehicle_logs = response.vehicle_logs;
                        this.vehicles = response.filters.vehicles;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editVehicleLog(vehicle_log){
                this.$router.push('/transport/vehicle/log/'+vehicle_log.id+'/edit');
            },
            confirmDelete(vehicle_log){
                return dialog => this.deleteVehicleLog(vehicle_log);
            },
            deleteVehicleLog(vehicle_log){
                let loader = this.$loading.show();
                axios.delete('/api/vehicle/log/'+vehicle_log.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVehicleLogs();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/log/print',{filter: this.filter})
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
                axios.post('/api/vehicle/log/pdf',{filter: this.filter})
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
        watch: {
            'filter.sort_by': function(val){
                this.getVehicleLogs();
            },
            'filter.order': function(val){
                this.getVehicleLogs();
            },
            'filter.page_length': function(val){
                this.getVehicleLogs();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
