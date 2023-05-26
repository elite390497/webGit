<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_summary_report')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="list.total">{{trans('general.total_result_found',{count : list.total, from: list.from, to: list.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
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
                        <help-button @clicked="help_topic = 'transport.vehicle.report.summary'"></help-button>
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
                                    <v-select label="name" track-by="id" v-model="selected_vehicles" name="vehicle_id" id="vehicle_id" :options="vehicles" :placeholder="trans('transport.select_vehicle')" @select="onVehicleSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVehicleRemove" :selected="selected_vehicles">
                                        <div class="multiselect__option" slot="afterList" v-if="!vehicles.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_performance_criteria_base_metric')}}</label>
                                    <select v-model="filter.base_metric" class="custom-select col-12" name="base_metric">
                                      <option v-for="option in base_metrics" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_rating_greater_than')}}</label>
                                    <input class="form-control" type="text" v-model="filter.min_rating" name="min_rating" :placeholder="trans('transport.vehicle_rating_greater_than')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_rating_greater_than')}}</label>
                                    <input class="form-control" type="text" v-model="filter.max_rating" name="max_rating" :placeholder="trans('transport.vehicle_rating_greater_than')">
                                </div>
                            </div>
                            <div class="col-6">
                                <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getSummary">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="list.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle')}}</th>
                                    <th>{{trans('transport.vehicle_age')}}</th>
                                    <th>{{trans('transport.vehicle_fuel_input')}} ({{trans('transport.unit_liter')}})</th>
                                    <th>{{trans('transport.vehicle_fuel_cost')}} ({{default_currency.symbol}})</th>
                                    <th>{{trans('transport.vehicle_run')}} ({{trans('transport.unit_km')}})</th>
                                    <th>{{trans('transport.vehicle_mileage')}}</th>
                                    <th>{{trans('transport.vehicle_service_charge')}}</th>
                                    <th>{{trans('transport.vehicle_rating')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list.data">
                                    <td v-text="item.vehicle"></td>
                                    <td v-text="item.age"></td>
                                    <td v-text="item.total_fuel"></td>
                                    <td v-text="item.total_fuel_cost"></td>
                                    <td v-text="item.total_run"></td>
                                    <td>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_actual_mileage')}}</span>: {{item.mileage}} {{trans('transport.unit_km_per_liter')}}</p>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_proposed_mileage')}}</span>: {{item.proposed_mileage_range}} {{trans('transport.unit_km_per_liter')}}</p>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_mileage_diff')}}</span>: 
                                            <span :class="[item.mileage_diff > 0 ? 'text-success' : 'text-danger', 'font-weight-bold']">{{item.mileage_diff}}% </span>
                                        </p>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_rating')}}</span>: {{item.mileage_rating}}</p>
                                    </td>
                                    <td>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_actual_service_charge')}}</span>: {{formatCurrency(item.total_service_charge)}}</p>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_proposed_service_charge')}}</span>: {{item.proposed_service_charge_range}} ({{default_currency.symbol}})</p>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_service_charge_diff')}}</span>: 
                                            <span :class="[item.service_charge_diff > 0 ? 'text-danger' : 'text-success', 'font-weight-bold']">{{item.service_charge_diff}}%</span>
                                        </p>
                                        <p><span class="font-weight-bold">{{trans('transport.vehicle_rating')}}</span>: {{item.service_charge_rating}}</p>
                                    </td>
                                    <td>
                                        {{item.rating+'/'+item.total_rating}}
                                    </td>
                                    <td class="table-option">
                                        <!-- <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('general.view_detail')" @click="$router.push('/student/'+item.uuid+'/vehicle/'+item.id)"><i class="fas fa-arrow-circle-right"></i></button>
                                        </div> -->
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="2"></th>
                                    <th>{{footer.grand_total_fuel}}</th>
                                    <th>{{footer.grand_total_fuel_cost}}</th>
                                    <th>{{footer.grand_total_run}}</th>
                                    <th></th>
                                    <th>{{footer.grand_total_service_charge}}</th>
                                    <th colspan="2"></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <module-info v-if="!list.total" module="transport" title="vehicle_summary_report_module_title" description="vehicle_summary_report_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="list" @updateRecords="getSummary"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                list: {
                    total: 0,
                    data: []
                },
                vehicles: [],
                selected_vehicles: null,
                default_currency: helper.getConfig('default_currency'),
                footer: [],
                filter: {
                    sort_by : 'rating',
                    order: 'asc',
                    base_metric: 'max',
                    start_date: '',
                    end_date: '',
                    max_rating: '',
                    min_rating: '',
                    vehicle_id: [],
                    page_length: helper.getConfig('page_length')
                },
                base_metrics: [
                    {
                        text: i18n.general.minimum,
                        value: 'min'
                    },
                    {
                        text: i18n.general.maximum,
                        value: 'max'
                    },
                    {
                        text: i18n.general.average,
                        value: 'avg'
                    }
                ],
                orderByOptions: [
                    {
                        value: 'vehicle',
                        translation: i18n.transport.vehicle
                    },
                    {
                        value: 'age_integer',
                        translation: i18n.transport.vehicle_age
                    },
                    {
                        value: 'total_fuel',
                        translation: i18n.transport.vehicle_fuel_input
                    },
                    {
                        value: 'total_run',
                        translation: i18n.transport.vehicle_run
                    },
                    {
                        value: 'rating',
                        translation: i18n.transport.vehicle_rating
                    }
                ],
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-transport-report')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.filter.date_effective = helper.today();
            this.filter.start_date = moment().subtract(1, 'months').format('YYYY-MM-DD');
            this.filter.end_date = helper.today();

            this.getSummary();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getSummary(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle/report/summary?page=' + page + url)
                    .then(response => {
                        this.list = response.list;
                        this.footer = response.footer;
                        this.vehicles = response.filters.vehicles;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/report/summary/print',{filter: this.filter})
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
                axios.post('/api/vehicle/report/summary/pdf',{filter: this.filter})
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
                this.getSummary();
            },
            'filter.order': function(val){
                this.getSummary();
            },
            'filter.page_length': function(val){
                this.getSummary();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>