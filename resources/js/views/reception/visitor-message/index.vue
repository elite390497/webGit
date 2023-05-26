<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.visitor_message')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="visitor_messages.total">{{trans('general.total_result_found',{count : visitor_messages.total, from: visitor_messages.from, to: visitor_messages.to})}}</span>
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
                        <help-button @clicked="help_topic = 'reception.visitor_message'"></help-button>
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
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('reception.visitor_message_name')}}</label>
                                    <input class="form-control" name="name" v-model="filter.name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('reception.visitor_message_email')}}</label>
                                    <input class="form-control" name="email" v-model="filter.email">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_start_date" :end-date.sync="filter.date_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVisitorMessages">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="visitor_messages.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{trans('reception.visitor_message_name')}}</th>
                                    <th>{{trans('reception.visitor_message_contact_number')}}</th>
                                    <th>{{trans('reception.visitor_message_email')}}</th>
                                    <th>{{trans('reception.visitor_message_message')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="visitor_message in visitor_messages.data">
                                    <td v-text="visitor_message.id"></td>
                                    <td v-text="visitor_message.name"></td>
                                    <td v-text="visitor_message.contact_number"></td>
                                    <td v-text="visitor_message.email"></td>
                                    <td v-text="visitor_message.message"></td>
                                    <td v-text="visitor_message.created_at | momentDateTime"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-visitor-message')" :key="visitor_message.id" v-confirm="{ok: confirmDelete(visitor_message)}" v-tooltip="trans('reception.delete_visitor_message')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!visitor_messages.total" module="reception" title="visitor_message_module_title" description="visitor_message_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="visitor_messages" @updateRecords="getVisitorMessages"></pagination-record>
                </div>
            </div>
        </div>
        <visitor-message-detail v-if="showModal" @close="showModal = false" :id="showId"></visitor-message-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import visitorMessageDetail from './show'

    export default {
        components : { visitorMessageDetail },
        data() {
            return {
                visitor_messages: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    name: '',
                    email: '',
                    date_start_date: '',
                    date_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'name',
                        translation: i18n.reception.visitor_message_name
                    }
                ],
                showFilterPanel: false,
                showId: '',
                showModal: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-visitor-message')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getVisitorMessages();
            helper.showDemoNotification(['reception']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(visitor_message){
                this.showId = visitor_message.id;
                this.showModal = true;
            },
            getVisitorMessages(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_start_date = helper.toDate(this.filter.date_start_date);
                this.filter.date_end_date = helper.toDate(this.filter.date_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/visitor/message?page=' + page + url)
                    .then(response => {
                        this.visitor_messages = response.visitor_messages;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(visitor_message){
                return dialog => this.deleteVisitorMessage(visitor_message);
            },
            deleteVisitorMessage(visitor_message){
                let loader = this.$loading.show();
                axios.delete('/api/visitor/message/'+visitor_message.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVisitorMessages();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/visitor/message/print',{filter: this.filter})
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
                axios.post('/api/visitor/message/pdf',{filter: this.filter})
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
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getVisitorMessages();
            },
            'filter.order': function(val){
                this.getVisitorMessages();
            },
            'filter.page_length': function(val){
                this.getVisitorMessages();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>