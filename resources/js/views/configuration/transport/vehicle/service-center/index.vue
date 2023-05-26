<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_service_center')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="service_centers.total">{{trans('general.total_result_found',{count : service_centers.total, from: service_centers.from, to: service_centers.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="service_centers.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle_service_center')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.transport.vehicle.service-center'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle_service_center')}}</h4>
                        <service-center-form @completed="getServiceCenters" @cancel="showCreatePanel = !showCreatePanel"></service-center-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="service_centers.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle_service_center_name')}}</th>
                                    <th>{{trans('transport.vehicle_service_center_phone')}}</th>
                                    <th>{{trans('transport.vehicle_service_center_contact_person')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="service_center in service_centers.data">
                                    <td v-text="service_center.name"></td>
                                    <td v-text="service_center.phone"></td>
                                    <td v-text="service_center.contact_person"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle_service_center')" @click.prevent="editServiceCenter(service_center)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="service_center.id" v-confirm="{ok: confirmDelete(service_center)}" v-tooltip="trans('transport.delete_vehicle_service_center')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!service_centers.total" module="transport" title="vehicle_service_center_module_title" description="vehicle_service_center_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="service_centers" @updateRecords="getServiceCenters" @change.native="getServiceCenters"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import serviceCenterForm from './form'

    export default {
        components : { serviceCenterForm },
        data() {
            return {
                service_centers: {
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
                        translation: i18n.transport.vehicle_service_center_name
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

            this.getServiceCenters();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getServiceCenters(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/transport/vehicle/service/center?page=' + page + url)
                    .then(response => {
                        this.service_centers = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editServiceCenter(service_center){
                this.$router.push('/configuration/transport/vehicle/service/center/'+service_center.id+'/edit');
            },
            confirmDelete(service_center){
                return dialog => this.deleteServiceCenter(service_center);
            },
            deleteServiceCenter(service_center){
                let loader = this.$loading.show();
                axios.delete('/api/transport/vehicle/service/center/'+service_center.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getServiceCenters();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/transport/vehicle/service/center/print',{filter: this.filter})
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
                axios.post('/api/transport/vehicle/service/center/pdf',{filter: this.filter})
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
                this.getServiceCenters();
            },
            'filter.order': function(val){
                this.getServiceCenters();
            },
            'filter.page_length': function(val){
                this.getServiceCenters();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
