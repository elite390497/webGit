<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.route')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="transport_routes.total">{{trans('general.total_result_found',{count : transport_routes.total, from: transport_routes.from, to: transport_routes.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="hasPermission('assign-transport-route')" @click="$router.push('/transport/route/assign')" v-tooltip="trans('transport.assign_route')"><i class="fas fa-route"></i> <span class="d-none d-sm-inline">{{trans('transport.assign_route')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="transport_routes.total && !showCreatePanel && hasPermission('create-transport-route')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_route')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/transport/stoppage')" v-if="hasPermission('list-transport-stoppage')"><i class="fas fa-stoppage-notch"></i> {{trans('transport.transport_stoppage')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'transport.route'"></help-button>
                        
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
                                    <label for="">{{trans('transport.route_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.name" name="name" :placeholder="trans('transport.route_name')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getTransportRoutes">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-transport-route')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_route')}}</h4>
                        <transport-route-form @completed="getTransportRoutes" @cancel="showCreatePanel = !showCreatePanel"></transport-route-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="transport_routes.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.route_name')}}</th>
                                    <th>{{trans('transport.stoppage')}}</th>
                                    <th>{{trans('transport.route_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transport_route in transport_routes.data">
                                    <td v-text="transport_route.name"></td>
                                    <td>
                                        <ul style="list-style-type: none; padding-left: 0;">
                                            <li v-for="transport_route_detail in transport_route.transport_route_details">{{transport_route_detail.transport_stoppage.name}}</li>
                                        </ul>
                                    </td>
                                    <td v-text="transport_route.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button v-if="transport_route.transport_route_details" class="btn btn-success btn-sm" v-tooltip="trans('transport.reorder_stoppage')" @click.prevent="showStoppageReorderAction(transport_route)"><i class="fas fa-arrows-alt"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-transport-route')" v-tooltip="trans('transport.edit_route')" @click.prevent="editTransportRoute(transport_route)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-transport-route')" :key="transport_route.id" v-confirm="{ok: confirmDelete(transport_route)}" v-tooltip="trans('transport.delete_route')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!transport_routes.total" module="transport" title="route_module_title" description="route_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-transport-route')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="transport_routes" @updateRecords="getTransportRoutes"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="hasPermission('edit-transport-route') && showStoppageReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('transport.reorder_stoppage')}}
                                <span class="float-right pointer" @click="showStoppageReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="stoppage_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in stoppage_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderStoppage">{{trans('general.save')}}</button>
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
    import transportRouteForm from './form'

    export default {
        components : { transportRouteForm },
        data() {
            return {
                transport_routes: {
                    total: 0,
                    data: []
                },
                transport_route: {},
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.transport.route_name
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                showStoppageReorderModal: false,
                stoppage_list: [],
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-transport-route')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getTransportRoutes();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showStoppageReorderAction(transport_route){
                this.showStoppageReorderModal = true;
                this.getStoppageList(transport_route);
            },
            getStoppageList(transport_route){
                this.stoppage_list = [];
                this.transport_route = transport_route;
                transport_route.transport_route_details.forEach(detail => {
                    this.stoppage_list.push(detail.transport_stoppage.name);
                })
            },
            getTransportRoutes(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/transport/route?page=' + page + url)
                    .then(response => {
                        this.transport_routes = response
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editTransportRoute(transport_route){
                this.$router.push('/transport/route/'+transport_route.id+'/edit');
            },
            confirmDelete(transport_route){
                return dialog => this.deleteTransportRoute(transport_route);
            },
            deleteTransportRoute(transport_route){
                let loader = this.$loading.show();
                axios.delete('/api/transport/route/'+transport_route.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getTransportRoutes();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            formatCurrency(price){
                return helper.formatCurrency(price);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/transport/route/print',{filter: this.filter})
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
                axios.post('/api/transport/route/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderStoppage(){
                axios.post('/api/transport/route/'+this.transport_route.id+'/stoppage/reorder',{list: this.stoppage_list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showStoppageReorderModal = false;
                        this.getTransportRoutes();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
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
                this.getTransportRoutes();
            },
            'filter.order': function(val){
                this.getTransportRoutes();
            },
            'filter.page_length': function(val){
                this.getTransportRoutes();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>