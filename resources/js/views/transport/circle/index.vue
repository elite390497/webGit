<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.circle')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="circles.total">{{trans('general.total_result_found',{count : circles.total, from: circles.from, to: circles.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="circles.total && !showCreatePanel && hasPermission('create-transport-circle')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('transport.add_new_circle')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/transport/fee')" v-if="hasPermission('list-transport-fee')"><i class="fas fa-truck"></i> {{trans('transport.fee')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'transport.circle'"></help-button>
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
                                    <label for="">{{trans('transport.circle_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.name" name="name" :placeholder="trans('transport.circle_name')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getCircles">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel && hasPermission('create-transport-circle')">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('transport.add_new_circle')}}</h4>
                        <circle-form @completed="getCircles" @cancel="showCreatePanel = !showCreatePanel"></circle-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="circles.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('transport.circle_name')}}</th>
                                    <th>{{trans('transport.circle_description')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th>{{trans('general.updated_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="circle in circles.data">
                                    <td v-text="circle.name"></td>
                                    <td v-text="circle.description"></td>
                                    <td>{{circle.created_at | momentDateTime}}</td>
                                    <td>{{circle.updated_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('transport.edit_circle')" v-if="hasPermission('edit-transport-circle')" @click.prevent="editCircle(circle)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="circle.id" v-if="hasPermission('delete-transport-circle')" v-confirm="{ok: confirmDelete(circle)}" v-tooltip="trans('transport.delete_circle')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!circles.total" module="transport" title="circle_module_title" description="circle_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="circles" @updateRecords="getCircles" @change.native="getCircles"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import circleForm from './form'

    export default {
        components : { circleForm },
        data() {
            return {
                circles: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.transport.circle_name
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-transport-circle')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCircles();
            helper.showDemoNotification(['transport']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getCircles(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/transport/circle?page=' + page + url)
                    .then(response => {
                        this.circles = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCircle(circle){
                this.$router.push('/transport/circle/'+circle.id+'/edit');
            },
            confirmDelete(circle){
                return dialog => this.deleteCircle(circle);
            },
            deleteCircle(circle){
                let loader = this.$loading.show();
                axios.delete('/api/transport/circle/'+circle.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCircles();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/transport/circle/print',{filter: this.filter})
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
                axios.post('/api/transport/circle/pdf',{filter: this.filter})
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
                this.getCircles();
            },
            'filter.order': function(val){
                this.getCircles();
            },
            'filter.page_length': function(val){
                this.getCircles();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
