<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_fuel_type')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="fuel_types.total">{{trans('general.total_result_found',{count : fuel_types.total, from: fuel_types.from, to: fuel_types.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="fuel_types.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle_fuel_type')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.transport.vehicle.fuel-type'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle_fuel_type')}}</h4>
                        <fuel-type-form @completed="getFuelTypes" @cancel="showCreatePanel = !showCreatePanel"></fuel-type-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="fuel_types.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle_fuel_type_name')}}</th>
                                    <th>{{trans('transport.vehicle_fuel_type_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fuel_type in fuel_types.data">
                                    <td v-text="fuel_type.name"></td>
                                    <td v-text="fuel_type.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle_fuel_type')" @click.prevent="editFuelType(fuel_type)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="fuel_type.id" v-confirm="{ok: confirmDelete(fuel_type)}" v-tooltip="trans('transport.delete_vehicle_fuel_type')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!fuel_types.total" module="transport" title="vehicle_fuel_type_module_title" description="vehicle_fuel_type_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="fuel_types" @updateRecords="getFuelTypes" @change.native="getFuelTypes"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import fuelTypeForm from './form'

    export default {
        components : { fuelTypeForm },
        data() {
            return {
                fuel_types: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.transport.vehicle_fuel_type_name
                    }
                ],
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getFuelTypes();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getFuelTypes(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/transport/vehicle/fuel/type?page=' + page + url)
                    .then(response => {
                        this.fuel_types = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editFuelType(fuel_type){
                this.$router.push('/configuration/transport/vehicle/fuel/type/'+fuel_type.id+'/edit');
            },
            confirmDelete(fuel_type){
                return dialog => this.deleteFuelType(fuel_type);
            },
            deleteFuelType(fuel_type){
                let loader = this.$loading.show();
                axios.delete('/api/transport/vehicle/fuel/type/'+fuel_type.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getFuelTypes();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/transport/vehicle/fuel/type/print',{filter: this.filter})
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
                axios.post('/api/transport/vehicle/fuel/type/pdf',{filter: this.filter})
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
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getFuelTypes();
            },
            'filter.order': function(val){
                this.getFuelTypes();
            },
            'filter.page_length': function(val){
                this.getFuelTypes();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
