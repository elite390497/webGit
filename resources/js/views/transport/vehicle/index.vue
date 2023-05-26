<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="vehicles.total">{{trans('general.total_result_found',{count : vehicles.total, from: vehicles.from, to: vehicles.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="vehicles.total && !showCreatePanel && hasPermission('create-vehicle')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle')}}</span></button>
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
                        <help-button @clicked="help_topic = 'transport.vehicle'"></help-button>
                        
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
                                    <label for="">{{trans('transport.vehicle_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.name" name="name" :placeholder="trans('transport.vehicle_name')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_registration_number')}}</label>
                                    <input class="form-control" type="text" v-model="filter.registration_number" name="registration_number" :placeholder="trans('transport.vehicle_registration_number')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_type')}}</label>
                                    <select v-model="filter.type" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="vehicle_type in vehicle_types" v-bind:value="vehicle_type.value">
                                        {{ vehicle_type.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_status')}}</label>
                                    <select v-model="filter.status" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="vehicle_status in vehicle_statuses" v-bind:value="vehicle_status.value">
                                        {{ vehicle_status.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVehicles">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-vehicle')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle')}}</h4>
                        <vehicle-form @completed="getVehicles" @cancel="showCreatePanel = !showCreatePanel"></vehicle-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="vehicles.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle_name')}}</th>
                                    <th>{{trans('transport.vehicle_registration_number')}}</th>
                                    <th>{{trans('transport.vehicle_model')}}</th>
                                    <th><small>{{trans('transport.vehicle_max_seating_capacity')}}</small></th>
                                    <th>{{trans('transport.vehicle_max_allowed')}}</th>
                                    <th>{{trans('transport.vehicle_owner')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vehicle in vehicles.data">
                                    <td>
                                        {{vehicle.name}} <span class="label label-success" v-if="vehicle.is_active">{{trans('transport.vehicle_active')}}</span>
                                        <span class="label label-danger" v-else>{{trans('transport.vehicle_inactive')}}</span>
                                    </td>
                                    <td v-text="vehicle.registration_number"></td>
                                    <td>
                                        {{vehicle.model}} <span v-if="vehicle.make">{{'('+trans('transport.vehicle_make')+': '+vehicle.make+')'}}</span>
                                    </td>
                                    <td v-text="vehicle.max_seating_capacity"></td>
                                    <td v-text="vehicle.max_allowed"></td>
                                    <td>
                                        <span v-if="vehicle.is_owned" class="label label-info">{{trans('transport.vehicle_owned')}}</span>
                                        <span v-else class="label label-warning">{{trans('transport.vehicle_contract')}}</span>
                                        <ul style="list-style:none;padding:0;margin:0">
                                            <li><strong>{{trans('transport.vehicle_owner_name')}}:</strong> {{vehicle.owner_name}}</li>
                                            <li><strong>{{trans('transport.vehicle_owner_company_name')}}:</strong> {{vehicle.owner_company_name}}</li>
                                            <li><strong>{{trans('transport.vehicle_owner_phone')}}:</strong> {{vehicle.owner_phone}}</li>
                                            <li><strong>{{trans('transport.vehicle_owner_email')}}:</strong> {{vehicle.owner_email}}</li>
                                        </ul>
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle')" @click.prevent="editVehicle(vehicle)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="vehicle.id" v-confirm="{ok: confirmDelete(vehicle)}" v-tooltip="trans('transport.delete_vehicle')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!vehicles.total" module="transport" title="vehicle_module_title" description="vehicle_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-vehicle')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="vehicles" @updateRecords="getVehicles"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import vehicleForm from './form'

    export default {
        components : { vehicleForm },
        data() {
            return {
                vehicles: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    name: '',
                    registration_number: '',
                    status: '',
                    type: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.transport.vehicle_name
                    },
                    {
                        value: 'registration_number',
                        translation: i18n.transport.vehicle_registration_number
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                vehicle_types: [
                    {
                        text: i18n.transport.vehicle_owned,
                        value: 'owned'
                    },
                    {
                        text: i18n.transport.vehicle_contract,
                        value: 'contract'
                    }
                ],
                vehicle_statuses: [
                    {
                        text: i18n.transport.vehicle_active,
                        value: 'active'
                    },
                    {
                        text: i18n.transport.vehicle_inactive,
                        value: 'inactive'
                    }
                ],
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
                this.getVehicles();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getVehicles(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle?page=' + page + url)
                    .then(response => {
                        this.vehicles = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editVehicle(vehicle){
                this.$router.push('/transport/vehicle/'+vehicle.id+'/edit');
            },
            confirmDelete(vehicle){
                return dialog => this.deleteVehicle(vehicle);
            },
            deleteVehicle(vehicle){
                let loader = this.$loading.show();
                axios.delete('/api/vehicle/'+vehicle.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVehicles();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/print',{filter: this.filter})
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
                axios.post('/api/vehicle/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
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
                this.getVehicles();
            },
            'filter.order': function(val){
                this.getVehicles();
            },
            'filter.page_length': function(val){
                this.getVehicles();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
