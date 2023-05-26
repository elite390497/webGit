<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_service_record')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="vehicle_service_records.total">{{trans('general.total_result_found',{count : vehicle_service_records.total, from: vehicle_service_records.from, to: vehicle_service_records.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="vehicle_service_records.total && !showCreatePanel && hasPermission('create-vehicle-service-record')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle_service_record')}}</span></button>
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
                        <help-button @clicked="help_topic = 'transport.vehicle.service-record'"></help-button>
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
                                    <label for="">{{trans('transport.vehicle_service_center')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_vehicle_service_center" name="vehicle_service_center_id" id="vehicle_service_center_id" :options="vehicle_service_centers" :placeholder="trans('transport.select_vehicle_service_center')" @select="onVehicleServiceCenterSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVehicleServiceCenterRemove" :selected="selected_vehicle_service_center">
                                        <div class="multiselect__option" slot="afterList" v-if="!vehicle_service_centers.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_service_start_date" :end-date.sync="filter.date_of_service_end_date" :label="trans('transport.date_of_service_between')"></date-range-picker>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger ">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVehicleServiceRecords">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-vehicle-service-record')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle_service_record')}}</h4>
                        <vehicle-service-record-form @completed="getVehicleServiceRecords" @cancel="showCreatePanel = !showCreatePanel"></vehicle-service-record-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="vehicle_service_records.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle')}}</th>
                                    <th>{{trans('transport.vehicle_service_center')}}</th>
                                    <th>{{trans('transport.vehicle_service_record_amount')}}</th>
                                    <th>{{trans('transport.vehicle_log_log')}}</th>
                                    <th>{{trans('transport.date_of_service')}}</th>
                                    <th>{{trans('transport.vehicle_service_record_next_due_date')}}</th>
                                    <th>{{trans('transport.vehicle_service_record_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vehicle_service_record in vehicle_service_records.data">
                                    <td>{{vehicle_service_record.vehicle.name+' ('+vehicle_service_record.vehicle.registration_number+')'}}</td>
                                    <td>
                                        <span v-if="vehicle_service_record.vehicle_service_center
                                        ">{{vehicle_service_record.vehicle_service_center.name}}</span>
                                        <span v-else>-</span>
                                    </td>
                                    <td>{{formatCurrency(vehicle_service_record.amount)}}</td>
                                    <td>{{vehicle_service_record.log}}</td>
                                    <td>{{vehicle_service_record.date_of_service | moment}}</td>
                                    <td>{{vehicle_service_record.next_due_date | moment}}</td>
                                    <td>{{vehicle_service_record.description}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('transport.view_vehicle_service_record')" @click.prevent="showDetailAction(vehicle_service_record)" @click="showDetailModal = true"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle_service_record')" @click.prevent="editVehicleServiceRecord(vehicle_service_record)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="vehicle_service_record.id" v-confirm="{ok: confirmDelete(vehicle_service_record)}" v-tooltip="trans('transport.delete_vehicle_service_record')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2">{{trans('general.total')}}</td>
                                    <td>{{formatCurrency(total_amount)}}</td>
                                    <td colspan="5"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <module-info v-if="!vehicle_service_records.total" module="transport" title="vehicle_service_record_module_title" description="vehicle_service_record_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-vehicle-service-record')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="vehicle_service_record" @updateRecords="getVehicleServiceRecords"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showDetailModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{vehicle_service_record.vehicle ? (vehicle_service_record.vehicle.name+' ('+vehicle_service_record.vehicle.registration_number+')') : ''}} <span v-if="vehicle_service_record.vehicle_service_center">{{trans('transport.vehicle_service_center')}}: {{vehicle_service_record.vehicle_service_center.name}}</span>
                                <span class="float-right pointer" @click="showDetailModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <div>
                                    {{trans('transport.date_of_service')}}: {{vehicle_service_record.date_of_service | moment}} <br />
                                    {{trans('transport.vehicle_service_record_next_due_date')}}: {{vehicle_service_record.next_due_date | moment}}
                                </div>
                                <div class="m-t-20" v-html="vehicle_service_record.description"></div>
                                <div v-if="attachments.length">
                                    <ul class="m-t-10 upload-file-list">
                                        <li class="upload-file-list-item" v-for="attachment in attachments">
                                            <a :href="`/transport/vehicle/service/record/${vehicle_service_record.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                        </li>
                                    </ul>
                                </div>
                                <hr />
                                <p>
                                    <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{vehicle_service_record.created_at | momentDateTime}}</small>
                                    <span class="pull-right">
                                        <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{vehicle_service_record.updated_at | momentDateTime}}</small>
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
    import vehicleServiceRecordForm from './form'

    export default {
        components : { vehicleServiceRecordForm},
        data() {
            return {
                vehicle_service_records: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_service',
                    order: 'desc',
                    vehicle_id: [],
                    vehicle_service_center_id: [],
                    date_of_service_start_date: moment().startOf('month').format('YYYY-MM-DD'),
                    date_of_service_end_date: moment().endOf('month').format('YYYY-MM-DD'),
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'vehicle_id',
                        translation: i18n.transport.vehicle
                    },
                    {
                        value: 'date_of_service',
                        translation: i18n.transport.date_of_service
                    },
                    {
                        value: 'amount',
                        translation: i18n.transport.vehicle_service_record_amount
                    },
                    {
                        value: 'next_due_date',
                        translation: i18n.transport.vehicle_service_record_next_due_date
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                vehicles: [],
                vehicle_service_centers: [],
                selected_vehicle: null,
                selected_vehicle_service_center: null,
                showCreatePanel: false,
                showFilterPanel: false,
                viewId: '',
                vehicle_service_record: {},
                attachments: [],
                total_amount: 0,
                showDetailModal: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-vehicle-service-record') || !helper.hasPermission('create-vehicle-service-record')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-vehicle-service-record'))
                this.getVehicleServiceRecords();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getVehicleServiceRecords(page){
                let loader = this.$loading.show();

                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_service_start_date = helper.toDate(this.filter.date_of_service_start_date);
                this.filter.date_of_service_end_date = helper.toDate(this.filter.date_of_service_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle/service/record?page=' + page + url)
                    .then(response => {
                        this.vehicle_service_records = response.vehicle_service_records;
                        this.vehicles = response.filters.vehicles;
                        this.vehicle_service_centers = response.filters.vehicle_service_centers;
                        this.total_amount = response.total_amount;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getVehicleServiceRecord(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/service/record/'+this.viewId)
                    .then(response => {
                        this.vehicle_service_record = response.vehicle_service_record;
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });

            },
            editVehicleServiceRecord(vehicle_service_record){
                this.$router.push('/transport/vehicle/service/record/'+vehicle_service_record.id+'/edit');
            },
            confirmDelete(vehicle_service_record){
                return dialog => this.deleteVehicleServiceRecord(vehicle_service_record);
            },
            deleteVehicleServiceRecord(vehicle_service_record){
                let loader = this.$loading.show();
                axios.delete('/api/vehicle/service/record/'+vehicle_service_record.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVehicleServiceRecords();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/service/record/print',{filter: this.filter})
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
                axios.post('/api/vehicle/service/record/pdf',{filter: this.filter})
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
            onVehicleServiceCenterSelect(selectedOption){
                this.filter.vehicle_service_center_id.push(selectedOption.id);
            },
            onVehicleServiceCenterRemove(removedOption){
                this.filter.vehicle_service_center_id.splice(this.filter.vehicle_service_center_id.indexOf(removedOption.id), 1);
            },
            showDetailAction(vehicle_service_record){
                this.viewId = vehicle_service_record.id;
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
                this.getVehicleServiceRecords();
            },
            'filter.order': function(val){
                this.getVehicleServiceRecords();
            },
            'filter.page_length': function(val){
                this.getVehicleServiceRecords();
            },
            viewId(val){
                if (val)
                    this.getVehicleServiceRecord();
                else {
                    this.vehicle_service_record = {};
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
