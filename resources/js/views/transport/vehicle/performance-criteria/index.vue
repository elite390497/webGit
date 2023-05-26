<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_performance_criteria')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="vehicle_performance_criterias.total">{{trans('general.total_result_found',{count : vehicle_performance_criterias.total, from: vehicle_performance_criterias.from, to: vehicle_performance_criterias.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="vehicle_performance_criterias.total && !showCreatePanel && hasPermission('create-vehicle')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle_performance_criteria')}}</span></button>
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
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVehiclePerformanceCriterias">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-vehicle')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle_performance_criteria')}}</h4>
                        <vehicle-performance-criteria-form @completed="getVehiclePerformanceCriterias" @cancel="showCreatePanel = !showCreatePanel"></vehicle-performance-criteria-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="vehicle_performance_criterias.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle')}}</th>
                                    <th>{{trans('transport.vehicle_performance_criteria_date_effective')}}</th>
                                    <th>{{trans('transport.vehicle_performance_criteria_mileage_range')}} ({{trans('transport.unit_km_per_liter')}})</th>
                                    <th>{{trans('transport.vehicle_performance_criteria_run_range')}} ({{trans('transport.unit_km')}})</th>
                                    <th>{{trans('transport.vehicle_performance_criteria_service_charge_range')}} ({{trans('transport.vehicle_performance_criteria_service_charge_range_per_month')}})</th>
                                    <th>{{trans('transport.vehicle_performance_criteria_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vehicle_performance_criteria in vehicle_performance_criterias.data">
                                    <td>{{vehicle_performance_criteria.vehicle.name+' ('+vehicle_performance_criteria.vehicle.registration_number+')'}}</td>
                                    <td>{{vehicle_performance_criteria.date_effective | moment}}</td>
                                    <td>
                                        {{formatNumber(vehicle_performance_criteria.min_mileage)+' '+trans('general.to')+' '+formatNumber(vehicle_performance_criteria.max_mileage)}}
                                    </td>
                                    <td>
                                        {{(vehicle_performance_criteria.min_run)+' '+trans('general.to')+' '+(vehicle_performance_criteria.max_run)}}
                                    </td>
                                    <td>
                                        {{formatCurrency(vehicle_performance_criteria.min_service_charge)+' '+trans('general.to')+' '+formatCurrency(vehicle_performance_criteria.max_service_charge)}}
                                    </td>
                                    <td v-text="vehicle_performance_criteria.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle_performance_criteria')" @click.prevent="editVehiclePerformanceCriteria(vehicle_performance_criteria)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="vehicle_performance_criteria.id" v-confirm="{ok: confirmDelete(vehicle_performance_criteria)}" v-tooltip="trans('transport.delete_vehicle_performance_criteria')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!vehicle_performance_criterias.total" module="transport" title="vehicle_performance_criteria_module_title" description="vehicle_performance_criteria_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-vehicle')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="vehicle_performance_criterias" @updateRecords="getVehiclePerformanceCriterias"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import vehiclePerformanceCriteriaForm from './form'

    export default {
        components : { vehiclePerformanceCriteriaForm },
        data() {
            return {
                vehicle_performance_criterias: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_effective',
                    order: 'desc',
                    vehicle_id: [],
                    date_effective: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'vehicle_id',
                        translation: i18n.transport.vehicle
                    },
                    {
                        value: 'date_effective',
                        translation: i18n.transport.vehicle_performance_criteria_date_effective
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
            if(!helper.hasPermission('list-vehicle') || !helper.hasPermission('create-vehicle')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-vehicle'))
                this.getVehiclePerformanceCriterias();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getVehiclePerformanceCriterias(page){
                let loader = this.$loading.show();

                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_effective = helper.toDate(this.filter.date_effective);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle/performance/criteria?page=' + page + url)
                    .then(response => {
                        this.vehicle_performance_criterias = response.vehicle_performance_criterias;
                        this.vehicles = response.filters.vehicles;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editVehiclePerformanceCriteria(vehicle_performance_criteria){
                this.$router.push('/transport/vehicle/performance/criteria/'+vehicle_performance_criteria.id+'/edit');
            },
            confirmDelete(vehicle_performance_criteria){
                return dialog => this.deleteVehiclePerformanceCriteria(vehicle_performance_criteria);
            },
            deleteVehiclePerformanceCriteria(vehicle_performance_criteria){
                let loader = this.$loading.show();
                axios.delete('/api/vehicle/performance/criteria/'+vehicle_performance_criteria.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVehiclePerformanceCriterias();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/performance/criteria/print',{filter: this.filter})
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
                axios.post('/api/vehicle/performance/criteria/pdf',{filter: this.filter})
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
            formatNumber(number){
                return helper.formatNumber(number);
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
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
                this.getVehiclePerformanceCriterias();
            },
            'filter.order': function(val){
                this.getVehiclePerformanceCriterias();
            },
            'filter.page_length': function(val){
                this.getVehiclePerformanceCriterias();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
