<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.vehicle_document')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="vehicle_documents.total">{{trans('general.total_result_found',{count : vehicle_documents.total, from: vehicle_documents.from, to: vehicle_documents.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="vehicle_documents.total && !showCreatePanel && hasPermission('create-vehicle-document')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_vehicle_document')}}</span></button>
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
                        <help-button @clicked="help_topic = 'transport.vehicle.document'"></help-button>
                        
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
                                    <label for="">{{trans('transport.vehicle_document_type')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_vehicle_document_type" name="vehicle_document_type_id" id="vehicle_document_type_id" :options="vehicle_document_types" :placeholder="trans('transport.select_vehicle_document_type')" @select="onVehicleDocumentTypeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVehicleDocumentTypeRemove" :selected="selected_vehicle_document_type">
                                        <div class="multiselect__option" slot="afterList" v-if="!vehicle_document_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-1">
                                <div class="form-group">
                                    <div>{{trans('transport.vehicle_document_status_expired')}}</div>
                                    <switches class="m-t-20" v-model="filter.expired" theme="bootstrap" color="success"></switches>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="!filter.expired">
                                <div class="form-group">
                                    <label for="">{{trans('transport.vehicle_document_expiring_in_days')}}</label>
                                    <input class="form-control" type="text" v-model="filter.expiring_in" name="expiring_in" :placeholder="trans('transport.vehicle_document_expiring_in_days')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVehicleDocuments">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-vehicle-document')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_vehicle_document')}}</h4>
                        <vehicle-document-form @completed="getVehicleDocuments" @cancel="showCreatePanel = !showCreatePanel"></vehicle-document-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="vehicle_documents.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.vehicle')}}</th>
                                    <th>{{trans('transport.vehicle_document_type')}}</th>
                                    <th>{{trans('transport.vehicle_document_title')}}</th>
                                    <th>{{trans('transport.date_of_expiry')}}</th>
                                    <th>{{trans('transport.vehicle_document_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vehicle_document in vehicle_documents.data">
                                    <td>{{vehicle_document.vehicle.name+' ('+vehicle_document.vehicle.registration_number+')'}}</td>
                                    <td>{{vehicle_document.vehicle_document_type.name}}</td>
                                    <td>{{vehicle_document.title}}</td>
                                    <td>
                                    	<span v-if="vehicle_document.date_of_expiry">
                                            {{vehicle_document.date_of_expiry | moment}}
                                            <span :class="['label','label-'+getStatus(vehicle_document)['color']]">{{trans('transport.'+getStatus(vehicle_document)['status'], {day: getStatus(vehicle_document)['day']})}}</span>
                                        </span>
                                        <span v-else>-</span>
                                    </td>
                                    <td>{{vehicle_document.description}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('transport.view_vehicle_document')" @click.prevent="showDetailAction(vehicle_document)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_vehicle_document')" @click.prevent="editVehicleLog(vehicle_document)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="vehicle_document.id" v-confirm="{ok: confirmDelete(vehicle_document)}" v-tooltip="trans('transport.delete_vehicle_document')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!vehicle_documents.total" module="transport" title="vehicle_document_module_title" description="vehicle_document_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-vehicle-document')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="vehicle_documents" @updateRecords="getVehicleDocuments"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showDetailModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                <span v-if="vehicle_document.vehicle">{{vehicle_document.vehicle.name+' ('+vehicle_document.vehicle.registration_number+')'}}</span>
                                <span class="float-right pointer" @click="showDetailModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <h4 class="card-title" v-if="vehicle_document.vehicle_document_type">{{vehicle_document.title}} ({{vehicle_document.vehicle_document_type.name}})</h4>
                                <div v-if="vehicle_document.date_of_expiry">
                                    {{trans('transport.date_of_expiry')}}: {{vehicle_document.date_of_expiry | moment}}
                                    <span :class="['label','label-'+getStatus(vehicle_document)['color']]">{{trans('transport.'+getStatus(vehicle_document)['status'], {day: getStatus(vehicle_document)['day']})}}</span>
                                </div>
                                <div class="m-t-20" v-html="vehicle_document.description"></div>
                                <div v-if="documents.length">
                                    <ul class="m-t-10 upload-file-list">
                                        <li class="upload-file-list-item" v-for="document in documents">
                                            <a :href="`/transport/vehicle/document/${vehicle_document.id}/attachment/${document.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', document.file_info.icon]"></i> <span class="upload-file-list-item-size">{{document.file_info.size}}</span> {{document.user_filename}}</a>
                                        </li>
                                    </ul>
                                </div>
                                <hr />
                                <p>
                                    <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{vehicle_document.created_at | momentDateTime}}</small>
                                    <span class="pull-right">
                                        <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{vehicle_document.updated_at | momentDateTime}}</small>
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
    import vehicleDocumentForm from './form'

    export default {
        components : { vehicleDocumentForm},
        data() {
            return {
                vehicle_documents: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_expiry',
                    order: 'desc',
                    expired: false,
                    expiring_in: 0,
                    vehicle_id: [],
                    vehicle_document_type_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'vehicle_id',
                        translation: i18n.transport.vehicle
                    },
                    {
                        value: 'date_of_expiry',
                        translation: i18n.transport.date_of_expiry
                    },
                    {
                        value: 'title',
                        translation: i18n.transport.vehicle_document_title
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                vehicles: [],
                selected_vehicle: null,
                vehicle_document_types: [],
                selected_vehicle_document_type: null,
                showCreatePanel: false,
                showFilterPanel: false,
                viewId: '',
                vehicle_document: {},
                documents: [],
                showDetailModal: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-vehicle-document') || !helper.hasPermission('create-vehicle-document')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-vehicle-document'))
                this.getVehicleDocuments();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getVehicleDocuments(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vehicle/document?page=' + page + url)
                    .then(response => {
                        this.vehicle_documents = response.vehicle_documents;
                        this.vehicles = response.filters.vehicles;
                        this.vehicle_document_types = response.filters.vehicle_document_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getVehicleDocument(){
                let loader = this.$loading.show();
                axios.get('/api/vehicle/document/'+this.viewId)
                    .then(response => {
                        this.vehicle_document = response.vehicle_document;
                        this.documents = response.documents;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });

            },
            editVehicleLog(vehicle_document){
                this.$router.push('/transport/vehicle/document/'+vehicle_document.id+'/edit');
            },
            confirmDelete(vehicle_document){
                return dialog => this.deleteVehicleLog(vehicle_document);
            },
            deleteVehicleLog(vehicle_document){
                let loader = this.$loading.show();
                axios.delete('/api/vehicle/document/'+vehicle_document.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVehicleDocuments();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vehicle/document/print',{filter: this.filter})
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
                axios.post('/api/vehicle/document/pdf',{filter: this.filter})
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
            onVehicleDocumentTypeSelect(selectedOption){
                this.filter.vehicle_document_type_id.push(selectedOption.id);
            },
            onVehicleDocumentTypeRemove(removedOption){
                this.filter.vehicle_document_type_id.splice(this.filter.vehicle_document_type_id.indexOf(removedOption.id), 1);
            },
            getStatus(vehicle_document){
                return helper.getVehicleDocumentStatus(vehicle_document);
            },
            showDetailAction(vehicle_document){
                this.viewId = vehicle_document.id;
                this.showDetailModal = true;
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
                this.getVehicleDocuments();
            },
            'filter.order': function(val){
                this.getVehicleDocuments();
            },
            'filter.page_length': function(val){
                this.getVehicleDocuments();
            },
            viewId(val){
                if (val)
                    this.getVehicleDocument();
                else {
                    this.vehicle_document = {};
                    this.documents = [];
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
